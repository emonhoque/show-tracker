export const COST_CATEGORIES = [
  { value: 'ticket', label: 'Ticket', emoji: '🎫' },
  { value: 'travel', label: 'Travel', emoji: '✈️' },
  { value: 'merch', label: 'Merch', emoji: '👕' },
  { value: 'food_drink', label: 'Food & Drink', emoji: '🍔' },
  { value: 'lodging', label: 'Lodging', emoji: '🏨' },
  { value: 'parking', label: 'Parking', emoji: '🅿️' },
  { value: 'rideshare', label: 'Rideshare', emoji: '🚗' },
  { value: 'other', label: 'Other', emoji: '📦' },
] as const

export type CostCategory = typeof COST_CATEGORIES[number]['value']

export function getCategoryLabel(category: string): string {
  return COST_CATEGORIES.find(c => c.value === category)?.label || category
}

export function getCategoryEmoji(category: string): string {
  return COST_CATEGORIES.find(c => c.value === category)?.emoji || '📦'
}

export function parseAmountToMinorUnits(amountString: string): number | null {
  if (!amountString || typeof amountString !== 'string') return null

  const cleaned = amountString.replace(/,/g, '').replace(/\s/g, '').trim()
  if (!cleaned) return null
  if (!/^\d+(\.\d*)?$/.test(cleaned)) return null

  const num = parseFloat(cleaned)
  if (isNaN(num) || num <= 0 || !isFinite(num)) return null

  const cents = Math.round(num * 100)
  if (cents > 1_000_000_000) return null

  return cents
}

export function formatMinorUnits(amountMinor: number): string {
  const dollars = amountMinor / 100
  const formatted = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(dollars)
  return `$${formatted}`
}

export function formatMinorToDecimal(amountMinor: number): string {
  return (amountMinor / 100).toFixed(2)
}

export function minorToDollars(amountMinor: number): number {
  return amountMinor / 100
}

export interface ShowCost {
  id: string
  show_id: string
  user_id: string
  category: CostCategory
  amount_minor: number
  currency: string
  note: string | null
  created_at: string
  updated_at: string
}

export interface ShowWithCosts {
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

export interface CostsSummary {
  year: number
  total_spend: number
  total_shows_with_costs: number
  total_attended_shows: number
  average_per_show: number
  spend_by_category: Array<{
    category: CostCategory
    label: string
    emoji: string
    total: number // dollars
  }>
  most_expensive_show: {
    show_id: string
    title: string
    total: number // dollars
  } | null
  cheapest_show: {
    show_id: string
    title: string
    total: number // dollars
  } | null
  cost_per_artist: number | null // dollars, only if show_artists data exists
}
