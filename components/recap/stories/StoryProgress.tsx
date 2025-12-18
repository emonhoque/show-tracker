'use client'

import { memo } from 'react'
import { cn } from '@/lib/utils'
import type { ThemeConfig } from './types'

interface StoryProgressProps {
  totalSlides: number
  activeIndex: number
  progress: number
  theme: ThemeConfig
  reducedMotion?: boolean
}

/**
 * Progress bar component showing slide progress segments
 * Each segment represents one slide, with the current slide filling based on progress
 */
export const StoryProgress = memo(function StoryProgress({
  totalSlides,
  activeIndex,
  progress,
  theme,
  reducedMotion = false,
}: StoryProgressProps) {
  return (
    <div
      className="flex gap-1 w-full px-2"
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={totalSlides}
      aria-valuenow={activeIndex + 1}
      aria-label={`Slide ${activeIndex + 1} of ${totalSlides}`}
    >
      {Array.from({ length: totalSlides }).map((_, index) => {
        const isCompleted = index < activeIndex
        const isCurrent = index === activeIndex

        return (
          <div
            key={index}
            className={cn(
              'h-1 flex-1 rounded-full overflow-hidden',
              theme.progressBg
            )}
          >
            <div
              className={cn(
                'h-full rounded-full',
                theme.progressFill,
                // Use transition only if not reduced motion
                !reducedMotion && isCurrent && 'transition-none'
              )}
              style={{
                width: isCompleted
                  ? '100%'
                  : isCurrent
                  ? `${progress * 100}%`
                  : '0%',
                // Smooth progress animation only when not reduced motion
                ...(isCurrent && !reducedMotion
                  ? { transition: 'width 100ms linear' }
                  : {}),
              }}
            />
          </div>
        )
      })}
    </div>
  )
})
