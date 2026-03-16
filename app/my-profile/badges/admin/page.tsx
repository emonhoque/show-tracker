'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { ThemeToggle } from '@/components/ThemeToggle'
import { useToast } from '@/components/ui/toast'
import {
  ArrowLeft,
  Search,
  Plus,
  Trash2,
  Shield,
  Loader2,
  Pencil,
  Check,
  X,
  Home,
} from 'lucide-react'

// ---- Types ----

interface BadgeDefinition {
  id: string
  key: string
  spotify_id: string
  name: string
  description: string
  image_url: string | null
  scope: 'lifetime' | 'year'
  created_at: string
}

interface SpotifyArtist {
  id: string
  name: string
  external_urls: { spotify: string }
  images: Array<{ url: string; height: number; width: number }>
}

/** Pick the smallest Spotify image that's >= targetSize, or the last (smallest) available. */
function pickImage(images: SpotifyArtist['images'], targetSize = 200): string | null {
  if (!images.length) return null
  // Spotify images are ordered largest→smallest
  const suitable = images.filter((img) => img.width >= targetSize || img.height >= targetSize)
  const picked = suitable.length ? suitable[suitable.length - 1] : images[images.length - 1]
  return picked.url
}

function proxyUrl(url: string): string {
  return `/api/image-proxy?url=${encodeURIComponent(url)}`
}

// ---- Page ----

export default function BadgesAdminPage() {
  const router = useRouter()
  const { showToast } = useToast()

  // Auth state
  const [adminSecret, setAdminSecret] = useState('')
  const [authenticated, setAuthenticated] = useState(false)
  const [authError, setAuthError] = useState('')

  // Data
  const [definitions, setDefinitions] = useState<BadgeDefinition[]>([])
  const [loading, setLoading] = useState(false)

  // Search
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<SpotifyArtist[]>([])
  const [searching, setSearching] = useState(false)

  // New badge form
  const [selectedArtist, setSelectedArtist] = useState<SpotifyArtist | null>(
    null,
  )
  const [badgeName, setBadgeName] = useState('')
  const [badgeDescription, setBadgeDescription] = useState('')
  const [badgeScope, setBadgeScope] = useState<'lifetime' | 'year'>('lifetime')
  const [creating, setCreating] = useState(false)

  // Edit state
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [editDescription, setEditDescription] = useState('')
  const [editScope, setEditScope] = useState<'lifetime' | 'year'>('lifetime')
  const [saving, setSaving] = useState(false)

  // ---- Auth ----

  const handleAuth = useCallback(async () => {
    setAuthError('')
    try {
      const res = await fetch('/api/badges/admin', {
        headers: { Authorization: `Bearer ${adminSecret}` },
      })
      if (res.ok) {
        sessionStorage.setItem('badgeAdminSecret', adminSecret)
        setAuthenticated(true)
      } else {
        setAuthError('Invalid admin secret')
      }
    } catch {
      setAuthError('Failed to connect')
    }
  }, [adminSecret])

  // Restore session
  useEffect(() => {
    const stored = sessionStorage.getItem('badgeAdminSecret')
    if (stored) {
      setAdminSecret(stored)
      setAuthenticated(true)
    }
  }, [])

  // ---- Fetch definitions ----

  const fetchDefinitions = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/badges/admin', {
        headers: { Authorization: `Bearer ${adminSecret}` },
      })
      if (res.ok) {
        const json = await res.json()
        setDefinitions(json.definitions ?? [])
      }
    } catch (err) {
      console.error('Fetch definitions error:', err)
    } finally {
      setLoading(false)
    }
  }, [adminSecret])

  useEffect(() => {
    if (authenticated) fetchDefinitions()
  }, [authenticated, fetchDefinitions])

  // ---- Spotify search ----

  const searchArtists = async () => {
    if (!searchQuery.trim()) return
    setSearching(true)
    try {
      const res = await fetch(
        `/api/artists/search?q=${encodeURIComponent(searchQuery)}`,
      )
      if (res.ok) {
        const json = await res.json()
        setSearchResults(json.artists ?? [])
      }
    } catch (err) {
      console.error('Search error:', err)
    } finally {
      setSearching(false)
    }
  }

  const selectArtist = (artist: SpotifyArtist) => {
    setSelectedArtist(artist)
    setBadgeName(`${artist.name} Award`)
    setBadgeDescription(`Saw ${artist.name} live`)
    setSearchResults([])
    setSearchQuery('')
  }

  // ---- Create badge ----

  const createBadge = async () => {
    if (!selectedArtist || !badgeName.trim() || !badgeDescription.trim()) return
    setCreating(true)
    try {
      const res = await fetch('/api/badges/admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminSecret}`,
        },
        body: JSON.stringify({
          spotify_id: selectedArtist.id,
          name: badgeName.trim(),
          description: badgeDescription.trim(),
          image_url: pickImage(selectedArtist.images) || null,
          scope: badgeScope,
        }),
      })
      if (res.ok) {
        showToast({
          title: 'Badge Created',
          description: `"${badgeName}" has been added`,
          type: 'success',
          duration: 3000,
        })
        setSelectedArtist(null)
        setBadgeName('')
        setBadgeDescription('')
        setBadgeScope('lifetime')
        fetchDefinitions()
      } else {
        const err = await res.json().catch(() => ({ error: 'Unknown error' }))
        showToast({
          title: 'Error',
          description: err.error || 'Failed to create badge',
          type: 'error',
          duration: 4000,
        })
      }
    } catch {
      showToast({
        title: 'Error',
        description: 'Network error',
        type: 'error',
        duration: 4000,
      })
    } finally {
      setCreating(false)
    }
  }

  // ---- Edit badge ----

  const startEdit = (def: BadgeDefinition) => {
    setEditingId(def.id)
    setEditName(def.name)
    setEditDescription(def.description)
    setEditScope(def.scope)
  }

  const cancelEdit = () => {
    setEditingId(null)
  }

  const saveEdit = async () => {
    if (!editingId || !editName.trim() || !editDescription.trim()) return
    setSaving(true)
    try {
      const res = await fetch('/api/badges/admin', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminSecret}`,
        },
        body: JSON.stringify({
          id: editingId,
          name: editName.trim(),
          description: editDescription.trim(),
          scope: editScope,
        }),
      })
      if (res.ok) {
        showToast({
          title: 'Updated',
          description: `"${editName}" saved`,
          type: 'success',
          duration: 3000,
        })
        setEditingId(null)
        fetchDefinitions()
      } else {
        const err = await res.json().catch(() => ({ error: 'Unknown error' }))
        showToast({
          title: 'Error',
          description: err.error || 'Failed to update badge',
          type: 'error',
          duration: 4000,
        })
      }
    } catch {
      showToast({
        title: 'Error',
        description: 'Network error',
        type: 'error',
        duration: 4000,
      })
    } finally {
      setSaving(false)
    }
  }

  // ---- Delete badge ----

  const deleteBadge = async (def: BadgeDefinition) => {
    if (!confirm(`Delete "${def.name}"? This cannot be undone.`)) return
    try {
      const res = await fetch('/api/badges/admin', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminSecret}`,
        },
        body: JSON.stringify({ id: def.id }),
      })
      if (res.ok) {
        showToast({
          title: 'Deleted',
          description: `"${def.name}" removed`,
          type: 'success',
          duration: 3000,
        })
        fetchDefinitions()
      }
    } catch {
      showToast({
        title: 'Error',
        description: 'Failed to delete badge',
        type: 'error',
        duration: 4000,
      })
    }
  }

  // ---- Auth screen ----

  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-background">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 space-y-4">
            <div className="text-center mb-2">
              <Shield className="w-10 h-10 mx-auto text-muted-foreground mb-2" />
              <h1 className="text-xl font-bold text-foreground">
                Badge Admin
              </h1>
              <p className="text-sm text-muted-foreground">
                Enter the admin secret to manage secret badges
              </p>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleAuth()
              }}
              className="space-y-3"
            >
              <Input
                type="password"
                placeholder="Admin secret"
                value={adminSecret}
                onChange={(e) => setAdminSecret(e.target.value)}
              />
              {authError && (
                <p className="text-sm text-red-500">{authError}</p>
              )}
              <Button type="submit" className="w-full">
                Authenticate
              </Button>
            </form>
            <Button
              variant="ghost"
              className="w-full"
              onClick={() => router.push('/my-profile/badges')}
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to Badges
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // ---- Admin dashboard ----

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card shadow-sm border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/my-profile/badges')}
              className="p-1"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Secret Badge Admin
              </h1>
              <p className="text-sm text-muted-foreground">
              {definitions.length} definition
              {definitions.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={() => router.push('/')} className="p-1">
              <Home className="w-4 h-4" />
            </Button>
            <ThemeToggle />
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* ---- Add New Badge ---- */}
        <Card>
          <CardContent className="pt-6 space-y-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Add Secret Badge
            </h2>

            {/* Spotify search */}
            {!selectedArtist && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Search artist on Spotify
                </label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Search for an artist..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && searchArtists()}
                  />
                  <Button
                    onClick={searchArtists}
                    disabled={searching || !searchQuery.trim()}
                    size="sm"
                  >
                    {searching ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Search className="w-4 h-4" />
                    )}
                  </Button>
                </div>

                {/* Search results */}
                {searchResults.length > 0 && (
                  <div className="border border-border rounded-lg divide-y divide-border max-h-60 overflow-y-auto">
                    {searchResults.map((artist) => (
                      <button
                        key={artist.id}
                        onClick={() => selectArtist(artist)}
                        className="w-full flex items-center gap-3 p-2 hover:bg-muted/50 transition-colors text-left"
                      >
                        {pickImage(artist.images) ? (
                          <img
                            src={proxyUrl(pickImage(artist.images)!)}
                            alt={artist.name}
                            width={36}
                            height={36}
                            className="w-9 h-9 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-xs">
                            🎵
                          </div>
                        )}
                        <span className="text-sm font-medium truncate">
                          {artist.name}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Selected artist & form */}
            {selectedArtist && (
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  {pickImage(selectedArtist.images) ? (
                    <img
                      src={proxyUrl(pickImage(selectedArtist.images)!)}
                      alt={selectedArtist.name}
                      width={48}
                      height={48}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                      🎵
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">
                      {selectedArtist.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {selectedArtist.id}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedArtist(null)}
                  >
                    Change
                  </Button>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground">
                    Badge Name
                  </label>
                  <Input
                    value={badgeName}
                    onChange={(e) => setBadgeName(e.target.value)}
                    placeholder="e.g. Illenium Award"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">
                    Description
                  </label>
                  <Input
                    value={badgeDescription}
                    onChange={(e) => setBadgeDescription(e.target.value)}
                    placeholder="e.g. Saw Illenium live"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">
                    Unlock Type
                  </label>
                  <div className="flex gap-2 mt-1">
                    <button
                      type="button"
                      onClick={() => setBadgeScope('lifetime')}
                      className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${
                        badgeScope === 'lifetime'
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border text-muted-foreground hover:bg-muted/50'
                      }`}
                    >
                      Lifetime
                      <p className="text-[10px] font-normal mt-0.5 opacity-70">
                        Unlocks once, forever
                      </p>
                    </button>
                    <button
                      type="button"
                      onClick={() => setBadgeScope('year')}
                      className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${
                        badgeScope === 'year'
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border text-muted-foreground hover:bg-muted/50'
                      }`}
                    >
                      Yearly
                      <p className="text-[10px] font-normal mt-0.5 opacity-70">
                        Unlocks each year seen
                      </p>
                    </button>
                  </div>
                </div>
                <Button
                  onClick={createBadge}
                  disabled={
                    creating || !badgeName.trim() || !badgeDescription.trim()
                  }
                  className="w-full"
                >
                  {creating ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-1" />
                  ) : (
                    <Plus className="w-4 h-4 mr-1" />
                  )}
                  Create Badge
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* ---- Existing Definitions ---- */}
        <Card>
          <CardContent className="pt-6 space-y-4">
            <h2 className="text-lg font-semibold">
              Existing Badges ({definitions.length})
            </h2>

            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              </div>
            ) : definitions.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">
                No secret badges defined yet. Search for an artist above to add
                one.
              </p>
            ) : (
              <div className="divide-y divide-border">
                {definitions.map((def) => (
                  <div key={def.id} className="py-3">
                    {editingId === def.id ? (
                      /* ---- Inline edit form ---- */
                      <div className="flex items-start gap-3">
                        {def.image_url ? (
                          <img
                            src={proxyUrl(def.image_url)}
                            alt={def.name}
                            width={40}
                            height={40}
                            className="w-10 h-10 rounded-full object-cover mt-1"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-sm mt-1">
                            🎵
                          </div>
                        )}
                        <div className="flex-1 min-w-0 space-y-2">
                          <Input
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            placeholder="Badge name"
                            className="h-8 text-sm"
                          />
                          <Input
                            value={editDescription}
                            onChange={(e) => setEditDescription(e.target.value)}
                            placeholder="Description"
                            className="h-8 text-sm"
                          />
                          <div className="flex gap-1.5">
                            <button
                              type="button"
                              onClick={() => setEditScope('lifetime')}
                              className={`px-2 py-1 rounded text-[10px] font-medium border transition-colors ${
                                editScope === 'lifetime'
                                  ? 'border-amber-500 bg-amber-500/10 text-amber-500'
                                  : 'border-border text-muted-foreground'
                              }`}
                            >
                              Lifetime
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditScope('year')}
                              className={`px-2 py-1 rounded text-[10px] font-medium border transition-colors ${
                                editScope === 'year'
                                  ? 'border-blue-500 bg-blue-500/10 text-blue-500'
                                  : 'border-border text-muted-foreground'
                              }`}
                            >
                              Yearly
                            </button>
                          </div>
                        </div>
                        <div className="flex gap-1 mt-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={saveEdit}
                            disabled={saving || !editName.trim() || !editDescription.trim()}
                            className="text-green-500 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-950/20 h-8 w-8 p-0"
                          >
                            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={cancelEdit}
                            className="text-muted-foreground hover:text-foreground h-8 w-8 p-0"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ) : (
                      /* ---- Read-only row ---- */
                      <div className="flex items-center gap-3">
                        {def.image_url ? (
                          <img
                            src={proxyUrl(def.image_url)}
                            alt={def.name}
                            width={40}
                            height={40}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-sm">
                            🎵
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-sm truncate">
                              {def.name}
                            </p>
                            <span
                              className={`shrink-0 text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                                def.scope === 'year'
                                  ? 'bg-blue-500/10 text-blue-500'
                                  : 'bg-amber-500/10 text-amber-500'
                              }`}
                            >
                              {def.scope === 'year' ? 'Yearly' : 'Lifetime'}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground truncate">
                            {def.description}
                          </p>
                          <p className="text-[10px] text-muted-foreground/60 font-mono">
                            {def.key}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => startEdit(def)}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteBadge(def)}
                          className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
