'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Search, Plus, Music } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Card, CardContent } from '@/components/ui/card'
import { SpotifyArtist, Artist } from '@/lib/types'
import { SpotifyDisclaimer } from '@/components/SpotifyDisclaimer'
import { useToast } from '@/components/ui/toast'

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
  const { showToast } = useToast()

  const handleSearch = async () => {
    if (!searchQuery.trim()) return

    setIsSearching(true)
    setSpotifyError(null)
    try {
      const response = await fetch(`/api/artists/search?q=${encodeURIComponent(searchQuery)}&limit=10`)
      if (response.ok) {
        const data = await response.json()
        setSearchResults(data.artists || [])
      } else {
        const errorData = await response.json()
        if (response.status === 503) {
          setSpotifyError(errorData.message || 'Spotify API not configured')
          showToast({
            title: 'Search Failed',
            description: errorData.message || 'Spotify API not configured',
            type: 'error',
            duration: 4000
          })
        } else {
          console.error('Search failed', response.status, response.statusText)
          showToast({
            title: 'Search Failed',
            description: errorData.error || 'Failed to search for artists',
            type: 'error',
            duration: 4000
          })
        }
      }
    } catch (error) {
      console.error('Search error:', error)
      showToast({
        title: 'Search Failed',
        description: 'Network error. Please check your connection.',
        type: 'error',
        duration: 4000
      })
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
        
        // Show success toast
        showToast({
          title: 'Artist Added',
          description: `"${spotifyArtist.name}" has been added to your tracked artists`,
          type: 'success',
          duration: 4000
        })
        
        setOpen(false)
        setSearchQuery('')
        setSearchResults([])
      } else {
        const errorData = await response.json()
        if (response.status === 503) {
          setSpotifyError(errorData.message || 'Spotify API not configured')
          showToast({
            title: 'Add Failed',
            description: errorData.message || 'Spotify API not configured',
            type: 'error',
            duration: 4000
          })
        } else {
          console.error('Failed to add artist')
          showToast({
            title: 'Add Failed',
            description: errorData.error || 'Failed to add artist',
            type: 'error',
            duration: 4000
          })
        }
      }
    } catch (error) {
      console.error('Add artist error:', error)
      showToast({
        title: 'Add Failed',
        description: 'Failed to add artist',
        type: 'error',
        duration: 4000
      })
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
                            <Image
                              src={artist.images[0].url}
                              alt={artist.name}
                              width={48}
                              height={48}
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
