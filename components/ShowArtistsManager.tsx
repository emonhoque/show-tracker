'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ShowArtist } from '@/lib/types'
import { Plus, Trash2, Search } from 'lucide-react'

interface ShowArtistsManagerProps {
  showArtists: ShowArtist[]
  onArtistsChange: (artists: ShowArtist[]) => void
}

interface SpotifySearchResult {
  id: string
  name: string
  external_urls: {
    spotify: string
  }
  images: Array<{
    url: string
    height: number
    width: number
  }>
}

export function ShowArtistsManager({ showArtists, onArtistsChange }: ShowArtistsManagerProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<SpotifySearchResult[]>([])
  const [searching, setSearching] = useState(false)
  const [showSearch, setShowSearch] = useState(false)

  const searchSpotify = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([])
      return
    }

    setSearching(true)
    try {
      const response = await fetch(`/api/artists/search?q=${encodeURIComponent(query)}`)
      if (response.ok) {
        const data = await response.json()
        setSearchResults(data.artists || [])
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
        console.error('Search failed:', errorData.error || response.statusText)
        setSearchResults([])
        // You could show a toast notification here if you have a toast system
        alert(`Search failed: ${errorData.error || response.statusText}`)
      }
    } catch (error) {
      console.error('Search error:', error)
      setSearchResults([])
      alert('Search failed: Network error. Please check your connection.')
    } finally {
      setSearching(false)
    }
  }

  const handleSearch = () => {
    searchSpotify(searchQuery)
  }

  const addArtist = (spotifyArtist: SpotifySearchResult) => {
    // First artist is headliner, subsequent artists are support by default
    const isFirstArtist = showArtists.length === 0
    const newArtist: ShowArtist = {
      artist: spotifyArtist.name,
      position: isFirstArtist ? 'Headliner' : 'Support',
      image_url: spotifyArtist.images[0]?.url || '',
      spotify_id: spotifyArtist.id,
      spotify_url: spotifyArtist.external_urls.spotify
    }

    onArtistsChange([...showArtists, newArtist])
    setSearchQuery('')
    setSearchResults([])
    setShowSearch(false)
  }

  const removeArtist = (index: number) => {
    const updatedArtists = showArtists.filter((_, i) => i !== index)
    onArtistsChange(updatedArtists)
  }

  const updateArtistPosition = (index: number, position: 'Headliner' | 'Support') => {
    const updatedArtists = showArtists.map((artist, i) => 
      i === index ? { ...artist, position } : artist
    )
    onArtistsChange(updatedArtists)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-foreground">Show Artists</h3>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setShowSearch(!showSearch)}
          className="text-green-600 hover:text-green-700 hover:bg-green-50 dark:text-green-400 dark:hover:text-green-300"
        >
          <Plus className="w-4 h-4 mr-1" />
          Add Artist
        </Button>
      </div>

      {/* Search Section */}
      {showSearch && (
        <div className="space-y-3 p-3 border rounded-lg bg-muted/50">
          <div className="flex gap-2">
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  handleSearch()
                }
              }}
              placeholder="Search for artist on Spotify..."
              className="flex-1"
            />
            <Button 
              type="button"
              onClick={handleSearch} 
              disabled={searching || !searchQuery.trim()}
            >
              <Search className="w-4 h-4 mr-1" />
              {searching ? 'Searching...' : 'Search'}
            </Button>
          </div>

          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {searchResults.map((artist) => (
                <div
                  key={artist.id}
                  className="flex items-center justify-between p-2 bg-background rounded border"
                >
                  <div className="flex items-center space-x-2">
                    {artist.images[0] && (
                      <img
                        src={artist.images[0].url}
                        alt={artist.name}
                        className="w-8 h-8 rounded-lg object-cover"
                      />
                    )}
                    <span className="text-sm font-medium">{artist.name}</span>
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => addArtist(artist)}
                    disabled={showArtists.some(a => a.spotify_id === artist.id)}
                    className="text-xs"
                  >
                    {showArtists.some(a => a.spotify_id === artist.id) ? 'Added' : 'Add'}
                  </Button>
                </div>
              ))}
            </div>
          )}

          {searchResults.length === 0 && searchQuery && !searching && (
            <p className="text-sm text-muted-foreground text-center py-2">
              No artists found. Try a different search term.
            </p>
          )}
        </div>
      )}

      {/* Current Artists */}
      {showArtists.length > 0 && (
        <div className="space-y-2">
          {showArtists.map((artist, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-background rounded border">
              <div className="flex items-center space-x-3">
                {artist.image_url && (
                  <img
                    src={artist.image_url}
                    alt={artist.artist}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                )}
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">{artist.artist}</span>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      type="button"
                      size="sm"
                      variant={artist.position === 'Headliner' ? 'default' : 'outline'}
                      onClick={() => updateArtistPosition(index, 'Headliner')}
                      className="h-8 px-3 text-xs"
                    >
                      Headliner
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant={artist.position === 'Support' ? 'default' : 'outline'}
                      onClick={() => updateArtistPosition(index, 'Support')}
                      className="h-8 px-3 text-xs"
                    >
                      Support
                    </Button>
                  </div>
                </div>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => removeArtist(index)}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {showArtists.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-4">
          No artists added yet. Click "Add Artist" to search and add artists from Spotify.
        </p>
      )}
    </div>
  )
}
