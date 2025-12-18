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
import { formatNameForDisplay } from '@/lib/validation'
import type { StorySlide, TextSlide, ChartSlide, ListSlide, ComparisonSlide, ThemeConfig } from './types'
import { THEME_CONFIGS } from './types'

interface StorySlideViewProps {
  slide: StorySlide
  reducedMotion?: boolean
}

// Animation helper - uses GPU-accelerated properties and shorter durations for mobile
const anim = {
  fadeIn: 'animate-in fade-in duration-200',
  slideUp: 'animate-in fade-in slide-in-from-bottom-2 duration-300',
  slideUpSlow: 'animate-in fade-in slide-in-from-bottom-3 duration-400',
  scaleIn: 'animate-in fade-in zoom-in-95 duration-300',
  slideLeft: 'animate-in fade-in slide-in-from-left-2 duration-300',
}

// Stagger delays - reduced for snappier feel
const delay = {
  d0: 'delay-0',
  d1: 'delay-75',
  d2: 'delay-100',
  d3: 'delay-150',
  d4: 'delay-200',
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
    case 'comparison':
      return <ComparisonSlideView slide={slide} theme={theme} reducedMotion={reducedMotion} />
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
        'flex flex-col items-center justify-center h-full px-8 text-center will-change-transform',
        !reducedMotion && anim.fadeIn
      )}
    >
      {slide.emoji && (
        <span
          className={cn(
            'text-6xl mb-6',
            !reducedMotion && anim.scaleIn,
            !reducedMotion && delay.d1
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
          !reducedMotion && anim.slideUp,
          !reducedMotion && delay.d2
        )}
      >
        {slide.title}
      </h2>

      {slide.headline && (
        <p
          className={cn(
            'text-5xl sm:text-6xl font-bold mb-4',
            theme.text,
            !reducedMotion && anim.slideUp,
            !reducedMotion && delay.d3
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
            !reducedMotion && anim.slideUp,
            !reducedMotion && delay.d4
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
  const totalShows = slide.chart.data.reduce((sum, d) => sum + d.value, 0)
  const peakMonth = slide.chart.data.reduce((max, d) => d.value > max.value ? d : max, slide.chart.data[0])
  
  // Find months with shows for stats
  const activeMonths = slide.chart.data.filter(d => d.value > 0).length

  // Gradient colors for bars
  const getBarColor = (isHighlight: boolean) => {
    if (isHighlight) {
      return 'url(#barGradientHighlight)'
    }
    return 'url(#barGradient)'
  }

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center h-full px-4 will-change-transform',
        !reducedMotion && anim.fadeIn
      )}
      role="figure"
      aria-label={slide.chart.ariaLabel}
    >
      {/* Header */}
      <h2
        className={cn(
          'text-2xl font-bold mb-1',
          theme.text,
          !reducedMotion && anim.slideUp,
          !reducedMotion && delay.d1
        )}
      >
        {slide.title}
      </h2>
      
      {slide.subtext && (
        <p
          className={cn(
            'text-sm opacity-70 mb-6',
            theme.text,
            !reducedMotion && anim.slideUp,
            !reducedMotion && delay.d2
          )}
        >
          {slide.subtext}
        </p>
      )}

      {/* Stats row */}
      <div
        className={cn(
          'flex gap-6 mb-6',
          !reducedMotion && anim.slideUp,
          !reducedMotion && delay.d2
        )}
      >
        <div className="text-center">
          <div className={cn('text-3xl font-bold', theme.text)}>{totalShows}</div>
          <div className={cn('text-xs opacity-60 uppercase tracking-wide', theme.text)}>Total</div>
        </div>
        <div className="text-center">
          <div className={cn('text-3xl font-bold', theme.accent)}>{peakMonth.label}</div>
          <div className={cn('text-xs opacity-60 uppercase tracking-wide', theme.text)}>Peak</div>
        </div>
        <div className="text-center">
          <div className={cn('text-3xl font-bold', theme.text)}>{activeMonths}</div>
          <div className={cn('text-xs opacity-60 uppercase tracking-wide', theme.text)}>Months</div>
        </div>
      </div>

      {/* Chart */}
      <div
        className={cn(
          'w-full max-w-md h-52 pointer-events-none select-none',
          !reducedMotion && anim.fadeIn,
          !reducedMotion && delay.d3
        )}
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={slide.chart.data}
            margin={{ top: 10, right: 5, left: -25, bottom: 5 }}
          >
            <defs>
              <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(255,255,255,0.4)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0.1)" />
              </linearGradient>
              <linearGradient id="barGradientHighlight" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#a78bfa" />
                <stop offset="100%" stopColor="#7c3aed" />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="label"
              tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 9 }}
              axisLine={false}
              tickLine={false}
              dy={5}
            />
            <YAxis
              tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 9 }}
              axisLine={false}
              tickLine={false}
              domain={[0, maxValue]}
              allowDecimals={false}
              width={25}
            />
            <Bar
              dataKey="value"
              radius={[6, 6, 0, 0]}
              isAnimationActive={!reducedMotion}
              animationDuration={600}
              animationBegin={150}
              animationEasing="ease-out"
            >
              {slide.chart.data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={getBarColor(entry.label === peakMonth.label && entry.value > 0)}
                  fillOpacity={entry.value > 0 ? 1 : 0.2}
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
        'flex flex-col items-center justify-center h-full px-8 will-change-transform',
        !reducedMotion && anim.fadeIn
      )}
    >
      <h2
        className={cn(
          'text-xl font-medium mb-8 opacity-80',
          theme.accent,
          !reducedMotion && anim.slideUp,
          !reducedMotion && delay.d1
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
              !reducedMotion && anim.slideUp
            )}
            style={{
              animationDelay: reducedMotion ? '0ms' : `${100 + index * 75}ms`,
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

// Comparison slide renderer for showing user vs others
function ComparisonSlideView({
  slide,
  theme,
  reducedMotion,
}: {
  slide: ComparisonSlide
  theme: ThemeConfig
  reducedMotion: boolean
}) {
  const maxShows = Math.max(...slide.leaderboard.map(u => u.shows), 1)

  // Find user's position for messaging
  const userIndex = slide.leaderboard.findIndex(u => u.isCurrentUser)
  const userPosition = userIndex + 1

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center h-full px-6 will-change-transform',
        !reducedMotion && anim.fadeIn
      )}
    >
      <h2
        className={cn(
          'text-2xl font-bold mb-2',
          theme.text,
          !reducedMotion && anim.slideUp,
          !reducedMotion && delay.d1
        )}
      >
        {slide.title}
      </h2>

      <p
        className={cn(
          'text-sm mb-8 opacity-70',
          theme.text,
          !reducedMotion && anim.slideUp,
          !reducedMotion && delay.d2
        )}
      >
        {userPosition === 1 ? 'You led the pack this year' : 
         userPosition <= 3 ? `You came in #${userPosition}` : 
         `You placed #${userPosition}`}
      </p>

      <div className="w-full max-w-md space-y-2.5">
        {slide.leaderboard.map((user, index) => {
          const isUser = user.isCurrentUser
          const barWidth = Math.max((user.shows / maxShows) * 100, 20)
          
          return (
            <div
              key={user.name}
              className={cn(
                'relative flex items-center',
                !reducedMotion && anim.slideLeft,
                isUser && 'scale-[1.02]'
              )}
              style={{
                animationDelay: reducedMotion ? '0ms' : `${150 + index * 60}ms`,
              }}
            >
              {/* Rank badge */}
              <div 
                className={cn(
                  'w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold mr-3 flex-shrink-0',
                  isUser 
                    ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white' 
                    : 'bg-white/10 text-white/70'
                )}
              >
                {index + 1}
              </div>

              {/* Bar container */}
              <div className="flex-1 relative">
                <div
                  className={cn(
                    'h-11 rounded-xl flex items-center px-4',
                    isUser
                      ? 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 shadow-lg shadow-purple-500/30'
                      : 'bg-white/15'
                  )}
                  style={{
                    width: `${barWidth}%`,
                  }}
                >
                  {/* Name inside bar */}
                  <span
                    className={cn(
                      'text-sm truncate flex-1',
                      isUser ? 'font-bold text-white' : 'text-white/90'
                    )}
                  >
                    {isUser ? 'You' : formatNameForDisplay(user.name)}
                  </span>
                  
                  {/* Count */}
                  <span
                    className={cn(
                      'text-sm font-bold ml-2 flex-shrink-0',
                      isUser ? 'text-white' : 'text-white/80'
                    )}
                  >
                    {user.shows}
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <p
        className={cn(
          'mt-8 text-xs uppercase tracking-wider opacity-50',
          theme.text,
          !reducedMotion && anim.fadeIn,
          !reducedMotion && delay.d4
        )}
      >
        Total shows attended
      </p>
    </div>
  )
}
