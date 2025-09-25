'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectOption, SelectTrigger } from '@/components/ui/select'
import { ThemeToggle } from '@/components/ThemeToggle'
import { LogOut, Copy, Plus, Menu } from 'lucide-react'
import * as DropdownMenu from '@/components/ui/dropdown-menu'
import { formatNameForDisplay } from '@/lib/validation'
import { RecapChart } from '@/components/RecapChart'
import { RecapData } from '@/app/api/recap/route'

export default function RecapPage() {
  const [mounted, setMounted] = useState(false)
  const [authenticated, setAuthenticated] = useState(false)
  const [userName, setUserName] = useState<string | null>(null)
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [recapData, setRecapData] = useState<RecapData | null>(null)
  const [loading, setLoading] = useState(false)
  const [copySuccess, setCopySuccess] = useState(false)

  const router = useRouter()

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
  }, [selectedYear, authenticated])

  const fetchRecapData = async () => {
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
  }

  const handleLogout = () => {
    localStorage.removeItem('userName')
    setAuthenticated(false)
    setUserName(null)
    router.push('/')
  }

  const handleCopySummary = async () => {
    if (!recapData || !userName) return
    
    const userIndex = recapData.leaderboard.findIndex(user => user.name === userName?.toLowerCase())
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
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/')}
              className="text-muted-foreground hover:text-foreground"
            >
              ← Back to Shows
            </Button>
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
                    Based on Boston time, Jan 1 to Dec 31.
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
                    const userIndex = recapData.leaderboard.findIndex(user => user.name === userName?.toLowerCase())
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
                        🏆 You're ranked {getOrdinal(position)} out of {totalUsers} attendees!
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
                      Totals use Boston time and exclude Maybe and Not going
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
    </div>
  )
}
