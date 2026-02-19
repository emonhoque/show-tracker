'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectOption, SelectTrigger } from '@/components/ui/select'
import { ThemeToggle } from '@/components/ThemeToggle'
import { useToast } from '@/components/ui/toast'
import { LogOut, Plus, Menu, DollarSign, ChevronDown, CalendarDays, History, BarChart3 } from 'lucide-react'
import * as DropdownMenu from '@/components/ui/dropdown-menu'
import { formatNameForDisplay } from '@/lib/validation'
import {
  type CostsSummary,
  type ShowWithCosts,
} from '@/lib/costs'
import { ShowCostsCard } from '@/components/CostsComponents'

const fmtUSD = (value: number) =>
  '$' + value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

export default function MyShowsPage() {
  const [mounted, setMounted] = useState(false)
  const [authenticated, setAuthenticated] = useState(false)
  const [userName, setUserName] = useState<string | null>(null)
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [summary, setSummary] = useState<CostsSummary | null>(null)
  const [upcoming, setUpcoming] = useState<ShowWithCosts[]>([])
  const [past, setPast] = useState<ShowWithCosts[]>([])
  const [loading, setLoading] = useState(false)
  const [spendingOpen, setSpendingOpen] = useState(false)
  const [detailsOpen, setDetailsOpen] = useState(false)

  const router = useRouter()
  const { showToast } = useToast()

  useEffect(() => {
    setMounted(true)
    const storedName = localStorage.getItem('userName')
    if (storedName) {
      setUserName(storedName)
      setAuthenticated(true)
    }
  }, [])

  const fetchData = useCallback(async () => {
    if (!userName) return
    setLoading(true)
    try {
      const [summaryRes, showsRes] = await Promise.all([
        fetch(`/api/costs/summary?year=${selectedYear}&user=${encodeURIComponent(userName)}`),
        fetch(`/api/costs/shows?year=${selectedYear}&user=${encodeURIComponent(userName)}`),
      ])

      if (summaryRes.ok) {
        const summaryData = await summaryRes.json()
        setSummary(summaryData)
      }

      if (showsRes.ok) {
        const data = await showsRes.json()
        setUpcoming(data.upcoming || [])
        setPast(data.past || [])
      }
    } catch (error) {
      console.error('Error fetching data:', error)
      showToast({ title: 'Error', description: 'Failed to load data', type: 'error' })
    } finally {
      setLoading(false)
    }
  }, [selectedYear, userName, showToast])

  useEffect(() => {
    if (authenticated && userName) {
      fetchData()
    }
  }, [selectedYear, authenticated, userName, fetchData])

  const handleLogout = () => {
    localStorage.removeItem('userName')
    setAuthenticated(false)
    setUserName(null)
    router.push('/')
  }

  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear()
    const years = []
    for (let year = 2023; year <= currentYear; year++) {
      years.push(year)
    }
    return years
  }

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

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card shadow-sm border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">My Shows</h1>
              {userName && (
                <p className="text-sm text-muted-foreground">Welcome, {formatNameForDisplay(userName)}</p>
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
                  <Button variant="outline" size="sm" className="h-8 w-8 p-0" aria-label="Open menu">
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

      <main className="max-w-4xl mx-auto p-4 space-y-6">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/')}
              className="text-muted-foreground hover:text-foreground"
            >
              ← Back to Shows
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push('/my-shows/recap')}
            >
              <BarChart3 className="w-4 h-4 mr-1" />
              View Recap
            </Button>
          </div>
          <div className="flex items-center gap-2">
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
        </div>

        {loading ? (
          <div className="space-y-6">
            <div className="animate-pulse space-y-3">
              <div className="h-20 bg-muted rounded-lg" />
              <div className="h-20 bg-muted rounded-lg" />
              <div className="h-20 bg-muted rounded-lg" />
            </div>
          </div>
        ) : upcoming.length === 0 && past.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <CalendarDays className="w-12 h-12 mx-auto text-muted-foreground/30 mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No Shows Yet</h3>
              <p className="text-muted-foreground mb-4">
                RSVP &quot;Going&quot; to shows on the main page to see them here.
              </p>
              <Button onClick={() => router.push('/')}>
                Go to Shows
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Upcoming Shows */}
            {upcoming.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <CalendarDays className="w-4 h-4 text-primary" />
                  <h2 className="text-lg font-semibold text-foreground">
                    Upcoming ({upcoming.length})
                  </h2>
                </div>
                {upcoming.map(show => (
                  <ShowCostsCard
                    key={show.id}
                    show={show}
                    isPast={false}
                    userName={userName!}
                    onCostsChanged={fetchData}
                  />
                ))}
              </div>
            )}

            {/* Past Shows */}
            {past.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <History className="w-4 h-4 text-muted-foreground" />
                  <h2 className="text-lg font-semibold text-foreground">
                    Past ({past.length})
                  </h2>
                </div>
                {past.map(show => (
                  <ShowCostsCard
                    key={show.id}
                    show={show}
                    isPast={true}
                    userName={userName!}
                    onCostsChanged={fetchData}
                  />
                ))}
              </div>
            )}

            {/* Spending Summary — collapsible */}
            {summary && summary.total_attended_shows > 0 && (
              <Card>
                <button
                  onClick={() => setSpendingOpen(o => !o)}
                  className="w-full"
                >
                  <CardHeader className="flex flex-row items-center justify-between cursor-pointer hover:bg-muted/30 transition-colors">
                    <CardTitle className="flex items-center gap-2">
                      <DollarSign className="w-5 h-5" />
                      {selectedYear} Spending Summary
                    </CardTitle>
                    <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform duration-200 ${spendingOpen ? 'rotate-180' : ''}`} />
                  </CardHeader>
                </button>

                {spendingOpen && (
                  <CardContent className="space-y-6 pt-0">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
                        <div className="text-xs text-muted-foreground">Total Spend</div>
                        <div className="text-xl font-bold text-foreground">
                          {fmtUSD(summary.total_spend)}
                        </div>
                      </div>
                      <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
                        <div className="text-xs text-muted-foreground">Avg per Show</div>
                        <div className="text-xl font-bold text-foreground">
                          {fmtUSD(summary.average_per_show)}
                        </div>
                      </div>
                      <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
                        <div className="text-xs text-muted-foreground">
                          {selectedYear < new Date().getFullYear() ? 'Shows Attended' : 'Total Shows'}
                        </div>
                        <div className="text-xl font-bold text-foreground">
                          {summary.total_attended_shows}
                        </div>
                      </div>
                      <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
                        <div className="text-xs text-muted-foreground">Costs Tracked</div>
                        <div className="text-xl font-bold text-foreground">
                          {summary.total_shows_with_costs}/{summary.total_attended_shows}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => setDetailsOpen(o => !o)}
                      className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${detailsOpen ? 'rotate-180' : ''}`} />
                      {detailsOpen ? 'Hide details' : 'Show details'}
                    </button>

                    {detailsOpen && (
                      <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {summary.most_expensive_show && (
                          <div className="bg-red-50/50 dark:bg-red-950/10 border border-red-200 dark:border-red-800/30 rounded-lg p-3">
                            <div className="text-xs text-muted-foreground mb-1">Most Expensive Show</div>
                            <div className="font-semibold text-foreground">
                              {summary.most_expensive_show.title}
                            </div>
                            <div className="text-sm text-red-600 dark:text-red-400 font-medium">
                              {fmtUSD(summary.most_expensive_show.total)}
                            </div>
                          </div>
                        )}

                        {summary.cheapest_show && (
                          <div className="bg-green-50/50 dark:bg-green-950/10 border border-green-200 dark:border-green-800/30 rounded-lg p-3">
                            <div className="text-xs text-muted-foreground mb-1">Cheapest Show</div>
                            <div className="font-semibold text-foreground">
                              {summary.cheapest_show.title}
                            </div>
                            <div className="text-sm text-green-600 dark:text-green-400 font-medium">
                              {fmtUSD(summary.cheapest_show.total)}
                            </div>
                          </div>
                        )}

                        {summary.cost_per_artist !== null && (
                          <div className="bg-purple-50/50 dark:bg-purple-950/10 border border-purple-200 dark:border-purple-800/30 rounded-lg p-3">
                            <div className="text-xs text-muted-foreground mb-1">Cost per Artist Seen</div>
                            <div className="text-xl font-bold text-foreground">
                              {fmtUSD(summary.cost_per_artist)}
                            </div>
                          </div>
                        )}
                      </div>

                        {summary.spend_by_category.length > 0 && (
                          <div>
                            <h4 className="text-sm font-semibold text-foreground mb-3">Spend by Category</h4>
                            <div className="space-y-2">
                              {summary.spend_by_category.map(cat => {
                                const maxTotal = summary.spend_by_category[0]?.total || 1
                                const percentage = (cat.total / maxTotal) * 100
                                return (
                                  <div key={cat.category} className="flex items-center gap-2">
                                    <span className="text-base w-6 text-center">{cat.emoji}</span>
                                    <span className="text-sm text-muted-foreground w-24">{cat.label}</span>
                                    <div className="flex-1 h-6 bg-muted rounded-full overflow-hidden">
                                      <div
                                        className="h-full bg-primary/70 rounded-full transition-all duration-300"
                                        style={{ width: `${Math.max(percentage, 2)}%` }}
                                      />
                                    </div>
                                    <span className="text-sm font-medium text-foreground min-w-[80px] text-right">
                                      {fmtUSD(cat.total)}
                                    </span>
                                  </div>
                                )
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                )}
              </Card>
            )}
          </>
        )}
      </main>
    </div>
  )
}
