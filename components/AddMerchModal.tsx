'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
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
import { MERCH_CATEGORIES, MERCH_CONDITIONS, PURCHASE_SOURCES, parsePriceToMinor } from '@/lib/merch'
import { Show, ShowArtist, RSVPSummary } from '@/lib/types'
import { X, Upload, ImageIcon } from 'lucide-react'

const MAX_IMAGES = 5
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

interface AddMerchModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onItemAdded: () => void
  prefillArtist?: string
  prefillArtistId?: string
  prefillShowId?: string
  prefillShowTitle?: string
}

export function AddMerchModal({
  open,
  onOpenChange,
  onItemAdded,
  prefillArtist,
  prefillArtistId,
  prefillShowId,
  prefillShowTitle,
}: AddMerchModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    artist_name: prefillArtist || '',
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
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [uploadingImages, setUploadingImages] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [shows, setShows] = useState<Pick<Show, 'id' | 'title' | 'date_time' | 'venue' | 'show_artists'>[]>([])
  const [selectedShowId, setSelectedShowId] = useState<string>(prefillShowId || '')
  const [showSearch, setShowSearch] = useState('')
  const { showToast } = useToast()

  // Fetch shows the user has RSVP'd to
  useEffect(() => {
    if (!open) return
    const userName = localStorage.getItem('userName')
    if (!userName) return
    const fetchShows = async () => {
      try {
        const [upRes, pastRes] = await Promise.all([
          fetch('/api/shows/upcoming'),
          fetch('/api/shows/past?limit=200'),
        ])
        const allShows: Pick<Show, 'id' | 'title' | 'date_time' | 'venue' | 'show_artists'>[] = []
        const filterByRsvp = (items: (Show & { rsvps?: RSVPSummary })[]) =>
          items
            .filter(s => s.rsvps && (s.rsvps.going?.includes(userName) || s.rsvps.maybe?.includes(userName)))
            .map(s => ({ id: s.id, title: s.title, date_time: s.date_time, venue: s.venue, show_artists: s.show_artists }))
        if (upRes.ok) {
          const upData = await upRes.json()
          const items = Array.isArray(upData) ? upData : upData.shows || []
          allShows.push(...filterByRsvp(items))
        }
        if (pastRes.ok) {
          const pastData = await pastRes.json()
          allShows.push(...filterByRsvp(pastData.shows || []))
        }
        setShows(allShows)
      } catch {
        // Non-critical
      }
    }
    fetchShows()
  }, [open])

  // Reset form when modal opens with prefill values
  useEffect(() => {
    if (open) {
      setFormData(prev => ({
        ...prev,
        name: '',
        artist_name: prefillArtist || '',
        category: 'shirt',
        variant: '',
        quantity: '1',
        condition: 'new',
        purchase_date: '',
        purchase_price: '',
        purchase_source: prefillShowId ? 'concert' : '',
        notes: '',
        is_signed: false,
        is_limited_edition: false,
        is_custom: false,
      }))
      setImageFiles([])
      setImagePreviews([])
      setSelectedShowId(prefillShowId || '')
      setShowSearch('')
      setError('')
    }
  }, [open, prefillArtist, prefillShowId])

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const remaining = MAX_IMAGES - imageFiles.length
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
      setImageFiles(prev => [...prev, ...validFiles])
      const newPreviews = validFiles.map(f => URL.createObjectURL(f))
      setImagePreviews(prev => [...prev, ...newPreviews])
    }
    // Reset input so the same file can be re-selected
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const removeImage = (index: number) => {
    URL.revokeObjectURL(imagePreviews[index])
    setImageFiles(prev => prev.filter((_, i) => i !== index))
    setImagePreviews(prev => prev.filter((_, i) => i !== index))
  }

  const uploadImages = async (): Promise<string[]> => {
    const urls: string[] = []
    for (const file of imageFiles) {
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
    setError('')

    // Validate required fields
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

    // Validate image URL if provided
    // (no URL validation needed — images are uploaded as files)

    // Validate price if provided
    if (formData.purchase_price) {
      const priceMinor = parsePriceToMinor(formData.purchase_price)
      if (priceMinor === null) {
        setError('Please enter a valid price')
        return
      }
    }

    const userName = localStorage.getItem('userName')
    if (!userName) {
      setError('You must be logged in to add items')
      return
    }

    setSaving(true)
    try {
      // Upload images to Vercel Blob first
      let imageUrls: string[] = []
      if (imageFiles.length > 0) {
        setUploadingImages(true)
        try {
          imageUrls = await uploadImages()
        } finally {
          setUploadingImages(false)
        }
      }

      const res = await fetch('/api/merch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userName,
          name: formData.name,
          artist_name: formData.artist_name,
          artist_id: prefillArtistId || null,
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
          image_urls: imageUrls,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to add item')
      }

      // Clean up object URLs
      imagePreviews.forEach(url => URL.revokeObjectURL(url))

      showToast({ title: 'Item added to merch', type: 'success' })
      onItemAdded()
      onOpenChange(false)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to add item'
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
          <DialogTitle>Add Merch Item</DialogTitle>
          <DialogDescription>
            Add a new item to your merch.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="text-red-600 text-sm bg-red-50 dark:bg-red-950/30 p-3 rounded-md">
              {error}
            </div>
          )}

          {/* Artist Name */}
          <div>
            <label className="text-sm font-medium text-foreground">Artist *</label>
            <Input
              type="text"
              value={formData.artist_name}
              onChange={(e) => updateField('artist_name', e.target.value)}
              placeholder="e.g. Excision"
              required
              className="mt-1"
            />
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

          {/* Condition + Quantity row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-foreground">Condition</label>
              <Select value={formData.condition} onChange={(v) => updateField('condition', v)} className="mt-1">
                <SelectTrigger className="w-full">
                  {MERCH_CONDITIONS.find(c => c.value === formData.condition)?.label || 'Select'}
                </SelectTrigger>
                <SelectContent>
                  {MERCH_CONDITIONS.map(c => (
                    <SelectOption key={c.value} value={c.value}>
                      {c.label}
                    </SelectOption>
                  ))}
                </SelectContent>
              </Select>
            </div>
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
            <div className="mt-1 space-y-1">
              <Input
                type="text"
                value={showSearch}
                onChange={(e) => setShowSearch(e.target.value)}
                placeholder="Search by show name, venue, or artist..."
              />
              <Select value={selectedShowId} onChange={(v) => { setSelectedShowId(v); setShowSearch('') }}>
                <SelectTrigger className="w-full">
                  {selectedShowId
                    ? (() => {
                        const s = shows.find(s => s.id === selectedShowId)
                        return s ? `🎪 ${s.title} — ${s.venue}` : (prefillShowTitle || 'Selected show')
                      })()
                    : 'None (not purchased at a show)'}
                </SelectTrigger>
                <SelectContent>
                  <SelectOption value="">None</SelectOption>
                  {shows
                    .filter(s => {
                      if (!showSearch) return true
                      const q = showSearch.toLowerCase()
                      const artistNames = (s.show_artists || []).map((a: ShowArtist) => a.artist.toLowerCase()).join(' ')
                      return s.title.toLowerCase().includes(q) || s.venue.toLowerCase().includes(q) || artistNames.includes(q)
                    })
                    .map(s => {
                      const artists = (s.show_artists || []).map((a: ShowArtist) => a.artist).join(', ')
                      return (
                        <SelectOption key={s.id} value={s.id}>
                          🎪 {s.title} — {s.venue} ({new Date(s.date_time).toLocaleDateString()}){artists ? ` · ${artists}` : ''}
                        </SelectOption>
                      )
                    })}
                </SelectContent>
              </Select>
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
              Images {imageFiles.length > 0 && `(${imageFiles.length}/${MAX_IMAGES})`}
            </label>
            <div className="mt-1 space-y-2">
              {imagePreviews.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {imagePreviews.map((src, i) => (
                    <div key={i} className="relative w-20 h-20 rounded-md overflow-hidden border border-border">
                      <Image src={src} alt={`Preview ${i + 1}`} fill className="object-cover" sizes="80px" />
                      <button
                        type="button"
                        onClick={() => removeImage(i)}
                        className="absolute top-0.5 right-0.5 bg-black/60 text-white rounded-full p-0.5 hover:bg-black/80"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              {imageFiles.length < MAX_IMAGES && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 px-3 py-2 text-sm border border-dashed border-border rounded-md hover:bg-muted transition-colors w-full justify-center"
                >
                  <Upload className="w-4 h-4" />
                  {imageFiles.length === 0 ? 'Add images' : 'Add more'}
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
              {saving ? (uploadingImages ? 'Uploading images...' : 'Adding...') : 'Add Item'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
