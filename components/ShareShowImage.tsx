'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import html2canvas from 'html2canvas'
import { Button } from '@/components/ui/button'
import { Show, RSVPSummary } from '@/lib/types'
import { formatUserTime } from '@/lib/time'
import { formatNameForDisplay } from '@/lib/validation'
import { Share2, Download, Music, MapPin, Calendar, Loader2 } from 'lucide-react'
import { useToast } from '@/components/ui/toast'

interface ShareShowImageProps {
  show: Show
  rsvps: RSVPSummary
  isPast: boolean
}

export function ShareShowImage({ show, rsvps, isPast }: ShareShowImageProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const { showToast } = useToast()

  const generateImage = async (): Promise<HTMLCanvasElement | null> => {
    if (!cardRef.current) return null
    
    setIsGenerating(true)
    
    try {
      // Wait for images to load
      const images = cardRef.current.querySelectorAll('img')
      await Promise.all(
        Array.from(images).map((img) => {
          if (img.complete) return Promise.resolve()
          return new Promise((resolve) => {
            img.onload = resolve
            img.onerror = resolve
          })
        })
      )

      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: '#0a0a0a',
        scale: 2, // Higher quality
        useCORS: true,
        allowTaint: true,
        logging: false,
      } as Parameters<typeof html2canvas>[1])
      
      return canvas
    } catch (error) {
      console.error('Error generating image:', error)
      return null
    } finally {
      setIsGenerating(false)
    }
  }

  const handleShare = async () => {
    setShowPreview(true)
    
    // Small delay to ensure the preview is rendered
    await new Promise(resolve => setTimeout(resolve, 100))
    
    const canvas = await generateImage()
    if (!canvas) {
      showToast({
        title: 'Share Failed',
        description: 'Failed to generate image',
        type: 'error',
        duration: 3000
      })
      setShowPreview(false)
      return
    }

    try {
      const blob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob(resolve, 'image/png', 1.0)
      })

      if (!blob) throw new Error('Failed to create blob')

      const file = new File([blob], `${show.title.replace(/[^a-z0-9]/gi, '-')}.png`, {
        type: 'image/png'
      })

      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: show.title,
          text: `Check out ${show.title} at ${show.venue}!`
        })
      } else {
        // Fallback: download the image
        handleDownload(canvas)
      }
    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
        console.error('Error sharing:', error)
        // Fallback to download
        handleDownload(canvas)
      }
    }
    
    setShowPreview(false)
  }

  const handleDownload = async (existingCanvas?: HTMLCanvasElement) => {
    if (!existingCanvas) {
      setShowPreview(true)
      await new Promise(resolve => setTimeout(resolve, 100))
    }
    
    const canvas = existingCanvas || await generateImage()
    if (!canvas) {
      showToast({
        title: 'Download Failed',
        description: 'Failed to generate image',
        type: 'error',
        duration: 3000
      })
      setShowPreview(false)
      return
    }

    const link = document.createElement('a')
    link.download = `${show.title.replace(/[^a-z0-9]/gi, '-')}.png`
    link.href = canvas.toDataURL('image/png', 1.0)
    link.click()

    showToast({
      title: 'Image Downloaded',
      description: 'Show image saved to downloads',
      type: 'success',
      duration: 3000
    })
    
    if (!existingCanvas) {
      setShowPreview(false)
    }
  }

  const headliners = show.show_artists?.filter(artist => artist.position === 'Headliner') || []
  const supportActs = show.show_artists?.filter(artist => artist.position === 'Support') || []
  const localActs = show.show_artists?.filter(artist => artist.position === 'Local') || []

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={handleShare}
        disabled={isGenerating}
        className="flex-1 sm:flex-none"
      >
        {isGenerating ? (
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        ) : (
          <Share2 className="w-4 h-4 mr-2" />
        )}
        Share
      </Button>

      {/* Hidden shareable card - rendered off-screen for capture */}
      {showPreview && (
        <div className="fixed -left-[9999px] top-0">
          <div
            ref={cardRef}
            className="w-[500px] p-6 rounded-2xl"
            style={{
              background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f0f23 100%)',
              fontFamily: 'system-ui, -apple-system, sans-serif',
            }}
          >
            {/* Header with branding */}
            <div className="flex items-center justify-between mb-4">
              <div className="text-xs text-gray-400 tracking-wider uppercase">
                Show Tracker
              </div>
              <div className="text-xs text-gray-500">
                edmadoptionclinic.org
              </div>
            </div>

            {/* Show Title */}
            <h1 className="text-2xl font-bold text-white mb-3 leading-tight">
              {show.title}
            </h1>

            {/* Date & Time */}
            <div className="flex items-center gap-2 text-purple-300 mb-2">
              <Calendar className="w-4 h-4" />
              <span className="text-sm font-medium">
                {formatUserTime(show.date_time, show.time_local)}
              </span>
            </div>

            {/* Venue & Location */}
            <div className="flex items-center gap-2 text-blue-300 mb-5">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">
                {show.venue} • {show.city}
              </span>
            </div>

            {/* Poster Image */}
            {show.poster_url && (
              <div className="mb-5 rounded-xl overflow-hidden bg-black/30">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={show.poster_url}
                  alt={show.title}
                  className="w-full h-auto max-h-[280px] object-contain"
                  crossOrigin="anonymous"
                />
              </div>
            )}

            {/* Artists Section */}
            {(headliners.length > 0 || supportActs.length > 0 || localActs.length > 0) && (
              <div className="space-y-4 mb-5">
                {/* Headliners */}
                {headliners.length > 0 && (
                  <div>
                    <div className="text-xs text-gray-400 uppercase tracking-wider mb-2">
                      Headliner{headliners.length > 1 ? 's' : ''}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {headliners.map((artist, index) => (
                        <div
                          key={`h-${index}`}
                          className="flex items-center gap-2 px-3 py-2 rounded-lg"
                          style={{ backgroundColor: 'rgba(139, 92, 246, 0.2)' }}
                        >
                          {artist.image_url ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={artist.image_url}
                              alt={artist.artist}
                              className="w-6 h-6 rounded-full object-cover"
                              crossOrigin="anonymous"
                            />
                          ) : (
                            <div className="w-6 h-6 rounded-full bg-purple-900/50 flex items-center justify-center">
                              <Music className="w-3 h-3 text-purple-300" />
                            </div>
                          )}
                          <span className="text-sm font-medium text-white">{artist.artist}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Support */}
                {supportActs.length > 0 && (
                  <div>
                    <div className="text-xs text-gray-400 uppercase tracking-wider mb-2">
                      Support
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {supportActs.map((artist, index) => (
                        <div
                          key={`s-${index}`}
                          className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
                          style={{ backgroundColor: 'rgba(59, 130, 246, 0.2)' }}
                        >
                          {artist.image_url ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={artist.image_url}
                              alt={artist.artist}
                              className="w-5 h-5 rounded-full object-cover"
                              crossOrigin="anonymous"
                            />
                          ) : (
                            <div className="w-5 h-5 rounded-full bg-blue-900/50 flex items-center justify-center">
                              <Music className="w-3 h-3 text-blue-300" />
                            </div>
                          )}
                          <span className="text-sm text-gray-200">{artist.artist}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Local */}
                {localActs.length > 0 && (
                  <div>
                    <div className="text-xs text-gray-400 uppercase tracking-wider mb-2">
                      Local Support
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {localActs.map((artist, index) => (
                        <div
                          key={`l-${index}`}
                          className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
                          style={{ backgroundColor: 'rgba(34, 197, 94, 0.2)' }}
                        >
                          {artist.image_url ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={artist.image_url}
                              alt={artist.artist}
                              className="w-5 h-5 rounded-full object-cover"
                              crossOrigin="anonymous"
                            />
                          ) : (
                            <div className="w-5 h-5 rounded-full bg-green-900/50 flex items-center justify-center">
                              <Music className="w-3 h-3 text-green-300" />
                            </div>
                          )}
                          <span className="text-sm text-gray-200">{artist.artist}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* RSVPs Section */}
            {rsvps?.going?.length > 0 && (
              <div 
                className="rounded-xl p-4 mb-4"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
              >
                <div className="text-xs text-gray-400 uppercase tracking-wider mb-2">
                  {isPast ? 'Who Went' : 'Who\'s Going'}
                </div>
                <div className="text-sm text-gray-200">
                  {rsvps.going.map(formatNameForDisplay).join(', ')}
                </div>
              </div>
            )}

            {/* Footer */}
            <div 
              className="pt-4 border-t flex items-center justify-between"
              style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}
            >
              <div className="text-xs text-gray-500">
                Join us for live music!
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="text-xs text-gray-400">
                  {isPast ? 'Past Event' : 'Upcoming'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
