'use client'

import { memo } from 'react'
import Image from 'next/image'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import { cn } from '@/lib/utils'
import type { StorySlide, TextSlide, ChartSlide, ListSlide, ThemeConfig } from './types'
import { THEME_CONFIGS } from './types'

interface StorySlideViewProps {
  slide: StorySlide
  reducedMotion?: boolean
}

/**
 * Renders individual story slides based on their kind
 * Supports text, chart, and list slides with themed styling
 */
export const StorySlideView = memo(function StorySlideView({
  slide,
  reducedMotion = false,
}: StorySlideViewProps) {
  const theme = THEME_CONFIGS[slide.theme]

  switch (slide.kind) {
    case 'intro':
    case 'stat':
    case 'rank':
    case 'outro':
      return <TextSlideView slide={slide} theme={theme} reducedMotion={reducedMotion} />
    case 'chart':
      return <ChartSlideView slide={slide} theme={theme} reducedMotion={reducedMotion} />
    case 'list':
      return <ListSlideView slide={slide} theme={theme} reducedMotion={reducedMotion} />
    default:
      return null
  }
})

// Text-based slide renderer
function TextSlideView({
  slide,
  theme,
  reducedMotion,
}: {
  slide: TextSlide
  theme: ThemeConfig
  reducedMotion: boolean
}) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center h-full px-8 text-center',
        !reducedMotion && 'animate-in fade-in duration-300'
      )}
    >
      {slide.emoji && (
        <span
          className={cn(
            'text-6xl mb-6',
            !reducedMotion && 'animate-in zoom-in duration-500 delay-100'
          )}
          role="img"
          aria-hidden="true"
        >
          {slide.emoji}
        </span>
      )}

      <h2
        className={cn(
          'text-xl font-medium mb-4 opacity-80',
          theme.accent,
          !reducedMotion && 'animate-in slide-in-from-bottom-4 duration-500 delay-150'
        )}
      >
        {slide.title}
      </h2>

      {slide.headline && (
        <p
          className={cn(
            'text-5xl sm:text-6xl font-bold mb-4',
            theme.text,
            !reducedMotion && 'animate-in slide-in-from-bottom-4 duration-500 delay-200'
          )}
        >
          {slide.headline}
        </p>
      )}

      {slide.subtext && (
        <p
          className={cn(
            'text-lg opacity-70',
            theme.text,
            !reducedMotion && 'animate-in slide-in-from-bottom-4 duration-500 delay-300'
          )}
        >
          {slide.subtext}
        </p>
      )}
    </div>
  )
}

// Chart slide renderer using Recharts
function ChartSlideView({
  slide,
  theme,
  reducedMotion,
}: {
  slide: ChartSlide
  theme: ThemeConfig
  reducedMotion: boolean
}) {
  const maxValue = Math.max(...slide.chart.data.map(d => d.value), 1)

  // Get accent color from theme for bars
  const getBarColor = () => {
    switch (slide.theme) {
      case 'midnight':
        return '#818cf8' // indigo-400
      case 'neon':
        return '#f472b6' // pink-400
      case 'sunset':
        return '#fde047' // yellow-300
      case 'forest':
        return '#34d399' // emerald-400
      case 'mono':
        return '#d4d4d8' // zinc-300
      default:
        return '#ffffff'
    }
  }

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center h-full px-4',
        !reducedMotion && 'animate-in fade-in duration-300'
      )}
      role="figure"
      aria-label={slide.chart.ariaLabel}
    >
      <h2
        className={cn(
          'text-xl font-medium mb-8 opacity-80',
          theme.accent,
          !reducedMotion && 'animate-in slide-in-from-bottom-4 duration-500 delay-100'
        )}
      >
        {slide.title}
      </h2>

      <div
        className={cn(
          'w-full max-w-md h-64',
          !reducedMotion && 'animate-in slide-in-from-bottom-4 duration-500 delay-200'
        )}
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={slide.chart.data}
            margin={{ top: 10, right: 10, left: -20, bottom: 5 }}
          >
            <XAxis
              dataKey="label"
              tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 10 }}
              axisLine={{ stroke: 'rgba(255,255,255,0.2)' }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 10 }}
              axisLine={{ stroke: 'rgba(255,255,255,0.2)' }}
              tickLine={false}
              domain={[0, maxValue]}
              allowDecimals={false}
            />
            <Bar
              dataKey="value"
              radius={[4, 4, 0, 0]}
              isAnimationActive={!reducedMotion}
              animationDuration={800}
            >
              {slide.chart.data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={getBarColor()}
                  fillOpacity={entry.value > 0 ? 0.9 : 0.3}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

// List slide renderer for top artists, venues, etc.
function ListSlideView({
  slide,
  theme,
  reducedMotion,
}: {
  slide: ListSlide
  theme: ThemeConfig
  reducedMotion: boolean
}) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center h-full px-8',
        !reducedMotion && 'animate-in fade-in duration-300'
      )}
    >
      <h2
        className={cn(
          'text-xl font-medium mb-8 opacity-80',
          theme.accent,
          !reducedMotion && 'animate-in slide-in-from-bottom-4 duration-500 delay-100'
        )}
      >
        {slide.title}
      </h2>

      <div className="w-full max-w-sm space-y-4">
        {slide.items.map((item, index) => (
          <div
            key={item.label}
            className={cn(
              'flex items-center gap-4 bg-white/10 rounded-xl p-4',
              !reducedMotion &&
                `animate-in slide-in-from-bottom-4 duration-500`,
              !reducedMotion && `delay-${(index + 2) * 100}`
            )}
            style={{
              animationDelay: reducedMotion ? '0ms' : `${(index + 2) * 100}ms`,
            }}
          >
            {/* Rank number or image */}
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center overflow-hidden">
              {item.imageUrl ? (
                <Image
                  src={item.imageUrl}
                  alt=""
                  width={48}
                  height={48}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <span className={cn('text-2xl font-bold', theme.text)}>
                  {index + 1}
                </span>
              )}
            </div>

            {/* Label and value */}
            <div className="flex-1 min-w-0">
              <p className={cn('font-semibold truncate', theme.text)}>
                {item.label}
              </p>
              <p className={cn('text-sm opacity-70', theme.text)}>{item.value}</p>
            </div>

            {/* Badge if present */}
            {item.badge && (
              <span
                className={cn(
                  'px-2 py-1 text-xs font-medium rounded-full bg-white/20',
                  theme.accent
                )}
              >
                {item.badge}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
