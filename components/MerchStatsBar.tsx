'use client'

import { Card, CardContent } from '@/components/ui/card'
import { MerchStats } from '@/lib/types'
import { formatPriceMinor, getCategoryEmoji, getCategoryLabel } from '@/lib/merch'
import { ShoppingBag, Star, Sparkles, DollarSign, Trophy } from 'lucide-react'

interface MerchStatsBarProps {
  stats: MerchStats | null
  loading: boolean
}

export function MerchStatsBar({ stats, loading }: MerchStatsBarProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 animate-pulse">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-3 sm:p-4">
              <div className="h-3 bg-muted rounded w-16 mb-2"></div>
              <div className="h-6 bg-muted rounded w-10"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (!stats || stats.totalItems === 0) return null

  const statCards = [
    {
      label: 'Items',
      value: String(stats.totalItems),
      icon: <ShoppingBag className="w-4 h-4 text-blue-500" />,
    },
    {
      label: 'Spent',
      value: stats.totalSpent > 0 ? formatPriceMinor(stats.totalSpent) : '—',
      icon: <DollarSign className="w-4 h-4 text-green-500" />,
    },
    {
      label: 'Top Artist',
      value: stats.topArtist ? stats.topArtist.name : '—',
      sub: stats.topArtist ? `${stats.topArtist.count} items` : undefined,
      icon: <Trophy className="w-4 h-4 text-yellow-500" />,
    },
    {
      label: 'Special',
      value: `${stats.signedCount} signed · ${stats.limitedEditionCount} limited`,
      icon: <Star className="w-4 h-4 text-purple-500" />,
    },
  ]

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
      {statCards.map((stat) => (
        <Card key={stat.label}>
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center gap-1.5 mb-1">
              {stat.icon}
              <span className="text-xs text-muted-foreground">{stat.label}</span>
            </div>
            <p className="text-sm sm:text-base font-semibold text-foreground truncate">{stat.value}</p>
            {stat.sub && (
              <p className="text-xs text-muted-foreground">{stat.sub}</p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
