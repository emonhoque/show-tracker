'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import Image from 'next/image'
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'

interface ImageModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  src: string
  alt: string
  images?: string[]
}

export function ImageModal({ open, onOpenChange, src, alt, images }: ImageModalProps) {
  const allImages = images && images.length > 0 ? images : [src]
  const [currentIndex, setCurrentIndex] = useState(0)
  const hasMultiple = allImages.length > 1

  const goNext = useCallback(() => {
    setCurrentIndex(i => (i + 1) % allImages.length)
  }, [allImages.length])

  const goPrev = useCallback(() => {
    setCurrentIndex(i => (i - 1 + allImages.length) % allImages.length)
  }, [allImages.length])

  // Reset index when modal opens
  useEffect(() => {
    if (open) setCurrentIndex(0)
  }, [open])

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [open])

  // Keyboard navigation
  useEffect(() => {
    if (!open || !hasMultiple) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') goNext()
      else if (e.key === 'ArrowLeft') goPrev()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open, hasMultiple, goNext, goPrev])

  // Touch swipe navigation
  const touchStartX = useRef<number | null>(null)
  const touchStartY = useRef<number | null>(null)

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
    touchStartY.current = e.touches[0].clientY
  }, [])

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null || !hasMultiple) return
    const deltaX = e.changedTouches[0].clientX - touchStartX.current
    const deltaY = e.changedTouches[0].clientY - touchStartY.current
    touchStartX.current = null
    touchStartY.current = null

    // Only swipe if horizontal movement is dominant and exceeds threshold
    if (Math.abs(deltaX) > 50 && Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX < 0) goNext()
      else goPrev()
    }
  }, [hasMultiple, goNext, goPrev])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="max-w-[95vw] max-h-[95vh] w-[95vw] h-[95vh] p-0 bg-transparent border-0 shadow-none"
        showCloseButton={false}
        onPointerDownOutside={(e) => {
          // Allow clicking outside to close
          e.preventDefault()
          onOpenChange(false)
        }}
      >
        <DialogTitle className="sr-only">
          {alt} - Click outside or press escape to close
        </DialogTitle>
        <DialogDescription className="sr-only">
          Image viewer for {alt}. Use the close button or press escape to close this modal.
        </DialogDescription>
        <div 
          className="relative w-full h-full flex items-center justify-center"
          onClick={() => onOpenChange(false)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Close button */}
          <button
            onClick={() => onOpenChange(false)}
            className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
            aria-label="Close image"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Previous button */}
          {hasMultiple && (
            <button
              onClick={(e) => { e.stopPropagation(); goPrev() }}
              className="absolute left-4 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}

          {/* Next button */}
          {hasMultiple && (
            <button
              onClick={(e) => { e.stopPropagation(); goNext() }}
              className="absolute right-4 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
              aria-label="Next image"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}

          {/* Counter */}
          {hasMultiple && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 bg-black/60 text-white text-sm px-3 py-1 rounded-full">
              {currentIndex + 1} / {allImages.length}
            </div>
          )}
          
          {/* Image */}
          <Image
            src={allImages[currentIndex]}
            alt={`${alt}${hasMultiple ? ` (${currentIndex + 1} of ${allImages.length})` : ''}`}
            width={800}
            height={600}
            className="max-w-full max-h-full object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}
