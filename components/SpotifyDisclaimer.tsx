'use client'

import { AlertCircle, Music, ExternalLink } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

interface SpotifyDisclaimerProps {
  feature?: string
}

export function SpotifyDisclaimer({ feature = 'this feature' }: SpotifyDisclaimerProps) {
  return (
    <Card className="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950">
      <CardContent className="p-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
          <div className="space-y-3">
            <div>
              <h3 className="font-semibold text-amber-800 dark:text-amber-200 flex items-center gap-2">
                <Music className="h-4 w-4" />
                Spotify Integration Not Configured
              </h3>
              <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                To use {feature}, you need to configure your Spotify API credentials.
              </p>
            </div>
            
            <div className="space-y-2 text-sm text-amber-700 dark:text-amber-300">
              <p className="font-medium">Setup Instructions:</p>
              <ol className="list-decimal list-inside space-y-1 ml-2">
                <li>
                  Go to the{' '}
                  <a
                    href="https://developer.spotify.com/dashboard"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-amber-800 dark:text-amber-200 hover:underline font-medium"
                  >
                    Spotify Developer Dashboard
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </li>
                <li>Create a new app or use an existing one</li>
                <li>Copy your Client ID and Client Secret</li>
                <li>Add them to your <code className="bg-amber-100 dark:bg-amber-900 px-1 rounded text-xs">.env.local</code> file:</li>
              </ol>
              
              <div className="bg-amber-100 dark:bg-amber-900 p-3 rounded-md font-mono text-xs">
                <div>SPOTIFY_CLIENT_ID=your_client_id_here</div>
                <div>SPOTIFY_CLIENT_SECRET=your_client_secret_here</div>
              </div>
              
              <p className="text-xs">
                After adding the credentials, restart your development server.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
