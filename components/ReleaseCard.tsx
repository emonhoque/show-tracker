'use client'

import { useState } from 'react'
import { Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ImageModal } from '@/components/ImageModal'
import { Release, Artist } from '@/lib/types'

interface ReleaseWithArtist extends Release {
  artists: Array<{ id: string; name: string }> | null
}

interface ReleaseCardProps {
  release: ReleaseWithArtist
}

export function ReleaseCard({ release }: ReleaseCardProps) {
  const [imageModalOpen, setImageModalOpen] = useState(false)
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getReleaseTypeColor = (type: string) => {
    switch (type) {
      case 'album':
        return 'bg-blue-100 text-blue-800'
      case 'single':
        return 'bg-green-100 text-green-800'
      case 'ep':
        return 'bg-purple-100 text-purple-800'
      case 'compilation':
        return 'bg-orange-100 text-orange-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getArtistNames = (): string => {
    try {
      // Parse the artists JSON string if it exists
      const artists = typeof release.artists === 'string' 
        ? JSON.parse(release.artists) 
        : release.artists;
      
      if (Array.isArray(artists) && artists.length > 0) {
        return artists.map(artist => artist.name).join(', ');
      }
      
      // Fallback to old structure if available
      if (release.artists && typeof release.artists === 'object' && 'artist_name' in release.artists) {
        return (release.artists as { artist_name: string }).artist_name;
      }
      
      return 'Unknown Artist';
    } catch (error) {
      return 'Unknown Artist';
    }
  }

  return (
    <Card className="w-full mb-4 hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        {/* Mobile Layout (vertical) */}
        <div className="block md:hidden space-y-3">
          {/* Header with Title and Release Type */}
          <div className="flex justify-between items-start">
            <h3 className="text-xl font-bold text-foreground">{release.name}</h3>
            <span className={`px-3 py-1 text-sm font-medium rounded-full ${getReleaseTypeColor(release.release_type)}`}>
              {release.release_type.toUpperCase()}
            </span>
          </div>

          {/* Album Art */}
          {release.image_url && (
            <div className="w-full max-w-xs mx-auto">
              <img
                src={release.image_url}
                alt={release.name}
                className="w-full max-h-48 object-contain rounded-lg bg-gray-50 dark:bg-gray-800 cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => setImageModalOpen(true)}
              />
            </div>
          )}

          {/* Artist and Release Details */}
          <div>
            <div className="text-lg font-semibold text-foreground">
              by {getArtistNames()}
            </div>
            <div className="flex items-center gap-4 text-muted-foreground mt-1">
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {formatDate(release.release_date)}
              </span>
              {release.total_tracks && (
                <span>{release.total_tracks} tracks</span>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2">
            {release.spotify_url && (
              <Button
                variant="outline"
                size="default"
                asChild
                className="text-green-800 hover:text-green-900 hover:bg-green-50 dark:text-green-400 dark:hover:text-green-300 w-full"
              >
                <a
                  href={release.spotify_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1 w-full"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z"/>
                  </svg>
                  Spotify
                </a>
              </Button>
            )}
          </div>
        </div>

        {/* Desktop Layout (horizontal) */}
        <div className="hidden md:flex items-start gap-4">
          {/* Album Art */}
          {release.image_url && (
            <div className="flex-shrink-0">
              <img
                src={release.image_url}
                alt={release.name}
                className="w-24 h-24 object-cover rounded-lg bg-gray-50 dark:bg-gray-800 cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => setImageModalOpen(true)}
              />
            </div>
          )}

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Header with Title and Release Type */}
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-xl font-bold text-foreground truncate pr-2">{release.name}</h3>
              <span className={`px-3 py-1 text-sm font-medium rounded-full flex-shrink-0 ${getReleaseTypeColor(release.release_type)}`}>
                {release.release_type.toUpperCase()}
              </span>
            </div>

            {/* Artist and Release Details */}
            <div className="mb-3">
              <div className="text-lg font-semibold text-foreground mb-1">
                by {getArtistNames()}
              </div>
              <div className="flex items-center gap-4 text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {formatDate(release.release_date)}
                </span>
                {release.total_tracks && (
                  <span>{release.total_tracks} tracks</span>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex-shrink-0">
            {release.spotify_url && (
              <Button
                variant="outline"
                size="default"
                asChild
                className="text-green-800 hover:text-green-900 hover:bg-green-50 dark:text-green-400 dark:hover:text-green-300 px-6"
              >
                <a
                  href={release.spotify_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z"/>
                  </svg>
                  Spotify
                </a>
              </Button>
            )}
          </div>
        </div>
      </CardContent>
      
      {/* Image Modal */}
      {release.image_url && (
        <ImageModal
          open={imageModalOpen}
          onOpenChange={setImageModalOpen}
          src={release.image_url}
          alt={`${release.name} album art`}
        />
      )}
    </Card>
  )
}
