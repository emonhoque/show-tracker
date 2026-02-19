'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ThemeToggle } from '@/components/ThemeToggle'
import { LogOut, Plus, Menu, Trophy, Lock, ChevronDown } from 'lucide-react'
import * as DropdownMenu from '@/components/ui/dropdown-menu'
import { formatNameForDisplay } from '@/lib/validation'
import type { BadgeCategory } from '@/lib/badges'

// ---- Types matching the new grouped API response ----

interface BadgeResponse {
  key: string
  name: string
  description: string
  category: BadgeCategory
  scope: 'lifetime' | 'year'
  criteria: string
  threshold?: number
  unlocked: boolean
  unlocked_at: string | null
  scope_year: number | null
  metadata: Record<string, unknown> | null
  image_url: string | null
}

interface YearGroup {
  year: number
  badges: BadgeResponse[]
}

interface BadgesPayload {
  lifetime: BadgeResponse[]
  years: YearGroup[]
  attendedYears: number[]
  newlyUnlocked: string[]
  summary: {
    totalDefinitions: number
    lifetimeUnlocked: number
    lifetimeTotal: number
    unlockedByYear: Array<{ year: number; unlocked: number; total: number }>
  }
}

// ---- Category display helpers ----

const CATEGORY_META: Record<BadgeCategory, { label: string; icon: string }> = {
  attendance: { label: 'Attendance', icon: '🎟️' },
  streaks: { label: 'Streaks & Timing', icon: '🔥' },
  venues: { label: 'Venues & Cities', icon: '📍' },
  artists: { label: 'Artists', icon: '🎤' },
  social: { label: 'Social', icon: '👥' },
  power_user: { label: 'Power User', icon: '⚡' },
}

const CATEGORY_ORDER: BadgeCategory[] = [
  'attendance',
  'streaks',
  'venues',
  'artists',
  'social',
  'power_user',
]

// ---- Placeholder badge icon by category ----

const PLACEHOLDER_ICONS: Record<BadgeCategory, string> = {
  attendance: '🎫',
  streaks: '🔥',
  venues: '🏟️',
  artists: '🎵',
  social: '🤝',
  power_user: '💎',
}

function formatDate(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

/** Group badges by category, preserving category order */
function groupByCategory(
  badges: BadgeResponse[],
): Array<{ category: BadgeCategory; badges: BadgeResponse[] }> {
  const map = new Map<BadgeCategory, BadgeResponse[]>()
  for (const b of badges) {
    if (!map.has(b.category)) map.set(b.category, [])
    map.get(b.category)!.push(b)
  }
  return CATEGORY_ORDER.filter((c) => map.has(c)).map((c) => ({
    category: c,
    badges: map.get(c)!,
  }))
}

// ---- Page component ----

export default function BadgesPage() {
  const [mounted, setMounted] = useState(false)
  const [authenticated, setAuthenticated] = useState(false)
  const [userName, setUserName] = useState<string | null>(null)
  const [data, setData] = useState<BadgesPayload | null>(null)
  const [loading, setLoading] = useState(false)

  const router = useRouter()

  useEffect(() => {
    setMounted(true)
    const storedName = localStorage.getItem('userName')
    if (storedName) {
      setUserName(storedName)
      setAuthenticated(true)
    }
  }, [])

  const fetchBadges = useCallback(async () => {
    if (!userName) return
    setLoading(true)
    try {
      const res = await fetch(
        `/api/badges?user=${encodeURIComponent(userName)}`,
      )
      if (res.ok) {
        const json: BadgesPayload = await res.json()
        setData(json)
      }
    } catch (err) {
      console.error('Error fetching badges:', err)
    } finally {
      setLoading(false)
    }
  }, [userName])

  useEffect(() => {
    if (authenticated && userName) {
      fetchBadges()
    }
  }, [authenticated, userName, fetchBadges])

  const handleLogout = () => {
    localStorage.removeItem('userName')
    setAuthenticated(false)
    setUserName(null)
    router.push('/')
  }

  // ---- Guards ----

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-foreground mx-auto" />
          <p className="mt-2 text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!authenticated) {
    router.push('/')
    return null
  }

  // Compute totals across all scopes
  const totalUnlocked = data
    ? data.summary.lifetimeUnlocked +
      data.summary.unlockedByYear.reduce((s, y) => s + y.unlocked, 0)
    : 0
  const totalBadges = data
    ? data.summary.lifetimeTotal +
      data.summary.unlockedByYear.reduce((s, y) => s + y.total, 0)
    : 0

  return (
    <div className="min-h-screen bg-background">
      {/* ---- Header ---- */}
      <header className="bg-card shadow-sm border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <Trophy className="w-6 h-6 text-yellow-500" />
                Badges
              </h1>
              {userName && (
                <p className="text-sm text-muted-foreground">
                  {formatNameForDisplay(userName)}
                </p>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <div className="hidden sm:flex gap-2">
              <Button onClick={() => router.push('/')} size="sm">
                <Plus className="w-4 h-4 mr-1" />
                Add Show
              </Button>
              <ThemeToggle />
              <Button onClick={handleLogout} variant="outline" size="sm">
                <LogOut className="w-4 h-4 mr-1" />
                Logout
              </Button>
            </div>
            <div className="sm:hidden flex gap-2">
              <Button onClick={() => router.push('/')} size="sm">
                <Plus className="w-4 h-4 mr-1" />
                Add
              </Button>
              <DropdownMenu.DropdownMenu>
                <DropdownMenu.DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 p-0"
                    aria-label="Open menu"
                  >
                    <Menu className="h-4 w-4" />
                  </Button>
                </DropdownMenu.DropdownMenuTrigger>
                <DropdownMenu.DropdownMenuContent
                  align="end"
                  className="w-48 p-2"
                >
                  <DropdownMenu.DropdownMenuItem
                    onClick={() => router.push('/')}
                  >
                    <Plus className="mr-3 h-4 w-4" />
                    Add Show
                  </DropdownMenu.DropdownMenuItem>
                  <DropdownMenu.DropdownMenuItem
                    onClick={handleLogout}
                    className="text-red-600 focus:text-red-600"
                  >
                    <LogOut className="mr-3 h-4 w-4" />
                    Logout
                  </DropdownMenu.DropdownMenuItem>
                </DropdownMenu.DropdownMenuContent>
              </DropdownMenu.DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {/* ---- Main ---- */}
      <main className="max-w-4xl mx-auto p-4 space-y-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push('/my-shows')}
          className="text-muted-foreground hover:text-foreground"
        >
          &larr; Back to My Shows
        </Button>

        {/* ---- Progress overview ---- */}
        {data && totalBadges > 0 && (
          <Card>
            <CardContent className="py-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-semibold text-foreground">
                    {totalUnlocked} / {totalBadges} unlocked
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Keep going to shows to earn more badges!
                  </p>
                </div>
                <div className="relative h-14 w-14">
                  <svg className="h-14 w-14 -rotate-90" viewBox="0 0 36 36">
                    <circle
                      cx="18"
                      cy="18"
                      r="15.5"
                      fill="none"
                      className="stroke-muted"
                      strokeWidth="3"
                    />
                    <circle
                      cx="18"
                      cy="18"
                      r="15.5"
                      fill="none"
                      className="stroke-primary"
                      strokeWidth="3"
                      strokeDasharray={`${(totalUnlocked / totalBadges) * 97.4} 97.4`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-foreground">
                    {Math.round((totalUnlocked / totalBadges) * 100)}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* ---- Loading skeleton ---- */}
        {loading && !data && (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse space-y-3">
                <div className="h-6 w-40 bg-muted rounded" />
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[...Array(3)].map((_, j) => (
                    <div key={j} className="h-32 bg-muted rounded-lg" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ---- Collapsible sections ---- */}
        {data && (
          <div className="space-y-4">
            {/* 1) Lifetime section — always open */}
            <CollapsibleBadgeSection
              title="Lifetime"
              subtitle={`${data.summary.lifetimeUnlocked} / ${data.summary.lifetimeTotal}`}
              badges={data.lifetime}
              defaultOpen
            />

            {/* 2-N) Year sections — newest open, rest collapsed */}
            {data.years.map((yg, idx) => {
              const yearStats = data.summary.unlockedByYear.find(
                (u) => u.year === yg.year,
              )
              return (
                <CollapsibleBadgeSection
                  key={yg.year}
                  title={String(yg.year)}
                  subtitle={
                    yearStats
                      ? `${yearStats.unlocked} / ${yearStats.total}`
                      : undefined
                  }
                  badges={yg.badges}
                  defaultOpen={idx === 0}
                />
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}

// ---- Collapsible section ----

function CollapsibleBadgeSection({
  title,
  subtitle,
  badges,
  defaultOpen = false,
}: {
  title: string
  subtitle?: string
  badges: BadgeResponse[]
  defaultOpen?: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)
  const grouped = groupByCategory(badges)

  return (
    <div className="border border-border rounded-lg overflow-hidden bg-card">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-muted/40 transition-colors"
      >
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold text-foreground">{title}</h2>
          {subtitle && (
            <span className="text-xs text-muted-foreground">{subtitle}</span>
          )}
        </div>
        <ChevronDown
          className={`w-5 h-5 text-muted-foreground transition-transform ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>

      {open && (
        <div className="px-4 pb-4 space-y-5">
          {grouped.map(({ category, badges: catBadges }) => {
            const meta = CATEGORY_META[category]
            const unlockedInCat = catBadges.filter((b) => b.unlocked).length

            return (
              <div key={category} className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-base">{meta.icon}</span>
                  <h3 className="text-sm font-medium text-foreground">
                    {meta.label}
                  </h3>
                  <span className="text-xs text-muted-foreground ml-auto">
                    {unlockedInCat}/{catBadges.length}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {catBadges.map((badge) => (
                    <BadgeCard
                      key={`${badge.key}-${badge.scope_year ?? 'lt'}`}
                      badge={badge}
                    />
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ---- Badge card ----

function BadgeCard({ badge }: { badge: BadgeResponse }) {
  const placeholder = PLACEHOLDER_ICONS[badge.category]

  return (
    <Card
      className={`transition-all duration-200 ${
        badge.unlocked
          ? 'border-primary/40 bg-primary/5'
          : 'opacity-60 grayscale'
      }`}
    >
      <CardContent className="py-4 px-3 flex flex-col items-center text-center gap-2">
        {/* Badge icon / image */}
        <div className={`text-3xl ${badge.unlocked ? '' : 'opacity-40'}`}>
          {badge.image_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={badge.image_url}
              alt={badge.name}
              className="w-12 h-12 rounded-full object-cover"
            />
          ) : badge.unlocked ? (
            placeholder
          ) : (
            <Lock className="w-8 h-8 text-muted-foreground" />
          )}
        </div>

        {/* Name */}
        <p className="text-sm font-semibold text-foreground leading-tight">
          {badge.name}
        </p>

        {/* Description */}
        <p className="text-xs text-muted-foreground leading-snug">
          {badge.description}
        </p>

        {/* Unlocked date */}
        {badge.unlocked && badge.unlocked_at && (
          <p className="text-[10px] text-primary/70 mt-1">
            Unlocked {formatDate(badge.unlocked_at)}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
