'use client'

import { Card, CardContent } from '@/components/ui/card'

export function ReleaseCardSkeleton() {
  return (
    <Card className="w-full mb-4 animate-pulse">
      <CardContent className="p-4">
        {/* Mobile Layout Skeleton */}
        <div className="block md:hidden space-y-3">
          {/* Header with Title and Release Type */}
          <div className="flex justify-between items-start">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
          </div>

          {/* Album Art */}
          <div className="w-full max-w-xs mx-auto">
            <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
          </div>

          {/* Artist and Release Details */}
          <div>
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-1"></div>
            <div className="flex items-center gap-4">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="w-full h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>

        {/* Desktop Layout Skeleton */}
        <div className="hidden md:flex items-start gap-4">
          {/* Album Art */}
          <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-lg flex-shrink-0"></div>

          {/* Main Content */}
          <div className="flex-1 min-w-0 space-y-3">
            {/* Header with Title and Release Type */}
            <div className="flex justify-between items-start">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16 flex-shrink-0"></div>
            </div>

            {/* Artist and Release Details */}
            <div className="space-y-2">
              <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
              <div className="flex items-center gap-4">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="w-24 h-10 bg-gray-200 dark:bg-gray-700 rounded flex-shrink-0"></div>
        </div>
      </CardContent>
    </Card>
  )
}
