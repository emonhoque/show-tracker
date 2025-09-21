'use client'

import { useState } from 'react'
import { Show } from '@/lib/types'
import { ExportToCalendar, QuickExportButton } from '@/components/ExportToCalendar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, Download, ExternalLink } from 'lucide-react'

// Demo show data
const demoShows: Show[] = [
  {
    id: 'demo-1',
    title: 'Taylor Swift - Eras Tour',
    date_time: '2024-12-25T20:00:00.000Z',
    time_local: '20:00',
    city: 'Boston',
    venue: 'TD Garden',
    ticket_url: 'https://example.com/tickets',
    spotify_url: 'https://open.spotify.com/artist/taylor-swift',
    apple_music_url: 'https://music.apple.com/artist/taylor-swift',
    notes: 'Special holiday show with extended setlist',
    created_at: '2024-01-01T00:00:00.000Z'
  },
  {
    id: 'demo-2',
    title: 'Local Band Night',
    date_time: '2024-12-20T19:30:00.000Z',
    time_local: '19:30',
    city: 'Cambridge',
    venue: 'The Middle East',
    spotify_url: 'https://open.spotify.com/artist/local-band',
    notes: 'Featuring 3 local bands',
    created_at: '2024-01-01T00:00:00.000Z'
  },
  {
    id: 'demo-3',
    title: 'Jazz Brunch',
    date_time: '2024-12-22T11:00:00.000Z',
    time_local: '11:00',
    city: 'Boston',
    venue: 'Regattabar',
    ticket_url: 'https://example.com/jazz-tickets',
    notes: 'Sunday jazz brunch with bottomless mimosas',
    created_at: '2024-01-01T00:00:00.000Z'
  }
]

const invalidShow: Show = {
  id: 'invalid-demo',
  title: '', // Missing title
  date_time: 'invalid-date',
  time_local: '20:00',
  city: '', // Missing city
  venue: '', // Missing venue
  created_at: '2024-01-01T00:00:00.000Z'
}

export default function CalendarDemoPage() {
  const [selectedShow, setSelectedShow] = useState<Show>(demoShows[0])

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4 flex items-center gap-3">
          <Calendar className="h-8 w-8" />
          Calendar Export Demo
        </h1>
        <p className="text-muted-foreground">
          Test the calendar export functionality with different show configurations.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Show Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Select Show to Test</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {demoShows.map((show) => (
              <Button
                key={show.id}
                variant={selectedShow.id === show.id ? 'default' : 'outline'}
                onClick={() => setSelectedShow(show)}
                className="w-full justify-start"
              >
                <div className="text-left">
                  <div className="font-medium">{show.title}</div>
                  <div className="text-sm text-muted-foreground">
                    {show.venue}, {show.city} • {show.time_local}
                  </div>
                </div>
              </Button>
            ))}
            
            <div className="border-t pt-3">
              <Button
                variant={selectedShow.id === invalidShow.id ? 'destructive' : 'outline'}
                onClick={() => setSelectedShow(invalidShow)}
                className="w-full justify-start"
              >
                <div className="text-left">
                  <div className="font-medium text-red-600 dark:text-red-400">
                    Invalid Show (Test Error Handling)
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Missing required fields
                  </div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Export Options */}
        <div className="space-y-4">
          {/* Button Variant */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ExternalLink className="h-5 w-5" />
                Button Variant (Default)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ExportToCalendar show={selectedShow} />
              <p className="text-sm text-muted-foreground mt-2">
                Opens a modal dialog with export options and duration selection.
              </p>
            </CardContent>
          </Card>

          {/* Card Variant */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-5 w-5" />
                Card Variant
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ExportToCalendar show={selectedShow} variant="card" />
              <p className="text-sm text-muted-foreground mt-2">
                Inline card with all export options visible.
              </p>
            </CardContent>
          </Card>

          {/* Quick Export */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Quick Export (Mobile Optimized)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <QuickExportButton show={selectedShow} />
              <p className="text-sm text-muted-foreground mt-2">
                Single-click export optimized for mobile devices.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Show Details */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Selected Show Details</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="bg-muted p-4 rounded-lg overflow-auto text-sm">
            {JSON.stringify(selectedShow, null, 2)}
          </pre>
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Testing Instructions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <h4 className="font-medium mb-2">1. Valid Shows</h4>
            <p className="text-sm text-muted-foreground">
              Try exporting the valid shows above. You should see options for Google Calendar 
              and ICS download, with customizable duration settings.
            </p>
          </div>
          
          <div>
            <h4 className="font-medium mb-2">2. Invalid Show</h4>
            <p className="text-sm text-muted-foreground">
              Select the "Invalid Show" to test error handling. You should see validation 
              errors explaining what's missing.
            </p>
          </div>
          
          <div>
            <h4 className="font-medium mb-2">3. Mobile Testing</h4>
            <p className="text-sm text-muted-foreground">
              Use browser dev tools to simulate mobile devices. The Quick Export button 
              should prioritize Google Calendar on mobile.
            </p>
          </div>
          
          <div>
            <h4 className="font-medium mb-2">4. ICS File Testing</h4>
            <p className="text-sm text-muted-foreground">
              Download ICS files and import them into your calendar app to verify 
              the format and data accuracy.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
