# Show Tracker

A modern, password-protected Progressive Web App (PWA) for groups to track shows and manage RSVPs. Built with Next.js 15.5.2 and Supabase, featuring offline capabilities and native app-like experience.

## Features

- 🔐 **Password-protected access** - Simple shared password with show/hide toggle
- 📅 **Show management** - Add, edit, and delete shows with intuitive time picker
- ✅ **Smart RSVP system** - Going/Maybe/Not Going for upcoming, I was there!/Clear for past shows
- 🔍 **Advanced filtering** - Filter shows by status and people with smart AND logic for multiple selections
- 📱 **Progressive Web App** - Installable on mobile and desktop devices with scroll-to-top
- 🕐 **Smart time picker** - Starts at 3 PM, cycles to 2 PM (realistic show times)
- 📊 **Intelligent sorting** - Next show first (upcoming), newest first (past)
- 🌐 **Offline detection** - Graceful handling when connection is lost
- ⚡ **High-performance database** - Optimized queries, indexes, and caching
- 🚀 **Instant RSVP updates** - Optimistic UI updates for immediate feedback
- 📄 **Pagination** - Efficient loading of past shows (20 per page) with infinite scroll
- 🎨 **Modern UI** - Clean, responsive design with smooth animations and dark/light theme support
- 🎵 **Music integration** - Spotify and Apple Music links for shows
- 📸 **Photo sharing** - Google Photos links for past shows
- 🖼️ **Poster uploads** - Upload and display show posters with Vercel Blob storage
- 🎶 **Community Release Radar** - Track new releases from any artist the community adds
- 🔍 **Artist Search** - Search and add artists to shows and community pool via Spotify API
- 📊 **Performance monitoring** - Vercel Speed Insights integration for performance tracking
- 📈 **Year-end Recap** - Comprehensive analytics with leaderboards, monthly trends, and personal stats
- 📅 **Calendar Export** - Export shows to Google Calendar or download .ics files with custom duration
- 🔔 **Discord Integration** - Optional Discord bot notifications for new and updated shows
- 📋 **Copy Show Info** - One-click copy of show details for sharing
- 🖼️ **Image Modal** - Full-screen poster viewing with zoom capabilities

## Quick Start

### Prerequisites
- Node.js 18+
- A Supabase account
- A Spotify Developer account (for Release Radar feature)

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/emonhoque/show-tracker
   cd show-tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up the database**
   - Create a new project in Supabase
   - Go to SQL Editor and run the contents of `database-complete-setup.sql`
   - This single file sets up tables, indexes, and optimized RLS policies

4. **Configure environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   # Public environment variables (available to client)
   NEXT_PUBLIC_APP_PASSWORD="your-chosen-password"
   
   # Server-only environment variables
   SUPABASE_URL=your_supabase_project_url
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   
   # Timezone configuration
   TZ=America/New_York
   
   # Vercel Storage Blob (optional)
   BLOB_READ_WRITE_TOKEN=blob
   
   # Spotify API (for Release Radar feature)
   SPOTIFY_CLIENT_ID=your_spotify_client_id
   SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
   
   # Cron job security (optional)
   CRON_SECRET=your_secure_random_string
   
   # Discord bot integration (optional)
   DISCORD_BOT_API_URL=your_discord_bot_api_url
   ```

5. **Run the application**
   ```bash
   npm run dev
   ```

6. **Visit** [http://localhost:3000](http://localhost:3000)

## Usage

### Web App
1. Enter the shared password and your name
2. Add shows with the "Add" button
3. RSVP to upcoming shows
4. Past shows are automatically moved to the Past tab
5. Check the "Music" tab to see new music from tracked artists
6. Visit the "Recap" page for year-end analytics and statistics

### PWA Installation
- **Mobile**: Tap "Add to Home Screen" in your browser menu
- **Desktop**: Look for the install button in your browser's address bar
- **Features**: Once installed, scroll-to-top functionality, offline capabilities, and native app-like experience

### Time Picker
- Shows start at 3:00 PM and cycle through to 2:00 PM the next day
- Covers realistic show times from afternoon to late night
- No more scrolling through 3 AM times for evening shows!

### Filtering System
The app includes a powerful filtering system to help you find specific shows:

#### Status Filters
- **All**: Shows all upcoming shows (default)
- **Going**: Shows where people have RSVP'd as "Going"
- **Maybe**: Shows where people have RSVP'd as "Maybe"
- **Not Going**: Shows where people have RSVP'd as "Not Going"

#### People Filters
- **Everyone**: Shows all upcoming shows (default)
- **Individual People**: Filter by specific attendees
- **Smart Logic**: When multiple people are selected, shows only events where ALL selected people have the selected status

#### Filter Examples
- Select "John" + "Taylor" + "Going" = Shows where both John AND Taylor are going
- Select "Going" only = Shows where anyone is going
- Select "Sarah" + "Maybe" = Shows where Sarah is maybe attending

### Release Radar Feature
The app now includes a community-driven Release Radar tracking system:

#### Adding Artists
1. Go to the "Music" tab
2. Click "Add Artist" to search for artists via Spotify
3. Once added, the artist's releases will be visible to all users
4. Artists are shared across the entire community

#### Viewing Releases
- New releases from all tracked artists appear in the Music tab
- Shows releases from the last 13 weeks by default
- Each release shows artist name, release type (album/single/EP), release date, and Spotify link
- Releases are automatically fetched and updated

#### Automatic Updates
- Set up a cron job to call `/api/cron/check-releases` periodically
- This checks all tracked artists for new releases
- New releases are automatically added to the database

### Year-end Recap Feature
The app includes comprehensive analytics and year-end recaps:

#### Personal Analytics
- **Show Statistics**: Total shows attended, average per month, busiest month
- **Venue Tracking**: Most visited venues and attendance patterns
- **Artist Diversity**: Unique artists seen and most frequently seen artists
- **Time Patterns**: Most common days of the week, back-to-back shows
- **Gap Analysis**: Longest breaks between shows and attendance streaks

#### Group Analytics
- **Leaderboard**: Ranked by total shows attended
- **Group Statistics**: Total shows, average per person, most active users
- **Popular Venues**: Most visited venues across the group
- **Artist Popularity**: Most seen artists across all attendees
- **Monthly Trends**: Visual charts showing attendance patterns over time

#### Features
- **Copy Summary**: Generate and copy personalized year-end summaries
- **Year Selection**: View recaps for any year from 2023 onwards
- **Interactive Charts**: Monthly trend visualization with user comparisons
- **Comprehensive Stats**: 20+ different statistics and insights

### Calendar Export Feature
Export shows to your preferred calendar application:

#### Export Options
- **Google Calendar**: Direct integration with Google Calendar
- **ICS Download**: Download .ics files for any calendar app
- **Custom Duration**: Set event duration from 1-6 hours
- **Timezone Support**: Proper timezone handling (America/New_York)

#### Usage
- Click the "Calendar" button on any show card
- Choose between Google Calendar or .ics download
- Set the event duration
- Export with one click

### Show Artists Management
Enhanced show creation with detailed artist information:

#### Features
- **Spotify Integration**: Search and add artists directly from Spotify
- **Custom Artists**: Add artists not found on Spotify
- **Role Assignment**: Mark artists as Headliner or Support
- **Artist Images**: Automatic artist photos from Spotify
- **Spotify Links**: Direct links to artist pages

#### Usage
- When adding/editing shows, use the "Add Artist" button
- Search for artists by name
- Select from Spotify results or add custom artists
- Assign headliner/support roles
- Reorder artists as needed

### Discord Integration
Optional Discord bot notifications for show updates:

#### Features
- **New Show Notifications**: Automatic alerts when shows are added
- **Show Updates**: Notifications when show details change
- **Health Monitoring**: Bot status checking and error handling
- **Async Delivery**: Non-blocking notification system

#### Setup
- Configure `DISCORD_BOT_API_URL` environment variable
- Set up Discord bot with appropriate webhook endpoints
- Notifications are sent asynchronously and won't block show creation

### Additional Features

#### Copy Show Information
- **One-click Copy**: Copy show details including title, date, venue, and links
- **Formatted Text**: Clean, readable format for sharing
- **Mobile Optimized**: Works seamlessly on all devices

#### Image Modal
- **Full-screen Viewing**: Click posters for full-screen display
- **Zoom Capabilities**: Enhanced image viewing experience
- **Mobile Friendly**: Touch-optimized for mobile devices

## Deployment

The easiest way to deploy is using [Vercel](https://vercel.com/new):

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add your environment variables in Vercel's dashboard
4. Deploy!

## Tech Stack

- **Frontend**: Next.js 15.5.2, React 19.1.0, TypeScript 5
- **Styling**: Tailwind CSS 4
- **Database**: Supabase (PostgreSQL) with performance optimizations
- **PWA**: Service Worker, Web App Manifest
- **Icons**: Lucide React
- **Date Handling**: date-fns with timezone support
- **UI Components**: Radix UI primitives
- **Testing**: Jest with React Testing Library
- **File Storage**: Vercel Blob for poster uploads
- **Performance**: Vercel Speed Insights
- **Charts**: Recharts for data visualization
- **Calendar**: ICS generation and Google Calendar integration
- **Deployment**: Vercel (recommended)

## Database Setup

The app uses a single, comprehensive database setup file (`database-complete-setup.sql`) that includes:

- **Tables**: `shows`, `rsvps`, `artists`, `releases`, and `user_artists` with proper relationships
- **Show Fields**: title, date_time, time_local, city, venue, ticket_url, spotify_url, apple_music_url, google_photos_url, poster_url, notes, show_artists
- **Indexes**: Optimized for upcoming/past shows and RSVP joins
- **RLS Policies**: Streamlined for performance and security
- **Statistics**: Updated for optimal query planning

## PWA Features

This app is a fully functional Progressive Web App with:

- **Installable**: Can be installed on mobile and desktop devices
- **Offline capable**: Works without internet connection (with graceful degradation)
- **Native-like experience**: Scroll-to-top, app-like navigation
- **No stale data**: Always fetches fresh show/RSVP data when online
- **Cross-platform**: Works on iOS, Android, Windows, macOS, Linux
- **Theme support**: Dark and light mode with system preference detection
- **Responsive design**: Optimized for all screen sizes
- **Pull-to-refresh**: Native gesture support for refreshing content
- **Chunk error recovery**: Automatic recovery from JavaScript chunk loading failures

## Performance & Technical Details

### Database Optimizations
- **Combined queries**: Shows and RSVPs fetched in single database calls (eliminates N+1 problem)
- **Strategic indexes**: Optimized for upcoming/past shows and RSVP joins
- **RLS optimization**: Streamlined Row Level Security policies for better performance
- **Response caching**: API responses cached with appropriate headers (1-5 minutes)

### Frontend Optimizations
- **Optimistic updates**: RSVP changes feel instant with immediate UI feedback
- **Infinite scroll**: Past shows load 20 at a time with seamless infinite scroll
- **Skeleton loading**: Smooth loading states prevent layout shifts
- **Smart caching**: Static assets cached, API data always fresh
- **Efficient re-renders**: Minimal unnecessary component updates
- **Chunk loading**: Optimized webpack configuration for mobile performance
- **Error handling**: Robust chunk load error recovery with automatic cache clearing

### Performance Impact
- **80% fewer database calls** - From 11+ queries to just 2 per page load
- **2-5x faster queries** - Optimized database structure and indexes
- **Instant RSVP updates** - No waiting for server responses
- **Better scalability** - Handles large numbers of shows efficiently

## Security & Additional Features

### Security
- **Input sanitization**: All user inputs are validated and sanitized
- **Database security**: Row Level Security (RLS) policies for data protection
- **File upload security**: Type and size validation for poster uploads (JPEG, PNG, WebP, max 10MB)
- **XSS protection**: HTML sanitization to prevent cross-site scripting attacks
- **Calendar security**: Proper timezone handling and validation for calendar exports

### User Experience
- **Theme switching**: Dark and light mode with persistent preference
- **Mobile optimization**: Touch-friendly interface with proper mobile gestures
- **Offline indicators**: Clear visual feedback when connection is lost
- **Loading states**: Skeleton loaders and smooth transitions
- **Error handling**: Graceful error recovery and user feedback
- **Image viewing**: Full-screen poster modal with zoom capabilities
- **Copy functionality**: One-click copy of show details for sharing

## License

MIT License - feel free to use this project for your own group!
