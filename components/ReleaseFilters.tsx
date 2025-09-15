'use client'

import { RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AddArtistModal } from '@/components/AddArtistModal'
import { ArtistsListModal } from '@/components/ArtistsListModal'

interface ReleaseFiltersProps {
  onRefresh: () => void
  isRefreshing: boolean
  onArtistAdded?: () => void
  onArtistRemoved?: () => void
  userName?: string | null
}

export function ReleaseFilters({ 
  onRefresh, 
  isRefreshing, 
  onArtistAdded = () => {}, 
  onArtistRemoved = () => {},
  userName
}: ReleaseFiltersProps) {
  return (
    <div className="grid grid-cols-3 gap-2">
      <div>
        <AddArtistModal onArtistAdded={onArtistAdded} userName={userName} />
      </div>
      <div>
        <ArtistsListModal onArtistRemoved={onArtistRemoved} />
      </div>
      <div>
        <Button
          onClick={onRefresh}
          disabled={isRefreshing}
          variant="secondary"
          size="sm"
          className="w-full"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>
    </div>
  )
}
