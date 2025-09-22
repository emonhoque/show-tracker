import { Show } from './types'
import { addHours } from 'date-fns'
import { toZonedTime } from 'date-fns-tz'

const BOSTON_TZ = 'America/New_York'

/**
 * Calendar export configuration and types
 */
export interface CalendarEvent {
  title: string
  start: Date
  end: Date
  location: string
  description: string
  url?: string
}

export interface CalendarExportOptions {
  duration?: number // Duration in hours, defaults to 3
  timezone?: string // Timezone for the event, defaults to Boston
}

/**
 * Convert a Show to a CalendarEvent with proper timezone handling
 */
export function showToCalendarEvent(
  show: Show, 
  options: CalendarExportOptions = {}
): CalendarEvent {
  const { duration = 3, timezone = BOSTON_TZ } = options
  
  // Validate required fields
  if (!show.title || !show.date_time) {
    throw new Error('Show must have title and date_time')
  }

  // Parse the show date/time
  const showDate = new Date(show.date_time)
  if (isNaN(showDate.getTime())) {
    throw new Error('Invalid show date_time format')
  }

  // Convert to the specified timezone for display
  const startTime = toZonedTime(showDate, timezone)
  const endTime = addHours(startTime, duration)

  // Build location string
  const location = [show.venue, show.city].filter(Boolean).join(', ')
  if (!location) {
    throw new Error('Show must have venue and city for location')
  }

  // Build description
  const descriptionParts = []
  
  if (show.notes) {
    descriptionParts.push(show.notes)
  }

  // Add links section
  const links = []
  if (show.ticket_url) {
    links.push(`Tickets: ${show.ticket_url}`)
  }
  if (show.spotify_url) {
    links.push(`Spotify: ${show.spotify_url}`)
  }
  if (show.apple_music_url) {
    links.push(`Apple Music: ${show.apple_music_url}`)
  }
  if (show.google_photos_url) {
    links.push(`Photos: ${show.google_photos_url}`)
  }
  
  if (links.length > 0) {
    descriptionParts.push('\nLinks:')
    descriptionParts.push(links.join('\n'))
  }

  const description = descriptionParts.join('\n\n')

  return {
    title: show.title,
    start: startTime,
    end: endTime,
    location,
    description,
    url: show.ticket_url || undefined
  }
}

/**
 * Generate Google Calendar URL
 */
export function generateGoogleCalendarUrl(event: CalendarEvent): string {
  // Format dates to local time for Google Calendar (no timezone conversion)
  const formatDateForGoogle = (date: Date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    const seconds = String(date.getSeconds()).padStart(2, '0')
    return `${year}${month}${day}T${hours}${minutes}${seconds}`
  }
  
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.title,
    dates: `${formatDateForGoogle(event.start)}/${formatDateForGoogle(event.end)}`,
    location: event.location,
    details: event.description,
    ...(event.url && { trp: 'true' })
  })

  return `https://calendar.google.com/calendar/render?${params.toString()}`
}

/**
 * Generate ICS (iCalendar) file content
 */
export function generateICSContent(event: CalendarEvent, uid?: string): string {
  const now = new Date()
  const eventUid = uid || `show-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  
  // Format dates for ICS (local time format with timezone)
  const formatICSDate = (date: Date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    const seconds = String(date.getSeconds()).padStart(2, '0')
    return `${year}${month}${day}T${hours}${minutes}${seconds}`
  }

  // Get timezone offset for the event times (currently unused but kept for future use)
  // const timezoneOffset = event.start.getTimezoneOffset()
  // const offsetHours = Math.abs(Math.floor(timezoneOffset / 60))
  // const offsetMinutes = Math.abs(timezoneOffset % 60)
  // const offsetSign = timezoneOffset <= 0 ? '+' : '-'
  // const timezoneString = `${offsetSign}${String(offsetHours).padStart(2, '0')}${String(offsetMinutes).padStart(2, '0')}`

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Show Tracker//Calendar Export//EN',
    'BEGIN:VTIMEZONE',
    'TZID:America/New_York',
    'BEGIN:STANDARD',
    'DTSTART:20070101T020000',
    'RRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU',
    'TZOFFSETFROM:-0400',
    'TZOFFSETTO:-0500',
    'TZNAME:EST',
    'END:STANDARD',
    'BEGIN:DAYLIGHT',
    'DTSTART:20070101T020000',
    'RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU',
    'TZOFFSETFROM:-0500',
    'TZOFFSETTO:-0400',
    'TZNAME:EDT',
    'END:DAYLIGHT',
    'END:VTIMEZONE',
    'BEGIN:VEVENT',
    `UID:${eventUid}`,
    `DTSTAMP:${formatICSDate(now)}Z`,
    `DTSTART;TZID=America/New_York:${formatICSDate(event.start)}`,
    `DTEND;TZID=America/New_York:${formatICSDate(event.end)}`,
    `SUMMARY:${escapeICSField(event.title)}`,
    `LOCATION:${escapeICSField(event.location)}`,
    `DESCRIPTION:${escapeICSField(event.description)}`,
    ...(event.url ? [`URL:${event.url}`] : []),
    'END:VEVENT',
    'END:VCALENDAR'
  ]

  return lines.join('\r\n')
}

/**
 * Escape special characters for ICS format
 */
function escapeICSField(field: string): string {
  return field
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '')
}

/**
 * Download ICS file
 */
export function downloadICSFile(content: string, filename: string = 'show.ics'): void {
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 * Detect if user is on mobile device
 */
export function isMobileDevice(): boolean {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
}

/**
 * Validate show data for calendar export
 */
export function validateShowForCalendar(show: Show): { isValid: boolean; errors: string[] } {
  const errors: string[] = []

  if (!show.title || show.title.trim() === '') {
    errors.push('Show title is required')
  }

  if (!show.date_time) {
    errors.push('Show date and time are required')
  } else {
    const showDate = new Date(show.date_time)
    if (isNaN(showDate.getTime())) {
      errors.push('Invalid date format')
    }
  }

  if (!show.venue || show.venue.trim() === '') {
    errors.push('Venue is required')
  }

  if (!show.city || show.city.trim() === '') {
    errors.push('City is required')
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * Get default duration based on show type or time
 */
export function getDefaultDuration(show: Show): number {
  // Check if it's likely an evening show (after 6 PM)
  if (show.time_local) {
    const [hours] = show.time_local.split(':').map(Number)
    if (hours >= 18) {
      return 3 // Evening shows typically 3 hours
    }
  }
  
  return 2 // Default 2 hours for other shows
}
