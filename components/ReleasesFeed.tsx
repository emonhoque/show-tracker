'use client'

import { useState, useEffect, useCallback } from 'react'
import { Music, ChevronDown, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Release } from '@/lib/types'
import { ReleaseCard } from '@/components/ReleaseCard'
import { ReleaseCardSkeleton } from '@/components/ReleaseCardSkeleton'
import { ReleaseFilters } from '@/components/ReleaseFilters'
import { ReleaseEmptyState } from '@/components/ReleaseEmptyState'
import { ReleaseErrorState } from '@/components/ReleaseErrorState'
import { SpotifyDisclaimer } from '@/components/SpotifyDisclaimer'

interface ReleaseWithArtist extends Release {
  artists: Array<{ id: string; name: string }> | null
}

interface ReleasesFeedProps {
  limit?: number
  days?: number
  weeks?: number
  userName?: string | null
}

export function ReleasesFeed({ limit = 50, days = 30, weeks = 0, userName }: ReleasesFeedProps) {
  const [releases, setReleases] = useState<ReleaseWithArtist[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [spotifyError, setSpotifyError] = useState<string | null>(null)
  const [expandedWeeks, setExpandedWeeks] = useState<Set<string>>(new Set())

  const fetchReleases = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setIsRefreshing(true)
    } else {
      setIsLoading(true)
    }
    setError(null)
    setSpotifyError(null)

    try {
      const url = weeks > 0 
        ? `/api/releases?limit=${limit}&weeks=${weeks}`
        : `/api/releases?limit=${limit}&days=${days}`
      
      const response = await fetch(url)
      if (response.ok) {
        const data = await response.json()
        setReleases(data)
      } else {
        const errorData = await response.json()
        if (response.status === 503) {
          setSpotifyError(errorData.message || 'Spotify API not configured')
        } else {
          setError('Failed to fetch releases')
        }
      }
    } catch (err) {
      setError('Error loading releases')
      console.error('Error fetching releases:', err)
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }, [limit, days, weeks])

  useEffect(() => {
    fetchReleases()
  }, [limit, days, weeks, fetchReleases])

  const handleRefresh = async () => {
    setIsRefreshing(true)
    setError(null)
    setSpotifyError(null)

    try {
      // First, fetch releases for all artists from Spotify
      const response = await fetch('/api/releases', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({})
      })
      
      if (response.ok) {
        await response.json()
      } else {
        const errorData = await response.json()
        if (response.status === 503) {
          setSpotifyError(errorData.message || 'Spotify API not configured')
        } else {
          console.error('Failed to fetch releases from Spotify')
        }
      }
    } catch (error) {
      console.error('Error fetching releases from Spotify:', error)
    }

    // Then refresh the releases list from database
    fetchReleases(true)
  }

  const handleArtistAdded = async () => {
    // When an artist is added, fetch new releases from Spotify first, then refresh local data
    setIsRefreshing(true)
    setError(null)
    setSpotifyError(null)

    try {
      // First, fetch releases for all artists from Spotify (including the newly added one)
      const response = await fetch('/api/releases', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({})
      })
      
      if (response.ok) {
        await response.json()
        console.log('Successfully fetched new releases from Spotify')
      } else {
        const errorData = await response.json()
        if (response.status === 503) {
          setSpotifyError(errorData.message || 'Spotify API not configured')
        } else {
          console.error('Failed to fetch releases from Spotify')
        }
      }
    } catch (error) {
      console.error('Error fetching releases from Spotify:', error)
    }

    // Then refresh the releases list from database
    await fetchReleases(true)
    setIsRefreshing(false)
  }

  const handleArtistRemoved = async () => {
    // When an artist is removed, refresh local data
    // Note: We don't need to fetch from Spotify since we're just removing data
    await fetchReleases(true)
  }

  const groupReleasesByWeek = (releases: ReleaseWithArtist[]) => {
    const groups: { [key: string]: ReleaseWithArtist[] } = {}
    
    releases.forEach(release => {
      const releaseDate = new Date(release.release_date)
      const weekStart = new Date(releaseDate)
      weekStart.setDate(releaseDate.getDate() - releaseDate.getDay()) // Start of week (Sunday)
      
      const weekKey = weekStart.toISOString().split('T')[0]
      
      if (!groups[weekKey]) {
        groups[weekKey] = []
      }
      groups[weekKey].push(release)
    })
    
    // Sort weeks by date (newest first)
    return Object.entries(groups)
      .sort(([a], [b]) => b.localeCompare(a))
      .map(([weekKey, weekReleases]) => ({
        weekStart: weekKey,
        weekEnd: new Date(new Date(weekKey).getTime() + 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        releases: weekReleases.sort((a, b) => new Date(b.release_date).getTime() - new Date(a.release_date).getTime())
      }))
  }

  const formatWeekLabel = (weekStart: string, weekEnd: string) => {
    const start = new Date(weekStart)
    const end = new Date(weekEnd)
    const now = new Date()
    
    // Check if it's this week
    const thisWeekStart = new Date(now)
    thisWeekStart.setDate(now.getDate() - now.getDay())
    
    if (weekStart === thisWeekStart.toISOString().split('T')[0]) {
      return 'This Week'
    }
    
    // Check if it's last week
    const lastWeekStart = new Date(thisWeekStart)
    lastWeekStart.setDate(thisWeekStart.getDate() - 7)
    
    if (weekStart === lastWeekStart.toISOString().split('T')[0]) {
      return 'Last Week'
    }
    
    // Format as date range
    return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
  }

  const toggleWeek = (weekStart: string) => {
    setExpandedWeeks(prev => {
      const newSet = new Set(prev)
      if (newSet.has(weekStart)) {
        newSet.delete(weekStart)
      } else {
        newSet.add(weekStart)
      }
      return newSet
    })
  }

  const isWeekExpanded = (weekStart: string) => {
    return expandedWeeks.has(weekStart)
  }

  // Set the newest week as expanded by default when releases change
  useEffect(() => {
    if (weeks > 0 && releases.length > 0) {
      const weekGroups = groupReleasesByWeek(releases)
      if (weekGroups.length > 0) {
        // Only expand the first (newest) week
        setExpandedWeeks(new Set([weekGroups[0].weekStart]))
      }
    }
  }, [releases, weeks])

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Music className="h-6 w-6" />
            Recent Releases
          </h2>
        </div>
        <div className="grid gap-4">
          {[...Array(3)].map((_, i) => (
            <ReleaseCardSkeleton key={i} />
          ))}
        </div>
      </div>
    )
  }

  if (spotifyError) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Music className="h-6 w-6" />
            Release Radar
            <span className="text-sm font-normal text-gray-600">
              {weeks > 0 ? `(Last ${weeks} week${weeks !== 1 ? 's' : ''})` : `(Last ${days} days)`}
            </span>
          </h2>
        </div>
        <SpotifyDisclaimer feature="Release Radar" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Music className="h-6 w-6" />
            Recent Releases
          </h2>
        </div>
        <ReleaseErrorState error={error} onRetry={handleRefresh} />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Music className="h-6 w-6" />
          Release Radar
          <span className="text-sm font-normal text-gray-600">
            {weeks > 0 ? `(Last ${weeks} week${weeks !== 1 ? 's' : ''})` : `(Last ${days} days)`}
          </span>
        </h2>
        <ReleaseFilters 
          onRefresh={handleRefresh}
          isRefreshing={isRefreshing}
          onArtistAdded={handleArtistAdded}
          onArtistRemoved={handleArtistRemoved}
          userName={userName}
        />
      </div>

      {releases.length === 0 ? (
        <ReleaseEmptyState days={weeks > 0 ? weeks * 7 : days} />
      ) : (
        <div className="space-y-6">
          {weeks > 0 ? (
            // Group by weeks with collapsible functionality
            groupReleasesByWeek(releases).map((weekGroup) => {
              const isExpanded = isWeekExpanded(weekGroup.weekStart)
              return (
                <div key={weekGroup.weekStart} className="space-y-3">
                  <div className="w-full">
                    <Button
                      variant="ghost"
                      onClick={() => toggleWeek(weekGroup.weekStart)}
                      className="w-full justify-between p-0 h-auto hover:bg-transparent"
                    >
                      <div className="flex items-center gap-2">
                        {isExpanded ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                        <span className="text-lg font-semibold text-foreground">
                          {formatWeekLabel(weekGroup.weekStart, weekGroup.weekEnd)}
                        </span>
                      </div>
                      <span className="text-sm font-normal text-muted-foreground">
                        ({weekGroup.releases.length} release{weekGroup.releases.length !== 1 ? 's' : ''})
                      </span>
                    </Button>
                    <div className="w-full border-b border-border mt-2"></div>
                  </div>
                  {isExpanded && (
                    <div className="grid gap-4">
                      {weekGroup.releases.map((release) => (
                        <ReleaseCard key={release.id} release={release} />
                      ))}
                    </div>
                  )}
                </div>
              )
            })
          ) : (
            // Show all releases without grouping
            <div className="grid gap-4">
              {releases.map((release) => (
                <ReleaseCard key={release.id} release={release} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
