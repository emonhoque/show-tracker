'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectOption, SelectTrigger } from '@/components/ui/select'
import { Show } from '@/lib/types'
import { 
  showToCalendarEvent, 
  generateGoogleCalendarUrl, 
  generateICSContent, 
  downloadICSFile, 
  isMobileDevice, 
  validateShowForCalendar,
  getDefaultDuration,
  CalendarExportOptions 
} from '@/lib/calendar'
import { Calendar, Download, ExternalLink, Clock, MapPin, AlertCircle } from 'lucide-react'

interface ExportToCalendarProps {
  show: Show
  variant?: 'button' | 'card'
}

export function ExportToCalendar({ show, variant = 'button' }: ExportToCalendarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [duration, setDuration] = useState(getDefaultDuration(show))
  const [isExporting, setIsExporting] = useState(false)
  const [validationError, setValidationError] = useState<string | null>(null)

  const isMobile = isMobileDevice()

  const handleExport = async (type: 'google' | 'ics') => {
    setIsExporting(true)
    setValidationError(null)

    try {
      // Validate show data
      const validation = validateShowForCalendar(show)
      if (!validation.isValid) {
        setValidationError(validation.errors.join(', '))
        return
      }

      const options: CalendarExportOptions = {
        duration,
        timezone: 'America/New_York' // Boston timezone
      }

      const event = showToCalendarEvent(show, options)

      if (type === 'google') {
        const url = generateGoogleCalendarUrl(event)
        if (isMobile) {
          // On mobile, try to open in the app, fallback to browser
          window.open(url, '_blank')
        } else {
          // On desktop, open in new tab
          window.open(url, '_blank')
        }
      } else {
        // Generate and download ICS file
        const icsContent = generateICSContent(event, `show-${show.id}`)
        const filename = `${show.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_${show.date_time.split('T')[0]}.ics`
        downloadICSFile(icsContent, filename)
      }

      // Close dialog after successful export
      setIsOpen(false)
    } catch (error) {
      console.error('Export error:', error)
      setValidationError(error instanceof Error ? error.message : 'Failed to export to calendar')
    } finally {
      setIsExporting(false)
    }
  }

  // Quick export for mobile (single button)
  const handleQuickExport = async () => {
    if (isMobile) {
      await handleExport('google')
    } else {
      await handleExport('ics')
    }
  }

  if (variant === 'card') {
    return (
      <Card className="w-full">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Calendar className="h-5 w-5" />
            Add to Calendar
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {validationError && (
            <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg">
              <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
              <p className="text-sm text-red-600 dark:text-red-400">{validationError}</p>
            </div>
          )}
          
          <div className="space-y-3">
            <Button
              onClick={() => handleExport('google')}
              disabled={isExporting}
              className="w-full flex items-center gap-2"
              variant="outline"
            >
              <ExternalLink className="h-4 w-4" />
              Google Calendar
            </Button>
            
            <Button
              onClick={() => handleExport('ics')}
              disabled={isExporting}
              className="w-full flex items-center gap-2"
              variant="outline"
            >
              <Download className="h-4 w-4" />
              Download .ics File
            </Button>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Approximate Duration
            </label>
            <Select value={duration.toString()} onChange={(value) => setDuration(Number(value))}>
              <SelectTrigger>
                {duration} hour{duration !== 1 ? 's' : ''}
              </SelectTrigger>
              <SelectContent>
                <SelectOption value="1">1 hour</SelectOption>
                <SelectOption value="2">2 hours</SelectOption>
                <SelectOption value="3">3 hours</SelectOption>
                <SelectOption value="4">4 hours</SelectOption>
                <SelectOption value="5">5 hours</SelectOption>
                <SelectOption value="6">6 hours</SelectOption>
              </SelectContent>
            </Select>
          </div>

          <div className="text-xs text-muted-foreground space-y-1">
            <div className="flex items-center gap-2">
              <MapPin className="h-3 w-3" />
              <span>{show.venue}, {show.city}</span>
            </div>
            <div className="text-xs">
              * Times are in Eastern Time (America/New_York)
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Default button variant
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <Calendar className="h-4 w-4" />
          Add to Calendar
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Add to Calendar
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {validationError && (
            <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg">
              <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
              <p className="text-sm text-red-600 dark:text-red-400">{validationError}</p>
            </div>
          )}

          <div className="space-y-3">
            <Button
              onClick={() => handleExport('google')}
              disabled={isExporting}
              className="w-full flex items-center gap-2"
              variant="outline"
            >
              <ExternalLink className="h-4 w-4" />
              Google Calendar
            </Button>
            
            <Button
              onClick={() => handleExport('ics')}
              disabled={isExporting}
              className="w-full flex items-center gap-2"
              variant="outline"
            >
              <Download className="h-4 w-4" />
              Download .ics File
            </Button>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Approximate Duration
            </label>
            <Select value={duration.toString()} onChange={(value) => setDuration(Number(value))}>
              <SelectTrigger>
                {duration} hour{duration !== 1 ? 's' : ''}
              </SelectTrigger>
              <SelectContent>
                <SelectOption value="1">1 hour</SelectOption>
                <SelectOption value="2">2 hours</SelectOption>
                <SelectOption value="3">3 hours</SelectOption>
                <SelectOption value="4">4 hours</SelectOption>
                <SelectOption value="5">5 hours</SelectOption>
                <SelectOption value="6">6 hours</SelectOption>
              </SelectContent>
            </Select>
          </div>

          <div className="text-xs text-muted-foreground space-y-1">
            <div className="flex items-center gap-2">
              <MapPin className="h-3 w-3" />
              <span>{show.venue}, {show.city}</span>
            </div>
            <div className="text-xs">
              * Times are in Eastern Time (America/New_York)
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Quick export button for mobile
export function QuickExportButton({ show }: { show: Show }) {
  const [isExporting, setIsExporting] = useState(false)
  const isMobile = isMobileDevice()

  const handleQuickExport = async () => {
    setIsExporting(true)
    try {
      const validation = validateShowForCalendar(show)
      if (!validation.isValid) {
        alert(`Cannot export: ${validation.errors.join(', ')}`)
        return
      }

      const event = showToCalendarEvent(show, { 
        duration: getDefaultDuration(show),
        timezone: 'America/New_York'
      })

      if (isMobile) {
        const url = generateGoogleCalendarUrl(event)
        window.open(url, '_blank')
      } else {
        const icsContent = generateICSContent(event, `show-${show.id}`)
        const filename = `${show.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_${show.date_time.split('T')[0]}.ics`
        downloadICSFile(icsContent, filename)
      }
    } catch (error) {
      console.error('Export error:', error)
      alert('Failed to export to calendar')
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <Button
      onClick={handleQuickExport}
      disabled={isExporting}
      variant="outline"
      size="sm"
      className="flex items-center gap-2"
    >
      <Calendar className="h-4 w-4" />
      {isMobile ? 'Add to Calendar' : 'Download .ics'}
    </Button>
  )
}
