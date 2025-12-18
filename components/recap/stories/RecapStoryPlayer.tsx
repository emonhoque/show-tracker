'use client'

import { useState, useMemo, useEffect, useCallback } from 'react'
import { X, Copy, Share2, Check, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import type { RecapStoryPlayerProps } from './types'
import { THEME_CONFIGS } from './types'
import { buildRecapSlides, formatRecapSummary } from './buildRecapSlides'
import { useStoryPlayback } from './useStoryPlayback'
import { StoryProgress } from './StoryProgress'
import { StorySlideView } from './StorySlideView'

/**
 * Main RecapStoryPlayer component
 * Instagram-style story player for year recap data
 * Manual navigation - tap left/right to go back/forward
 */
export function RecapStoryPlayer({
  recap,
  onClose,
  initialSlideIndex = 0,
}: RecapStoryPlayerProps) {
  // Detect reduced motion preference
  const [reducedMotion, setReducedMotion] = useState(false)
  const [copySuccess, setCopySuccess] = useState(false)
  const [shareSupported, setShareSupported] = useState(false)

  // Build slides from recap data
  const slides = useMemo(() => buildRecapSlides(recap), [recap])

  // Initialize playback hook with auto-advance timer
  const {
    activeIndex,
    totalSlides,
    progress,
    next,
    prev,
  } = useStoryPlayback({
    slides,
    initialSlideIndex,
    onComplete: onClose,
  })

  // Get current slide and theme
  const currentSlide = slides[activeIndex]
  const currentTheme = THEME_CONFIGS[currentSlide?.theme ?? 'midnight']

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mediaQuery.matches)

    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches)
    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [])

  // Check for Web Share API support
  useEffect(() => {
    setShareSupported(typeof navigator !== 'undefined' && !!navigator.share)
  }, [])

  // Handle tap zones - simplified to just left/right
  const handleTapZone = useCallback(
    (zone: 'left' | 'right') => {
      if (zone === 'left') {
        prev()
      } else {
        next()
      }
    },
    [prev, next]
  )

  // Handle copy summary
  const handleCopy = async () => {
    const summary = formatRecapSummary(recap)
    try {
      await navigator.clipboard.writeText(summary)
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  // Handle share
  const handleShare = async () => {
    const summary = formatRecapSummary(recap)
    try {
      await navigator.share({
        title: `My ${recap.year} Concert Recap`,
        text: summary,
      })
    } catch (error) {
      // User cancelled or share failed
      console.error('Share failed:', error)
    }
  }

  // Prevent body scroll when player is open
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  if (!currentSlide) {
    return null
  }

  const isOutroSlide = currentSlide.kind === 'outro'

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black"
      role="dialog"
      aria-modal="true"
      aria-label={`Story slide ${activeIndex + 1} of ${totalSlides}: ${currentSlide.title}`}
    >
      {/* 9:16 aspect ratio container - full height on mobile, constrained on desktop */}
      <div
        className={cn(
          'relative flex flex-col w-full h-full',
          // On larger screens, constrain to 9:16 aspect ratio
          'sm:h-[min(100vh,900px)] sm:w-[min(56.25vh,506px)] sm:max-h-[900px]',
          'sm:rounded-2xl sm:overflow-hidden sm:shadow-2xl',
          currentTheme.background,
          currentTheme.text
        )}
      >
        {/* Safe area top padding */}
        <div className="pt-safe sm:pt-0" />

      {/* Progress bar - shows completed slides and auto-advance progress */}
      <div className="px-4 pt-4 pb-2">
        <StoryProgress
          totalSlides={totalSlides}
          activeIndex={activeIndex}
          progress={progress}
          theme={currentTheme}
          reducedMotion={reducedMotion}
        />
      </div>

      {/* Header with close button and slide counter */}
      <div className="flex items-center justify-between px-4 py-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className={cn(
            'text-white/80 hover:text-white hover:bg-white/10',
            'h-10 w-10 p-0 rounded-full'
          )}
          aria-label="Close story"
        >
          <X className="h-5 w-5" />
        </Button>

        {/* Slide counter */}
        <span className="text-white/60 text-sm">
          {activeIndex + 1} / {totalSlides}
        </span>
      </div>

      {/* Main slide content */}
      <div className="flex-1 relative">
        {/* Slide content */}
        <StorySlideView slide={currentSlide} reducedMotion={reducedMotion} />

        {/* Tap zones - left half and right half (on top of content) */}
        <div className="absolute inset-0 flex z-10">
          {/* Left tap zone (previous) */}
          <button
            className="w-1/3 h-full focus:outline-none active:bg-white/5 transition-colors"
            onClick={() => handleTapZone('left')}
            aria-label="Previous slide"
          />
          {/* Right tap zone (next) - larger for easier tapping */}
          <button
            className="w-2/3 h-full focus:outline-none active:bg-white/5 transition-colors"
            onClick={() => handleTapZone('right')}
            aria-label="Next slide"
          />
        </div>

        {/* Navigation hints - show on first slide */}
        {activeIndex === 0 && (
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-8 text-white/50 text-sm pointer-events-none">
            <span className="flex items-center gap-1">
              <ChevronLeft className="h-4 w-4" /> Back
            </span>
            <span className="flex items-center gap-1">
              Next <ChevronRight className="h-4 w-4" />
            </span>
          </div>
        )}
      </div>

      {/* Bottom controls (for outro slide) */}
      {isOutroSlide && (
        <div
          className={cn(
            'px-4 pb-8 pt-4 flex flex-col sm:flex-row gap-3 items-center justify-center',
            !reducedMotion && 'animate-in slide-in-from-bottom-4 duration-500 delay-500'
          )}
        >
          <Button
            onClick={handleCopy}
            className={cn(
              'w-full sm:w-auto bg-white/20 hover:bg-white/30 text-white border-0',
              'min-w-[160px]'
            )}
          >
            {copySuccess ? (
              <>
                <Check className="h-4 w-4 mr-2" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 mr-2" />
                Copy Summary
              </>
            )}
          </Button>

          {shareSupported && (
            <Button
              onClick={handleShare}
              className={cn(
                'w-full sm:w-auto bg-white/20 hover:bg-white/30 text-white border-0',
                'min-w-[160px]'
              )}
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          )}
        </div>
      )}

      {/* Safe area bottom padding */}
      <div className="pb-safe sm:pb-0" />

      {/* Screen reader instructions */}
      <div className="sr-only">
        Use left and right arrow keys or tap left/right to navigate between slides.
        Press Space or tap right to go forward. Press Escape to close.
      </div>
      </div>
    </div>
  )
}
