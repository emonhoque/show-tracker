'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
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
} from 'lucide-react'

// ---- Types ----

interface BadgeDefinition {
  id: string
  key: string
  spotify_id: string
  name: string
  description: string
  image_url: string | null
  created_at: string
}

interface SpotifyArtist {
  id: string
  name: string
  external_urls: { spotify: string }
  images: Array<{ url: string; height: number; width: number }>
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
  const [creating, setCreating] = useState(false)

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
          image_url: selectedArtist.images[0]?.url || null,
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
              onClick={() => router.push('/my-shows/badges')}
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
              onClick={() => router.push('/my-shows/badges')}
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Secret Badge Admin
              </h1>
              <p className="text-xs text-muted-foreground">
                {definitions.length} definition
                {definitions.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
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
                        {artist.images[0]?.url ? (
                          <Image
                            src={`/api/image-proxy?url=${encodeURIComponent(artist.images[0].url)}`}
                            alt={artist.name}
                            width={36}
                            height={36}
                            className="rounded-full object-cover"
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
                  {selectedArtist.images[0]?.url ? (
                    <Image
                      src={`/api/image-proxy?url=${encodeURIComponent(selectedArtist.images[0].url)}`}
                      alt={selectedArtist.name}
                      width={48}
                      height={48}
                      className="rounded-full object-cover"
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
                  <div
                    key={def.id}
                    className="flex items-center gap-3 py-3"
                  >
                    {def.image_url ? (
                      <Image
                        src={`/api/image-proxy?url=${encodeURIComponent(def.image_url)}`}
                        alt={def.name}
                        width={40}
                        height={40}
                        className="rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-sm">
                        🎵
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">
                        {def.name}
                      </p>
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
                      onClick={() => deleteBadge(def)}
                      className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
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
