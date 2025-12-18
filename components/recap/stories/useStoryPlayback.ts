'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import type { StorySlide } from './types'
import { DEFAULT_SLIDE_DURATION } from './types'

interface UseStoryPlaybackOptions {
  slides: StorySlide[]
  initialSlideIndex?: number
  onComplete?: () => void
  autoAdvance?: boolean
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
 * Auto-advances after duration, but allows manual navigation
 */
export function useStoryPlayback({
  slides,
  initialSlideIndex = 0,
  onComplete,
  autoAdvance = true,
}: UseStoryPlaybackOptions): UseStoryPlaybackReturn {
  const [activeIndex, setActiveIndex] = useState(initialSlideIndex)
  const [progress, setProgress] = useState(0)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const progressRef = useRef<NodeJS.Timeout | null>(null)
  const startTimeRef = useRef<number>(0)

  // Get duration for current slide
  const getCurrentDuration = useCallback(() => {
    const slide = slides[activeIndex]
    return slide?.durationMs ?? DEFAULT_SLIDE_DURATION
  }, [slides, activeIndex])

  // Move to the next slide
  const next = useCallback(() => {
    if (activeIndex < slides.length - 1) {
      setActiveIndex(prev => prev + 1)
      setProgress(0)
    } else {
      // Reached the end
      onComplete?.()
    }
  }, [activeIndex, slides.length, onComplete])

  // Move to the previous slide
  const prev = useCallback(() => {
    if (activeIndex > 0) {
      setActiveIndex(prev => prev - 1)
      setProgress(0)
    }
  }, [activeIndex])

  // Go to a specific slide
  const goTo = useCallback((index: number) => {
    if (index >= 0 && index < slides.length) {
      setActiveIndex(index)
      setProgress(0)
    }
  }, [slides.length])

  // Auto-advance timer and progress
  useEffect(() => {
    if (!autoAdvance) return

    const duration = getCurrentDuration()
    startTimeRef.current = Date.now()

    // Clear existing timers
    if (timerRef.current) clearTimeout(timerRef.current)
    if (progressRef.current) clearInterval(progressRef.current)

    // Progress update interval (60fps)
    progressRef.current = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current
      const newProgress = Math.min(elapsed / duration, 1)
      setProgress(newProgress)
    }, 16)

    // Auto-advance timer
    timerRef.current = setTimeout(() => {
      next()
    }, duration)

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
      if (progressRef.current) clearInterval(progressRef.current)
    }
  }, [activeIndex, autoAdvance, getCurrentDuration, next])

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
