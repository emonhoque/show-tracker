'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Show, RSVPSummary } from '@/lib/types'
import { formatUserTime } from '@/lib/time'
import { formatNameForDisplay } from '@/lib/validation'
import { ExternalLink, MoreVertical, Edit, Trash2, Copy, Music } from 'lucide-react'
import { ImageModal } from '@/components/ImageModal'
import { ExportToCalendar } from '@/components/ExportToCalendar'

// Apple Music icon as SVG component

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
  const [copySuccess, setCopySuccess] = useState(false)

  // Get userName from localStorage on client side
  useEffect(() => {
    setUserName(localStorage.getItem('userName'))
  }, [])

  const formatShowAsText = (show: Show): string => {
    const lines = [
      show.title,
      '',
      formatUserTime(show.date_time, show.time_local),
      `${show.venue}, ${show.city}`
    ]

    // Add headliner and support information
    if (show.show_artists && show.show_artists.length > 0) {
      lines.push('')
      
      // Headliners
      const headliners = show.show_artists.filter(artist => artist.position === 'Headliner')
      if (headliners.length > 0) {
        lines.push('Headliner:')
        headliners.forEach(artist => {
          lines.push(`  • ${artist.artist}`)
        })
      }
      
      // Support acts
      const supportActs = show.show_artists.filter(artist => artist.position === 'Support')
      if (supportActs.length > 0) {
        lines.push('Support:')
        supportActs.forEach(artist => {
          lines.push(`  • ${artist.artist}`)
        })
      }
      
      // Local acts
      const localActs = show.show_artists.filter(artist => artist.position === 'Local')
      if (localActs.length > 0) {
        lines.push('Local Support:')
        localActs.forEach(artist => {
          lines.push(`  • ${artist.artist}`)
        })
      }
    }

    if (show.notes) {
      lines.push('')
      lines.push(`Notes: ${show.notes}`)
    }

    if (show.ticket_url) {
      lines.push('')
      lines.push(`Tickets: ${show.ticket_url}`)
    }

    return lines.join('\n')
  }

  const handleCopyShowInfo = async () => {
    try {
      const text = formatShowAsText(show)
      await navigator.clipboard.writeText(text)
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    } catch (error) {
      console.error('Failed to copy text:', error)
      alert('Failed to copy show info')
    }
  }

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
    <Card className="w-full mb-6 overflow-hidden gap-1">
      {/* Header Section */}
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-xl font-bold leading-tight mb-2">
              {show.title}
            </CardTitle>
            <CardDescription className="text-base font-medium">
              {formatUserTime(show.date_time, show.time_local)}
            </CardDescription>
            <div className="text-sm text-muted-foreground mt-1">
              {show.venue} • {show.city}
            </div>
          </div>
          {(onEdit || (onDelete && !isPast)) && (
            <DropdownMenu.DropdownMenu>
              <DropdownMenu.DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 w-8 p-0 flex-shrink-0"
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
      </CardHeader>

      {/* Main Content Section */}
      <CardContent className="space-y-4">
        {/* Poster Image */}
        {show.poster_url && (
          <div className="w-full flex items-center justify-center bg-muted/30 rounded-lg overflow-hidden">
            <Image
              src={show.poster_url}
              alt={`${show.title} poster`}
              width={400}
              height={320}
              className="w-full max-h-80 object-contain cursor-pointer"
              onClick={() => setImageModalOpen(true)}
            />
          </div>
        )}

        {/* Notes Section */}
        {show.notes && (
          <div className="bg-muted/50 rounded-lg p-3 border-l-4 border-muted-foreground/20">
            <p className="text-sm text-muted-foreground italic">{show.notes}</p>
          </div>
        )}

        {/* Show Artists */}
        {show.show_artists && show.show_artists.length > 0 && (
          <div className="space-y-3">
            {/* Headliners */}
            {show.show_artists.filter(artist => artist.position === 'Headliner').length > 0 && (
              <div className="space-y-2">
                <div className="text-sm font-semibold text-foreground">Headliner</div>
                <div className="flex flex-wrap gap-2">
                  {show.show_artists
                    .filter(artist => artist.position === 'Headliner')
                    .sort((a, b) => {
                      // Sort Spotify artists first, then custom artists
                      if (a.spotify_id && !b.spotify_id) return -1
                      if (!a.spotify_id && b.spotify_id) return 1
                      return 0
                    })
                    .map((artist, index) => (
                      <div
                        key={`headliner-${index}`}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg border bg-muted/30 ${artist.spotify_url ? 'cursor-pointer' : ''}`}
                        onClick={() => artist.spotify_url && window.open(artist.spotify_url, '_blank')}
                      >
                        {artist.image_url ? (
                          <Image
                            src={artist.image_url}
                            alt={artist.artist}
                            width={24}
                            height={24}
                            className="w-6 h-6 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center">
                            <Music className="w-3 h-3 text-muted-foreground" />
                          </div>
                        )}
                        <span className="text-sm font-medium">{artist.artist}</span>
                      </div>
                    ))}
                </div>
              </div>
            )}
            
            {/* Support Acts */}
            {show.show_artists.filter(artist => artist.position === 'Support').length > 0 && (
              <div className="space-y-2">
                <div className="text-sm font-semibold text-foreground">Support</div>
                <div className="flex flex-wrap gap-2">
                  {show.show_artists
                    .filter(artist => artist.position === 'Support')
                    .sort((a, b) => {
                      // Sort Spotify artists first, then custom artists
                      if (a.spotify_id && !b.spotify_id) return -1
                      if (!a.spotify_id && b.spotify_id) return 1
                      return 0
                    })
                    .map((artist, index) => (
                      <div
                        key={`support-${index}`}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg border bg-muted/30 ${artist.spotify_url ? 'cursor-pointer' : ''}`}
                        onClick={() => artist.spotify_url && window.open(artist.spotify_url, '_blank')}
                      >
                        {artist.image_url ? (
                          <Image
                            src={artist.image_url}
                            alt={artist.artist}
                            width={24}
                            height={24}
                            className="w-6 h-6 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center">
                            <Music className="w-3 h-3 text-muted-foreground" />
                          </div>
                        )}
                        <span className="text-sm font-medium">{artist.artist}</span>
                      </div>
                    ))}
                </div>
              </div>
            )}
            
            {/* Local Acts */}
            {show.show_artists.filter(artist => artist.position === 'Local').length > 0 && (
              <div className="space-y-2">
                <div className="text-sm font-semibold text-foreground">Local Support</div>
                <div className="flex flex-wrap gap-2">
                  {show.show_artists
                    .filter(artist => artist.position === 'Local')
                    .sort((a, b) => {
                      // Sort Spotify artists first, then custom artists
                      if (a.spotify_id && !b.spotify_id) return -1
                      if (!a.spotify_id && b.spotify_id) return 1
                      return 0
                    })
                    .map((artist, index) => (
                      <div
                        key={`local-${index}`}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg border bg-muted/30 ${artist.spotify_url ? 'cursor-pointer' : ''}`}
                        onClick={() => artist.spotify_url && window.open(artist.spotify_url, '_blank')}
                      >
                        {artist.image_url ? (
                          <Image
                            src={artist.image_url}
                            alt={artist.artist}
                            width={24}
                            height={24}
                            className="w-6 h-6 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center">
                            <Music className="w-3 h-3 text-muted-foreground" />
                          </div>
                        )}
                        <span className="text-sm font-medium">{artist.artist}</span>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* RSVPs Section */}
        {(rsvps?.going?.length > 0 || rsvps?.maybe?.length > 0 || rsvps?.not_going?.length > 0) && (
          <div className="space-y-3">
            <div className="text-sm font-semibold text-foreground border-b border-border pb-1">
              {isPast ? 'Attendance' : 'RSVPs'}
            </div>
            <div className="space-y-2 text-sm">
              {rsvps?.going?.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="font-medium text-foreground">
                    {isPast ? 'Went:' : 'Going:'}
                  </span>
                  <span className="text-muted-foreground">
                    {rsvps.going.map(formatNameForDisplay).join(', ')}
                  </span>
                </div>
              )}
              {rsvps?.maybe?.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="font-medium text-foreground">
                    Maybe:
                  </span>
                  <span className="text-muted-foreground">
                    {rsvps.maybe.map(formatNameForDisplay).join(', ')}
                  </span>
                </div>
              )}
              {rsvps?.not_going?.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="font-medium text-foreground">
                    {isPast ? "Didn't Go:" : 'Not Going:'}
                  </span>
                  <span className="text-muted-foreground">
                    {rsvps.not_going.map(formatNameForDisplay).join(', ')}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>

      {/* Footer Section */}
      <CardFooter className="flex-col gap-4 pt-0 !items-stretch">
        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2 w-full">
          {show.ticket_url && !isPast && (
            <Button
              variant="outline"
              size="sm"
              asChild
              className="flex-1 sm:flex-none"
            >
              <a href={show.ticket_url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4 mr-2" />
                Get Tickets
              </a>
            </Button>
          )}
          {!isPast && <ExportToCalendar show={show} />}
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyShowInfo}
            className="flex-1 sm:flex-none"
          >
            <Copy className="w-4 h-4 mr-2" />
            {copySuccess ? 'Copied!' : 'Copy Info'}
          </Button>
          {show.google_photos_url && isPast && (
            <Button
              variant="outline"
              size="sm"
              asChild
              className="flex-1 sm:flex-none"
            >
              <a href={show.google_photos_url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4 mr-2" />
                Photos
              </a>
            </Button>
          )}
          {/* Only show Apple Music button if no show artists (old style) */}
          {(!show.show_artists || show.show_artists.length === 0) && show.apple_music_url && (
            <Button
              variant="outline"
              size="sm"
              asChild
              className="flex-1 sm:flex-none"
            >
              <a href={show.apple_music_url} target="_blank" rel="noopener noreferrer">
                <AppleMusicIcon className="w-4 h-4 mr-2" />
                Apple Music
              </a>
            </Button>
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
      </CardFooter>
      
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
