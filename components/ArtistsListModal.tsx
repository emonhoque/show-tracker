'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { Music, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Card, CardContent } from '@/components/ui/card'
import { Artist } from '@/lib/types'
import { useToast } from '@/components/ui/toast'

// Spotify Icon Component
const SpotifyIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="#1DB954"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z"/>
  </svg>
)

interface ArtistsListModalProps {
  onArtistRemoved?: (artistId: string) => void
}

export function ArtistsListModal({ onArtistRemoved }: ArtistsListModalProps) {
  const [open, setOpen] = useState(false)
  const [artists, setArtists] = useState<Artist[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { showToast } = useToast()

  const fetchArtists = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/artists')
      if (response.ok) {
        const data = await response.json()
        setArtists(data)
      } else {
        const errorMessage = 'Failed to fetch artists'
        setError(errorMessage)
        showToast({
          title: 'Load Failed',
          description: errorMessage,
          type: 'error',
          duration: 4000
        })
      }
    } catch (err) {
      const errorMessage = 'Error loading artists'
      setError(errorMessage)
      console.error('Error fetching artists:', err)
      showToast({
        title: 'Load Failed',
        description: errorMessage,
        type: 'error',
        duration: 4000
      })
    } finally {
      setIsLoading(false)
    }
  }, [showToast])

  useEffect(() => {
    if (open) {
      fetchArtists()
    }
  }, [open, fetchArtists])

  const handleRemoveArtist = async (artistId: string) => {
    const artistToRemove = artists.find(artist => artist.id === artistId)
    const artistName = artistToRemove?.artist_name || 'Artist'
    
    try {
      const response = await fetch(`/api/artists/${artistId}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        setArtists(prev => prev.filter(artist => artist.id !== artistId))
        onArtistRemoved?.(artistId)
        
        // Show success toast
        showToast({
          title: 'Artist Removed',
          description: `"${artistName}" has been removed from your tracked artists`,
          type: 'success',
          duration: 4000
        })
      } else {
        console.error('Failed to remove artist')
        showToast({
          title: 'Remove Failed',
          description: 'Failed to remove artist',
          type: 'error',
          duration: 4000
        })
      }
    } catch (error) {
      console.error('Error removing artist:', error)
      showToast({
        title: 'Remove Failed',
        description: 'Failed to remove artist',
        type: 'error',
        duration: 4000
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary" size="sm" className="flex items-center gap-2 w-full">
          <Music className="h-4 w-4" />
          Artists
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Music className="h-5 w-5" />
            Tracked Artists ({artists.length})
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 max-h-[60vh] overflow-y-auto">
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
              <p className="text-sm text-gray-600 mt-2">Loading artists...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-600 mb-4">{error}</p>
              <Button onClick={fetchArtists} size="sm">Try Again</Button>
            </div>
          ) : artists.length === 0 ? (
            <div className="text-center py-8">
              <Music className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No artists tracked</h3>
              <p className="text-gray-600">
                Add some artists to start tracking their releases!
              </p>
            </div>
          ) : (
            <div className="grid gap-3">
              {artists.map((artist) => (
                <Card key={artist.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      {/* Artist Header */}
                      <div className="flex items-center gap-3">
                        {artist.image_url && (
                          <Image
                            src={artist.image_url}
                            alt={artist.artist_name}
                            width={48}
                            height={48}
                            className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold truncate">{artist.artist_name}</h3>
                          <div className="flex flex-wrap gap-2 text-sm text-gray-600 mt-1">
                            {artist.followers_count && (
                              <span>{artist.followers_count.toLocaleString()} followers</span>
                            )}
                            {artist.popularity && (
                              <span>Popularity: {artist.popularity}</span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {/* Genres */}
                      {artist.genres && artist.genres.length > 0 && (
                        <p className="text-xs text-gray-500">
                          {artist.genres.slice(0, 3).join(', ')}
                        </p>
                      )}
                      
                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        {artist.spotify_url && (
                          <Button
                            size="sm"
                            variant="outline"
                            asChild
                            className="flex-1"
                          >
                            <a
                              href={artist.spotify_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-center gap-1 text-[#1DB954] hover:text-[#1ed760]"
                            >
                              <SpotifyIcon className="h-3 w-3" />
                              Spotify
                            </a>
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRemoveArtist(artist.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-950 flex-1"
                        >
                          <X className="h-3 w-3 mr-1" />
                          Remove
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
