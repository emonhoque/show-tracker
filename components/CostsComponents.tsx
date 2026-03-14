'use client'

import React, { useState, useRef, useCallback, useEffect } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/toast'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { AlertTriangle, Pencil, Trash2, Plus, X, Check, ChevronDown, Music, DollarSign, Users } from 'lucide-react'
import { ImageModal } from '@/components/ImageModal'
import {
  COST_CATEGORIES,
  getCategoryLabel,
  getCategoryEmoji,
  parseAmountToMinorUnits,
  formatMinorUnits,
  formatMinorToDecimal,
  type ShowCost,
  type CostCategory,
} from '@/lib/costs'
import { formatNameForDisplay } from '@/lib/validation'
import { useDemoMode } from '@/lib/demo-context'

interface AddCostRowProps {
  showId: string
  userName: string
  onCostAdded: (cost: ShowCost) => void
}

export function AddCostRow({ showId, userName, onCostAdded }: AddCostRowProps) {
  const [category, setCategory] = useState<string>('ticket')
  const [amount, setAmount] = useState('')
  const [note, setNote] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const amountRef = useRef<HTMLInputElement>(null)
  const { showToast } = useToast()
  const { apiFetch } = useDemoMode()

  const handleSubmit = useCallback(async () => {
    setError(null)

    const minorUnits = parseAmountToMinorUnits(amount)
    if (minorUnits === null) {
      setError('Enter a valid positive amount')
      return
    }

    setSubmitting(true)
    try {
      const res = await apiFetch(`/api/shows/${showId}/costs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user: userName,
          category,
          amount_minor: minorUnits,
          note: note.trim() || null,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to add cost')
      }

      const newCost = await res.json()
      onCostAdded(newCost)
      showToast({ title: 'Cost added', type: 'success' })

      setAmount('')
      setNote('')
      setError(null)
      setTimeout(() => amountRef.current?.focus(), 50)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to add cost'
      setError(message)
      showToast({ title: 'Error', description: message, type: 'error' })
    } finally {
      setSubmitting(false)
    }
  }, [amount, category, note, showId, userName, onCostAdded, showToast])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSubmit()
    }
    if (e.key === 'Escape') {
      setExpanded(false)
      setAmount('')
      setNote('')
      setError(null)
    }
  }

  if (!expanded) {
    return (
      <button
        onClick={() => {
          setExpanded(true)
          setTimeout(() => amountRef.current?.focus(), 50)
        }}
        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-md transition-colors border border-dashed border-border"
      >
        <Plus className="w-4 h-4" />
        Add cost
      </button>
    )
  }

  return (
    <div className="space-y-2 p-3 bg-muted/30 rounded-md border border-border" onKeyDown={handleKeyDown}>
      <div className="flex flex-col sm:flex-row gap-2">
        <select
          value={category}
          onChange={e => setCategory(e.target.value)}
          className="h-9 rounded-md border border-input bg-background px-2 text-sm min-w-[120px]"
        >
          {COST_CATEGORIES.map(cat => (
            <option key={cat.value} value={cat.value}>
              {cat.emoji} {cat.label}
            </option>
          ))}
        </select>

        <div className="flex-1 relative">
          <span className="absolute left-2 top-1/2 -translate-y-1/2 text-sm text-muted-foreground pointer-events-none">
            $
          </span>
          <Input
            ref={amountRef}
            type="text"
            inputMode="decimal"
            placeholder="0.00"
            value={amount}
            onChange={e => {
              setAmount(e.target.value)
              setError(null)
            }}
            className={`pl-6 ${error ? 'border-red-500' : ''}`}
            disabled={submitting}
          />
        </div>
      </div>

      <div className="flex gap-2">
        <Input
          type="text"
          placeholder="Note (optional)"
          value={note}
          onChange={e => setNote(e.target.value)}
          className="flex-1"
          maxLength={200}
          disabled={submitting}
        />

        <Button
          size="sm"
          onClick={handleSubmit}
          disabled={submitting || !amount}
          className="h-9"
        >
          {submitting ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
          ) : (
            <Check className="w-4 h-4" />
          )}
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => {
            setExpanded(false)
            setAmount('')
            setNote('')
            setError(null)
          }}
          className="h-9"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      {error && (
        <p className="text-xs text-red-500">{error}</p>
      )}
    </div>
  )
}

interface EditCostRowProps {
  cost: ShowCost
  userName: string
  onCostUpdated: (cost: ShowCost) => void
  onCancel: () => void
}

export function EditCostRow({ cost, userName, onCostUpdated, onCancel }: EditCostRowProps) {
  const [category, setCategory] = useState(cost.category)
  const [amount, setAmount] = useState(formatMinorToDecimal(cost.amount_minor))
  const [note, setNote] = useState(cost.note || '')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const { showToast } = useToast()
  const { apiFetch } = useDemoMode()

  const handleSubmit = useCallback(async () => {
    setError(null)

    const minorUnits = parseAmountToMinorUnits(amount)
    if (minorUnits === null) {
      setError('Enter a valid positive amount')
      return
    }

    setSubmitting(true)
    try {
      const res = await apiFetch(`/api/costs/${cost.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user: userName,
          category,
          amount_minor: minorUnits,
          note: note.trim() || null,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to update cost')
      }

      const updatedCost = await res.json()
      onCostUpdated(updatedCost)
      showToast({ title: 'Cost updated', type: 'success' })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update cost'
      setError(message)
      showToast({ title: 'Error', description: message, type: 'error' })
    } finally {
      setSubmitting(false)
    }
  }, [amount, category, note, cost.id, userName, onCostUpdated, showToast])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSubmit()
    }
    if (e.key === 'Escape') {
      onCancel()
    }
  }

  return (
    <div className="space-y-2 p-3 bg-blue-50/50 dark:bg-blue-950/20 rounded-md border border-blue-200 dark:border-blue-800" onKeyDown={handleKeyDown}>
      <div className="flex flex-col sm:flex-row gap-2">
        <select
          value={category}
          onChange={e => setCategory(e.target.value as CostCategory)}
          className="h-9 rounded-md border border-input bg-background px-2 text-sm min-w-[120px]"
        >
          {COST_CATEGORIES.map(cat => (
            <option key={cat.value} value={cat.value}>
              {cat.emoji} {cat.label}
            </option>
          ))}
        </select>

        <div className="flex-1 relative">
          <span className="absolute left-2 top-1/2 -translate-y-1/2 text-sm text-muted-foreground pointer-events-none">
            $
          </span>
          <Input
            type="text"
            inputMode="decimal"
            placeholder="0.00"
            value={amount}
            onChange={e => {
              setAmount(e.target.value)
              setError(null)
            }}
            className={`pl-6 ${error ? 'border-red-500' : ''}`}
            disabled={submitting}
          />
        </div>
      </div>

      <div className="flex gap-2">
        <Input
          type="text"
          placeholder="Note (optional)"
          value={note}
          onChange={e => setNote(e.target.value)}
          className="flex-1"
          maxLength={200}
          disabled={submitting}
        />

        <Button size="sm" onClick={handleSubmit} disabled={submitting || !amount} className="h-9">
          {submitting ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
          ) : (
            <Check className="w-4 h-4" />
          )}
        </Button>
        <Button size="sm" variant="ghost" onClick={onCancel} className="h-9">
          <X className="w-4 h-4" />
        </Button>
      </div>

      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}

interface DeleteCostDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  cost: ShowCost | null
  userName: string
  onDeleted: (costId: string) => void
}

export function DeleteCostDialog({ open, onOpenChange, cost, userName, onDeleted }: DeleteCostDialogProps) {
  const [loading, setLoading] = useState(false)
  const { showToast } = useToast()
  const { apiFetch } = useDemoMode()

  const handleConfirm = async () => {
    if (!cost) return
    setLoading(true)
    try {
      const res = await apiFetch(`/api/costs/${cost.id}?user=${encodeURIComponent(userName)}`, {
        method: 'DELETE',
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to delete cost')
      }

      onDeleted(cost.id)
      onOpenChange(false)
      showToast({ title: 'Cost deleted', type: 'success' })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete cost'
      showToast({ title: 'Error', description: message, type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-md mx-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <DialogTitle>Delete Cost</DialogTitle>
          </div>
          <DialogDescription>
            {cost && (
              <>
                Are you sure you want to delete this {getCategoryLabel(cost.category)} cost of{' '}
                <strong>{formatMinorUnits(cost.amount_minor)}</strong>?
                This action cannot be undone.
              </>
            )}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-row justify-end gap-2 pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleConfirm} disabled={loading}>
            {loading ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

interface CostItemRowProps {
  cost: ShowCost
  userName: string
  onUpdated: (cost: ShowCost) => void
  onDelete: (cost: ShowCost) => void
}

export function CostItemRow({ cost, userName, onUpdated, onDelete }: CostItemRowProps) {
  const [editing, setEditing] = useState(false)

  if (editing) {
    return (
      <EditCostRow
        cost={cost}
        userName={userName}
        onCostUpdated={(updated) => {
          onUpdated(updated)
          setEditing(false)
        }}
        onCancel={() => setEditing(false)}
      />
    )
  }

  return (
    <div className="px-3 py-2 text-sm hover:bg-muted/30 rounded-md group">
      <div className="flex items-center gap-2">
        <span className="text-base" title={getCategoryLabel(cost.category)}>
          {getCategoryEmoji(cost.category)}
        </span>
        <span className="text-muted-foreground min-w-[80px]">
          {getCategoryLabel(cost.category)}
        </span>
        <span className="font-medium flex-1">
          {formatMinorUnits(cost.amount_minor)}
        </span>
        <div className="flex gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => setEditing(true)}
            className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground"
            title="Edit"
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDelete(cost)}
            className="p-1 rounded hover:bg-red-100 dark:hover:bg-red-950/30 text-muted-foreground hover:text-red-600"
            title="Delete"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
      {cost.note && (
        <p className="text-xs text-muted-foreground mt-0.5 pl-1 break-words">
          {cost.note}
        </p>
      )}
    </div>
  )
}

interface ShowCostsCardProps {
  show: {
    id: string
    title: string
    date_time: string
    venue: string
    city: string
    poster_url?: string | null
    show_artists?: Array<{ artist: string; position: string; image_url?: string }>
    costs: ShowCost[]
    total_cents: number
    rsvps: {
      going: string[]
      maybe: string[]
      not_going: string[]
    }
  }
  isPast: boolean
  userName: string
  onCostsChanged: () => void
}

export function ShowCostsCard({ show, isPast, userName, onCostsChanged }: ShowCostsCardProps) {
  const [expanded, setExpanded] = useState(false)
  const [costs, setCosts] = useState<ShowCost[]>(show.costs)
  const [deletingCost, setDeletingCost] = useState<ShowCost | null>(null)
  const [posterOpen, setPosterOpen] = useState(false)

  useEffect(() => {
    setCosts(show.costs)
  }, [show.costs])

  const showDate = new Date(show.date_time)
  const dateStr = showDate.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
  const timeStr = showDate.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })

  const totalCents = costs.reduce((acc, cost) => acc + cost.amount_minor, 0)

  const handleCostAdded = (newCost: ShowCost) => {
    setCosts(prev => [...prev, newCost])
    onCostsChanged()
  }

  const handleCostUpdated = (updatedCost: ShowCost) => {
    setCosts(prev => prev.map(c => c.id === updatedCost.id ? updatedCost : c))
    onCostsChanged()
  }

  const handleCostDeleted = (costId: string) => {
    setCosts(prev => prev.filter(c => c.id !== costId))
    onCostsChanged()
  }

  const headliners = show.show_artists?.filter(a => a.position === 'Headliner') || []
  const supports = show.show_artists?.filter(a => a.position !== 'Headliner') || []
  const attendees = show.rsvps?.going || []

  return (
    <>
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center gap-3 p-4 text-left hover:bg-muted/30 transition-colors"
        >
          {show.poster_url ? (
            <div
              onClick={(e) => { e.stopPropagation(); setPosterOpen(true) }}
              className="flex-shrink-0 cursor-pointer"
            >
              <Image
                src={show.poster_url}
                alt={show.title}
                width={56}
                height={56}
                className="w-14 h-14 rounded-lg object-cover hover:opacity-80 transition-opacity"
              />
            </div>
          ) : (
            <div className="w-14 h-14 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
              <Music className="w-6 h-6 text-muted-foreground" />
            </div>
          )}

          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground truncate">{show.title}</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              {dateStr} · {timeStr}
            </p>
            <p className="text-xs text-muted-foreground">
              {show.venue}, {show.city}
            </p>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {totalCents > 0 && (
              <span className="text-sm font-medium text-muted-foreground">
                {formatMinorUnits(totalCents)}
              </span>
            )}
            <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`} />
          </div>
        </button>

        {expanded && (
          <div className="border-t border-border">
            {/* Artists */}
            {show.show_artists && show.show_artists.length > 0 && (
              <div className="px-4 py-3 border-b border-border">
                <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground mb-2">
                  <Music className="w-3.5 h-3.5" />
                  Artists
                </div>
                <div className="flex flex-wrap gap-2">
                  {headliners.map(a => (
                    <div key={a.artist} className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-primary/10 border border-primary/20">
                      {a.image_url ? (
                        <Image src={a.image_url} alt={a.artist} width={20} height={20} className="w-5 h-5 rounded-full object-cover" />
                      ) : (
                        <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center">
                          <Music className="w-2.5 h-2.5 text-muted-foreground" />
                        </div>
                      )}
                      <span className="text-sm font-medium">{a.artist}</span>
                    </div>
                  ))}
                  {supports.map(a => (
                    <div key={a.artist} className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-muted/50 border border-border">
                      {a.image_url ? (
                        <Image src={a.image_url} alt={a.artist} width={20} height={20} className="w-5 h-5 rounded-full object-cover" />
                      ) : (
                        <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center">
                          <Music className="w-2.5 h-2.5 text-muted-foreground" />
                        </div>
                      )}
                      <span className="text-sm text-muted-foreground">{a.artist}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Attendees */}
            {attendees.length > 0 && (
              <div className="px-4 py-3 border-b border-border">
                <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground mb-2">
                  <Users className="w-3.5 h-3.5" />
                  {isPast ? 'Who Went' : 'Who\'s Going'}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {attendees.map(name => (
                    <span
                      key={name}
                      className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-950/30 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-800/30"
                    >
                      {formatNameForDisplay(name)}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Costs */}
            <div className="px-4 py-3">
              <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground mb-2">
                <DollarSign className="w-3.5 h-3.5" />
                Costs
                {totalCents > 0 && (
                  <span className="ml-auto text-sm font-semibold text-foreground">
                    {formatMinorUnits(totalCents)}
                  </span>
                )}
              </div>

              <div className="space-y-1">
                {costs.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-1">
                    No costs recorded
                  </p>
                )}

                {costs.map(cost => (
                  <CostItemRow
                    key={cost.id}
                    cost={cost}
                    userName={userName}
                    onUpdated={handleCostUpdated}
                    onDelete={setDeletingCost}
                  />
                ))}

                <AddCostRow
                  showId={show.id}
                  userName={userName}
                  onCostAdded={handleCostAdded}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      <DeleteCostDialog
        open={!!deletingCost}
        onOpenChange={(open) => { if (!open) setDeletingCost(null) }}
        cost={deletingCost}
        userName={userName}
        onDeleted={handleCostDeleted}
      />

      {show.poster_url && (
        <ImageModal
          open={posterOpen}
          onOpenChange={setPosterOpen}
          src={show.poster_url}
          alt={`${show.title} poster`}
        />
      )}
    </>
  )
}
