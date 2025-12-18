/**
 * Story Player Types
 * Reusable type definitions for the Instagram-style story player
 */

// Theme options for story slides
export type StoryTheme = 'midnight' | 'neon' | 'sunset' | 'forest' | 'mono'

// Base slide properties shared by all slide types
interface BaseSlide {
  id: string
  theme: StoryTheme
  durationMs?: number
}

// Text-based slide (intro, stat, rank, outro)
export interface TextSlide extends BaseSlide {
  kind: 'intro' | 'stat' | 'rank' | 'outro'
  title: string
  headline?: string
  subtext?: string
  emoji?: string
}

// Chart slide with bar chart data
export interface ChartSlide extends BaseSlide {
  kind: 'chart'
  title: string
  chart: {
    type: 'bar'
    data: Array<{ label: string; value: number }>
    ariaLabel: string
  }
}

// List slide for top artists, venues, etc.
export interface ListSlide extends BaseSlide {
  kind: 'list'
  title: string
  items: Array<{
    label: string
    value: string | number
    badge?: string
    imageUrl?: string
  }>
}

// Union type for all slide types
export type StorySlide = TextSlide | ChartSlide | ListSlide

// RecapData type matching the API response structure
export type RecapData = {
  year: number
  totalShows: number
  avgPerMonth: number
  busiestMonth: string
  topVenue: string
  rank?: { position: number; total: number }
  monthCounts?: Record<string, number>
  topArtists?: Array<{ name: string; shows: number; isHeadliner?: boolean; imageUrl?: string }>
  topVenues?: Array<{ name: string; shows: number }>
}

// Props for the main RecapStoryPlayer component
export type RecapStoryPlayerProps = {
  recap: RecapData
  onClose?: () => void
  initialSlideIndex?: number
}

// Theme configuration for styling
export interface ThemeConfig {
  background: string
  text: string
  accent: string
  progressBg: string
  progressFill: string
}

// Theme map for CSS classes
export const THEME_CONFIGS: Record<StoryTheme, ThemeConfig> = {
  midnight: {
    background: 'bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900',
    text: 'text-white',
    accent: 'text-indigo-400',
    progressBg: 'bg-white/20',
    progressFill: 'bg-white',
  },
  neon: {
    background: 'bg-gradient-to-br from-purple-900 via-pink-900 to-purple-900',
    text: 'text-white',
    accent: 'text-pink-400',
    progressBg: 'bg-white/20',
    progressFill: 'bg-pink-400',
  },
  sunset: {
    background: 'bg-gradient-to-br from-orange-600 via-red-600 to-pink-700',
    text: 'text-white',
    accent: 'text-yellow-300',
    progressBg: 'bg-white/20',
    progressFill: 'bg-yellow-300',
  },
  forest: {
    background: 'bg-gradient-to-br from-emerald-900 via-teal-900 to-emerald-950',
    text: 'text-white',
    accent: 'text-emerald-400',
    progressBg: 'bg-white/20',
    progressFill: 'bg-emerald-400',
  },
  mono: {
    background: 'bg-gradient-to-br from-zinc-900 via-neutral-900 to-zinc-950',
    text: 'text-white',
    accent: 'text-zinc-300',
    progressBg: 'bg-white/20',
    progressFill: 'bg-white',
  },
}

// Default slide duration in milliseconds
export const DEFAULT_SLIDE_DURATION = 6000
