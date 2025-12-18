'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectOption, SelectTrigger } from '@/components/ui/select'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { ThemeToggle } from '@/components/ThemeToggle'
import { LogOut, Copy, Plus, Menu, Play } from 'lucide-react'
import * as DropdownMenu from '@/components/ui/dropdown-menu'
import { formatNameForDisplay } from '@/lib/validation'
import { RecapChart } from '@/components/RecapChart'
import { RecapData } from '@/app/api/recap/route'
import { RecapStoryPlayer, type RecapData as StoryRecapData } from '@/components/recap/stories'

export default function RecapPage() {
  const [mounted, setMounted] = useState(false)
  const [authenticated, setAuthenticated] = useState(false)
  const [userName, setUserName] = useState<string | null>(null)
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [recapData, setRecapData] = useState<RecapData | null>(null)
  const [loading, setLoading] = useState(false)
  const [copySuccess, setCopySuccess] = useState(false)
  const [showStoryPlayer, setShowStoryPlayer] = useState(false)

  const router = useRouter()

  const fetchRecapData = useCallback(async () => {
    setLoading(true)
    try {
      const userParam = userName ? `&user=${encodeURIComponent(userName)}` : ''
      const response = await fetch(`/api/recap?year=${selectedYear}${userParam}`)
      if (response.ok) {
        const data = await response.json()
        setRecapData(data)
      } else {
        console.error('Failed to fetch recap data')
      }
    } catch (error) {
      console.error('Error fetching recap data:', error)
    } finally {
      setLoading(false)
    }
  }, [selectedYear, userName])

  // Check if component is mounted on client side
  useEffect(() => {
    setMounted(true)
    const storedName = localStorage.getItem('userName')
    if (storedName) {
      setUserName(storedName)
      setAuthenticated(true)
    }
  }, [])

  // Fetch recap data when year changes
  useEffect(() => {
    if (authenticated) {
      fetchRecapData()
    }
  }, [selectedYear, authenticated, fetchRecapData])

  const handleLogout = () => {
    localStorage.removeItem('userName')
    setAuthenticated(false)
    setUserName(null)
    router.push('/')
  }

  const handleCopySummary = async () => {
    if (!recapData || !userName) return
    
    const userIndex = recapData.leaderboard.findIndex(user => user.name === userName)
    const position = userIndex + 1
    const totalUsers = recapData.leaderboard.length
    
    const getOrdinal = (num: number) => {
      const j = num % 10
      const k = num % 100
      if (j === 1 && k !== 11) return num + "st"
      if (j === 2 && k !== 12) return num + "nd"
      if (j === 3 && k !== 13) return num + "rd"
      return num + "th"
    }
    
    const avgPerMonth = (recapData.personalSummary.totalShows / 12).toFixed(1)
    
    let summaryText = `My ${selectedYear} concert recap:\n\n`
    summaryText += `🎵 I went to ${recapData.personalSummary.totalShows} shows (avg ${avgPerMonth}/month)\n`
    
    if (recapData.personalSummary.busiestMonthName) {
      summaryText += `📅 Busiest month: ${recapData.personalSummary.busiestMonthName}\n`
    }
    
    if (recapData.personalSummary.topVenue) {
      summaryText += `🏟️ Top venue: ${recapData.personalSummary.topVenue}\n`
    }
    
    summaryText += `🏆 Ranked ${getOrdinal(position)} out of ${totalUsers} attendees`
    
    try {
      await navigator.clipboard.writeText(summaryText)
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    } catch (error) {
      console.error('Failed to copy text:', error)
    }
  }

  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear()
    const years = []
    for (let year = 2023; year <= currentYear; year++) {
      years.push(year)
    }
    return years
  }

  // Transform API RecapData to Story RecapData format
  const storyRecapData: StoryRecapData | null = useMemo(() => {
    if (!recapData || !userName) return null

    const userIndex = recapData.leaderboard.findIndex(user => user.name === userName)
    const position = userIndex + 1
    const totalUsers = recapData.leaderboard.length

    // Build monthCounts from monthlyData if available
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const userMonthlyData = recapData.monthlyData.find(d => d.name === userName)
    const monthCounts: Record<string, number> = {}
    if (userMonthlyData) {
      monthNames.forEach((month, index) => {
        monthCounts[month] = userMonthlyData.monthlyCounts[index] || 0
      })
    }

    // Transform top artists if available
    const topArtists = recapData.stats?.personalTopArtists?.map(artist => ({
      name: artist.artist,
      shows: artist.count,
      isHeadliner: false,
      imageUrl: artist.image_url,
    }))

    return {
      year: selectedYear,
      totalShows: recapData.personalSummary.totalShows,
      avgPerMonth: recapData.personalSummary.totalShows / 12,
      busiestMonth: recapData.personalSummary.busiestMonthName || '',
      topVenue: recapData.personalSummary.topVenue || '',
      rank: totalUsers > 0 ? { position, total: totalUsers } : undefined,
      monthCounts: Object.keys(monthCounts).length > 0 ? monthCounts : undefined,
      topArtists: topArtists && topArtists.length > 0 ? topArtists : undefined,
      userName: userName,
      leaderboard: recapData.leaderboard,
    }
  }, [recapData, userName, selectedYear])

  // Show loading state until component is mounted
  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-foreground mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!authenticated) {
    router.push('/')
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card shadow-sm border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Recap</h1>
              {userName && (
                <p className="text-sm text-muted-foreground">Welcome, {formatNameForDisplay(userName)}</p>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            {/* Desktop buttons */}
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
            
            {/* Mobile dropdown menu */}
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
                <DropdownMenu.DropdownMenuContent align="end" className="w-48 p-2">
                  <DropdownMenu.DropdownMenuItem onClick={() => router.push('/')}>
                    <Plus className="mr-3 h-4 w-4" />
                    Add Show
                  </DropdownMenu.DropdownMenuItem>
                  <DropdownMenu.DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600">
                    <LogOut className="mr-3 h-4 w-4" />
                    Logout
                  </DropdownMenu.DropdownMenuItem>
                </DropdownMenu.DropdownMenuContent>
              </DropdownMenu.DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Year Selector */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/')}
            className="text-muted-foreground hover:text-foreground"
          >
            ← Back to Shows
          </Button>
          <label htmlFor="year-select" className="text-sm font-medium text-foreground">
            Year:
          </label>
          <Select value={selectedYear.toString()} onChange={(value) => setSelectedYear(parseInt(value))}>
            <SelectTrigger className="w-32" id="year-select">
              {selectedYear}
            </SelectTrigger>
            <SelectContent>
              {generateYearOptions().map(year => (
                <SelectOption key={year} value={year.toString()}>
                  {year}
                </SelectOption>
              ))}
            </SelectContent>
          </Select>
        </div>

        {loading ? (
          <div className="space-y-6">
            <div className="animate-pulse">
              <div className="h-32 bg-muted rounded-lg"></div>
            </div>
            <div className="animate-pulse">
              <div className="h-64 bg-muted rounded-lg"></div>
            </div>
          </div>
        ) : recapData ? (
          <>
            {/* Personal Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Your {selectedYear} Recap</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <h3 className="text-2xl font-bold text-foreground">
                    You went to {recapData.personalSummary.totalShows} show{recapData.personalSummary.totalShows !== 1 ? 's' : ''} in {selectedYear}.
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Your year in review from January through December.
                  </p>
                </div>
                
                {recapData.personalSummary.totalShows > 0 && (
                  <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                    <h4 className="font-semibold text-sm text-primary mb-4">Your Year in Numbers</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                      <div>
                        <div className="text-muted-foreground">Total Shows</div>
                        <div className="font-semibold text-lg">{recapData.personalSummary.totalShows}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Avg per Month</div>
                        <div className="font-semibold text-lg">
                          {(recapData.personalSummary.totalShows / 12).toFixed(1)}
                        </div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Busiest Month</div>
                        <div className="font-semibold text-lg">
                          {recapData.personalSummary.busiestMonthName || 'N/A'}
                        </div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Top Venue</div>
                        <div className="font-semibold text-lg">
                          {recapData.personalSummary.topVenue || 'N/A'}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="flex flex-col sm:flex-row gap-3">
                  {/* Play Story with Year Selector */}
                  {storyRecapData && recapData.personalSummary.totalShows > 0 && (
                    <div className="flex items-center gap-2">
                      <Select value={selectedYear.toString()} onChange={(value) => setSelectedYear(parseInt(value))}>
                        <SelectTrigger className="w-24 h-9">
                          {selectedYear}
                        </SelectTrigger>
                        <SelectContent>
                          {generateYearOptions().map(year => (
                            <SelectOption key={year} value={year.toString()}>
                              {year}
                            </SelectOption>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button
                        size="sm"
                        onClick={() => setShowStoryPlayer(true)}
                        className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white border-0"
                      >
                        <Play className="w-4 h-4 mr-1" />
                        Play Story
                      </Button>
                    </div>
                  )}
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopySummary}
                    className="text-blue-800 hover:text-blue-900 hover:bg-blue-50 dark:text-blue-400 dark:hover:text-blue-300 dark:hover:bg-blue-950/20"
                  >
                    <Copy className="w-4 h-4 mr-1" />
                    {copySuccess ? 'Copied!' : 'Copy Summary'}
                  </Button>
                  
                  {recapData.personalSummary.totalShows > 0 && (() => {
                    const userIndex = recapData.leaderboard.findIndex(user => user.name === userName)
                    const position = userIndex + 1
                    const totalUsers = recapData.leaderboard.length
                    
                    const getOrdinal = (num: number) => {
                      const j = num % 10
                      const k = num % 100
                      if (j === 1 && k !== 11) return num + "st"
                      if (j === 2 && k !== 12) return num + "nd"
                      if (j === 3 && k !== 13) return num + "rd"
                      return num + "th"
                    }
                    
                    return (
                      <div className="text-xs text-muted-foreground flex items-center">
                        🏆 You&apos;re ranked {getOrdinal(position)} out of {totalUsers} attendees!
                      </div>
                    )
                  })()}
                </div>
              </CardContent>
            </Card>

            {/* Leaderboard */}
            <Card>
              <CardHeader>
                <CardTitle>Leaderboard</CardTitle>
              </CardHeader>
              <CardContent>
                {recapData.leaderboard.length > 0 ? (
                  <div className="space-y-2">
                    {recapData.leaderboard.map((user, index) => (
                      <div key={user.name} className="flex items-center justify-between py-2 border-b border-border last:border-b-0">
                        <div className="flex items-center gap-3">
                          <span className="text-lg font-bold text-foreground w-8">
                            {index + 1}
                          </span>
                          <span className="font-medium text-foreground">
                            {formatNameForDisplay(user.displayName)}
                          </span>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {user.totalShows} show{user.totalShows !== 1 ? 's' : ''}
                        </span>
                      </div>
                    ))}
                    <p className="text-xs text-muted-foreground mt-4">
                      Totals exclude Maybe and Not going
                    </p>
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-8">
                    No shows attended in {selectedYear}
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Monthly Chart */}
            {recapData.monthlyData.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Monthly trend</CardTitle>
                </CardHeader>
                <CardContent>
                  <RecapChart data={recapData.monthlyData} year={selectedYear} />
                </CardContent>
              </Card>
            )}

            {/* Your Stats and Group Stats */}
            {recapData.stats && (
              <Card>
                <CardHeader>
                  <CardTitle>Your Stats and Group Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Your Personal Stats */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-lg text-foreground">Your Stats</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {/* Core Activity Stats */}
                      <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                        <div className="text-sm text-muted-foreground">Your Total Shows</div>
                        <div className="text-2xl font-bold text-primary">
                          {recapData.stats.personalTotalShows}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          Shows you attended
                        </div>
                      </div>
                      
                      <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                        <div className="text-sm text-muted-foreground">Your Solo Shows</div>
                        <div className="text-2xl font-bold text-primary">
                          {recapData.stats.personalSolos}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          Times you went alone
                        </div>
                      </div>
                      
                      {/* Time-Based Stats */}
                      <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                        <div className="text-sm text-muted-foreground">Your First Show</div>
                        <div className="text-lg font-bold text-primary truncate">
                          {recapData.stats.personalFirstShow?.title || 'N/A'}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {recapData.stats.personalFirstShow?.date || 'N/A'}
                        </div>
                      </div>
                      
                      <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                        <div className="text-sm text-muted-foreground">Your Last Show</div>
                        <div className="text-lg font-bold text-primary truncate">
                          {recapData.stats.personalLastShow?.title || 'N/A'}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {recapData.stats.personalLastShow?.date || 'N/A'}
                        </div>
                      </div>
                      
                      <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                        <div className="text-sm text-muted-foreground">Your Longest Gap</div>
                        <div className="text-2xl font-bold text-primary">
                          {recapData.stats.personalLongestGap?.days || 0} days
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {recapData.stats.personalLongestGap?.startDate || 'N/A'} → {recapData.stats.personalLongestGap?.endDate || 'N/A'}
                        </div>
                      </div>
                      
                      {/* Pattern & Preference Stats */}
                      <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                        <div className="text-sm text-muted-foreground">Your Busiest Month</div>
                        <div className="text-2xl font-bold text-primary">
                          {recapData.stats.personalBusiestMonth?.month || 'N/A'}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {recapData.stats.personalBusiestMonth?.count || 0} shows
                        </div>
                      </div>
                      
                      
                      <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                        <div className="text-sm text-muted-foreground">Most Common Day</div>
                        <div className="text-lg font-bold text-primary">
                          {recapData.stats.personalMostCommonDay?.day || 'N/A'}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {recapData.stats.personalMostCommonDay?.count || 0} shows
                        </div>
                      </div>
                      
                      <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                        <div className="text-sm text-muted-foreground">Your Top Venue</div>
                        <div className="text-lg font-bold text-primary truncate">
                          {recapData.stats.personalTopVenue?.venue || 'N/A'}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {recapData.stats.personalTopVenue?.count || 0} visits
                        </div>
                      </div>
                      
                      <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                        <div className="text-sm text-muted-foreground">Your Back-to-Back Nights</div>
                        <div className="text-2xl font-bold text-primary">
                          {recapData.stats.personalBackToBackNights?.count || 0}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          Consecutive day shows
                        </div>
                        {recapData.stats.personalBackToBackNights?.examples && recapData.stats.personalBackToBackNights.examples.length > 0 && (
                          <div className="text-xs text-muted-foreground mt-2">
                            {recapData.stats.personalBackToBackNights.examples.slice(0, 2).map((example, index) => (
                              <div key={index} className="truncate">
                                {example.dates.join(', ')}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      {/* Artist Diversity Stats */}
                      <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                        <div className="text-sm text-muted-foreground">Artist Diversity</div>
                        <div className="text-2xl font-bold text-primary">
                          {recapData.stats.personalUniqueArtists}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          Unique artists seen
                        </div>
                      </div>
                      
                      <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                        <div className="text-sm text-muted-foreground">Most Seen Artist</div>
                        <div className="text-lg font-bold text-primary truncate">
                          {recapData.stats.personalMostSeenArtist?.artist || 'N/A'}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {recapData.stats.personalMostSeenArtist?.count || 0} times
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Personal Artist Stats */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-lg text-foreground">Your Artist Stats</h4>
                    
                    {/* Artist Stats Tabs */}
                    <Tabs defaultValue="all" className="w-full">
                      <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="all">
                          All
                        </TabsTrigger>
                        <TabsTrigger value="headliner">
                          Headliners
                        </TabsTrigger>
                        <TabsTrigger value="support">
                          Support
                        </TabsTrigger>
                        <TabsTrigger value="local">
                          Local
                        </TabsTrigger>
                      </TabsList>
                      
                      {/* All Artists Tab */}
                      <TabsContent value="all" className="space-y-3">
                        {recapData.stats.personalTopArtists.length > 0 && (
                          <div className="space-y-3">
                            <h5 className="font-medium text-foreground">Your Top Artists</h5>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              {recapData.stats.personalTopArtists.slice(0, 8).map((artist, index) => (
                                <div key={artist.artist} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                                  <div className="text-sm font-medium text-muted-foreground w-6">
                                    {index + 1}
                                  </div>
                                  {artist.image_url && (
                                    <Image 
                                      src={artist.image_url} 
                                      alt={artist.artist}
                                      width={32}
                                      height={32}
                                      className="w-8 h-8 rounded-full object-cover"
                                    />
                                  )}
                                  <div className="flex-1 min-w-0">
                                    <div className="font-medium text-foreground truncate">
                                      {artist.artist}
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                      {artist.count} show{artist.count !== 1 ? 's' : ''}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </TabsContent>
                      
                      {/* Headliners Tab */}
                      <TabsContent value="headliner" className="space-y-3">
                        {recapData.stats.personalTopArtistsByPosition.Headliner.length > 0 ? (
                          <div className="space-y-3">
                            <h5 className="font-medium text-foreground">Your Top Headliners</h5>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              {recapData.stats.personalTopArtistsByPosition.Headliner.slice(0, 8).map((artist, index) => (
                                <div key={artist.artist} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                                  <div className="text-sm font-medium text-muted-foreground w-6">
                                    {index + 1}
                                  </div>
                                  {artist.image_url && (
                                    <Image 
                                      src={artist.image_url} 
                                      alt={artist.artist}
                                      width={32}
                                      height={32}
                                      className="w-8 h-8 rounded-full object-cover"
                                    />
                                  )}
                                  <div className="flex-1 min-w-0">
                                    <div className="font-medium text-foreground truncate">
                                      {artist.artist}
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                      {artist.count} show{artist.count !== 1 ? 's' : ''}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <div className="text-center text-muted-foreground py-8">
                            No headliners seen this year
                          </div>
                        )}
                      </TabsContent>
                      
                      {/* Support Tab */}
                      <TabsContent value="support" className="space-y-3">
                        {recapData.stats.personalTopArtistsByPosition.Support.length > 0 ? (
                          <div className="space-y-3">
                            <h5 className="font-medium text-foreground">Your Top Support Acts</h5>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              {recapData.stats.personalTopArtistsByPosition.Support.slice(0, 8).map((artist, index) => (
                                <div key={artist.artist} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                                  <div className="text-sm font-medium text-muted-foreground w-6">
                                    {index + 1}
                                  </div>
                                  {artist.image_url && (
                                    <Image 
                                      src={artist.image_url} 
                                      alt={artist.artist}
                                      width={32}
                                      height={32}
                                      className="w-8 h-8 rounded-full object-cover"
                                    />
                                  )}
                                  <div className="flex-1 min-w-0">
                                    <div className="font-medium text-foreground truncate">
                                      {artist.artist}
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                      {artist.count} show{artist.count !== 1 ? 's' : ''}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <div className="text-center text-muted-foreground py-8">
                            No support acts seen this year
                          </div>
                        )}
                      </TabsContent>
                      
                      {/* Local Tab */}
                      <TabsContent value="local" className="space-y-3">
                        {recapData.stats.personalTopArtistsByPosition.Local.length > 0 ? (
                          <div className="space-y-3">
                            <h5 className="font-medium text-foreground">Your Top Local Acts</h5>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              {recapData.stats.personalTopArtistsByPosition.Local.slice(0, 8).map((artist, index) => (
                                <div key={artist.artist} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                                  <div className="text-sm font-medium text-muted-foreground w-6">
                                    {index + 1}
                                  </div>
                                  {artist.image_url && (
                                    <Image 
                                      src={artist.image_url} 
                                      alt={artist.artist}
                                      width={32}
                                      height={32}
                                      className="w-8 h-8 rounded-full object-cover"
                                    />
                                  )}
                                  <div className="flex-1 min-w-0">
                                    <div className="font-medium text-foreground truncate">
                                      {artist.artist}
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                      {artist.count} show{artist.count !== 1 ? 's' : ''}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <div className="text-center text-muted-foreground py-8">
                            No local acts seen this year
                          </div>
                        )}
                      </TabsContent>
                    </Tabs>
                  </div>

                  {/* Group Stats */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-lg text-foreground">Group Stats</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {/* Group Activity Overview */}
                      <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                        <div className="text-sm text-muted-foreground">Total Shows</div>
                        <div className="text-2xl font-bold text-primary">
                          {recapData.stats.totalShows}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          Across all attendees
                        </div>
                      </div>
                      
                      <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                        <div className="text-sm text-muted-foreground">Group Total</div>
                        <div className="text-2xl font-bold text-primary">
                          {recapData.stats.groupTotal}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          Total shows attended
                        </div>
                      </div>
                      
                      <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                        <div className="text-sm text-muted-foreground">Average per Person</div>
                        <div className="text-2xl font-bold text-primary">
                          {recapData.stats.averageShowsPerPerson.toFixed(1)}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          Shows per person
                        </div>
                      </div>
                      
                      {/* Group Patterns & Preferences */}
                      <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                        <div className="text-sm text-muted-foreground">Group Busiest Month</div>
                        <div className="text-2xl font-bold text-primary">
                          {recapData.stats.groupBusiestMonth?.month || 'N/A'}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {recapData.stats.groupBusiestMonth?.count || 0} shows
                        </div>
                      </div>
                      
                      <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                        <div className="text-sm text-muted-foreground">Group Top Venue</div>
                        <div className="text-lg font-bold text-primary truncate">
                          {recapData.stats.groupTopVenue?.venue || 'N/A'}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {recapData.stats.groupTopVenue?.count || 0} visits
                        </div>
                      </div>
                      
                      <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                        <div className="text-sm text-muted-foreground">Most Popular Day</div>
                        <div className="text-lg font-bold text-primary">
                          {recapData.stats.mostPopularDay?.day || 'N/A'}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {recapData.stats.mostPopularDay?.count || 0} total attendance
                        </div>
                      </div>
                      
                      <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                        <div className="text-sm text-muted-foreground">Most People in One Show</div>
                        <div className="text-lg font-bold text-primary">
                          {recapData.stats.mostPeopleInOneShow?.count || 0} people
                        </div>
                        <div className="text-xs text-muted-foreground mt-1 truncate">
                          {recapData.stats.mostPeopleInOneShow?.showTitle || 'N/A'}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {recapData.stats.mostPeopleInOneShow?.date || 'N/A'}
                        </div>
                      </div>
                      
                      <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                        <div className="text-sm text-muted-foreground">Most Solos</div>
                        <div className="text-lg font-bold text-primary">
                          {recapData.stats.mostSolos?.name ? formatNameForDisplay(recapData.stats.mostSolos.name) : 'N/A'}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {recapData.stats.mostSolos?.count || 0} solo shows
                        </div>
                      </div>
                      
                      <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                        <div className="text-sm text-muted-foreground">Most Active User</div>
                        <div className="text-lg font-bold text-primary">
                          {recapData.stats.mostActiveUser?.name ? formatNameForDisplay(recapData.stats.mostActiveUser.name) : 'N/A'}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {recapData.stats.mostActiveUser?.count || 0} shows
                        </div>
                      </div>
                      
                      {/* Group Achievements & Streaks */}
                      <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                        <div className="text-sm text-muted-foreground">Biggest Streak</div>
                        <div className="text-lg font-bold text-primary">
                          {recapData.stats.biggestStreak?.user ? formatNameForDisplay(recapData.stats.biggestStreak.user) : 'N/A'}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {recapData.stats.biggestStreak?.streak || 0} months in a row
                        </div>
                      </div>
                      
                      
                      <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                        <div className="text-sm text-muted-foreground">Group Most Seen Artist</div>
                        <div className="text-lg font-bold text-primary truncate">
                          {recapData.stats.groupMostSeenArtist?.artist || 'N/A'}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {recapData.stats.groupMostSeenArtist?.count || 0} {recapData.stats.groupMostSeenArtist?.count !== 1 ? 'times seen' : 'time seen'}
                        </div>
                      </div>
                      
                    </div>
                  </div>

                  {/* Group Artist Stats */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-lg text-foreground">Group Artist Stats</h4>
                    
                    {/* Group Artist Stats Tabs */}
                    <Tabs defaultValue="all" className="w-full">
                      <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="all">
                          All
                        </TabsTrigger>
                        <TabsTrigger value="headliner">
                          Headliners
                        </TabsTrigger>
                        <TabsTrigger value="support">
                          Support
                        </TabsTrigger>
                        <TabsTrigger value="local">
                          Local
                        </TabsTrigger>
                      </TabsList>
                      
                      {/* All Artists Tab */}
                      <TabsContent value="all" className="space-y-3">
                        {recapData.stats.groupTopArtists.length > 0 && (
                          <div className="space-y-3">
                            <h5 className="font-medium text-foreground">Group Top Artists</h5>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              {recapData.stats.groupTopArtists.slice(0, 8).map((artist, index) => (
                                <div key={artist.artist} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                                  <div className="text-sm font-medium text-muted-foreground w-6">
                                    {index + 1}
                                  </div>
                                  {artist.image_url && (
                                    <Image 
                                      src={artist.image_url} 
                                      alt={artist.artist}
                                      width={32}
                                      height={32}
                                      className="w-8 h-8 rounded-full object-cover"
                                    />
                                  )}
                                  <div className="flex-1 min-w-0">
                                    <div className="font-medium text-foreground truncate">
                                      {artist.artist}
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                      {artist.count} {artist.count !== 1 ? 'times seen' : 'time seen'}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </TabsContent>
                      
                      {/* Headliners Tab */}
                      <TabsContent value="headliner" className="space-y-3">
                        {recapData.stats.groupTopArtistsByPosition.Headliner.length > 0 ? (
                          <div className="space-y-3">
                            <h5 className="font-medium text-foreground">Group Top Headliners</h5>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              {recapData.stats.groupTopArtistsByPosition.Headliner.slice(0, 8).map((artist, index) => (
                                <div key={artist.artist} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                                  <div className="text-sm font-medium text-muted-foreground w-6">
                                    {index + 1}
                                  </div>
                                  {artist.image_url && (
                                    <Image 
                                      src={artist.image_url} 
                                      alt={artist.artist}
                                      width={32}
                                      height={32}
                                      className="w-8 h-8 rounded-full object-cover"
                                    />
                                  )}
                                  <div className="flex-1 min-w-0">
                                    <div className="font-medium text-foreground truncate">
                                      {artist.artist}
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                      {artist.count} {artist.count !== 1 ? 'times seen' : 'time seen'}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <div className="text-center text-muted-foreground py-8">
                            No headliners seen this year
                          </div>
                        )}
                      </TabsContent>
                      
                      {/* Support Tab */}
                      <TabsContent value="support" className="space-y-3">
                        {recapData.stats.groupTopArtistsByPosition.Support.length > 0 ? (
                          <div className="space-y-3">
                            <h5 className="font-medium text-foreground">Group Top Support Acts</h5>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              {recapData.stats.groupTopArtistsByPosition.Support.slice(0, 8).map((artist, index) => (
                                <div key={artist.artist} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                                  <div className="text-sm font-medium text-muted-foreground w-6">
                                    {index + 1}
                                  </div>
                                  {artist.image_url && (
                                    <Image 
                                      src={artist.image_url} 
                                      alt={artist.artist}
                                      width={32}
                                      height={32}
                                      className="w-8 h-8 rounded-full object-cover"
                                    />
                                  )}
                                  <div className="flex-1 min-w-0">
                                    <div className="font-medium text-foreground truncate">
                                      {artist.artist}
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                      {artist.count} {artist.count !== 1 ? 'times seen' : 'time seen'}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <div className="text-center text-muted-foreground py-8">
                            No support acts seen this year
                          </div>
                        )}
                      </TabsContent>
                      
                      {/* Local Tab */}
                      <TabsContent value="local" className="space-y-3">
                        {recapData.stats.groupTopArtistsByPosition.Local.length > 0 ? (
                          <div className="space-y-3">
                            <h5 className="font-medium text-foreground">Group Top Local Acts</h5>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              {recapData.stats.groupTopArtistsByPosition.Local.slice(0, 8).map((artist, index) => (
                                <div key={artist.artist} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                                  <div className="text-sm font-medium text-muted-foreground w-6">
                                    {index + 1}
                                  </div>
                                  {artist.image_url && (
                                    <Image 
                                      src={artist.image_url} 
                                      alt={artist.artist}
                                      width={32}
                                      height={32}
                                      className="w-8 h-8 rounded-full object-cover"
                                    />
                                  )}
                                  <div className="flex-1 min-w-0">
                                    <div className="font-medium text-foreground truncate">
                                      {artist.artist}
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                      {artist.count} {artist.count !== 1 ? 'times seen' : 'time seen'}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <div className="text-center text-muted-foreground py-8">
                            No local acts seen this year
                          </div>
                        )}
                      </TabsContent>
                    </Tabs>
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        ) : (
          <Card>
            <CardContent className="py-12">
              <div className="text-center space-y-4">
                <h3 className="text-lg font-semibold text-foreground">No data available</h3>
                <p className="text-muted-foreground">
                  There are no shows to recap for {selectedYear}.
                </p>
                <Button onClick={() => router.push('/')}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add a show
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </main>

      {/* Story Player Modal */}
      {showStoryPlayer && storyRecapData && (
        <RecapStoryPlayer
          recap={storyRecapData}
          onClose={() => setShowStoryPlayer(false)}
        />
      )}
    </div>
  )
}
