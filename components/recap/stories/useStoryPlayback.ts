'use client'

import { useState, useCallback, useEffect } from 'react'
import type { StorySlide } from './types'

interface UseStoryPlaybackOptions {
  slides: StorySlide[]
  initialSlideIndex?: number
  onComplete?: () => void
}

interface UseStoryPlaybackReturn {
  activeIndex: number
  progress: number
  totalSlides: number
  next: () => void
  prev: () => void
  goTo: (index: number) => void
}

/**
 * Custom hook for managing story playback state
 * Manual navigation only - no autoplay
 * Users tap/click to advance through slides
 */
export function useStoryPlayback({
  slides,
  initialSlideIndex = 0,
  onComplete,
}: UseStoryPlaybackOptions): UseStoryPlaybackReturn {
  const [activeIndex, setActiveIndex] = useState(initialSlideIndex)

  // Progress is based on slide position (no time-based progress)
  const progress = (activeIndex + 1) / slides.length

  // Move to the next slide
  const next = useCallback(() => {
    if (activeIndex < slides.length - 1) {
      setActiveIndex(prev => prev + 1)
    } else {
      // Reached the end
      onComplete?.()
    }
  }, [activeIndex, slides.length, onComplete])

  // Move to the previous slide
  const prev = useCallback(() => {
    if (activeIndex > 0) {
      setActiveIndex(prev => prev - 1)
    }
  }, [activeIndex])

  // Go to a specific slide
  const goTo = useCallback((index: number) => {
    if (index >= 0 && index < slides.length) {
      setActiveIndex(index)
    }
  }, [slides.length])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault()
          prev()
          break
        case 'ArrowRight':
        case ' ':
          e.preventDefault()
          next()
          break
        case 'Escape':
          e.preventDefault()
          onComplete?.()
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [prev, next, onComplete])

  return {
    activeIndex,
    progress,
    totalSlides: slides.length,
    next,
    prev,
    goTo,
  }
}
