'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Select, SelectTrigger, SelectContent, SelectOption } from '@/components/ui/select'
import { useToast } from '@/components/ui/toast'
import {
  validateMerchName,
  validateArtistName,
  validateMerchNotes,
} from '@/lib/validation'
import { MERCH_CATEGORIES, PURCHASE_SOURCES, parsePriceToMinor } from '@/lib/merch'
import { MerchItem, Show, ShowArtist, RSVPSummary, SpotifyArtist } from '@/lib/types'
import { X, Upload, Search } from 'lucide-react'

const MAX_IMAGES = 5
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

interface EditMerchModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  item: MerchItem | null
  onItemUpdated: () => void
}

export function EditMerchModal({ open, onOpenChange, item, onItemUpdated }: EditMerchModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    artist_name: '',
    category: 'shirt',
    variant: '',
    quantity: '1',
    condition: 'new',
    purchase_date: '',
    purchase_price: '',
    purchase_source: '',
    notes: '',
    is_signed: false,
    is_limited_edition: false,
    is_custom: false,
  })
  const [existingImageUrls, setExistingImageUrls] = useState<string[]>([])
  const [newImageFiles, setNewImageFiles] = useState<File[]>([])
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([])
  const [uploadingImages, setUploadingImages] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [shows, setShows] = useState<Pick<Show, 'id' | 'title' | 'date_time' | 'venue' | 'show_artists'>[]>([])
  const [selectedShowId, setSelectedShowId] = useState<string>('')
  const [showSearch, setShowSearch] = useState('')
  const [showDropdownOpen, setShowDropdownOpen] = useState(false)
  const showDropdownRef = useRef<HTMLDivElement>(null)
  const [artistSearch, setArtistSearch] = useState('')
  const [artistResults, setArtistResults] = useState<SpotifyArtist[]>([])
  const [searchingArtist, setSearchingArtist] = useState(false)
  const [selectedArtistId, setSelectedArtistId] = useState<string | null>(null)
  const [selectedArtistImage, setSelectedArtistImage] = useState<string | null>(null)
  const { showToast } = useToast()

  // Fetch shows the user has RSVP'd to
  useEffect(() => {
    if (!open) return
    const userName = localStorage.getItem('userName')
    if (!userName) return
    const fetchShows = async () => {
      try {
        const res = await fetch('/api/shows/past?limit=200')
        if (res.ok) {
          const data = await res.json()
          const pastShows = (data.shows || []) as (Show & { rsvps?: RSVPSummary })[]
          const filtered = pastShows
            .filter(s => s.rsvps?.going?.includes(userName))
            .map(s => ({ id: s.id, title: s.title, date_time: s.date_time, venue: s.venue, show_artists: s.show_artists }))
          // Ensure the currently linked show is in the list even if user didn't RSVP
          if (item?.show_id && !filtered.find(s => s.id === item.show_id)) {
            filtered.push({
              id: item.show_id,
              title: item.show?.title || 'Linked show',
              date_time: item.show?.date_time || '',
              venue: item.show?.venue || '',
              show_artists: undefined,
            })
          }
          setShows(filtered)
        }
      } catch {
        // Non-critical
      }
    }
    fetchShows()
  }, [open, item])

  // Close show dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (showDropdownRef.current && !showDropdownRef.current.contains(e.target as Node)) {
        setShowDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Populate form from item
  useEffect(() => {
    if (item && open) {
      setFormData({
        name: item.name,
        artist_name: item.artist_name,
        category: item.category,
        variant: item.variant || '',
        quantity: String(item.quantity),
        condition: item.condition,
        purchase_date: item.purchase_date || '',
        purchase_price: item.purchase_price_minor ? String(item.purchase_price_minor / 100) : '',
        purchase_source: item.purchase_source || '',
        notes: item.notes || '',
        is_signed: item.is_signed,
        is_limited_edition: item.is_limited_edition,
        is_custom: item.is_custom,
      })
      setExistingImageUrls(item.images ? item.images.map(img => img.image_url) : [])
      setNewImageFiles([])
      setNewImagePreviews([])
      setSelectedShowId(item.show_id || '')
      setShowSearch('')
      setShowDropdownOpen(false)
      setSelectedArtistId(item.artist_id || null)
      setSelectedArtistImage(item.artist?.image_url || null)
      setArtistSearch('')
      setArtistResults([])
      setError('')
    }
  }, [item, open])

  const totalImages = existingImageUrls.length + newImageFiles.length

  const handleArtistSearch = async () => {
    const q = artistSearch.trim()
    if (!q) return
    setSearchingArtist(true)
    try {
      const res = await fetch(`/api/artists/search?q=${encodeURIComponent(q)}`)
      if (res.ok) {
        const data = await res.json()
        setArtistResults(data.artists || [])
      }
    } catch {
      // Non-critical
    } finally {
      setSearchingArtist(false)
    }
  }

  const handleSelectArtist = async (artist: SpotifyArtist) => {
    updateField('artist_name', artist.name)
    setSelectedArtistImage(artist.images?.[0]?.url || null)
    setArtistSearch('')
    setArtistResults([])
    try {
      const userName = localStorage.getItem('userName')
      const res = await fetch('/api/artists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ spotifyId: artist.id, createdBy: userName }),
      })
      if (res.ok) {
        const dbArtist = await res.json()
        setSelectedArtistId(dbArtist.id)
      }
    } catch {
      // Still keep the name even if DB upsert fails
    }
  }

  const clearArtist = () => {
    updateField('artist_name', '')
    setSelectedArtistId(null)
    setSelectedArtistImage(null)
    setArtistSearch('')
    setArtistResults([])
  }

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const remaining = MAX_IMAGES - totalImages
    if (remaining <= 0) return

    const validFiles: File[] = []
    for (const file of files.slice(0, remaining)) {
      if (!ALLOWED_TYPES.includes(file.type)) {
        setError('Only JPEG, PNG, and WebP images are allowed.')
        continue
      }
      if (file.size > MAX_FILE_SIZE) {
        setError('Each image must be under 10MB.')
        continue
      }
      validFiles.push(file)
    }

    if (validFiles.length > 0) {
      setNewImageFiles(prev => [...prev, ...validFiles])
      const newPreviews = validFiles.map(f => URL.createObjectURL(f))
      setNewImagePreviews(prev => [...prev, ...newPreviews])
    }
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const removeExistingImage = (index: number) => {
    setExistingImageUrls(prev => prev.filter((_, i) => i !== index))
  }

  const removeNewImage = (index: number) => {
    URL.revokeObjectURL(newImagePreviews[index])
    setNewImageFiles(prev => prev.filter((_, i) => i !== index))
    setNewImagePreviews(prev => prev.filter((_, i) => i !== index))
  }

  const uploadNewImages = async (): Promise<string[]> => {
    const urls: string[] = []
    for (const file of newImageFiles) {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/upload-merch-image', { method: 'POST', body: fd })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to upload image')
      }
      const data = await res.json()
      urls.push(data.url)
    }
    return urls
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!item) return
    setError('')

    const nameValidation = validateMerchName(formData.name)
    if (!nameValidation.isValid) {
      setError(nameValidation.error!)
      return
    }

    const artistValidation = validateArtistName(formData.artist_name)
    if (!artistValidation.isValid) {
      setError(artistValidation.error!)
      return
    }

    const notesValidation = validateMerchNotes(formData.notes)
    if (!notesValidation.isValid) {
      setError(notesValidation.error!)
      return
    }

    if (formData.purchase_price) {
      const priceMinor = parsePriceToMinor(formData.purchase_price)
      if (priceMinor === null) {
        setError('Please enter a valid price')
        return
      }
    }

    setSaving(true)
    try {
      // Upload new images to Vercel Blob
      let newUploadedUrls: string[] = []
      if (newImageFiles.length > 0) {
        setUploadingImages(true)
        try {
          newUploadedUrls = await uploadNewImages()
        } finally {
          setUploadingImages(false)
        }
      }

      const allImageUrls = [...existingImageUrls, ...newUploadedUrls]

      const res = await fetch(`/api/merch/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          artist_name: formData.artist_name,
          artist_id: selectedArtistId || null,
          show_id: selectedShowId || null,
          category: formData.category,
          variant: formData.variant || null,
          quantity: formData.quantity,
          condition: formData.condition,
          purchase_date: formData.purchase_date || null,
          purchase_price: formData.purchase_price || null,
          purchase_source: formData.purchase_source || null,
          is_signed: formData.is_signed,
          is_limited_edition: formData.is_limited_edition,
          is_custom: formData.is_custom,
          notes: formData.notes || null,
          image_urls: allImageUrls,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to update item')
      }

      // Clean up object URLs
      newImagePreviews.forEach(url => URL.revokeObjectURL(url))

      showToast({ title: 'Item updated', type: 'success' })
      onItemUpdated()
      onOpenChange(false)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update item'
      setError(message)
    } finally {
      setSaving(false)
    }
  }

  const updateField = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-lg mx-auto max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Merch Item</DialogTitle>
          <DialogDescription>Update the details of this item.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="text-red-600 text-sm bg-red-50 dark:bg-red-950/30 p-3 rounded-md">
              {error}
            </div>
          )}

          {/* Artist */}
          <div>
            <label className="text-sm font-medium text-foreground">Artist *</label>
            {formData.artist_name ? (
              <div className="mt-1 flex items-center gap-2 p-2 border border-border rounded-md bg-muted/30">
                {selectedArtistImage && (
                  <Image src={selectedArtistImage} alt="" width={32} height={32} className="rounded-full object-cover w-8 h-8" />
                )}
                <span className="text-sm font-medium flex-1">{formData.artist_name}</span>
                <button type="button" onClick={clearArtist} className="text-muted-foreground hover:text-foreground">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="mt-1 space-y-1">
                <div className="flex gap-1">
                  <Input
                    type="text"
                    value={artistSearch}
                    onChange={(e) => setArtistSearch(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleArtistSearch() } }}
                    placeholder="Search Spotify for artist..."
                  />
                  <Button type="button" size="sm" variant="outline" onClick={handleArtistSearch} disabled={searchingArtist} className="px-2">
                    <Search className="w-4 h-4" />
                  </Button>
                </div>
                {artistResults.length > 0 && (
                  <div className="max-h-40 overflow-y-auto border border-border rounded-md divide-y divide-border">
                    {artistResults.map(a => (
                      <button
                        key={a.id}
                        type="button"
                        onClick={() => handleSelectArtist(a)}
                        className="flex items-center gap-2 w-full p-2 text-left hover:bg-muted transition-colors"
                      >
                        {a.images?.[0]?.url && (
                          <Image src={a.images[0].url} alt="" width={32} height={32} className="rounded-full object-cover w-8 h-8" />
                        )}
                        <span className="text-sm">{a.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Category */}
          <div>
            <label className="text-sm font-medium text-foreground">Category *</label>
            <Select value={formData.category} onChange={(v) => updateField('category', v)} className="mt-1">
              <SelectTrigger className="w-full">
                {MERCH_CATEGORIES.find(c => c.value === formData.category)?.emoji}{' '}
                {MERCH_CATEGORIES.find(c => c.value === formData.category)?.label || 'Select'}
              </SelectTrigger>
              <SelectContent>
                {MERCH_CATEGORIES.map(cat => (
                  <SelectOption key={cat.value} value={cat.value}>
                    {cat.emoji} {cat.label}
                  </SelectOption>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Item Name */}
          <div>
            <label className="text-sm font-medium text-foreground">Item Name *</label>
            <Input
              type="text"
              value={formData.name}
              onChange={(e) => updateField('name', e.target.value)}
              placeholder="e.g. Lost Lands 2024 Tour Tee"
              required
              className="mt-1"
            />
          </div>

          {/* Variant */}
          <div>
            <label className="text-sm font-medium text-foreground">Variant</label>
            <Input
              type="text"
              value={formData.variant}
              onChange={(e) => updateField('variant', e.target.value)}
              placeholder="e.g. Large, Black, First Press"
              className="mt-1"
            />
          </div>

          {/* Quantity */}
          <div>
            <label className="text-sm font-medium text-foreground">Quantity</label>
            <Input
              type="number"
              min="1"
              max="999"
              value={formData.quantity}
              onChange={(e) => updateField('quantity', e.target.value)}
              className="mt-1"
            />
          </div>

          {/* Price + Source row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-foreground">Price</label>
              <Input
                type="text"
                value={formData.purchase_price}
                onChange={(e) => updateField('purchase_price', e.target.value)}
                placeholder="e.g. 35.00"
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Source</label>
              <Select value={formData.purchase_source} onChange={(v) => updateField('purchase_source', v)} className="mt-1">
                <SelectTrigger className="w-full">
                  {formData.purchase_source
                    ? `${PURCHASE_SOURCES.find(s => s.value === formData.purchase_source)?.emoji} ${PURCHASE_SOURCES.find(s => s.value === formData.purchase_source)?.label}`
                    : 'Select source'}
                </SelectTrigger>
                <SelectContent>
                  <SelectOption value="">None</SelectOption>
                  {PURCHASE_SOURCES.map(s => (
                    <SelectOption key={s.value} value={s.value}>
                      {s.emoji} {s.label}
                    </SelectOption>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Purchase Date */}
          <div>
            <label className="text-sm font-medium text-foreground">Purchase Date</label>
            <Input
              type="date"
              value={formData.purchase_date}
              onChange={(e) => updateField('purchase_date', e.target.value)}
              className="mt-1"
            />
          </div>

          {/* Linked Show */}
          <div>
            <label className="text-sm font-medium text-foreground">Purchased at Show</label>
            <div className="mt-1 relative" ref={showDropdownRef}>
              {selectedShowId ? (
                <div className="flex items-center gap-2 p-2 border border-border rounded-md bg-muted/30">
                  <span className="text-sm flex-1">
                    🎪 {(() => {
                      const s = shows.find(s => s.id === selectedShowId)
                      return s ? `${s.title} — ${s.venue}` : '🎪 Linked show'
                    })()}
                  </span>
                  <button type="button" onClick={() => { setSelectedShowId(''); setShowSearch('') }} className="text-muted-foreground hover:text-foreground">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <>
                  <Input
                    type="text"
                    value={showSearch}
                    onChange={(e) => { setShowSearch(e.target.value); setShowDropdownOpen(true) }}
                    onFocus={() => setShowDropdownOpen(true)}
                    placeholder="Search past shows..."
                  />
                  {showDropdownOpen && (
                    <div className="absolute z-50 w-full mt-1 bg-popover border border-border rounded-md shadow-lg max-h-48 overflow-auto">
                      {shows
                        .filter(s => {
                          if (!showSearch) return true
                          const q = showSearch.toLowerCase()
                          const artists = (s.show_artists as ShowArtist[] | undefined) || []
                          return s.title.toLowerCase().includes(q) || s.venue.toLowerCase().includes(q) || artists.some(a => a.artist.toLowerCase().includes(q))
                        })
                        .map(s => {
                          const artists = (s.show_artists as ShowArtist[] | undefined) || []
                          const artistStr = artists.map(a => a.artist).join(', ')
                          return (
                            <div
                              key={s.id}
                              className="px-3 py-2 text-sm cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors"
                              onClick={() => {
                                setSelectedShowId(s.id)
                                setShowSearch('')
                                setShowDropdownOpen(false)
                                if (s.date_time && !formData.purchase_date) {
                                  updateField('purchase_date', new Date(s.date_time).toISOString().split('T')[0])
                                }
                              }}
                            >
                              🎪 {s.title} — {s.venue} ({new Date(s.date_time).toLocaleDateString()}){artistStr ? ` · ${artistStr}` : ''}
                            </div>
                          )
                        })}
                      {shows.filter(s => {
                        if (!showSearch) return true
                        const q = showSearch.toLowerCase()
                        const artists = (s.show_artists as ShowArtist[] | undefined) || []
                        return s.title.toLowerCase().includes(q) || s.venue.toLowerCase().includes(q) || artists.some(a => a.artist.toLowerCase().includes(q))
                      }).length === 0 && (
                        <div className="px-3 py-2 text-sm text-muted-foreground">No matching shows</div>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Checkboxes */}
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_signed}
                onChange={(e) => updateField('is_signed', e.target.checked)}
                className="rounded border-border"
              />
              ⭐ Signed
            </label>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_limited_edition}
                onChange={(e) => updateField('is_limited_edition', e.target.checked)}
                className="rounded border-border"
              />
              ✨ Limited Edition
            </label>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_custom}
                onChange={(e) => updateField('is_custom', e.target.checked)}
                className="rounded border-border"
              />
              🎨 Custom / Fan-Made
            </label>
          </div>

          {/* Images */}
          <div>
            <label className="text-sm font-medium text-foreground">
              Images {totalImages > 0 && `(${totalImages}/${MAX_IMAGES})`}
            </label>
            <div className="mt-1 space-y-2">
              {(existingImageUrls.length > 0 || newImagePreviews.length > 0) && (
                <div className="flex flex-wrap gap-2">
                  {existingImageUrls.map((src, i) => (
                    <div key={`existing-${i}`} className="relative w-20 h-20 rounded-md overflow-hidden border border-border">
                      <Image src={src} alt={`Image ${i + 1}`} fill className="object-cover" sizes="80px" />
                      <button
                        type="button"
                        onClick={() => removeExistingImage(i)}
                        className="absolute top-0.5 right-0.5 bg-black/60 text-white rounded-full p-0.5 hover:bg-black/80"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  {newImagePreviews.map((src, i) => (
                    <div key={`new-${i}`} className="relative w-20 h-20 rounded-md overflow-hidden border border-border">
                      <Image src={src} alt={`New ${i + 1}`} fill className="object-cover" sizes="80px" />
                      <button
                        type="button"
                        onClick={() => removeNewImage(i)}
                        className="absolute top-0.5 right-0.5 bg-black/60 text-white rounded-full p-0.5 hover:bg-black/80"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              {totalImages < MAX_IMAGES && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 px-3 py-2 text-sm border border-dashed border-border rounded-md hover:bg-muted transition-colors w-full justify-center"
                >
                  <Upload className="w-4 h-4" />
                  {totalImages === 0 ? 'Add images' : 'Add more'}
                </button>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                onChange={handleImageSelect}
                className="hidden"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="text-sm font-medium text-foreground">Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => updateField('notes', e.target.value)}
              placeholder="Any additional details..."
              rows={2}
              className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={saving}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={saving}
              className="w-full sm:w-auto"
            >
              {saving ? (uploadingImages ? 'Uploading images...' : 'Saving...') : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
