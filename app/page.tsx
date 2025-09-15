'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PasswordGate } from '@/components/PasswordGate'
import { ShowCard } from '@/components/ShowCard'
import { ShowCardSkeleton } from '@/components/ShowCardSkeleton'
import { AddShowModal } from '@/components/AddShowModal'
import { EditShowModal } from '@/components/EditShowModal'
import { DeleteConfirmDialog } from '@/components/DeleteConfirmDialog'
import { PWAFeatures } from '@/components/PWAFeatures'
import { RSVPFilter } from '@/components/RSVPFilter'
import { RSVPFilterSkeleton } from '@/components/RSVPFilterSkeleton'
import { AddArtistModal } from '@/components/AddArtistModal'
import { ReleasesFeed } from '@/components/ReleasesFeed'
import { Show, RSVPSummary, Artist } from '@/lib/types'
import { formatNameForDisplay } from '@/lib/validation'
import { useInfiniteScroll } from '@/lib/useInfiniteScroll'
import { Plus, LogOut, Menu } from 'lucide-react'
import { ThemeToggle } from '@/components/ThemeToggle'
import { useTheme } from '@/components/ThemeProvider'
import * as DropdownMenu from '@/components/ui/dropdown-menu'

export default function Home() {
  const [mounted, setMounted] = useState(false)
  const [authenticated, setAuthenticated] = useState(false)
  const [userName, setUserName] = useState<string | null>(null)
  const [upcomingShows, setUpcomingShows] = useState<Show[]>([])
  const [pastShows, setPastShows] = useState<Show[]>([])
  const [rsvpsData, setRsvpsData] = useState<Record<string, RSVPSummary>>({})
  const [selectedStatusFilters, setSelectedStatusFilters] = useState<Set<string>>(new Set(['all']))
  const [selectedPeopleFilters, setSelectedPeopleFilters] = useState<Set<string>>(new Set(['all']))
  const [availableAttendees, setAvailableAttendees] = useState<string[]>([])
  const [filteredUpcomingShows, setFilteredUpcomingShows] = useState<Show[]>([])
  const [pastShowsPagination, setPastShowsPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false
  })
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [editingShow, setEditingShow] = useState<Show | null>(null)
  const [deletingShowId, setDeletingShowId] = useState<string | null>(null)
  const [deletingShowTitle, setDeletingShowTitle] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [isOffline, setIsOffline] = useState(false)
  const [cacheVersion, setCacheVersion] = useState(0)

  // Check if component is mounted on client side
  useEffect(() => {
    setMounted(true)
    const storedName = localStorage.getItem('userName')
    if (storedName) {
      setUserName(storedName)
      setAuthenticated(true)
    }

  }, [])

  // Get theme - this will be handled by ThemeToggle component
  const { theme, setTheme } = useTheme()

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOffline(false)
    const handleOffline = () => setIsOffline(true)
    
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    
    // Check initial status
    setIsOffline(!navigator.onLine)
    
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const fetchShows = useCallback(async (pastPage: number = 1, isLoadMore: boolean = false) => {
    if (isLoadMore) {
      setLoadingMore(true)
    } else {
      setLoading(true)
    }
    
    try {
      // Fetch upcoming shows (now includes RSVPs) - only on initial load
      if (!isLoadMore) {
        const upcomingResponse = await fetch(`/api/shows/upcoming?v=${cacheVersion}`, {
          headers: {
            'Cache-Control': 'no-cache'
          }
        })
        if (upcomingResponse.ok) {
          const upcomingData = await upcomingResponse.json()
          if (Array.isArray(upcomingData)) {
            setUpcomingShows(upcomingData)
            
            // Extract RSVPs from shows and attendees
            const newRsvpsData: Record<string, RSVPSummary> = {}
            const attendees = new Set<string>()
            
            upcomingData.forEach((show: Show & { rsvps?: RSVPSummary }) => {
              if (show.rsvps) {
                newRsvpsData[show.id] = show.rsvps
                
                // Extract attendees from RSVPs
                show.rsvps.going?.forEach(name => attendees.add(name))
                show.rsvps.maybe?.forEach(name => attendees.add(name))
                show.rsvps.not_going?.forEach(name => attendees.add(name))
              }
            })
            
            setRsvpsData(prev => ({ ...prev, ...newRsvpsData }))
            setAvailableAttendees(Array.from(attendees).sort())
          } else {
            console.error('Invalid upcoming shows data format:', upcomingData)
            setUpcomingShows([])
          }
        } else {
          console.error('Failed to fetch upcoming shows:', upcomingResponse.status)
          setUpcomingShows([])
        }
      }

      // Fetch past shows with pagination
      const pastResponse = await fetch(`/api/shows/past?page=${pastPage}&limit=20&v=${cacheVersion}`, {
        headers: {
          'Cache-Control': 'no-cache'
        }
      })
      if (pastResponse.ok) {
        const pastData = await pastResponse.json()
        if (pastData && Array.isArray(pastData.shows)) {
          if (isLoadMore) {
            // Append new shows to existing ones, filtering out duplicates
            setPastShows(prev => {
              const existingIds = new Set(prev.map((show: Show) => show.id))
              const newShows = pastData.shows.filter((show: Show) => !existingIds.has(show.id))
              return [...prev, ...newShows]
            })
          } else {
            // Replace shows on initial load
            setPastShows(pastData.shows)
          }
          setPastShowsPagination(pastData.pagination)
          
          // Extract RSVPs from shows
          const newRsvpsData: Record<string, RSVPSummary> = {}
          pastData.shows.forEach((show: Show & { rsvps?: RSVPSummary }) => {
            if (show.rsvps) {
              newRsvpsData[show.id] = show.rsvps
            }
          })
          setRsvpsData(prev => ({ ...prev, ...newRsvpsData }))
        } else {
          console.error('Invalid past shows data format:', pastData)
          if (!isLoadMore) {
            setPastShows([])
          }
        }
      } else {
        console.error('Failed to fetch past shows:', pastResponse.status)
        if (!isLoadMore) {
          setPastShows([])
        }
      }
    } catch (error) {
      console.error('Error fetching shows:', error)
    } finally {
      if (isLoadMore) {
        setLoadingMore(false)
      } else {
        setLoading(false)
      }
    }
  }, [])

  // Fetch shows when authenticated
  useEffect(() => {
    if (authenticated) {
      fetchShows()
    }
  }, [authenticated, fetchShows])

  // Apply filters to upcoming shows
  useEffect(() => {
    if (selectedStatusFilters.has('all') && selectedPeopleFilters.has('all')) {
      setFilteredUpcomingShows(upcomingShows)
      return
    }

    const filtered = upcomingShows.filter(show => {
      const rsvps = rsvpsData[show.id]
      if (!rsvps) return false

      // If both groups have "all" selected, show all shows
      if (selectedStatusFilters.has('all') && selectedPeopleFilters.has('all')) {
        return true
      }

      // If only status has "all", check people filters
      if (selectedStatusFilters.has('all')) {
        return selectedPeopleFilters.has('all') ||
          Array.from(selectedPeopleFilters).some(person => {
            return rsvps.going?.includes(person) || 
                   rsvps.maybe?.includes(person) ||
                   rsvps.not_going?.includes(person)
          })
      }

      // If only people has "all", check status filters
      if (selectedPeopleFilters.has('all')) {
        return Array.from(selectedStatusFilters).some(status => {
          if (status === 'going') {
            return rsvps.going && rsvps.going.length > 0
          } else if (status === 'maybe') {
            return rsvps.maybe && rsvps.maybe.length > 0
          } else if (status === 'not_going') {
            return rsvps.not_going && rsvps.not_going.length > 0
          }
          return false
        })
      }

      // Both groups have specific selections - check if ALL selected people have the selected statuses
      return Array.from(selectedPeopleFilters).every(person => {
        return Array.from(selectedStatusFilters).some(status => {
          if (status === 'going') {
            return rsvps.going?.includes(person)
          } else if (status === 'maybe') {
            return rsvps.maybe?.includes(person)
          } else if (status === 'not_going') {
            return rsvps.not_going?.includes(person)
          }
          return false
        })
      })
    })
    
    setFilteredUpcomingShows(filtered)
  }, [selectedStatusFilters, selectedPeopleFilters, upcomingShows, rsvpsData])

  const handleAuthentication = (name: string) => {
    setUserName(name)
    setAuthenticated(true)
  }

  // Filter functions
  const handleStatusFilterToggle = (filter: string) => {
    setSelectedStatusFilters(prev => {
      const newFilters = new Set(prev)
      
      if (filter === 'all') {
        return new Set(['all'])
      } else {
        newFilters.delete('all')
        
        if (newFilters.has(filter)) {
          newFilters.delete(filter)
          if (newFilters.size === 0) {
            return new Set(['all'])
          }
        } else {
          newFilters.add(filter)
        }
      }
      
      return newFilters
    })
  }

  const handlePeopleFilterToggle = (filter: string) => {
    setSelectedPeopleFilters(prev => {
      const newFilters = new Set(prev)
      
      if (filter === 'all') {
        return new Set(['all'])
      } else {
        newFilters.delete('all')
        
        if (newFilters.has(filter)) {
          newFilters.delete(filter)
          if (newFilters.size === 0) {
            return new Set(['all'])
          }
        } else {
          newFilters.add(filter)
        }
      }
      
      return newFilters
    })
  }

  const handleClearAllFilters = () => {
    setSelectedStatusFilters(new Set(['all']))
    setSelectedPeopleFilters(new Set(['all']))
  }

  const handleShowAdded = async () => {
    // Invalidate cache and refresh data
    setCacheVersion(prev => prev + 1)
    // Small delay to ensure database has been updated
    await new Promise(resolve => setTimeout(resolve, 100))
    // Fetch both upcoming and past shows to ensure new show appears
    await fetchShows(pastShowsPagination.page)
  }


  const loadMorePastShows = useCallback(() => {
    if (pastShowsPagination.hasNext && !loadingMore) {
      fetchShows(pastShowsPagination.page + 1, true)
    }
  }, [pastShowsPagination.hasNext, pastShowsPagination.page, loadingMore, fetchShows])

  // Infinite scroll for past shows
  const { sentinelRef } = useInfiniteScroll({
    hasMore: pastShowsPagination.hasNext,
    isLoading: loadingMore,
    onLoadMore: loadMorePastShows
  })

  const handleEditShow = (show: Show) => {
    setEditingShow(show)
    setShowEditModal(true)
  }

  const handleShowUpdated = async () => {
    // Invalidate cache and refresh data
    setCacheVersion(prev => prev + 1)
    // Small delay to ensure database has been updated
    await new Promise(resolve => setTimeout(resolve, 100))
    // Fetch both upcoming and past shows to ensure updated show appears
    await fetchShows(pastShowsPagination.page)
    setShowEditModal(false)
    setEditingShow(null)
  }

  const updateRSVPs = async (showId: string) => {
    try {
      const response = await fetch(`/api/rsvps/${showId}`, {
        headers: {
          'Cache-Control': 'no-cache'
        }
      })
      if (response.ok) {
        const data = await response.json()
        setRsvpsData(prev => ({ ...prev, [showId]: data }))
      }
    } catch (error) {
      console.error(`Error updating RSVPs for show ${showId}:`, error)
    }
  }

  const handleDeleteShow = (showId: string) => {
    const show = [...upcomingShows, ...pastShows].find(s => s.id === showId)
    if (show) {
      setDeletingShowId(showId)
      setDeletingShowTitle(show.title)
      setShowDeleteDialog(true)
    }
  }

  const confirmDeleteShow = async () => {
    if (!deletingShowId) return

    try {
      const response = await fetch(`/api/shows/${deletingShowId}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        const errorData = await response.json()
        alert(errorData.error || 'Failed to delete show')
        return
      }

      // Invalidate cache and refresh shows
      setCacheVersion(prev => prev + 1)
      await fetchShows(pastShowsPagination.page)
      setShowDeleteDialog(false)
      setDeletingShowId(null)
      setDeletingShowTitle('')
    } catch (error) {
      console.error('Error deleting show:', error)
      alert('Failed to delete show')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('userName')
    setAuthenticated(false)
    setUserName(null)
    setUpcomingShows([])
    setPastShows([])
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
    return <PasswordGate onSuccess={handleAuthentication} />
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card shadow-sm border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Show Tracker</h1>
            {userName && (
              <p className="text-sm text-muted-foreground">Welcome, {formatNameForDisplay(userName)}</p>
            )}
          </div>
          <div className="flex gap-2">
            {/* Desktop buttons */}
            <div className="hidden sm:flex gap-2">
              <Button onClick={() => setShowAddModal(true)} size="sm">
                <Plus className="w-4 h-4 mr-1" />
                Add
              </Button>
              <ThemeToggle />
              <Button onClick={handleLogout} variant="outline" size="sm">
                <LogOut className="w-4 h-4 mr-1" />
                Logout
              </Button>
            </div>
            
            {/* Mobile dropdown menu */}
            <div className="sm:hidden flex gap-2">
              <Button onClick={() => setShowAddModal(true)} size="sm">
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
                  <DropdownMenu.DropdownMenuItem onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} className="py-3">
                    <div className="flex items-center gap-3">
                      {theme === 'dark' ? (
                        <>
                          <div className="h-4 w-4 rounded-full bg-yellow-500 flex items-center justify-center">
                            <span className="text-xs">☀️</span>
                          </div>
                          Light Mode
                        </>
                      ) : (
                        <>
                          <div className="h-4 w-4 rounded-full bg-gray-800 flex items-center justify-center">
                            <span className="text-xs">🌙</span>
                          </div>
                          Dark Mode
                        </>
                      )}
                    </div>
                  </DropdownMenu.DropdownMenuItem>
                  <DropdownMenu.DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600 py-3">
                    <LogOut className="mr-3 h-4 w-4" />
                    Logout
                  </DropdownMenu.DropdownMenuItem>
                </DropdownMenu.DropdownMenuContent>
              </DropdownMenu.DropdownMenu>
            </div>
          </div>
        </div>
        {isOffline && (
          <div className="bg-yellow-100 dark:bg-yellow-900/20 border-t border-yellow-200 dark:border-yellow-800 px-4 py-2">
            <p className="text-sm text-yellow-800 dark:text-yellow-200 text-center">
              You&apos;re offline. Some features may not be available.
            </p>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto p-4">
        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="past">Past</TabsTrigger>
            <TabsTrigger value="releases">Releases</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upcoming" className="space-y-6">
            <h2 className="sr-only">Upcoming Shows</h2>
            
            {/* RSVP Filter */}
            {loading ? (
              <RSVPFilterSkeleton />
            ) : (
              <RSVPFilter
                selectedStatusFilters={selectedStatusFilters}
                selectedPeopleFilters={selectedPeopleFilters}
                availableAttendees={availableAttendees}
                onStatusFilterToggle={handleStatusFilterToggle}
                onPeopleFilterToggle={handlePeopleFilterToggle}
                filteredShowsCount={filteredUpcomingShows.length}
                onClearAllFilters={handleClearAllFilters}
              />
            )}
            
            {loading ? (
              <>
                <ShowCardSkeleton />
                <ShowCardSkeleton />
                <ShowCardSkeleton />
              </>
            ) : filteredUpcomingShows.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                {upcomingShows.length === 0 
                  ? 'No upcoming shows' 
                  : 'No shows match the selected filters'
                }
              </p>
            ) : (
              filteredUpcomingShows.map((show) => (
                <ShowCard 
                  key={show.id} 
                  show={show} 
                  isPast={false} 
                  rsvps={rsvpsData[show.id] || { going: [], maybe: [], not_going: [] }}
                  onEdit={handleEditShow}
                  onDelete={handleDeleteShow}
                  onRSVPUpdate={() => updateRSVPs(show.id)}
                />
              ))
            )}
          </TabsContent>
          
          <TabsContent value="past" className="space-y-4">
            <h2 className="sr-only">Past Shows</h2>
            {loading ? (
              <>
                <ShowCardSkeleton />
                <ShowCardSkeleton />
                <ShowCardSkeleton />
              </>
            ) : pastShows.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No past shows</p>
            ) : (
              <>
                {pastShows.map((show) => (
                  <ShowCard 
                    key={show.id} 
                    show={show} 
                    isPast={true} 
                    rsvps={rsvpsData[show.id] || { going: [], maybe: [], not_going: [] }}
                    onEdit={handleEditShow}
                    onDelete={handleDeleteShow}
                    onRSVPUpdate={() => updateRSVPs(show.id)}
                  />
                ))}
                
                {/* Infinite scroll loading indicator */}
                {loadingMore && (
                  <div className="flex justify-center py-4">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-muted-foreground"></div>
                      <span>Loading more shows...</span>
                    </div>
                  </div>
                )}
                
                {/* Infinite scroll sentinel */}
                <div ref={sentinelRef} className="h-4" />
              </>
            )}
          </TabsContent>
          
          <TabsContent value="releases" className="space-y-6">
            <ReleasesFeed userName={userName} weeks={12} />
          </TabsContent>
        </Tabs>
      </main>

      {/* Add Show Modal */}
      <AddShowModal
        open={showAddModal}
        onOpenChange={setShowAddModal}
        onShowAdded={handleShowAdded}
      />

      {/* Edit Show Modal */}
      <EditShowModal
        open={showEditModal}
        onOpenChange={setShowEditModal}
        show={editingShow}
        onShowUpdated={handleShowUpdated}
        isPast={editingShow ? new Date(editingShow.date_time) < new Date() : false}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        showTitle={deletingShowTitle}
        onConfirm={confirmDeleteShow}
      />

      {/* PWA Features */}
      <PWAFeatures onRefresh={fetchShows} />
    </div>
  )
}