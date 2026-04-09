'use client'

import { MerchStats } from '@/lib/types'
import { formatPriceMinor } from '@/lib/merch'
import { ShoppingBag, DollarSign, Star, Sparkles, Palette } from 'lucide-react'

interface MerchStatsBarProps {
  stats: MerchStats | null
  loading: boolean
}

export function MerchStatsBar({ stats, loading }: MerchStatsBarProps) {
  if (loading) {
    return (
      <div className="flex items-center gap-3 px-3 py-2 rounded-lg border border-border bg-card animate-pulse">
        <div className="h-4 bg-muted rounded w-32"></div>
      </div>
    )
  }

  if (!stats || stats.totalItems === 0) return null

  const chips: { icon: React.ReactNode; text: string }[] = [
    {
      icon: <ShoppingBag className="w-3.5 h-3.5 text-blue-500" />,
      text: `${stats.totalItems} item${stats.totalItems !== 1 ? 's' : ''}`,
    },
  ]

  if (stats.totalSpent > 0) {
    chips.push({
      icon: <DollarSign className="w-3.5 h-3.5 text-green-500" />,
      text: formatPriceMinor(stats.totalSpent),
    })
  }

  if (stats.topArtist) {
    chips.push({
      icon: <span className="text-xs">🏆</span>,
      text: stats.topArtist.name + (stats.topArtist.count > 1 ? ` (${stats.topArtist.count})` : ''),
    })
  }

  if (stats.signedCount > 0) {
    chips.push({
      icon: <Star className="w-3.5 h-3.5 text-yellow-500" />,
      text: `${stats.signedCount} signed`,
    })
  }

  if (stats.limitedEditionCount > 0) {
    chips.push({
      icon: <Sparkles className="w-3.5 h-3.5 text-purple-500" />,
      text: `${stats.limitedEditionCount} limited`,
    })
  }

  if (stats.customCount > 0) {
    chips.push({
      icon: <Palette className="w-3.5 h-3.5 text-pink-500" />,
      text: `${stats.customCount} custom`,
    })
  }

  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 px-3 py-2 rounded-lg border border-border bg-card text-sm">
      {chips.map((chip, i) => (
        <span key={i} className="flex items-center gap-1 text-foreground whitespace-nowrap">
          {chip.icon}
          <span>{chip.text}</span>
        </span>
      ))}
    </div>
  )
}
