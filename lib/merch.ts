import type { MerchCategory, MerchCondition, PurchaseSource } from '@/lib/types'

// ── Category definitions ────────────────────────────────
export const MERCH_CATEGORIES: { value: MerchCategory; label: string; emoji: string }[] = [
  { value: 'shirt', label: 'Shirt', emoji: '👕' },
  { value: 'hoodie', label: 'Hoodie', emoji: '🧥' },
  { value: 'vinyl', label: 'Vinyl', emoji: '💿' },
  { value: 'poster', label: 'Poster', emoji: '🖼️' },
  { value: 'hat', label: 'Hat', emoji: '🧢' },
  { value: 'pin', label: 'Pin', emoji: '📌' },
  { value: 'sticker', label: 'Sticker', emoji: '🏷️' },
  { value: 'flag', label: 'Flag', emoji: '🚩' },
  { value: 'jersey', label: 'Jersey', emoji: '🎽' },
  { value: 'jacket', label: 'Jacket', emoji: '🧥' },
  { value: 'accessory', label: 'Accessory', emoji: '💎' },
  { value: 'other', label: 'Other', emoji: '📦' },
]

export function getCategoryLabel(category: string): string {
  return MERCH_CATEGORIES.find(c => c.value === category)?.label || category
}

export function getCategoryEmoji(category: string): string {
  return MERCH_CATEGORIES.find(c => c.value === category)?.emoji || '📦'
}

// ── Condition definitions ───────────────────────────────
export const MERCH_CONDITIONS: { value: MerchCondition; label: string }[] = [
  { value: 'new', label: 'New' },
  { value: 'good', label: 'Good' },
  { value: 'worn', label: 'Worn' },
  { value: 'sealed', label: 'Sealed' },
]

export function getConditionLabel(condition: string): string {
  return MERCH_CONDITIONS.find(c => c.value === condition)?.label || condition
}

// ── Purchase source definitions ─────────────────────────
export const PURCHASE_SOURCES: { value: PurchaseSource; label: string; emoji: string }[] = [
  { value: 'concert', label: 'Concert', emoji: '🎤' },
  { value: 'online', label: 'Online', emoji: '🛒' },
  { value: 'resale', label: 'Resale', emoji: '🔄' },
  { value: 'gift', label: 'Gift', emoji: '🎁' },
  { value: 'other', label: 'Other', emoji: '📦' },
]

export function getSourceLabel(source: string): string {
  return PURCHASE_SOURCES.find(s => s.value === source)?.label || source
}

export function getSourceEmoji(source: string): string {
  return PURCHASE_SOURCES.find(s => s.value === source)?.emoji || '📦'
}

// ── Price helpers (mirror lib/costs.ts pattern) ─────────
export function formatPriceMinor(amountMinor: number): string {
  const dollars = amountMinor / 100
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(dollars)
}

export function parsePriceToMinor(amountString: string): number | null {
  if (!amountString || typeof amountString !== 'string') return null
  const cleaned = amountString.replace(/[$,]/g, '').replace(/\s/g, '').trim()
  if (!cleaned) return null
  if (!/^\d+(\.\d*)?$/.test(cleaned)) return null
  const num = parseFloat(cleaned)
  if (isNaN(num) || num < 0 || !isFinite(num)) return null
  const cents = Math.round(num * 100)
  if (cents > 1_000_000_000) return null
  return cents
}
