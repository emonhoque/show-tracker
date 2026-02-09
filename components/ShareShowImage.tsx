'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Show, RSVPSummary } from '@/lib/types'
import { formatUserTime } from '@/lib/time'
import { formatNameForDisplay } from '@/lib/validation'
import { Share2, Loader2 } from 'lucide-react'
import { useToast } from '@/components/ui/toast'

interface ShareShowImageProps {
  show: Show
  rsvps: RSVPSummary
  isPast: boolean
}

function loadImage(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new window.Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = () => resolve(null)
    img.src = src
  })
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.quadraticCurveTo(x + w, y, x + w, y + r)
  ctx.lineTo(x + w, y + h - r)
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  ctx.lineTo(x + r, y + h)
  ctx.quadraticCurveTo(x, y + h, x, y + h - r)
  ctx.lineTo(x, y + r)
  ctx.quadraticCurveTo(x, y, x + r, y)
  ctx.closePath()
}

function drawCircleImage(ctx: CanvasRenderingContext2D, img: HTMLImageElement, x: number, y: number, size: number) {
  ctx.save()
  ctx.beginPath()
  ctx.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2)
  ctx.closePath()
  ctx.clip()
  ctx.drawImage(img, x, y, size, size)
  ctx.restore()
}

function drawMusicIcon(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, color: string, bgColor: string) {
  ctx.save()
  ctx.beginPath()
  ctx.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2)
  ctx.fillStyle = bgColor
  ctx.fill()
  ctx.fillStyle = color
  ctx.font = `${size * 0.5}px system-ui`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('♪', x + size / 2, y + size / 2 + 1)
  ctx.restore()
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(' ')
  const lines: string[] = []
  let currentLine = ''
  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word
    if (ctx.measureText(testLine).width > maxWidth && currentLine) {
      lines.push(currentLine)
      currentLine = word
    } else {
      currentLine = testLine
    }
  }
  if (currentLine) lines.push(currentLine)
  return lines
}

export function ShareShowImage({ show, rsvps, isPast }: ShareShowImageProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const { showToast } = useToast()

  const headliners = show.show_artists?.filter(a => a.position === 'Headliner') || []
  const supportActs = show.show_artists?.filter(a => a.position === 'Support') || []
  const localActs = show.show_artists?.filter(a => a.position === 'Local') || []

  const generateImage = async (): Promise<HTMLCanvasElement | null> => {
    setIsGenerating(true)

    try {
      const scale = 2
      const W = 540
      const pad = 36
      const contentW = W - pad * 2

      const posterImg = show.poster_url ? await loadImage(show.poster_url) : null

      const artistGroups = [
        { label: 'Headliner', artists: headliners, pill: 'rgba(139,92,246,0.25)', iconBg: 'rgba(88,28,135,0.6)', iconColor: '#c4b5fd' },
        { label: 'Support', artists: supportActs, pill: 'rgba(59,130,246,0.25)', iconBg: 'rgba(30,58,138,0.6)', iconColor: '#93c5fd' },
        { label: 'Local Support', artists: localActs, pill: 'rgba(34,197,94,0.25)', iconBg: 'rgba(20,83,45,0.6)', iconColor: '#86efac' },
      ]

      const artistImages = new Map<string, HTMLImageElement | null>()
      for (const group of artistGroups) {
        for (const artist of group.artists) {
          if (artist.image_url) {
            artistImages.set(artist.image_url, await loadImage(artist.image_url))
          }
        }
      }

      const tmpCanvas = document.createElement('canvas')
      const tmpCtx = tmpCanvas.getContext('2d')!

      // Pre-calculate total height
      let y = pad
      y += 16 + 24

      tmpCtx.font = 'bold 28px system-ui, -apple-system, sans-serif'
      const titleLines = wrapText(tmpCtx, show.title, contentW)
      y += titleLines.length * 34 + 8
      y += 20 + 6
      y += 20 + 24

      if (posterImg) {
        const posterH = Math.min(300, (posterImg.height / posterImg.width) * contentW)
        y += posterH + 24
      }

      for (const group of artistGroups) {
        if (group.artists.length === 0) continue
        y += 16 + 10
        tmpCtx.font = '500 14px system-ui, -apple-system, sans-serif'
        const pillH = 32
        const pillGap = 8
        const iconSize = group.label === 'Headliner' ? 24 : 20
        let rowX = 0
        let rows = 1
        for (const artist of group.artists) {
          const tw = tmpCtx.measureText(artist.artist).width
          const pillW = 12 + iconSize + 8 + tw + 12
          if (rowX + pillW > contentW && rowX > 0) {
            rows++
            rowX = 0
          }
          rowX += pillW + pillGap
        }
        y += rows * (pillH + pillGap) + 8
      }

      if (rsvps?.going?.length > 0) {
        y += 16 + 8
        tmpCtx.font = '14px system-ui, -apple-system, sans-serif'
        const goingText = rsvps.going.map(formatNameForDisplay).join(', ')
        const goingLines = wrapText(tmpCtx, goingText, contentW - 24)
        y += goingLines.length * 20 + 24 + 8
      }

      y += 16 + 20 + pad
      const H = y

      const canvas = document.createElement('canvas')
      canvas.width = W * scale
      canvas.height = H * scale
      const ctx = canvas.getContext('2d')!
      ctx.scale(scale, scale)

      // Background gradient
      const grad = ctx.createLinearGradient(0, 0, W, H)
      grad.addColorStop(0, '#1a1a2e')
      grad.addColorStop(0.5, '#16213e')
      grad.addColorStop(1, '#0f0f23')
      roundRect(ctx, 0, 0, W, H, 20)
      ctx.fillStyle = grad
      ctx.fill()

      // Draw content
      let cy = pad

      // Branding
      ctx.font = '600 11px system-ui, -apple-system, sans-serif'
      ctx.fillStyle = '#9ca3af'
      ctx.textAlign = 'left'
      ctx.fillText('SHOW TRACKER', pad, cy + 11)
      ctx.textAlign = 'right'
      ctx.fillStyle = '#6b7280'
      ctx.fillText('edmadoptionclinic.org', W - pad, cy + 11)
      ctx.textAlign = 'left'
      cy += 16 + 24

      // Title
      ctx.font = 'bold 28px system-ui, -apple-system, sans-serif'
      ctx.fillStyle = '#ffffff'
      for (const line of titleLines) {
        ctx.fillText(line, pad, cy + 24)
        cy += 34
      }
      cy += 8

      // Date
      ctx.font = '500 14px system-ui, -apple-system, sans-serif'
      ctx.fillStyle = '#d8b4fe'
      ctx.fillText(`📅  ${formatUserTime(show.date_time, show.time_local)}`, pad, cy + 14)
      cy += 20 + 6

      // Venue
      ctx.fillStyle = '#93c5fd'
      ctx.fillText(`📍  ${show.venue} • ${show.city}`, pad, cy + 14)
      cy += 20 + 24

      // Poster
      if (posterImg) {
        const posterH = Math.min(300, (posterImg.height / posterImg.width) * contentW)
        ctx.save()
        roundRect(ctx, pad, cy, contentW, posterH, 12)
        ctx.fillStyle = 'rgba(0,0,0,0.3)'
        ctx.fill()
        ctx.clip()
        const imgAspect = posterImg.width / posterImg.height
        const boxAspect = contentW / posterH
        let dx = pad, dy = cy, dw = contentW, dh = posterH
        if (imgAspect > boxAspect) {
          dw = contentW
          dh = contentW / imgAspect
          dy = cy + (posterH - dh) / 2
        } else {
          dh = posterH
          dw = posterH * imgAspect
          dx = pad + (contentW - dw) / 2
        }
        ctx.drawImage(posterImg, dx, dy, dw, dh)
        ctx.restore()
        cy += posterH + 24
      }

      // Artist groups
      for (const group of artistGroups) {
        if (group.artists.length === 0) continue

        ctx.font = '600 11px system-ui, -apple-system, sans-serif'
        ctx.fillStyle = '#9ca3af'
        ctx.textAlign = 'left'
        ctx.fillText(group.label.toUpperCase(), pad, cy + 11)
        cy += 16 + 10

        const pillH = 32
        const pillGap = 8
        const iconSize = group.label === 'Headliner' ? 24 : 20
        let rowX = 0

        for (const artist of group.artists) {
          ctx.font = `${group.label === 'Headliner' ? '600' : '500'} 14px system-ui, -apple-system, sans-serif`
          const tw = ctx.measureText(artist.artist).width
          const pillW = 12 + iconSize + 8 + tw + 12

          if (rowX + pillW > contentW && rowX > 0) {
            cy += pillH + pillGap
            rowX = 0
          }

          const px = pad + rowX
          roundRect(ctx, px, cy, pillW, pillH, 8)
          ctx.fillStyle = group.pill
          ctx.fill()

          const iconY = cy + (pillH - iconSize) / 2
          const aImg = artist.image_url ? artistImages.get(artist.image_url) : null
          if (aImg) {
            drawCircleImage(ctx, aImg, px + 12, iconY, iconSize)
          } else {
            drawMusicIcon(ctx, px + 12, iconY, iconSize, group.iconColor, group.iconBg)
          }

          ctx.fillStyle = group.label === 'Headliner' ? '#ffffff' : '#e5e7eb'
          ctx.textAlign = 'left'
          ctx.fillText(artist.artist, px + 12 + iconSize + 8, cy + pillH / 2 + 5)

          rowX += pillW + pillGap
        }
        cy += pillH + pillGap + 8
      }

      // RSVPs
      if (rsvps?.going?.length > 0) {
        ctx.font = '600 11px system-ui, -apple-system, sans-serif'
        ctx.fillStyle = '#9ca3af'
        ctx.textAlign = 'left'
        ctx.fillText(isPast ? 'WHO WENT' : "WHO'S GOING", pad, cy + 11)
        cy += 16 + 8

        const goingText = rsvps.going.map(formatNameForDisplay).join(', ')
        ctx.font = '14px system-ui, -apple-system, sans-serif'
        const goingLines = wrapText(ctx, goingText, contentW - 24)
        const boxH = goingLines.length * 20 + 16

        roundRect(ctx, pad, cy, contentW, boxH, 10)
        ctx.fillStyle = 'rgba(255,255,255,0.05)'
        ctx.fill()

        ctx.fillStyle = '#e5e7eb'
        for (let i = 0; i < goingLines.length; i++) {
          ctx.fillText(goingLines[i], pad + 12, cy + 8 + 14 + i * 20)
        }
        cy += boxH + 8
      }

      // Footer
      cy += 8
      ctx.strokeStyle = 'rgba(255,255,255,0.1)'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(pad, cy)
      ctx.lineTo(W - pad, cy)
      ctx.stroke()
      cy += 16

      ctx.font = '12px system-ui, -apple-system, sans-serif'
      ctx.fillStyle = '#6b7280'
      ctx.textAlign = 'left'
      ctx.fillText('Join us for live music!', pad, cy + 10)

      ctx.textAlign = 'right'
      ctx.fillStyle = '#9ca3af'
      const statusText = isPast ? 'Past Event' : 'Upcoming'
      ctx.fillText(statusText, W - pad, cy + 10)

      ctx.beginPath()
      ctx.arc(W - pad - ctx.measureText(statusText).width - 12, cy + 6, 4, 0, Math.PI * 2)
      ctx.fillStyle = isPast ? '#6b7280' : '#22c55e'
      ctx.fill()

      return canvas
    } catch (error) {
      console.error('Error generating share image:', error)
      return null
    } finally {
      setIsGenerating(false)
    }
  }

  const downloadCanvas = (canvas: HTMLCanvasElement) => {
    const link = document.createElement('a')
    link.download = `${show.title.replace(/[^a-z0-9]/gi, '-')}.png`
    link.href = canvas.toDataURL('image/png', 1.0)
    link.click()
    showToast({ title: 'Image Downloaded', description: 'Show image saved to downloads', type: 'success', duration: 3000 })
  }

  const handleShare = async () => {
    const canvas = await generateImage()
    if (!canvas) {
      showToast({ title: 'Share Failed', description: 'Failed to generate image', type: 'error', duration: 3000 })
      return
    }

    try {
      const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png', 1.0))
      if (!blob) throw new Error('Failed to create blob')

      const file = new File([blob], `${show.title.replace(/[^a-z0-9]/gi, '-')}.png`, { type: 'image/png' })

      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], title: show.title, text: `Check out ${show.title} at ${show.venue}!` })
      } else {
        downloadCanvas(canvas)
      }
    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
        downloadCanvas(canvas)
      }
    }
  }

  return (
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
  )
}
