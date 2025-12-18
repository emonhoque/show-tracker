# Changelog

All notable changes to Show Tracker will be documented in this file.

---

## [1.7.0] - 2025-12-18

### Added
- **Recap Stories** - Instagram-style story experience for year-end recaps
  - Tap-to-navigate story player with auto-advance (5 seconds per slide)
  - 9 beautifully designed slide types: Intro, Total Shows, Monthly Average, Busiest Month, Top Venue, Monthly Chart, Top Artists, Comparison, and Outro
  - 5 unique color themes that rotate through slides (Midnight, Neon, Sunset, Forest, Mono)
  - Dynamic personalized copy system with contextual messaging based on stats
  - Smooth mobile-optimized animations with reduced motion support
  - Progress bar showing slide advancement
  - Copy summary and share functionality
- **Comparison Slide** - See how you stack up against others in your group
  - Shows your rank among all attendees
  - Compares your show count to the group average
  - Personalized messaging based on your relative position

### Changed
- Redesigned "Your Year in Shows" chart with improved visuals
- Optimized all recap animations for smoother mobile performance
- Enhanced copy variety to avoid repetitive messaging across slides

### Fixed
- Names now properly capitalized in recap displays
- Chart elements no longer interactive (prevented accidental highlighting)

---

## [1.6.8] - 2025-10-31

### Fixed
- Login screen background now respects dark mode (replaced hardcoded `bg-gray-50` with theme `bg-background`).

---

## [1.6.7] - 2025-10-21

### Added
- **Days Until Show Display** - Show cards now display how many days until each show
  - Shows "Today" for same-day events
  - Shows "Tomorrow" for next-day events  
  - Shows "In X days" for future events
  - Shows "X days ago" for past events

### Changed
- Removed redundant "(Local)" text from date display

---

## [1.6.6] - 2025-10-10

### Changed
- Enhanced RecapChart user statistics display for better readability
  - Improved formatting of total shows and active months statistics
  - Better visual spacing and layout consistency
- Fixed ShowCard footer padding for improved visual spacing

---

## [1.6.5] - 2025-10-03

### Added
- **Toast Notification System** - Real-time user feedback for all actions
  - Toast notifications for adding/removing artists
  - Toast notifications for calendar exports
  - Toast notifications for show duplication
  - Toast notifications for release refreshes
  - Custom toast component with auto-dismiss functionality
- **Show Duplication Feature** - Quickly duplicate shows with one click
  - Duplicate show API endpoint (`/api/shows/[id]/duplicate`)
  - Discord notifications for duplicated shows
  - Preserves all show details except RSVPs

### Changed
- Refactored ArtistsListModal to use `useCallback` for better performance
- Updated service worker caches and versioning for deployment consistency
- Improved component performance and prevented unnecessary re-renders

### Fixed
- Cleaned up unused imports in duplicate route file
- Fixed ShowCardSkeleton component import consistency

---

## [1.6.4] - 2025-10-02

### Fixed
- Corrected default image URL for new artists in ShowArtistsManager
- Enhanced visual consistency in artist displays

---

## [1.6.3] - 2025-09-30

### Added
- **Headliner Tracking** - Mark and track headliners in year-end recap
  - Headliner statistics in personal recap
  - Headliner statistics in group recap
  - Prioritized headliners in top artists list
- **Artist Role Support** - Headliner, Support, and Local artist designations
  - Tabbed interface for viewing artists by position
  - Enhanced artist statistics calculations
- **Default Artist Images** - Visual consistency for all artists

### Changed
- Enhanced artist statistics calculations in Recap API
- Updated RecapPage to display artist appearance counts by role
- Refactored ShowCard and ShowCardSkeleton components for better layout
- Improved RSVP button functionality and user interaction

---

## [1.6.1] - 2025-09-26

### Added
- **Custom Artist Addition** - Add artists not found on Spotify
  - Manual artist entry with custom names
  - Support for artists without Spotify profiles

### Changed
- Enhanced ShowArtistsManager with improved artist display logic
- Updated custom artist text to use HTML entities for quotes
- Removed unused Spotify icon code

---

## [1.6.0] - 2025-09-26

### Added
- **Show Artists Management** - Spotify integration for artist data
  - Search and add artists via Spotify API
  - Display artist images from Spotify
  - Store artist data as JSONB in database
  - Artist role assignment (Headliner/Support)
- **Artist Statistics in Recap** - Track most-seen artists
  - Personal top artists
  - Group top artists
  - Artist diversity metrics
  - Most frequently seen artists
- **Enhanced Recap Page** - Comprehensive artist analytics
  - Top artists by position (Headliner, Support, Local)
  - Tabbed interface for different views
  - Improved data visualization

### Changed
- Removed Spotify and Apple Music URL fields from show forms (moved to show level)
- Updated database schema to include `show_artists` JSONB field
- Added GIN index for `show_artists` field
- Enhanced type definitions for improved type safety
- Migrated to Next.js Image component for artist images

### Fixed
- Release tracking duration terminology (12 weeks → 90 days → 13 weeks)

---

## [1.5.0] - 2025-09-25

### Added
- **Year-end Recap Feature** - Comprehensive analytics and statistics
  - Personal statistics (shows attended, venues visited, etc.)
  - Group statistics with leaderboards
  - Monthly attendance trends with charts
  - Time pattern analysis (busiest month, days of week)
  - Gap analysis (longest breaks, attendance streaks)
  - Venue tracking and most visited venues
  - Artist diversity metrics
- **Recap Page** (`/recap`) - Dedicated analytics page
- **Monthly Trend Charts** - Visual attendance patterns using Recharts
- **Year Selection** - View recaps for any year from 2023 onwards
- **Copy Summary** - Generate and copy personalized year-end summaries

### Changed
- Added `recharts` dependency for data visualization
- Updated versioning script to use ES modules (`.mjs`)
- Improved dark mode detection in RecapChart component
- Enhanced RSVP type safety with `PartialRSVP` type

---

## [1.4.1] - 2025-09-22

### Added
- Ticket URL display in ShowCard component

---

## [1.4.0] - 2025-09-22

### Added
- **Copy Show Info Feature** - One-click copy of show details
  - Formatted text with title, date, venue, and links
  - Mobile-optimized functionality
  - Clean, shareable format

### Changed
- Modified ExportToCalendar button label for clarity
- Enhanced caching strategy in service worker
- Improved service worker functionality

---

## [1.3.1] - 2025-09-21

### Changed
- Conditionally render ExportToCalendar in ShowCard component
- Hide calendar export for shows without complete information

---

## [1.3.0] - 2025-09-21

### Added
- **Calendar Export Feature** - Export shows to calendar apps
  - Google Calendar integration
  - .ics file download for any calendar app
  - Custom event duration (1-6 hours)
  - Proper timezone handling (America/New_York)
- ExportToCalendar component with dual export options

### Removed
- CalendarDemoPage component and demo data
- Unused quick export function

---

## [1.2.1] - 2025-09-18

### Changed
- Enhanced service worker registration
- Refined site manifest for better PWA experience

---

## [1.2.0] - 2025-09-18

### Added
- **Discord Integration** - Bot notifications for show updates
  - Asynchronous notifications for new shows
  - Asynchronous notifications for updated shows
  - Non-blocking notification system
  - Health monitoring and error handling
- **Pagination for Releases API** - Improved performance for large datasets

### Changed
- Updated Discord Bot API URL configuration

---

## [1.1.0] - 2025-09-15

### Added
- **Community Release Radar** - Track new music from artists
  - Spotify API integration for release tracking
  - Artist management (add/remove artists)
  - Release tracking for albums, singles, EPs
  - Automated release checking via cron job
  - GitHub Actions workflow for 4x daily checks (5:01, 11:01, 17:01, 23:01 UTC)
  - Music tab with release feed
  - 13-week release window
- **Artist Search** - Search Spotify for artists
- **Add Artist Modal** - Community-driven artist pool
- **Artists List Modal** - Manage tracked artists
- **Release Cards** - Display new releases with artwork
- **Image Modal** - Full-screen poster and album art viewing
  - Zoom capabilities
  - Improved background and click handling
  - Enhanced accessibility

### Changed
- Updated site manifest name to "EDM Adoption Clinic Show Tracker"
- Migrated all `img` tags to Next.js `Image` component for performance
- Added image domain configuration in `next.config.ts`
- Improved type safety across components and API routes
- Renamed "Releases" tab to "Music" for consistency

### Technical
- New database tables: `artists`, `releases`, `user_artists`
- API endpoints: `/api/artists`, `/api/artists/search`, `/api/releases`, `/api/cron/check-releases`
- Spotify client ID and secret environment variables

---

## [1.0.0] - 2025-09-11

### Added
- **Advanced Filtering System** - Smart RSVP and people filters
  - Filter by status (Going/Maybe/Not Going)
  - Filter by attendees
  - Smart AND logic for multiple selections
  - Radix UI integration for dropdowns
- **MIT License** - Open source under MIT License

### Changed
- Enhanced RSVP filtering logic for complex queries
- Updated README with advanced filtering documentation
- Improved contribution guidelines

### Removed
- Jest configuration and test files (streamlined project)
- Unused Jest dependencies

### Fixed
- Name formatting with limited prefixes for better display

---

## [0.9.0] - 2025-09-10

### Added
- **Poster Upload Feature** - Show poster images
  - Vercel Blob storage integration
  - Image upload in add/edit show modals
  - Image preview in show cards
  - Poster URL field in database
  - File type and size validation (JPEG, PNG, WebP, max 10MB)
- **Google Photos Integration** - Link to show photos
  - Google Photos URL field in shows
  - Photo sharing for past shows
- **Spotify & Apple Music Links** - Music streaming integration
  - Spotify URL field
  - Apple Music URL field
  - Quick links in show cards
- **Theme Toggle** - Dark/light mode support
  - ThemeProvider component
  - System preference detection
  - Manual theme switching
  - Persistent theme preference
  - Consistent UI across all themes

### Changed
- Enhanced accessibility with aria-labels on buttons
- Improved ShowCard layout and styles
- Updated README with new features
- Enhanced image upload button styling
- Better media handling across components

### Technical
- Added `BLOB_READ_WRITE_TOKEN` environment variable
- Vercel Blob SDK integration
- Enhanced component accessibility

---

## [0.8.0] - 2025-09-10

### Added
- **Chunk Load Error Recovery** - Automatic recovery from JS chunk failures
  - Robust error handling in service worker
  - Automatic cache clearing on chunk errors
  - Improved user experience during loading issues
- **Improved Caching Strategy** - Better PWA performance
  - Smart cache invalidation
  - Real-time data for upcoming shows (no caching)
  - Delayed fetching to ensure database updates
- **Cursor Pointer on Buttons** - Better UI feedback

### Changed
- Enhanced show fetching logic with delays
- Updated caching strategy for upcoming shows
- Fixed light/dark mode UI inconsistencies
- Improved ThemeToggle positioning

### Fixed
- Service worker chunk loading issues
- Dark mode text color inconsistencies

---

## [0.7.0] - 2025-09-09

### Added
- **Infinite Scroll for Past Shows** - Efficient pagination
  - Load 20 shows at a time
  - Seamless infinite scroll
  - No duplicates in show list
  - Improved performance for large datasets
- **PWA Features** - Progressive Web App capabilities
  - Service worker for offline functionality
  - App manifest for installation
  - Offline detection and graceful degradation
  - Scroll-to-top functionality
  - Enhanced caching strategy
  - User agent checks for PWA mode
- **Vercel Speed Insights** - Performance monitoring
- **ShowCardSkeleton** - Loading states
  - Smooth skeleton loaders
  - Prevent layout shifts
  - Better perceived performance

### Changed
- Enhanced show fetching logic with type safety
- Improved RSVP handling for past shows
- Refactored ShowCard component RSVP logic
- Updated service worker to version 2
- Immediate activation of new service worker

### Technical
- Better error handling and data validation
- Proper RSVP data format handling
- Type-safe show ID management

---

## [0.6.0] - 2025-09-10

### Added
- **Past Shows Support** - Different RSVP for past events
  - "I was there!" / "Clear" options for past shows
  - Conditional RSVP display based on event date
  - Year display when necessary in time formatting
- **Show Management Improvements**
  - Conditional delete option based on show status
  - Proper handling of edit/delete for past shows
  - Ticket button only for upcoming shows

### Changed
- Enhanced time formatting to include year when needed
- Improved name formatting validation
- Safe RSVP data handling with optional chaining
- Better date validation (removed one-year past restriction)

---

## [0.5.0] - 2025-09-09

### Added
- **Database Schema** - Complete Supabase setup
  - `shows` table with comprehensive fields
  - `rsvps` table with composite primary key
  - Optimized indexes for performance
  - Row Level Security (RLS) policies
- **Pagination for Past Shows** - API-level pagination
  - 20 shows per page
  - Efficient database queries
  - Integrated RSVP data in responses
- **Enhanced README** - PWA features documentation
  - Detailed setup instructions
  - Feature documentation
  - Database setup guide

### Changed
- Refactored RSVP handling for better type safety
- Optimized API responses with integrated RSVP data
- Improved show management UI
- Better RSVP validation and sanitization

### Removed
- Separate database schema file (consolidated into complete setup SQL)

---

## [0.4.0] - 2025-09-09

### Added
- **Smart Time Picker** - Realistic show times
  - Starts at 3:00 PM
  - Cycles to 2:00 AM next day
  - Index-based hour calculation
  - No more scrolling through 3 AM times!
- **RSVP Functionality** - Going/Maybe/Not Going
  - RSVP cards in show components
  - Real-time RSVP updates
  - RSVP fetching logic
  - RSVP status display

### Changed
- Refactored time selection in AddShowModal and EditShowModal
- Improved RSVP data structure

---

## [0.3.0] - 2025-09-09

### Added
- **Password Visibility Toggle** - Show/hide password
- **Loading Skeletons** - Better loading experience
  - ShowCardSkeleton components
  - Smooth loading transitions
- **Password Gate** - Access control
  - Simple shared password system
  - Updated title in PasswordGate component

---

## [0.1.0] - 2025-09-09

### Added
- Initial release of Show Tracker
- **Core Features**
  - Password-protected access
  - Show management (Add/Edit/Delete)
  - Basic RSVP system
  - Next.js 15 App Router
  - Supabase integration
  - TypeScript support
  - Tailwind CSS styling
  - Responsive design

---

## Release Tags

- `v1.6.5` - October 3, 2025 - Toast notifications and show duplication
- `v1.2.1` - September 18, 2025 - Enhanced service worker and manifest
- `v1.1.0` - September 15, 2025 - Community Release Radar and Spotify integration

---

## Migration Notes

### Upgrading to 1.6.0
- Run database migration to add `show_artists` JSONB field
- Add GIN index: `CREATE INDEX idx_shows_artists_gin ON shows USING gin(show_artists);`
- Update environment variables to include Spotify API credentials

### Upgrading to 1.5.0
- No database changes required
- Add `recharts` dependency: `npm install recharts`

### Upgrading to 1.1.0
- Run database migration to create `artists`, `releases`, and `user_artists` tables
- Add Spotify API credentials to environment variables:
  - `SPOTIFY_CLIENT_ID`
  - `SPOTIFY_CLIENT_SECRET`
- Optional: Set up GitHub Actions for automated release checking

### Upgrading to 0.9.0
- Add Vercel Blob storage token to environment variables
- Run database migration to add `poster_url`, `google_photos_url`, `spotify_url`, `apple_music_url` fields

---

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## Contributors

- Tofazzal (Emon Tofazzal) - Creator and primary maintainer

---

## Links

- [Repository](https://github.com/emonhoque/show-tracker)
- [Issues](https://github.com/emonhoque/show-tracker/issues)
- [Pull Requests](https://github.com/emonhoque/show-tracker/pulls)
- [License](LICENSE)
