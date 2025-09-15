'use client'

import { useState } from 'react'
import { Search, Plus, Music } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Card, CardContent } from '@/components/ui/card'
import { SpotifyArtist, Artist } from '@/lib/types'
import { SpotifyDisclaimer } from '@/components/SpotifyDisclaimer'

interface AddArtistModalProps {
  onArtistAdded?: (artist: Artist) => void
  userName?: string | null
}

export function AddArtistModal({ onArtistAdded, userName }: AddArtistModalProps) {
  const [open, setOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<SpotifyArtist[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [isAdding, setIsAdding] = useState(false)
  const [spotifyError, setSpotifyError] = useState<string | null>(null)

  const handleSearch = async () => {
    if (!searchQuery.trim()) return

    setIsSearching(true)
    setSpotifyError(null)
    try {
      const response = await fetch(`/api/artists/search?q=${encodeURIComponent(searchQuery)}&limit=10`)
      if (response.ok) {
        const artists = await response.json()
        setSearchResults(artists)
      } else {
        const errorData = await response.json()
        if (response.status === 503) {
          setSpotifyError(errorData.message || 'Spotify API not configured')
        } else {
          console.error('Search failed', response.status, response.statusText)
        }
      }
    } catch (error) {
      console.error('Search error:', error)
    } finally {
      setIsSearching(false)
    }
  }

  const handleAddArtist = async (spotifyArtist: SpotifyArtist) => {
    setIsAdding(true)
    setSpotifyError(null)
    try {
      const response = await fetch('/api/artists', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          spotifyId: spotifyArtist.id,
          createdBy: userName || 'unknown'
        })
      })

      if (response.ok) {
        const newArtist = await response.json()
        onArtistAdded?.(newArtist)
        setOpen(false)
        setSearchQuery('')
        setSearchResults([])
      } else {
        const errorData = await response.json()
        if (response.status === 503) {
          setSpotifyError(errorData.message || 'Spotify API not configured')
        } else {
          console.error('Failed to add artist')
        }
      }
    } catch (error) {
      console.error('Add artist error:', error)
    } finally {
      setIsAdding(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" size="sm" className="flex items-center gap-2 w-full">
          <Plus className="h-4 w-4" />
          Add Artist
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Music className="h-5 w-5" />
            Add Artist to Community Pool
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {spotifyError ? (
            <SpotifyDisclaimer feature="artist search" />
          ) : (
            <>
              <div className="flex gap-2">
                <Input
                  placeholder="Search for an artist..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1"
                />
                <Button 
                  onClick={handleSearch} 
                  disabled={isSearching || !searchQuery.trim()}
                  size="sm"
                >
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </>
          )}

          {!spotifyError && (
            <>
              {isSearching && (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900 mx-auto"></div>
                  <p className="text-sm text-gray-600 mt-2">Searching...</p>
                </div>
              )}

              {searchResults.length > 0 && (
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {searchResults.map((artist) => (
                    <Card key={artist.id} className="p-3">
                      <CardContent className="p-0">
                        <div className="flex items-center gap-3">
                          {artist.images?.[0] && (
                            <img
                              src={artist.images[0].url}
                              alt={artist.name}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium truncate">{artist.name}</h3>
                            <p className="text-sm text-gray-600">
                              {artist.followers?.total?.toLocaleString()} followers
                            </p>
                            {artist.genres && artist.genres.length > 0 && (
                              <p className="text-xs text-gray-500 truncate">
                                {artist.genres.slice(0, 3).join(', ')}
                              </p>
                            )}
                          </div>
                          <Button
                            size="sm"
                            onClick={() => handleAddArtist(artist)}
                            disabled={isAdding}
                            className="shrink-0"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {searchResults.length === 0 && !isSearching && searchQuery && (
                <div className="text-center py-4">
                  <p className="text-gray-600">No artists found</p>
                </div>
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
