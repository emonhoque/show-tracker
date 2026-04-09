'use client'

import { Card, CardContent } from '@/components/ui/card'

export function MerchCardSkeleton() {
  return (
    <Card className="w-full overflow-hidden animate-pulse">
      <CardContent className="p-0">
        {/* Image Skeleton */}
        <div className="w-full aspect-square bg-muted"></div>

        {/* Details Skeleton */}
        <div className="p-3 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 space-y-1.5">
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-3.5 bg-muted rounded w-1/2"></div>
            </div>
            <div className="h-6 w-6 bg-muted rounded flex-shrink-0"></div>
          </div>
          <div className="h-5 bg-muted rounded-full w-20"></div>
          <div className="flex justify-between">
            <div className="h-3 bg-muted rounded w-12"></div>
            <div className="h-3 bg-muted rounded w-16"></div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
