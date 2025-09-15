import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ThemeProvider } from "@/components/ThemeProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EDM Adoption Clinic Show Tracker", // change to your own title
  description: "Track shows and manage RSVPs for the EDM Adoption Clinic group", // change to your own description
  keywords: ["EDM", "shows", "events", "RSVP", "music", "concerts"], // change to your own keywords
  authors: [{ name: "EDM Adoption Clinic" }], // change to your own authors
  creator: "EDM Adoption Clinic", // change to your own creator
  publisher: "EDM Adoption Clinic", // change to your own publisher
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [
      { url: '/assets/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/assets/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/assets/favicon.ico', sizes: 'any' }
    ],
    apple: [
      { url: '/assets/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }
    ],
    other: [
      { url: '/assets/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/assets/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' }
    ]
  },
  manifest: '/assets/site.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'EDM Adoption Clinic Show Tracker' // change to your own title
  },
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'apple-mobile-web-app-title': 'EDM Adoption Clinic Show Tracker', // change to your own title
    'application-name': 'EDM Adoption Clinic Show Tracker', // change to your own title
    'msapplication-TileColor': '#1f2937',
    'msapplication-config': '/browserconfig.xml'
  }
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#1f2937' },
    { media: '(prefers-color-scheme: dark)', color: '#1f2937' }
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js')
                    .then(function(registration) {
                      console.log('Service worker registered successfully');
                    })
                    .catch(function(registrationError) {
                      console.error('Service worker registration failed:', registrationError);
                    });
                });
              }

              // Handle chunk load errors with more robust error handling
              window.addEventListener('error', function(event) {
                if (event.message && event.message.includes('Loading chunk')) {
                  console.error('Chunk load error detected:', event.message);
                  
                  // Clear service worker and caches before reloading
                  if ('serviceWorker' in navigator) {
                    navigator.serviceWorker.getRegistrations().then(registrations => {
                      registrations.forEach(registration => {
                        registration.unregister();
                      });
                    });
                  }
                  
                  if ('caches' in window) {
                    caches.keys().then(cacheNames => {
                      cacheNames.forEach(cacheName => {
                        caches.delete(cacheName);
                      });
                    });
                  }
                  
                  // Force reload after clearing caches
                  setTimeout(() => {
                    window.location.reload();
                  }, 1500);
                }
              });

              // Handle unhandled promise rejections (chunk load errors)
              window.addEventListener('unhandledrejection', function(event) {
                if (event.reason && event.reason.message && event.reason.message.includes('Loading chunk')) {
                  console.error('Chunk load error (unhandled rejection):', event.reason.message);
                  event.preventDefault();
                  
                  // Clear service worker and caches before reloading
                  if ('serviceWorker' in navigator) {
                    navigator.serviceWorker.getRegistrations().then(registrations => {
                      registrations.forEach(registration => {
                        registration.unregister();
                      });
                    });
                  }
                  
                  if ('caches' in window) {
                    caches.keys().then(cacheNames => {
                      cacheNames.forEach(cacheName => {
                        caches.delete(cacheName);
                      });
                    });
                  }
                  
                  // Force reload after clearing caches
                  setTimeout(() => {
                    window.location.reload();
                  }, 1500);
                }
              });
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          defaultTheme="light"
          storageKey="show-tracker-theme" 
        >
          {children}
        </ThemeProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}
