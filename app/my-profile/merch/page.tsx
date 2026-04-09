'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { PageHeader } from '@/components/PageHeader'
import { ProfileTabs } from '@/components/ProfileTabs'
import { MerchCard } from '@/components/MerchCard'
import { MerchCardSkeleton } from '@/components/MerchCardSkeleton'
import { MerchEmptyState } from '@/components/MerchEmptyState'
import { MerchErrorState } from '@/components/MerchErrorState'
import { MerchFilters } from '@/components/MerchFilters'
import { MerchStatsBar } from '@/components/MerchStatsBar'
import { AddMerchModal } from '@/components/AddMerchModal'
import { EditMerchModal } from '@/components/EditMerchModal'
import { DeleteMerchDialog } from '@/components/DeleteMerchDialog'
import { useToast } from '@/components/ui/toast'
import { Button } from '@/components/ui/button'
import { Plus, ShoppingBag } from 'lucide-react'
import { MerchItem, MerchStats } from '@/lib/types'
import { formatNameForDisplay } from '@/lib/validation'

export default function MerchPage() {
  const [mounted, setMounted] = useState(false)
  const [authenticated, setAuthenticated] = useState(false)
  const [userName, setUserName] = useState<string | null>(null)
  const [items, setItems] = useState<MerchItem[]>([])
  const [allItems, setAllItems] = useState<MerchItem[]>([])
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

  const handleLogout = () => {
    localStorage.removeItem('userName')
    setAuthenticated(false)
    setUserName(null)
    router.push('/')
  }

  const fetchMerch = useCallback(async () => {
    if (!userName) return
    setLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams({ user: userName })

      const res = await fetch(`/api/merch?${params}`)
      if (!res.ok) throw new Error('Failed to load merch')

      const data = await res.json()
      const all: MerchItem[] = data.items || []
      setAllItems(all)

      // Apply filters client-side
      let filtered = all
      if (selectedCategory) filtered = filtered.filter(i => i.category === selectedCategory)
      if (selectedArtist) filtered = filtered.filter(i => i.artist_name === selectedArtist)
      if (signedOnly) filtered = filtered.filter(i => i.is_signed)
      if (customOnly) filtered = filtered.filter(i => i.is_custom)
      if (showLinkedOnly) filtered = filtered.filter(i => i.show_id)

      setItems(filtered)

      // Extract unique artist names from all items
      const artists = [...new Set(all.map(i => i.artist_name))] as string[]
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
    router.push('/')
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <PageHeader
        title="My Profile"
        subtitle={userName ? `Welcome, ${formatNameForDisplay(userName)}` : undefined}
        backHref="/"
        showHome
        showLogout
        onLogout={handleLogout}
        extraButtons={
          <Button onClick={() => setShowAddModal(true)} size="sm">
            <Plus className="w-4 h-4 mr-1" />
            Add Item
          </Button>
        }
      />
      <ProfileTabs />

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
          availableCategories={[...new Set(allItems.map(i => i.category))]}
          availableArtists={availableArtists}
          hasSigned={allItems.some(i => i.is_signed)}
          hasCustom={allItems.some(i => i.is_custom)}
          hasShowLinked={allItems.some(i => i.show_id)}
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
