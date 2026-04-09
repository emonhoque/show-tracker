'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { ImageModal } from '@/components/ImageModal'
import { getCategoryLabel, getCategoryEmoji, formatPriceMinor } from '@/lib/merch'
import { formatUserTime } from '@/lib/time'
import { MerchItem } from '@/lib/types'
import { Edit, Trash2, MoreVertical, Star, Sparkles, Palette } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'

interface MerchCardProps {
  item: MerchItem
  onEdit?: (item: MerchItem) => void
  onDelete?: (itemId: string, itemName: string) => void
}

export function MerchCard({ item, onEdit, onDelete }: MerchCardProps) {
  const [imageModalOpen, setImageModalOpen] = useState(false)

  const primaryImage = item.images && item.images.length > 0 ? item.images[0].image_url : null

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'shirt': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
      case 'hoodie': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
      case 'vinyl': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300'
      case 'poster': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
      case 'hat': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
      case 'pin': return 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300'
      case 'sticker': return 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300'
      case 'flag': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
      case 'jersey': return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300'
      case 'jacket': return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300'
      case 'accessory': return 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
    }
  }

  return (
    <>
      <Card className="w-full overflow-hidden hover:shadow-md transition-shadow">
        <CardContent className="p-0">
          {/* Image Section */}
          {primaryImage ? (
            <div
              className="relative w-full aspect-square bg-muted cursor-pointer overflow-hidden"
              onClick={() => setImageModalOpen(true)}
            >
              <Image
                src={primaryImage}
                alt={item.name}
                fill
                className="object-cover hover:scale-105 transition-transform duration-200"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              {item.images && item.images.length > 1 && (
                <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
                  +{item.images.length - 1}
                </div>
              )}
              {/* Badges overlay */}
              <div className="absolute top-2 left-2 flex gap-1">
                {item.is_signed && (
                  <span className="bg-yellow-500/90 text-white text-xs px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                    <Star className="w-3 h-3" /> Signed
                  </span>
                )}
                {item.is_limited_edition && (
                  <span className="bg-purple-500/90 text-white text-xs px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                    <Sparkles className="w-3 h-3" /> Limited
                  </span>
                )}
                {item.is_custom && (
                  <span className="bg-teal-500/90 text-white text-xs px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                    <Palette className="w-3 h-3" /> Custom
                  </span>
                )}
              </div>
            </div>
          ) : (
            <div className="relative w-full aspect-square bg-muted flex items-center justify-center">
              <span className="text-4xl">{getCategoryEmoji(item.category)}</span>
              {/* Badges overlay */}
              <div className="absolute top-2 left-2 flex gap-1">
                {item.is_signed && (
                  <span className="bg-yellow-500/90 text-white text-xs px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                    <Star className="w-3 h-3" /> Signed
                  </span>
                )}
                {item.is_limited_edition && (
                  <span className="bg-purple-500/90 text-white text-xs px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                    <Sparkles className="w-3 h-3" /> Limited
                  </span>
                )}
                {item.is_custom && (
                  <span className="bg-teal-500/90 text-white text-xs px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                    <Palette className="w-3 h-3" /> Custom
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Details Section */}
          <div className="p-3 space-y-2">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-sm text-foreground leading-snug line-clamp-2">{item.name}</h3>
                <p className="text-sm text-muted-foreground truncate">{item.artist_name}</p>
              </div>
              {(onEdit || onDelete) && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="p-1 rounded-md hover:bg-muted transition-colors flex-shrink-0">
                      <MoreVertical className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {onEdit && (
                      <DropdownMenuItem onClick={() => onEdit(item)}>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                    )}
                    {onDelete && (
                      <DropdownMenuItem
                        variant="destructive"
                        onClick={() => onDelete(item.id, item.name)}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>

            <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-medium rounded-full ${getCategoryColor(item.category)}`}>
              <span className="w-4 text-center leading-none">{getCategoryEmoji(item.category)}</span>
              {getCategoryLabel(item.category)}
            </span>

            {item.show && (
              <div className="flex items-start gap-1.5 text-xs text-muted-foreground leading-snug">
                <span className="w-4 text-center shrink-0 pt-px">🎪</span>
                <span className="line-clamp-2">{item.show.title} — {item.show.venue}</span>
              </div>
            )}

            <div className="flex items-center justify-between">
              {item.purchase_price_minor != null && item.purchase_price_minor > 0 ? (
                <span className="text-sm font-semibold text-foreground">{formatPriceMinor(item.purchase_price_minor)}</span>
              ) : (
                <span />
              )}
              {item.quantity > 1 && (
                <span className="text-xs text-muted-foreground">Qty: {item.quantity}</span>
              )}
            </div>

            {item.variant && (
              <p className="text-xs text-muted-foreground">{item.variant}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {primaryImage && (
        <ImageModal
          open={imageModalOpen}
          onOpenChange={setImageModalOpen}
          src={primaryImage}
          alt={item.name}
          images={item.images?.map(img => img.image_url)}
        />
      )}
    </>
  )
}
