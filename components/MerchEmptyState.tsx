'use client'

import { ShoppingBag } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface MerchEmptyStateProps {
  onAddItem?: () => void
}

export function MerchEmptyState({ onAddItem }: MerchEmptyStateProps) {
  return (
    <Card>
      <CardContent className="p-6 text-center">
        <ShoppingBag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2">No merch items yet</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Start tracking your concert merch collection by adding your first item.
        </p>
        {onAddItem && (
          <Button onClick={onAddItem}>Add First Item</Button>
        )}
      </CardContent>
    </Card>
  )
}
