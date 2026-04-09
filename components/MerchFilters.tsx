'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Filter, ChevronDown, X } from 'lucide-react'
import { MERCH_CATEGORIES, getCategoryEmoji } from '@/lib/merch'

interface MerchFiltersProps {
  selectedCategory: string
  selectedArtist: string
  signedOnly: boolean
  customOnly: boolean
  showLinkedOnly: boolean
  availableCategories: string[]
  availableArtists: string[]
  hasSigned: boolean
  hasCustom: boolean
  hasShowLinked: boolean
  filteredCount: number
  onCategoryChange: (category: string) => void
  onArtistChange: (artist: string) => void
  onSignedToggle: (signed: boolean) => void
  onCustomToggle: (custom: boolean) => void
  onShowLinkedToggle: (linked: boolean) => void
  onClearAll: () => void
}

export function MerchFilters({
  selectedCategory,
  selectedArtist,
  signedOnly,
  customOnly,
  showLinkedOnly,
  availableCategories,
  availableArtists,
  hasSigned,
  hasCustom,
  hasShowLinked,
  filteredCount,
  onCategoryChange,
  onArtistChange,
  onSignedToggle,
  onCustomToggle,
  onShowLinkedToggle,
  onClearAll,
}: MerchFiltersProps) {
  const [filtersCollapsed, setFiltersCollapsed] = useState(true)
  const [isAnimating, setIsAnimating] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)
  const [contentHeight, setContentHeight] = useState<number | undefined>(undefined)

  const hasActiveFilters = selectedCategory !== '' || selectedArtist !== '' || signedOnly || customOnly || showLinkedOnly

  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight)
    }
  }, [selectedCategory, selectedArtist, signedOnly, customOnly, showLinkedOnly, availableCategories, availableArtists, hasSigned, hasCustom, hasShowLinked])

  const handleToggle = () => {
    if (isAnimating) return
    setIsAnimating(true)
    setFiltersCollapsed(!filtersCollapsed)
    setTimeout(() => setIsAnimating(false), 300)
  }

  return (
    <Card>
      <CardContent className={filtersCollapsed ? 'p-2 sm:p-3' : 'p-3 sm:p-4'}>
        <div className={filtersCollapsed ? 'space-y-0' : 'space-y-2 sm:space-y-3'}>
          {/* Header */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              <h2 className="text-sm sm:text-base font-semibold text-foreground">Filter Merch</h2>
              {hasActiveFilters && (
                <span className="text-xs text-primary font-medium">Active</span>
              )}
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

          {/* Collapsible content */}
          <div
            ref={contentRef}
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              filtersCollapsed ? 'max-h-0 opacity-0' : 'max-h-[1000px] opacity-100'
            }`}
            style={{
              maxHeight: filtersCollapsed ? '0px' : contentHeight ? `${contentHeight}px` : 'none',
            }}
          >
            <div className="space-y-2 sm:space-y-3 pt-2">
              {/* Category filter */}
              <div className="space-y-1 sm:space-y-2">
                <span className="text-xs sm:text-sm font-medium text-foreground">Category:</span>
                <div className="grid grid-cols-3 sm:flex sm:flex-wrap gap-1 sm:gap-2">
                  <Button
                    variant={selectedCategory === '' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => onCategoryChange('')}
                    className="h-7 sm:h-9 text-xs sm:text-sm px-2 transition-all duration-200 hover:scale-105"
                  >
                    All
                  </Button>
                  {MERCH_CATEGORIES.filter(cat => availableCategories.includes(cat.value)).map(cat => (
                    <Button
                      key={cat.value}
                      variant={selectedCategory === cat.value ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => onCategoryChange(cat.value)}
                      className="h-7 sm:h-9 text-xs sm:text-sm px-2 transition-all duration-200 hover:scale-105"
                    >
                      {getCategoryEmoji(cat.value)} {cat.label}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Artist filter */}
              {availableArtists.length > 0 && (
                <div className="space-y-1 sm:space-y-2">
                  <span className="text-xs sm:text-sm font-medium text-foreground">Artist:</span>
                  <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-1 sm:gap-2">
                    <Button
                      variant={selectedArtist === '' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => onArtistChange('')}
                      className="h-7 sm:h-9 text-xs sm:text-sm px-2 transition-all duration-200 hover:scale-105"
                    >
                      All Artists
                    </Button>
                    {availableArtists.slice(0, 10).map(artist => (
                      <Button
                        key={artist}
                        variant={selectedArtist === artist ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => onArtistChange(artist)}
                        className="h-7 sm:h-9 text-xs sm:text-sm px-2 truncate max-w-[150px] transition-all duration-200 hover:scale-105"
                      >
                        {artist}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Toggle filters */}
              <div className="flex flex-wrap gap-2">
                {hasSigned && (
                  <Button
                    variant={signedOnly ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => onSignedToggle(!signedOnly)}
                    className="h-7 sm:h-9 text-xs sm:text-sm px-2 transition-all duration-200 hover:scale-105"
                  >
                    ⭐ Signed Only
                  </Button>
                )}
                {hasCustom && (
                  <Button
                    variant={customOnly ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => onCustomToggle(!customOnly)}
                    className="h-7 sm:h-9 text-xs sm:text-sm px-2 transition-all duration-200 hover:scale-105"
                  >
                    🎨 Custom Only
                  </Button>
                )}
                {hasShowLinked && (
                  <Button
                    variant={showLinkedOnly ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => onShowLinkedToggle(!showLinkedOnly)}
                    className="h-7 sm:h-9 text-xs sm:text-sm px-2 transition-all duration-200 hover:scale-105"
                  >
                    🎪 Linked to Show
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex flex-col gap-1">
            <div className="text-xs sm:text-sm text-muted-foreground flex items-center justify-between">
              <span>
                {filteredCount} item{filteredCount !== 1 ? 's' : ''}
                {hasActiveFilters && (
                  <span className="ml-1 text-primary">(filtered)</span>
                )}
              </span>
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClearAll}
                  className="text-xs sm:text-sm text-muted-foreground hover:text-foreground h-6 sm:h-8 px-2"
                >
                  <X className="w-3 h-3 mr-1" />
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
