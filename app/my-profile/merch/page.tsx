'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { PageHeader } from '@/components/PageHeader'
import { MerchCard } from '@/components/MerchCard'
import { MerchCardSkeleton } from '@/components/MerchCardSkeleton'
import { MerchEmptyState } from '@/components/MerchEmptyState'
import { MerchErrorState } from '@/components/MerchErrorState'
import { MerchFilters } from '@/components/MerchFilters'
import { MerchStatsBar } from '@/components/MerchStatsBar'
import { AddMerchModal } from '@/components/AddMerchModal'
import { EditMerchModal } from '@/components/EditMerchModal'
import { DeleteMerchDialog } from '@/components/DeleteMerchDialog'
import { PasswordGate } from '@/components/PasswordGate'
import { useToast } from '@/components/ui/toast'
import { Button } from '@/components/ui/button'
import { Plus, ShoppingBag } from 'lucide-react'
import { MerchItem, MerchStats } from '@/lib/types'

export default function MerchPage() {
  const [mounted, setMounted] = useState(false)
  const [authenticated, setAuthenticated] = useState(false)
  const [userName, setUserName] = useState<string | null>(null)
  const [items, setItems] = useState<MerchItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState<MerchStats | null>(null)
  const [statsLoading, setStatsLoading] = useState(false)

  // Filters
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedArtist, setSelectedArtist] = useState('')
  const [signedOnly, setSignedOnly] = useState(false)
  const [customOnly, setCustomOnly] = useState(false)
  const [showLinkedOnly, setShowLinkedOnly] = useState(false)
  const [availableArtists, setAvailableArtists] = useState<string[]>([])

  // Modals
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingItem, setEditingItem] = useState<MerchItem | null>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [deletingItemId, setDeletingItemId] = useState<string | null>(null)
  const [deletingItemName, setDeletingItemName] = useState('')
  const [deleting, setDeleting] = useState(false)

  const router = useRouter()
  const { showToast } = useToast()

  useEffect(() => {
    setMounted(true)
    const storedName = localStorage.getItem('userName')
    if (storedName) {
      setUserName(storedName)
      setAuthenticated(true)
    }
  }, [])

  const fetchMerch = useCallback(async () => {
    if (!userName) return
    setLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams({ user: userName })
      if (selectedCategory) params.set('category', selectedCategory)
      if (selectedArtist) params.set('artist', selectedArtist)
      if (signedOnly) params.set('signed', 'true')

      const res = await fetch(`/api/merch?${params}`)
      if (!res.ok) throw new Error('Failed to load merch')

      const data = await res.json()
      let filteredItems = data.items || []

      if (showLinkedOnly) {
        filteredItems = filteredItems.filter((item: MerchItem) => item.show_id)
      }

      // Client-side filter for custom items
      if (customOnly) {
        filteredItems = filteredItems.filter((item: MerchItem) => item.is_custom)
      }

      setItems(filteredItems)

      // Extract unique artist names for filter
      const artists = [...new Set(filteredItems.map((item: MerchItem) => item.artist_name))] as string[]
      setAvailableArtists(artists.sort())
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load merch')
    } finally {
      setLoading(false)
    }
  }, [userName, selectedCategory, selectedArtist, signedOnly, customOnly, showLinkedOnly])

  const fetchStats = useCallback(async () => {
    if (!userName) return
    setStatsLoading(true)

    try {
      const res = await fetch(`/api/merch/stats?user=${userName}`)
      if (res.ok) {
        const data = await res.json()
        setStats(data)
      }
    } catch {
      // Stats are non-critical, don't show error
    } finally {
      setStatsLoading(false)
    }
  }, [userName])

  useEffect(() => {
    if (authenticated && userName) {
      fetchMerch()
      fetchStats()
    }
  }, [authenticated, userName, fetchMerch, fetchStats])

  const handleEdit = (item: MerchItem) => {
    setEditingItem(item)
    setShowEditModal(true)
  }

  const handleDeletePrompt = (itemId: string, itemName: string) => {
    setDeletingItemId(itemId)
    setDeletingItemName(itemName)
    setShowDeleteDialog(true)
  }

  const handleDeleteConfirm = async () => {
    if (!deletingItemId) return
    setDeleting(true)

    try {
      const res = await fetch(`/api/merch/${deletingItemId}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete item')

      showToast({ title: 'Item deleted', type: 'success' })
      setShowDeleteDialog(false)
      setDeletingItemId(null)
      fetchMerch()
      fetchStats()
    } catch (err) {
      showToast({ title: 'Error', description: 'Failed to delete item', type: 'error' })
    } finally {
      setDeleting(false)
    }
  }

  const handleItemAdded = () => {
    fetchMerch()
    fetchStats()
  }

  const handleItemUpdated = () => {
    fetchMerch()
    fetchStats()
  }

  const clearAllFilters = () => {
    setSelectedCategory('')
    setSelectedArtist('')
    setSignedOnly(false)
    setCustomOnly(false)
    setShowLinkedOnly(false)
  }

  if (!mounted) return null

  if (!authenticated) {
    return (
      <PasswordGate onSuccess={(name: string) => {
        setUserName(name)
        setAuthenticated(true)
      }} />
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <PageHeader
        title="My Merch"
        titleIcon={<ShoppingBag className="w-6 h-6" />}
        backHref="/my-profile"
        showHome
        extraButtons={
          <Button onClick={() => setShowAddModal(true)} size="sm">
            <Plus className="w-4 h-4 mr-1" />
            Add Item
          </Button>
        }
      />

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-4">
        {/* Stats */}
        <MerchStatsBar stats={stats} loading={statsLoading} />

        {/* Filters */}
        <MerchFilters
          selectedCategory={selectedCategory}
          selectedArtist={selectedArtist}
          signedOnly={signedOnly}
          customOnly={customOnly}
          showLinkedOnly={showLinkedOnly}
          availableArtists={availableArtists}
          filteredCount={items.length}
          onCategoryChange={setSelectedCategory}
          onArtistChange={setSelectedArtist}
          onSignedToggle={setSignedOnly}
          onCustomToggle={setCustomOnly}
          onShowLinkedToggle={setShowLinkedOnly}
          onClearAll={clearAllFilters}
        />

        {/* Content */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <MerchCardSkeleton key={i} />
            ))}
          </div>
        ) : error ? (
          <MerchErrorState error={error} onRetry={fetchMerch} />
        ) : items.length === 0 ? (
          <MerchEmptyState onAddItem={() => setShowAddModal(true)} />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {items.map(item => (
              <MerchCard
                key={item.id}
                item={item}
                onEdit={handleEdit}
                onDelete={handleDeletePrompt}
              />
            ))}
          </div>
        )}
      </main>

      {/* Modals */}
      <AddMerchModal
        open={showAddModal}
        onOpenChange={setShowAddModal}
        onItemAdded={handleItemAdded}
      />

      <EditMerchModal
        open={showEditModal}
        onOpenChange={setShowEditModal}
        item={editingItem}
        onItemUpdated={handleItemUpdated}
      />

      <DeleteMerchDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        itemName={deletingItemName}
        onConfirm={handleDeleteConfirm}
        loading={deleting}
      />
    </div>
  )
}
