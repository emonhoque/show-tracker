'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ShowArtist } from '@/lib/types'
import { Plus, Trash2, Search, Music } from 'lucide-react'
import { useToast } from '@/components/ui/toast'

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
  const { showToast } = useToast()

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
        showToast({
          title: 'Search Failed',
          description: errorData.error || response.statusText,
          type: 'error',
          duration: 4000
        })
      }
    } catch (error) {
      console.error('Search error:', error)
      setSearchResults([])
      showToast({
        title: 'Search Failed',
        description: 'Network error. Please check your connection.',
        type: 'error',
        duration: 4000
      })
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
    
    // Show success toast
    showToast({
      title: 'Artist Added',
      description: `"${spotifyArtist.name}" has been added to the show`,
      type: 'success',
      duration: 3000
    })
    
    setSearchQuery('')
    setSearchResults([])
    setShowSearch(false)
  }

  const addCustomArtist = () => {
    if (!searchQuery.trim()) return

    // First artist is headliner, subsequent artists are support by default
    const isFirstArtist = showArtists.length === 0
    const newArtist: ShowArtist = {
      artist: searchQuery.trim(),
      position: isFirstArtist ? 'Headliner' : 'Support',
      image_url: 'https://dorosdstv5ifoevu.public.blob.vercel-storage.com/ab6761610000e5eb359a5c25a8bbfe678cc4fd0.jpg',
      spotify_id: '',
      spotify_url: ''
    }

    onArtistsChange([...showArtists, newArtist])
    
    // Show success toast
    showToast({
      title: 'Custom Artist Added',
      description: `"${searchQuery.trim()}" has been added to the show`,
      type: 'success',
      duration: 3000
    })
    
    setSearchQuery('')
    setSearchResults([])
    setShowSearch(false)
  }

  const removeArtist = (index: number) => {
    const artistToRemove = showArtists[index]
    const updatedArtists = showArtists.filter((_, i) => i !== index)
    onArtistsChange(updatedArtists)
    
    // Show success toast
    showToast({
      title: 'Artist Removed',
      description: `"${artistToRemove.artist}" has been removed from the show`,
      type: 'success',
      duration: 3000
    })
  }

  const updateArtistPosition = (index: number, position: 'Headliner' | 'Support' | 'Local') => {
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
                      <Image
                        src={artist.images[0].url}
                        alt={artist.name}
                        width={32}
                        height={32}
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
              
              {/* Add Custom Artist Button at the end of results */}
              {searchQuery && (
                <div className="flex justify-center pt-2 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addCustomArtist}
                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add &quot;{searchQuery}&quot; as Custom Artist
                  </Button>
                </div>
              )}
            </div>
          )}

          {searchResults.length === 0 && searchQuery && !searching && (
            <div className="text-center py-2 space-y-2">
              <p className="text-sm text-muted-foreground">
                No artists found. Try a different search term.
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addCustomArtist}
                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:text-blue-400 dark:hover:text-blue-300"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add &quot;{searchQuery}&quot; as Custom Artist
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Current Artists */}
      {showArtists.length > 0 && (
        <div className="space-y-2">
          {showArtists.map((artist, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-background rounded border">
              <div className="flex items-center space-x-3">
                {artist.image_url ? (
                  <Image
                    src={artist.image_url}
                    alt={artist.artist}
                    width={48}
                    height={48}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                    <Music className="w-6 h-6 text-muted-foreground" />
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className={`font-medium ${!artist.spotify_id ? 'text-muted-foreground' : ''}`}>
                      {artist.artist}
                    </span>
                    {!artist.spotify_id && (
                      <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                        Custom
                      </span>
                    )}
                  </div>
                  <div className="flex border rounded-md overflow-hidden mt-1">
                    <Button
                      type="button"
                      size="sm"
                      variant={artist.position === 'Headliner' ? 'default' : 'ghost'}
                      onClick={() => updateArtistPosition(index, 'Headliner')}
                      className="h-8 px-3 text-xs rounded-none border-0"
                    >
                      Headliner
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant={artist.position === 'Support' ? 'default' : 'ghost'}
                      onClick={() => updateArtistPosition(index, 'Support')}
                      className="h-8 px-3 text-xs rounded-none border-0 border-l"
                    >
                      Support
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant={artist.position === 'Local' ? 'default' : 'ghost'}
                      onClick={() => updateArtistPosition(index, 'Local')}
                      className="h-8 px-3 text-xs rounded-none border-0 border-l"
                    >
                      Local
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
          No artists added yet. Click &quot;Add Artist&quot; to search and add artists from Spotify.
        </p>
      )}
    </div>
  )
}
