// Input validation and sanitization utilities

export interface ValidationResult {
  isValid: boolean
  error?: string
  sanitizedValue?: string
}

// Sanitize HTML to prevent XSS
export function sanitizeHtml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
}

// Sanitize text input (remove dangerous characters)
export function sanitizeText(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove angle brackets
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
}

// Validate and sanitize show title
export function validateTitle(title: string): ValidationResult {
  const sanitized = sanitizeText(title)
  
  if (!sanitized) {
    return { isValid: false, error: 'Title is required' }
  }
  
  if (sanitized.length > 100) {
    return { isValid: false, error: 'Title must be 100 characters or less' }
  }
  
  if (sanitized.length < 2) {
    return { isValid: false, error: 'Title must be at least 2 characters' }
  }
  
  return { isValid: true, sanitizedValue: sanitized }
}

// Validate and sanitize venue name
export function validateVenue(venue: string): ValidationResult {
  const sanitized = sanitizeText(venue)
  
  if (!sanitized) {
    return { isValid: false, error: 'Venue is required' }
  }
  
  if (sanitized.length > 100) {
    return { isValid: false, error: 'Venue must be 100 characters or less' }
  }
  
  if (sanitized.length < 2) {
    return { isValid: false, error: 'Venue must be at least 2 characters' }
  }
  
  return { isValid: true, sanitizedValue: sanitized }
}

// Validate and sanitize city name
export function validateCity(city: string): ValidationResult {
  const sanitized = sanitizeText(city)
  
  if (!sanitized) {
    return { isValid: false, error: 'City is required' }
  }
  
  if (sanitized.length > 50) {
    return { isValid: false, error: 'City must be 50 characters or less' }
  }
  
  if (sanitized.length < 2) {
    return { isValid: false, error: 'City must be at least 2 characters' }
  }
  
  // Only allow letters, spaces, hyphens, apostrophes, commas, and periods
  if (!/^[a-zA-Z\s\-',\.]+$/.test(sanitized)) {
    return { isValid: false, error: 'City can only contain letters, spaces, hyphens, apostrophes, commas, and periods' }
  }
  
  return { isValid: true, sanitizedValue: sanitized }
}

// Validate and sanitize URL
export function validateUrl(url: string): ValidationResult {
  if (!url) {
    return { isValid: true, sanitizedValue: '' } // URL is optional
  }
  
  const sanitized = sanitizeText(url)
  
  if (sanitized.length > 500) {
    return { isValid: false, error: 'URL must be 500 characters or less' }
  }
  
  // Basic URL validation
  try {
    const urlObj = new URL(sanitized)
    // Only allow http and https protocols
    if (urlObj.protocol !== 'http:' && urlObj.protocol !== 'https:') {
      return { isValid: false, error: 'URL must use http or https protocol' }
    }
    return { isValid: true, sanitizedValue: sanitized }
  } catch {
    return { isValid: false, error: 'Please enter a valid URL' }
  }
}

// Validate and sanitize notes
export function validateNotes(notes: string): ValidationResult {
  if (!notes) {
    return { isValid: true, sanitizedValue: '' } // Notes are optional
  }
  
  const sanitized = sanitizeText(notes)
  
  if (sanitized.length > 500) {
    return { isValid: false, error: 'Notes must be 500 characters or less' }
  }
  
  return { isValid: true, sanitizedValue: sanitized }
}

// Validate and sanitize user name
export function validateUserName(name: string): ValidationResult {
  const sanitized = sanitizeText(name)
  
  if (!sanitized) {
    return { isValid: false, error: 'Full name is required' }
  }
  
  if (sanitized.length > 50) {
    return { isValid: false, error: 'Full name must be 50 characters or less' }
  }
  
  if (sanitized.length < 2) {
    return { isValid: false, error: 'Full name must be at least 2 characters' }
  }
  
  // Only allow letters, numbers, spaces, hyphens, and apostrophes
  if (!/^[a-zA-Z0-9\s\-']+$/.test(sanitized)) {
    return { isValid: false, error: 'Full name can only contain letters, numbers, spaces, hyphens, and apostrophes' }
  }
  
  // Normalize to lowercase for consistent storage and comparison
  const normalized = sanitized.toLowerCase()
  
  return { isValid: true, sanitizedValue: normalized }
}

// Validate date format
export function validateDate(date: string): ValidationResult {
  if (!date) {
    return { isValid: false, error: 'Date is required' }
  }
  
  const dateObj = new Date(date)
  if (isNaN(dateObj.getTime())) {
    return { isValid: false, error: 'Please enter a valid date' }
  }
  
  
  // Check if date is not too far in the future (more than 2 years)
  const twoYearsFromNow = new Date()
  twoYearsFromNow.setFullYear(twoYearsFromNow.getFullYear() + 2)
  
  if (dateObj > twoYearsFromNow) {
    return { isValid: false, error: 'Date cannot be more than 2 years in the future' }
  }
  
  return { isValid: true, sanitizedValue: date }
}

// Validate time format
export function validateTime(time: string): ValidationResult {
  if (!time) {
    return { isValid: false, error: 'Time is required' }
  }
  
  // Validate HH:MM format
  if (!/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time)) {
    return { isValid: false, error: 'Please enter a valid time in HH:MM format' }
  }
  
  return { isValid: true, sanitizedValue: time }
}

// Validate RSVP status
export function validateRsvpStatus(status: string): ValidationResult {
  const validStatuses = ['going', 'maybe', 'not_going']
  
  if (!validStatuses.includes(status)) {
    return { isValid: false, error: 'Invalid RSVP status' }
  }
  
  return { isValid: true, sanitizedValue: status }
}

// Normalize name for storage (lowercase)
export function normalizeNameForStorage(name: string): string {
  return sanitizeText(name).toLowerCase()
}

// Format name for display (title case with special handling for prefixes)
export function formatNameForDisplay(normalizedName: string): string {
  if (!normalizedName || typeof normalizedName !== 'string') {
    return ''
  }
  
  return normalizedName
    .split(' ')
    .map(word => {
      if (!word) return word
      
      // Handle common prefixes that should keep the next letter capitalized
      // Only match if the prefix is followed by another character (not just the prefix alone)
      const prefixes = ['mc']
      
      const lowerWord = word.toLowerCase()
      for (const prefix of prefixes) {
        // Only match if the word starts with the prefix AND has more characters after it
        if (lowerWord.startsWith(prefix) && word.length > prefix.length) {
          return prefix.charAt(0).toUpperCase() + prefix.slice(1) + 
                 word.charAt(prefix.length).toUpperCase() + word.slice(prefix.length + 1)
        }
      }
      
      // Default title case for other words
      return word.charAt(0).toUpperCase() + word.slice(1)
    })
    .join(' ')
}
