'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Show, RSVPSummary } from '@/lib/types'
import { formatUserTime } from '@/lib/time'
import { formatNameForDisplay } from '@/lib/validation'
import { ExternalLink, MoreVertical, Edit, Trash2 } from 'lucide-react'
import { ImageModal } from '@/components/ImageModal'

// Spotify and Apple Music icons as SVG components
const SpotifyIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z"/>
  </svg>
)

const AppleMusicIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 256 256" fill="currentColor">
    <g transform="translate(1.4065934065934016 1.4065934065934016) scale(2.81 2.81)">
      <circle cx="45" cy="45" r="45" fill="currentColor"/>
      <path d="M 63.574 17.51 c -0.195 0.018 -1.931 0.326 -2.14 0.368 l -24.029 4.848 l -0.009 0.002 c -0.627 0.132 -1.118 0.355 -1.498 0.674 c -0.458 0.384 -0.712 0.927 -0.808 1.561 c -0.02 0.135 -0.054 0.409 -0.054 0.813 c 0 0 0 24.55 0 30.074 c 0 0.703 -0.056 1.386 -0.532 1.967 c -0.476 0.582 -1.064 0.757 -1.754 0.896 c -0.523 0.106 -1.046 0.211 -1.57 0.317 c -1.985 0.4 -3.276 0.671 -4.446 1.125 c -1.118 0.433 -1.956 0.986 -2.623 1.686 c -1.323 1.386 -1.859 3.265 -1.675 5.026 c 0.157 1.502 0.833 2.94 1.994 4.002 c 0.784 0.719 1.763 1.264 2.917 1.496 c 1.197 0.24 2.472 0.157 4.336 -0.22 c 0.993 -0.2 1.922 -0.512 2.807 -1.035 c 0.876 -0.516 1.626 -1.206 2.212 -2.046 c 0.588 -0.842 0.968 -1.779 1.177 -2.773 c 0.216 -1.026 0.267 -1.954 0.267 -2.978 V 37.229 c 0 -1.397 0.395 -1.765 1.523 -2.039 c 0 0 19.973 -4.029 20.905 -4.211 c 1.3 -0.249 1.913 0.121 1.913 1.484 V 50.27 c 0 0.705 -0.007 1.419 -0.487 2.003 c -0.476 0.582 -1.064 0.757 -1.754 0.896 c -0.523 0.106 -1.046 0.211 -1.57 0.317 c -1.985 0.4 -3.276 0.671 -4.446 1.125 c -1.118 0.433 -1.956 0.986 -2.623 1.686 c -1.323 1.386 -1.907 3.265 -1.722 5.026 c 0.157 1.502 0.88 2.94 2.041 4.002 c 0.784 0.719 1.763 1.249 2.917 1.482 c 1.197 0.24 2.472 0.155 4.336 -0.22 c 0.993 -0.2 1.922 -0.499 2.807 -1.022 c 0.876 -0.517 1.626 -1.206 2.212 -2.046 c 0.588 -0.842 0.968 -1.779 1.177 -2.773 c 0.216 -1.026 0.225 -1.954 0.225 -2.978 V 19.634 C 65.604 18.251 64.874 17.398 63.574 17.51 z" fill="white"/>
    </g>
  </svg>
)
import * as DropdownMenu from '@/components/ui/dropdown-menu'

interface ShowCardProps {
  show: Show
  isPast: boolean
  rsvps: RSVPSummary
  onEdit?: (show: Show) => void
  onDelete?: (showId: string) => void
  onRSVPUpdate?: () => void
}

export function ShowCard({ show, isPast, rsvps, onEdit, onDelete, onRSVPUpdate }: ShowCardProps) {
  const [loading, setLoading] = useState(false)
  const [userName, setUserName] = useState<string | null>(null)
  const [imageModalOpen, setImageModalOpen] = useState(false)

  // Get userName from localStorage on client side
  useEffect(() => {
    setUserName(localStorage.getItem('userName'))
  }, [])

  const handleRSVP = async (status: 'going' | 'maybe' | 'not_going' | null) => {
    if (!userName || loading) return

    setLoading(true)
    
    try {
      if (status) {
        // Add or update RSVP
        const response = await fetch('/api/rsvp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            show_id: show.id,
            name: userName,
            status
          })
        })

        if (!response.ok) {
          const error = await response.json()
          alert(error.error || 'Failed to save RSVP')
          return
        }
      } else {
        // Remove RSVP completely
        const response = await fetch('/api/rsvp/remove', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            show_id: show.id,
            name: userName
          })
        })

        if (!response.ok) {
          const error = await response.json()
          alert(error.error || 'Failed to remove RSVP')
          return
        }
      }

      // Update RSVPs after successful API call
      if (onRSVPUpdate) {
        onRSVPUpdate()
      }
    } catch (error) {
      console.error('Error saving RSVP:', error)
      alert('Failed to save RSVP')
    } finally {
      setLoading(false)
    }
  }

  const userStatus = userName && rsvps
    ? rsvps.going?.includes(userName.toLowerCase())
      ? 'going'
      : rsvps.maybe?.includes(userName.toLowerCase())
      ? 'maybe'
      : rsvps.not_going?.includes(userName.toLowerCase())
      ? 'not_going'
      : null
    : null

  return (
    <Card className="w-full mb-4">
      <CardContent className="p-4 space-y-3">
        {/* Header with Title and Actions */}
        <div className="flex justify-between items-start">
          <h3 className="text-xl font-bold text-foreground">{show.title}</h3>
          {(onEdit || (onDelete && !isPast)) && (
            <DropdownMenu.DropdownMenu>
              <DropdownMenu.DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 w-8 p-0"
                  aria-label={`More options for ${show.title}`}
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenu.DropdownMenuTrigger>
              <DropdownMenu.DropdownMenuContent align="end" className="w-48">
                {onEdit && (
                  <DropdownMenu.DropdownMenuItem onClick={() => onEdit(show)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenu.DropdownMenuItem>
                )}
                {onDelete && !isPast && (
                  <DropdownMenu.DropdownMenuItem 
                    onClick={() => onDelete(show.id)}
                    className="text-red-600 focus:text-red-600"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenu.DropdownMenuItem>
                )}
              </DropdownMenu.DropdownMenuContent>
            </DropdownMenu.DropdownMenu>
          )}
        </div>

        {/* Poster Image */}
        {show.poster_url && (
          <div className="w-full">
            <Image
              src={show.poster_url}
              alt={`${show.title} poster`}
              width={400}
              height={320}
              className="w-full max-h-80 object-contain rounded-lg bg-gray-50 dark:bg-gray-800 cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => setImageModalOpen(true)}
            />
          </div>
        )}

        {/* Date/Time, Venue, and Location */}
        <div>
          <div className="text-lg font-semibold text-foreground">
            {formatUserTime(show.date_time, show.time_local)}
          </div>
          <p className="text-muted-foreground">{show.venue}, {show.city}</p>
          {show.notes && (
            <p className="text-sm text-muted-foreground italic mt-1">{show.notes}</p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2">
          {show.ticket_url && !isPast && (
            <Button
              variant="outline"
              size="sm"
              asChild
            >
              <a href={show.ticket_url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4 mr-1" />
                Ticket
              </a>
            </Button>
          )}
          {show.google_photos_url && isPast && (
            <Button
              variant="outline"
              size="sm"
              asChild
              className="text-blue-800 hover:text-blue-900 hover:bg-blue-50 dark:text-blue-400 dark:hover:text-blue-300 dark:hover:bg-blue-950/20"
            >
              <a href={show.google_photos_url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4 mr-1" />
                Photos
              </a>
            </Button>
          )}
          {show.spotify_url && (
            <Button
              variant="outline"
              size="sm"
              asChild
              className="text-green-800 hover:text-green-900 hover:bg-green-50 dark:text-green-400 dark:hover:text-green-300"
            >
              <a href={show.spotify_url} target="_blank" rel="noopener noreferrer">
                <SpotifyIcon className="w-4 h-4 mr-1" />
                Spotify
              </a>
            </Button>
          )}
          {show.apple_music_url && (
            <Button
              variant="outline"
              size="sm"
              asChild
              className="text-red-800 hover:text-red-900 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300"
            >
              <a href={show.apple_music_url} target="_blank" rel="noopener noreferrer">
                <AppleMusicIcon className="w-4 h-4 mr-1" />
                Apple Music
              </a>
            </Button>
          )}
        </div>

        {/* RSVPs */}
        <div className="space-y-2 text-sm text-foreground">
          {rsvps?.going?.length > 0 && (
            <div>
              <span className="font-semibold">{isPast ? 'Went:' : 'Going:'}</span> {rsvps.going.map(formatNameForDisplay).join(', ')}
            </div>
          )}
          {rsvps?.maybe?.length > 0 && (
            <div>
              <span className="font-semibold">Maybe:</span> {rsvps.maybe.map(formatNameForDisplay).join(', ')}
            </div>
          )}
          {rsvps?.not_going?.length > 0 && (
            <div>
              <span className="font-semibold">{isPast ? "Didn't Go:" : 'Not Going:'}</span> {rsvps.not_going.map(formatNameForDisplay).join(', ')}
            </div>
          )}
        </div>

        {/* RSVP Buttons (only for upcoming shows) */}
        {!isPast && userName && (
          <div className="pt-2 border-t border-border">
            <div className="text-sm text-muted-foreground mb-2">Your RSVP:</div>
            <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2">
              <Button
                size="sm"
                variant={userStatus === 'going' ? 'default' : 'outline'}
                onClick={() => handleRSVP(userStatus === 'going' ? null : 'going')}
                disabled={loading}
                className="w-full sm:w-auto"
              >
                Going
              </Button>
              <Button
                size="sm"
                variant={userStatus === 'maybe' ? 'default' : 'outline'}
                onClick={() => handleRSVP(userStatus === 'maybe' ? null : 'maybe')}
                disabled={loading}
                className="w-full sm:w-auto"
              >
                Maybe
              </Button>
              <Button
                size="sm"
                variant={userStatus === 'not_going' ? 'default' : 'outline'}
                onClick={() => handleRSVP(userStatus === 'not_going' ? null : 'not_going')}
                disabled={loading}
                className="w-full sm:w-auto"
              >
                Not Going
              </Button>
              {userStatus && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleRSVP(null)}
                  disabled={loading}
                  className="w-full sm:w-auto"
                >
                  Clear
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Attendance Button (only for past shows) */}
        {isPast && userName && (
          <div className="pt-2 border-t border-border">
            <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2">
              <Button
                size="sm"
                variant={userStatus === 'going' ? 'default' : 'outline'}
                onClick={() => handleRSVP(userStatus === 'going' ? null : 'going')}
                disabled={loading}
                className="w-full sm:w-auto"
              >
                {userStatus === 'going' ? 'I was there!' : 'I was there!'}
              </Button>
              {userStatus === 'going' && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleRSVP(null)}
                  disabled={loading}
                  className="w-full sm:w-auto"
                >
                  Clear
                </Button>
              )}
            </div>
          </div>
        )}
      </CardContent>
      
      {/* Image Modal */}
      {show.poster_url && (
        <ImageModal
          open={imageModalOpen}
          onOpenChange={setImageModalOpen}
          src={show.poster_url}
          alt={`${show.title} poster`}
        />
      )}
    </Card>
  )
}
