'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ThemeToggle } from '@/components/ThemeToggle'
import { Trophy, Lock, Sparkles, Shield, ArrowLeft, Ticket, Flame, MapPin, Mic, Users, Music, Building2, Handshake } from 'lucide-react'
import { formatNameForDisplay } from '@/lib/validation'
import type { BadgeCategory } from '@/lib/badges'
import type { ReactNode } from 'react'

// ---- Types matching the grouped API response ----

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

interface SecretArtistBadge {
  key: string
  name: string
  description: string
  scope: 'lifetime' | 'year'
  scope_year: number | null
  unlocked: boolean
  unlocked_at: string | null
  image_url: string | null
  artist_name: string | null
}

interface YearGroup {
  year: number
  badges: BadgeResponse[]
}

interface BadgesPayload {
  lifetime: BadgeResponse[]
  years: YearGroup[]
  secretArtists: SecretArtistBadge[]
  attendedYears: number[]
  newlyUnlocked: string[]
  summary: {
    totalDefinitions: number
    totalSecretArtists: number
    lifetimeUnlocked: number
    lifetimeTotal: number
    unlockedByYear: Array<{ year: number; unlocked: number; total: number }>
  }
}

// ---- Category display helpers ----

const CATEGORY_META: Record<BadgeCategory, { label: string; icon: ReactNode }> = {
  attendance: { label: 'Attendance', icon: <Ticket className="w-4 h-4 text-blue-500" /> },
  streaks: { label: 'Streaks & Timing', icon: <Flame className="w-4 h-4 text-orange-500" /> },
  venues: { label: 'Venues & Cities', icon: <MapPin className="w-4 h-4 text-green-500" /> },
  artists: { label: 'Artists', icon: <Mic className="w-4 h-4 text-purple-500" /> },
  social: { label: 'Social', icon: <Users className="w-4 h-4 text-pink-500" /> },
}

const CATEGORY_ORDER: BadgeCategory[] = [
  'attendance',
  'streaks',
  'venues',
  'artists',
  'social',
]

// ---- Placeholder badge icon by category ----

const PLACEHOLDER_ICONS: Record<BadgeCategory, ReactNode> = {
  attendance: <Ticket className="w-6 h-6 text-blue-500/70" />,
  streaks: <Flame className="w-6 h-6 text-orange-500/70" />,
  venues: <Building2 className="w-6 h-6 text-green-500/70" />,
  artists: <Music className="w-6 h-6 text-purple-500/70" />,
  social: <Handshake className="w-6 h-6 text-pink-500/70" />,
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

// ---- Tab definitions ----

type TabId = 'overview' | 'lifetime' | 'secret' | number

interface TabDef {
  id: TabId
  label: string
  icon?: ReactNode
}

// ---- Page component ----

export default function BadgesPage() {
  const [mounted, setMounted] = useState(false)
  const [authenticated, setAuthenticated] = useState(false)
  const [userName, setUserName] = useState<string | null>(null)
  const [data, setData] = useState<BadgesPayload | null>(null)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<TabId>('overview')
  const tabBarRef = useRef<HTMLDivElement>(null)

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

  // ---- Derived data ----
  const lifetimeSecrets = data
    ? data.secretArtists.filter((s) => s.scope === 'lifetime')
    : []
  const secretUnlocked = lifetimeSecrets.filter((s) => s.unlocked).length
  const yearlySecretUnlocked = data
    ? data.secretArtists.filter((s) => s.scope === 'year' && s.unlocked).length
    : 0
  const totalUnlocked = data
    ? data.summary.lifetimeUnlocked +
      data.summary.unlockedByYear.reduce((s, y) => s + y.unlocked, 0) +
      secretUnlocked +
      yearlySecretUnlocked
    : 0
  const totalBadges = data
    ? data.summary.lifetimeTotal +
      data.summary.unlockedByYear.reduce((s, y) => s + y.total, 0) +
      data.summary.totalSecretArtists
    : 0

  // Build tab list
  const tabs: TabDef[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'lifetime', label: 'Lifetime' },
    ...(data?.years.map((yg) => ({ id: yg.year as TabId, label: String(yg.year) })) ?? []),
    ...(data && data.secretArtists.length > 0
      ? [{ id: 'secret' as TabId, label: 'Secret', icon: <Lock className="w-3.5 h-3.5" /> }]
      : []),
  ]

  // Collect all badges + secrets for the overview
  const allBadges: BadgeResponse[] = data
    ? [...data.lifetime, ...data.years.flatMap((y) => y.badges)]
    : []

  // Recently unlocked: prioritize newly unlocked this session, then by date descending
  const newlySet = new Set(data?.newlyUnlocked ?? [])
  const recentlyUnlocked = allBadges
    .filter((b) => b.unlocked && b.unlocked_at)
    .sort((a, b) => {
      const aNew = newlySet.has(a.key) ? 1 : 0
      const bNew = newlySet.has(b.key) ? 1 : 0
      if (bNew !== aNew) return bNew - aNew
      return new Date(b.unlocked_at!).getTime() - new Date(a.unlocked_at!).getTime()
    })
    .slice(0, 5)

  // Also include recently unlocked secret badges
  const recentSecrets = (data?.secretArtists ?? [])
    .filter((s) => s.unlocked && s.unlocked_at)
    .sort(
      (a, b) =>
        new Date(b.unlocked_at!).getTime() -
        new Date(a.unlocked_at!).getTime(),
    )
    .slice(0, 3)

  // Category progress across ALL scopes (lifetime + all years)
  const categoryProgress = CATEGORY_ORDER.map((cat) => {
    const catBadges = allBadges.filter((b) => b.category === cat)
    return {
      category: cat,
      unlocked: catBadges.filter((b) => b.unlocked).length,
      total: catBadges.length,
    }
  }).filter((c) => c.total > 0)

  return (
    <div className="min-h-screen bg-background">
      {/* ---- Header ---- */}
      <header className="bg-card shadow-sm border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/my-shows')}
              className="p-1"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                My Badges
              </h1>
              {userName && (
                <p className="text-sm text-muted-foreground">
                  Welcome, {formatNameForDisplay(userName)}
                </p>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            {userName?.toLowerCase() === 'emon hoque' && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push('/my-shows/badges/admin')}
              >
                <Shield className="w-4 h-4" />
              </Button>
            )}
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* ---- Main ---- */}
      <main className="max-w-4xl mx-auto p-4 space-y-4">

        {/* ---- Loading skeleton ---- */}
        {loading && !data && (
          <div className="space-y-4">
            <div className="h-10 bg-muted rounded animate-pulse" />
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

        {data && (
          <>
            {/* ---- Tab bar ---- */}
            <div
              ref={tabBarRef}
              className="flex gap-1 overflow-x-auto pb-1 scrollbar-hide -mx-4 px-4"
              style={{ WebkitOverflowScrolling: 'touch' }}
            >
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id
                return (
                  <button
                    key={String(tab.id)}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }`}
                  >
                    {tab.icon && <span className="mr-1 inline-flex">{tab.icon}</span>}
                    {tab.label}
                  </button>
                )
              })}
            </div>

            {/* ---- Tab content ---- */}
            <div className="space-y-6">
              {/* ===== OVERVIEW TAB ===== */}
              {activeTab === 'overview' && (
                <>
                  {/* Overall progress */}
                  {totalBadges > 0 && (
                    <Card>
                      <CardContent className="py-5 space-y-3">
                        <div className="flex items-center justify-between">
                          <p className="text-lg font-semibold text-foreground">
                            {totalUnlocked} / {totalBadges} unlocked
                          </p>
                          <span className="text-sm font-bold text-primary">
                            {Math.round((totalUnlocked / totalBadges) * 100)}%
                          </span>
                        </div>
                        <div className="h-3 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full transition-all duration-500"
                            style={{
                              width: `${(totalUnlocked / totalBadges) * 100}%`,
                            }}
                          />
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Keep going to shows to earn more badges!
                        </p>
                      </CardContent>
                    </Card>
                  )}

                  {/* Recently unlocked */}
                  {(recentlyUnlocked.length > 0 ||
                    recentSecrets.length > 0) && (
                    <div className="space-y-3">
                      <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-yellow-500" />
                        Recently Unlocked
                      </h2>
                      <div className="flex gap-3 overflow-x-auto pb-1 -mx-4 px-4" style={{ WebkitOverflowScrolling: 'touch' }}>
                        {recentlyUnlocked.map((badge) => (
                          <div
                            key={`${badge.key}-${badge.scope_year ?? 'lt'}`}
                            className="shrink-0 w-24 flex flex-col items-center text-center gap-1"
                          >
                            <div className="w-14 h-14 rounded-full bg-primary/10 border-2 border-primary/40 flex items-center justify-center text-2xl">
                              {badge.image_url ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                  src={badge.image_url}
                                  alt={badge.name}
                                  className="w-14 h-14 rounded-full object-cover"
                                />
                              ) : (
                                PLACEHOLDER_ICONS[badge.category]
                              )}
                            </div>
                            <p className="text-[11px] font-medium text-foreground leading-tight">
                              {badge.name}
                            </p>
                            {badge.scope === 'year' && badge.scope_year && (
                              <span className="text-[10px] text-muted-foreground">
                                {badge.scope_year}
                              </span>
                            )}
                          </div>
                        ))}
                        {recentSecrets.map((badge) => (
                          <div
                            key={badge.key}
                            className="shrink-0 w-24 flex flex-col items-center text-center gap-1"
                          >
                            <div className="w-14 h-14 rounded-full bg-primary/10 border-2 border-primary/40 flex items-center justify-center overflow-hidden">
                              {badge.image_url ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                  src={`/api/image-proxy?url=${encodeURIComponent(badge.image_url)}`}
                                  alt={badge.name}
                                  className="w-14 h-14 rounded-full object-cover"
                                />
                              ) : (
                                <Mic className="w-7 h-7 text-primary/70" />
                              )}
                            </div>
                            <p className="text-[11px] font-medium text-foreground leading-tight">
                              {badge.name}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Category breakdown */}
                  {categoryProgress.length > 0 && (
                    <div className="space-y-3">
                      <h2 className="text-sm font-semibold text-foreground">
                        Category Breakdown
                      </h2>
                      <Card>
                        <CardContent className="py-4 space-y-3">
                          {categoryProgress.map(({ category, unlocked, total }) => {
                            const meta = CATEGORY_META[category]
                            const pct = total > 0 ? (unlocked / total) * 100 : 0
                            return (
                              <div key={category} className="space-y-1">
                                <div className="flex items-center justify-between text-sm">
                                  <span className="flex items-center gap-2">
                                    <span>{meta.icon}</span>
                                    <span className="font-medium text-foreground">
                                      {meta.label}
                                    </span>
                                  </span>
                                  <span className="text-xs text-muted-foreground">
                                    {unlocked}/{total}
                                  </span>
                                </div>
                                <div className="h-2 bg-muted rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-primary/70 rounded-full transition-all duration-500"
                                    style={{ width: `${pct}%` }}
                                  />
                                </div>
                              </div>
                            )
                          })}
                        </CardContent>
                      </Card>
                    </div>
                  )}

                  {/* Scope breakdown (Lifetime + years) */}
                  <div className="space-y-3">
                    <h2 className="text-sm font-semibold text-foreground">
                      By Scope
                    </h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {/* Lifetime chip */}
                      <button
                        type="button"
                        onClick={() => setActiveTab('lifetime')}
                        className="bg-card border border-border rounded-lg p-3 text-left hover:border-primary/40 transition-colors"
                      >
                        <p className="text-xs text-muted-foreground">
                          Lifetime
                        </p>
                        <p className="text-lg font-bold text-foreground">
                          {data.summary.lifetimeUnlocked}
                          <span className="text-sm font-normal text-muted-foreground">
                            /{data.summary.lifetimeTotal}
                          </span>
                        </p>
                        <div className="mt-1 h-1.5 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full"
                            style={{
                              width: `${(data.summary.lifetimeUnlocked / data.summary.lifetimeTotal) * 100}%`,
                            }}
                          />
                        </div>
                      </button>

                      {/* Year chips */}
                      {data.summary.unlockedByYear.map(
                        ({ year, unlocked, total }) => (
                          <button
                            key={year}
                            type="button"
                            onClick={() => setActiveTab(year)}
                            className="bg-card border border-border rounded-lg p-3 text-left hover:border-primary/40 transition-colors"
                          >
                            <p className="text-xs text-muted-foreground">
                              {year}
                            </p>
                            <p className="text-lg font-bold text-foreground">
                              {unlocked}
                              <span className="text-sm font-normal text-muted-foreground">
                                /{total}
                              </span>
                            </p>
                            <div className="mt-1 h-1.5 bg-muted rounded-full overflow-hidden">
                              <div
                                className="h-full bg-primary rounded-full"
                                style={{
                                  width: `${total > 0 ? (unlocked / total) * 100 : 0}%`,
                                }}
                              />
                            </div>
                          </button>
                        ),
                      )}

                      {/* Secret chip */}
                      {data.secretArtists.length > 0 && (
                        <button
                          type="button"
                          onClick={() => setActiveTab('secret')}
                          className="bg-card border border-border rounded-lg p-3 text-left hover:border-primary/40 transition-colors"
                        >
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <Lock className="w-3 h-3" /> Secret
                          </p>
                          <p className="text-lg font-bold text-foreground">
                            {secretUnlocked + yearlySecretUnlocked}
                            <span className="text-sm font-normal text-muted-foreground">
                              /?
                            </span>
                          </p>
                        </button>
                      )}
                    </div>
                  </div>
                </>
              )}

              {/* ===== LIFETIME TAB ===== */}
              {activeTab === 'lifetime' && (
                <BadgeGrid
                  badges={data.lifetime}
                  sectionLabel="Lifetime"
                  unlocked={data.summary.lifetimeUnlocked}
                  total={data.summary.lifetimeTotal}
                />
              )}

              {/* ===== YEAR TABS ===== */}
              {typeof activeTab === 'number' && (() => {
                const yg = data.years.find((y) => y.year === activeTab)
                if (!yg) return null
                const yearStats = data.summary.unlockedByYear.find(
                  (u) => u.year === activeTab,
                )
                const yearSecrets = data.secretArtists.filter(
                  (s) => s.scope === 'year' && s.scope_year === activeTab,
                )
                return (
                  <BadgeGrid
                    badges={yg.badges}
                    sectionLabel={String(activeTab)}
                    unlocked={yearStats?.unlocked ?? 0}
                    total={yearStats?.total ?? yg.badges.length}
                    secretBadges={yearSecrets}
                  />
                )
              })()}

              {/* ===== SECRET TAB ===== */}
              {activeTab === 'secret' && (
                <SecretBadgesTab
                  badges={data.secretArtists}
                />
              )}
            </div>
          </>
        )}
      </main>
    </div>
  )
}

// ---- Badge grid (used for Lifetime and Year tabs) ----

function BadgeGrid({
  badges,
  sectionLabel,
  unlocked,
  total,
  secretBadges,
}: {
  badges: BadgeResponse[]
  sectionLabel: string
  unlocked: number
  total: number
  secretBadges?: SecretArtistBadge[]
}) {
  const grouped = groupByCategory(badges)
  const pct = total > 0 ? (unlocked / total) * 100 : 0
  const hasSecrets = secretBadges && secretBadges.length > 0

  return (
    <div className="space-y-6">
      {/* Section header with progress */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">
            {sectionLabel}
          </h2>
          <span className="text-sm text-muted-foreground">
            {unlocked}/{total}
          </span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* Category groups */}
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

      {/* Year-scoped secret badges inside year tab */}
      {hasSecrets && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4" />
            <h3 className="text-sm font-medium text-foreground">Secret</h3>
            <span className="text-xs text-muted-foreground ml-auto">
              {secretBadges.filter((s) => s.unlocked).length}/?
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {secretBadges
              .filter((s) => s.unlocked)
              .map((badge) => (
                <SecretArtistCard
                  key={`${badge.key}-${badge.scope_year}`}
                  badge={badge}
                />
              ))}
            {secretBadges.some((s) => !s.unlocked) && (
              <Card className="opacity-60 grayscale">
                <CardContent className="py-4 px-3 flex flex-col items-center text-center gap-2">
                  <div className="text-3xl opacity-40">
                    <Lock className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <p className="text-sm font-semibold text-foreground leading-tight">
                    ???
                  </p>
                  <p className="text-xs text-muted-foreground leading-snug">
                    See the right artist to unlock
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
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

        <p className="text-sm font-semibold text-foreground leading-tight">
          {badge.name}
        </p>

        <p className="text-xs text-muted-foreground leading-snug">
          {badge.description}
        </p>

        {badge.unlocked && badge.unlocked_at && (
          <p className="text-[10px] text-primary/70 mt-1">
            Unlocked {formatDate(badge.unlocked_at)}
          </p>
        )}
      </CardContent>
    </Card>
  )
}

// ---- Secret badges tab ----

function SecretBadgesTab({ badges }: { badges: SecretArtistBadge[] }) {
  const lifetimeSecrets = badges.filter((s) => s.scope === 'lifetime')
  const yearlySecrets = badges.filter((s) => s.scope === 'year')

  // Group yearly by year
  const yearGroups = new Map<number, SecretArtistBadge[]>()
  for (const s of yearlySecrets) {
    if (s.scope_year) {
      if (!yearGroups.has(s.scope_year)) yearGroups.set(s.scope_year, [])
      yearGroups.get(s.scope_year)!.push(s)
    }
  }
  const sortedYears = [...yearGroups.keys()].sort((a, b) => b - a)

  const allUnlocked = badges.filter((b) => b.unlocked).length
  const hasLocked = badges.some((b) => !b.unlocked)

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Lock className="w-5 h-5" /> Secret Badges
        </h2>
        <p className="text-sm text-muted-foreground">
          {allUnlocked} unlocked — see the right artists to discover more
        </p>
      </div>

      {/* Lifetime secrets */}
      {lifetimeSecrets.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground">
            Lifetime
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {lifetimeSecrets
              .filter((s) => s.unlocked)
              .map((badge) => (
                <SecretArtistCard key={badge.key} badge={badge} />
              ))}
            {lifetimeSecrets.some((s) => !s.unlocked) && (
              <LockedPlaceholderCard />
            )}
          </div>
        </div>
      )}

      {/* Year-scoped secrets */}
      {sortedYears.map((year) => {
        const yearBadges = yearGroups.get(year)!
        return (
          <div key={year} className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">
              {year}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {yearBadges
                .filter((s) => s.unlocked)
                .map((badge) => (
                  <SecretArtistCard
                    key={`${badge.key}-${badge.scope_year}`}
                    badge={badge}
                  />
                ))}
              {yearBadges.some((s) => !s.unlocked) && (
                <LockedPlaceholderCard />
              )}
            </div>
          </div>
        )
      })}

      {/* If no secrets at all yet but there are locked ones */}
      {allUnlocked === 0 && hasLocked && (
        <div className="text-center py-8 text-muted-foreground">
          <Lock className="w-10 h-10 mx-auto mb-3 opacity-40" />
          <p className="text-sm">
            No secret badges unlocked yet. Keep exploring!
          </p>
        </div>
      )}
    </div>
  )
}

// ---- Locked placeholder card ----

function LockedPlaceholderCard() {
  return (
    <Card className="opacity-60 grayscale">
      <CardContent className="py-4 px-3 flex flex-col items-center text-center gap-2">
        <div className="text-3xl opacity-40">
          <Lock className="w-8 h-8 text-muted-foreground" />
        </div>
        <p className="text-sm font-semibold text-foreground leading-tight">
          ???
        </p>
        <p className="text-xs text-muted-foreground leading-snug">
          See the right artist to unlock
        </p>
      </CardContent>
    </Card>
  )
}

// ---- Secret artist card ----

function SecretArtistCard({ badge }: { badge: SecretArtistBadge }) {
  const proxiedUrl = badge.image_url
    ? `/api/image-proxy?url=${encodeURIComponent(badge.image_url)}`
    : null

  return (
    <Card className="border-primary/40 bg-primary/5 transition-all duration-200">
      <CardContent className="py-4 px-3 flex flex-col items-center text-center gap-2">
        <div className="w-12 h-12 rounded-full overflow-hidden bg-muted flex items-center justify-center">
          {proxiedUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={proxiedUrl}
              alt={badge.name}
              className="w-12 h-12 rounded-full object-cover"
            />
          ) : (
            <Mic className="w-6 h-6 text-primary/70" />
          )}
        </div>
        <p className="text-sm font-semibold text-foreground leading-tight">
          {badge.name}
        </p>
        <p className="text-xs text-muted-foreground leading-snug">
          {badge.description}
        </p>
        {badge.unlocked_at && (
          <p className="text-[10px] text-primary/70 mt-1">
            Unlocked {formatDate(badge.unlocked_at)}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
