'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Filter, ChevronDown } from 'lucide-react'
import { formatNameForDisplay } from '@/lib/validation'

interface RSVPFilterProps {
  selectedStatusFilters: Set<string>
  selectedPeopleFilters: Set<string>
  availableAttendees: string[]
  onStatusFilterToggle: (filter: string) => void
  onPeopleFilterToggle: (filter: string) => void
  filteredShowsCount: number
  onClearAllFilters: () => void
}

export function RSVPFilter({
  selectedStatusFilters,
  selectedPeopleFilters,
  availableAttendees,
  onStatusFilterToggle,
  onPeopleFilterToggle,
  filteredShowsCount,
  onClearAllFilters
}: RSVPFilterProps) {
  const [filtersCollapsed, setFiltersCollapsed] = useState(true)
  const [isAnimating, setIsAnimating] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)
  const [contentHeight, setContentHeight] = useState<number | undefined>(undefined)

  // Measure content height when component mounts or when filters change
  useEffect(() => {
    if (contentRef.current) {
      const height = contentRef.current.scrollHeight
      setContentHeight(height)
    }
  }, [selectedStatusFilters, selectedPeopleFilters, availableAttendees])

  const handleToggle = () => {
    if (isAnimating) return
    
    setIsAnimating(true)
    setFiltersCollapsed(!filtersCollapsed)
    
    // Reset animation state after transition completes
    setTimeout(() => {
      setIsAnimating(false)
    }, 300)
  }

  return (
    <Card>
      <CardContent className={filtersCollapsed ? "p-2 sm:p-3" : "p-3 sm:p-4"}>
        <div className={filtersCollapsed ? "space-y-0" : "space-y-2 sm:space-y-3"}>
          {/* Compact header */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              <h2 className="text-sm sm:text-base font-semibold text-foreground">Filter Shows</h2>
            </div>
            
            <button
              onClick={handleToggle}
              disabled={isAnimating}
              className="flex items-center justify-center gap-1 text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors py-1 px-2 rounded hover:bg-muted/50 disabled:opacity-50 min-h-[32px] sm:min-h-[36px]"
            >
              <span className="text-xs sm:text-sm">
                {filtersCollapsed ? 'Show Filters' : 'Hide Filters'}
              </span>
              <div className={`transition-transform duration-300 ${filtersCollapsed ? 'rotate-0' : 'rotate-180'}`}>
                <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4" />
              </div>
            </button>
          </div>
          
          <div
            ref={contentRef}
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              filtersCollapsed 
                ? 'max-h-0 opacity-0' 
                : 'max-h-[1000px] opacity-100'
            }`}
            style={{
              maxHeight: filtersCollapsed ? '0px' : contentHeight ? `${contentHeight}px` : 'none'
            }}
          >
            <div className="space-y-2 sm:space-y-3 pt-2">
              {/* RSVP Status Filters */}
              <div className="space-y-1 sm:space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs sm:text-sm font-medium text-foreground">Status:</span>
                  {!selectedStatusFilters.has('all') && selectedStatusFilters.size > 0 && (
                    <span className="text-xs text-primary">
                      ({selectedStatusFilters.size})
                    </span>
                  )}
                </div>
                
                <div className="grid grid-cols-4 sm:flex sm:flex-wrap gap-1 sm:gap-2">
                  <Button
                    variant={selectedStatusFilters.has('all') ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => onStatusFilterToggle('all')}
                    className="h-7 sm:h-9 text-xs sm:text-sm px-2 transition-all duration-200 hover:scale-105"
                  >
                    All
                  </Button>
                  
                  <Button
                    variant={selectedStatusFilters.has('going') ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => onStatusFilterToggle('going')}
                    className="h-7 sm:h-9 text-xs sm:text-sm px-2 transition-all duration-200 hover:scale-105"
                  >
                    Going
                  </Button>
                  
                  <Button
                    variant={selectedStatusFilters.has('maybe') ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => onStatusFilterToggle('maybe')}
                    className="h-7 sm:h-9 text-xs sm:text-sm px-2 transition-all duration-200 hover:scale-105"
                  >
                    Maybe
                  </Button>
                  
                  <Button
                    variant={selectedStatusFilters.has('not_going') ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => onStatusFilterToggle('not_going')}
                    className="h-7 sm:h-9 text-xs sm:text-sm px-2 transition-all duration-200 hover:scale-105"
                  >
                    Not Going
                  </Button>
                </div>
              </div>

              {/* People Filters */}
              <div className="space-y-1 sm:space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs sm:text-sm font-medium text-foreground">People:</span>
                  {!selectedPeopleFilters.has('all') && selectedPeopleFilters.size > 0 && (
                    <span className="text-xs text-primary">
                      ({selectedPeopleFilters.size})
                    </span>
                  )}
                </div>
                
                <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-1 sm:gap-2">
                  <Button
                    variant={selectedPeopleFilters.has('all') ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => onPeopleFilterToggle('all')}
                    className="h-7 sm:h-9 text-xs sm:text-sm px-2 transition-all duration-200 hover:scale-105"
                  >
                    Everyone
                  </Button>
                  
                  {/* Individual Attendee Filters */}
                  {availableAttendees.map(attendee => (
                    <Button
                      key={attendee}
                      variant={selectedPeopleFilters.has(attendee) ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => onPeopleFilterToggle(attendee)}
                      className="h-7 sm:h-9 text-xs sm:text-sm px-2 transition-all duration-200 hover:scale-105"
                    >
                      {formatNameForDisplay(attendee)}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col gap-1">
            <div className="text-xs sm:text-sm text-muted-foreground flex items-center justify-between">
              <span>
                {filteredShowsCount} show{filteredShowsCount !== 1 ? 's' : ''} found
                {(!selectedStatusFilters.has('all') || !selectedPeopleFilters.has('all')) && (
                  <span className="ml-1 text-primary">
                    <span className="hidden sm:inline">(Status: {selectedStatusFilters.has('all') ? 'All' : selectedStatusFilters.size} | People: {selectedPeopleFilters.has('all') ? 'All' : selectedPeopleFilters.size})</span>
                    <span className="sm:hidden">(S:{selectedStatusFilters.has('all') ? 'All' : selectedStatusFilters.size} P:{selectedPeopleFilters.has('all') ? 'All' : selectedPeopleFilters.size})</span>
                  </span>
                )}
              </span>
              
              {(!selectedStatusFilters.has('all') || !selectedPeopleFilters.has('all')) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClearAllFilters}
                  className="text-xs sm:text-sm text-muted-foreground hover:text-foreground h-6 sm:h-8 px-2"
                >
                  <span className="hidden sm:inline">Clear All</span>
                  <span className="sm:hidden">Clear</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
