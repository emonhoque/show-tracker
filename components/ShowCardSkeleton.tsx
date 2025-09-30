import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'

export function ShowCardSkeleton() {
  return (
    <Card className="w-full mb-6 overflow-hidden">
      {/* Header Section */}
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1 min-w-0 space-y-2">
            <div className="h-6 bg-muted rounded w-3/4 animate-pulse"></div>
            <div className="h-5 bg-muted rounded w-1/2 animate-pulse"></div>
            <div className="h-4 bg-muted rounded w-2/3 animate-pulse"></div>
          </div>
          <div className="h-8 w-8 bg-muted rounded animate-pulse flex-shrink-0"></div>
        </div>
      </CardHeader>

      {/* Main Content Section */}
      <CardContent className="space-y-6">
        {/* Poster Image Skeleton */}
        <div className="w-full -mx-6 h-48 bg-muted animate-pulse"></div>

        {/* Artists Section Skeleton */}
        <div className="space-y-4">
          <div className="space-y-3">
            <div className="h-4 bg-muted rounded w-20 animate-pulse"></div>
            <div className="flex flex-wrap gap-2">
              <div className="h-10 bg-muted rounded-lg w-24 animate-pulse"></div>
              <div className="h-10 bg-muted rounded-lg w-32 animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* RSVPs Section Skeleton */}
        <div className="space-y-3">
          <div className="h-4 bg-muted rounded w-16 animate-pulse"></div>
          <div className="space-y-2">
            <div className="h-4 bg-muted rounded w-1/3 animate-pulse"></div>
            <div className="h-4 bg-muted rounded w-1/4 animate-pulse"></div>
          </div>
        </div>
      </CardContent>

      {/* Footer Section */}
      <CardFooter className="flex-col gap-4 pt-0">
        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2 w-full">
          <div className="h-8 bg-muted rounded w-24 animate-pulse"></div>
          <div className="h-8 bg-muted rounded w-20 animate-pulse"></div>
          <div className="h-8 bg-muted rounded w-24 animate-pulse"></div>
        </div>

        {/* RSVP Buttons */}
        <div className="w-full space-y-3">
          <div className="h-4 bg-muted rounded w-20 animate-pulse"></div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <div className="h-8 bg-muted rounded w-full animate-pulse"></div>
            <div className="h-8 bg-muted rounded w-full animate-pulse"></div>
            <div className="h-8 bg-muted rounded w-full animate-pulse"></div>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}
