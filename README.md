<div align="center">

# 🎵 Show Tracker

**A modern Progressive Web App for groups to track concerts and manage RSVPs**

[![Version](https://img.shields.io/badge/version-1.6.5-blue)](https://github.com/emonhoque/show-tracker/releases)
[![Next.js](https://img.shields.io/badge/Next.js-15.5.2-black)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19.1.0-blue)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen)](CONTRIBUTING.md)

Built with Next.js 15.5.2 and Supabase, featuring offline capabilities and native app-like experience.

</div>

---

## 📖 Table of Contents

- [Why Show Tracker?](#-why-show-tracker)
- [Features](#-features)
- [Quick Start](#-quick-start)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Usage](#-usage)
- [Deployment](#-deployment)
- [API Reference](#-api-reference)
- [Tech Stack](#-tech-stack)
- [Performance](#-performance)
- [Troubleshooting](#-troubleshooting)
- [FAQ](#-faq)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 Why Show Tracker?

Keep your concert group organized with:
- **Shared calendar** - Everyone sees upcoming shows at a glance
- **Easy RSVPs** - Know who's going where
- **New music tracking** - Never miss releases from your favorite artists
- **Year-end stats** - See your concert history and trends
- **Works offline** - Install as an app, use anywhere

Built for music lovers who attend lots of shows and want to stay coordinated.

## ✨ Features

### Core Functionality
- 🔐 **Password-protected access** - Simple shared password with show/hide toggle
- 📅 **Show management** - Add, edit, delete, and duplicate shows with intuitive time picker
- ✅ **Smart RSVP system** - Going/Maybe/Not Going for upcoming shows, I was there!/Clear for past shows
- 🔍 **Advanced filtering** - Filter by status and people with smart AND logic for complex queries
- 🔔 **Toast notifications** - Real-time feedback for all user actions
- 📋 **Copy & share** - One-click copy of show details for easy sharing

### Music & Artists
- 🎶 **Community Release Radar** - Track new releases from any artist the community adds
- 🔍 **Artist Search** - Search and add artists to shows via Spotify API
- 🎵 **Music integration** - Spotify and Apple Music links for shows
- 🎯 **Headliner tracking** - Mark and track headliners in your year-end recap
- 🖼️ **Artist images** - Automatic artist photos from Spotify

### Data & Analytics
- 📈 **Year-end Recap** - Comprehensive analytics with leaderboards, monthly trends, and personal stats
- 📅 **Calendar Export** - Export shows to Google Calendar or download .ics files with custom duration
- 📊 **Performance monitoring** - Vercel Speed Insights integration
- 📸 **Photo sharing** - Google Photos links for past shows
- 🖼️ **Poster uploads** - Upload and display show posters with Vercel Blob storage

### PWA & Performance
- 📱 **Progressive Web App** - Installable on mobile and desktop devices
- 🌐 **Offline capabilities** - Works without internet connection with graceful degradation
- ⚡ **Instant updates** - Optimistic UI updates for immediate feedback
- 🚀 **High-performance** - Optimized queries, indexes, and caching (80% fewer database calls)
- 📄 **Infinite scroll** - Efficient loading of past shows (20 per page)
- 🔄 **Auto-recovery** - Automatic chunk loading error recovery with cache clearing
- 🎨 **Dark/light theme** - System preference detection with manual toggle
- 🕐 **Smart time picker** - Realistic show times (3 PM to 2 AM)
- 📊 **Intelligent sorting** - Next show first (upcoming), newest first (past)

### Integrations
- 🔔 **Discord Integration** - Optional Discord bot notifications for new and updated shows
- 🤖 **Automated updates** - GitHub Actions for release checking (4x daily)
- ⚙️ **Auto-versioning** - Automated cache busting on deployment

## 🚀 Quick Start

**Want to try it first?** Check out the live demo with mock data at: [https://show-tracker.emontofazzal.com/](https://show-tracker.emontofazzal.com/)

**Want to run locally in 5 minutes?** Follow these steps:

## ✅ Prerequisites

Before you begin, ensure you have:
- ✅ **Node.js 18+** installed ([Download](https://nodejs.org))
- ✅ **A Supabase account** ([Sign up free](https://supabase.com))
- ✅ **A Spotify Developer account** for Release Radar ([Register](https://developer.spotify.com))
- ⚠️ *Optional:* Vercel account for deployment
- ⚠️ *Optional:* Discord bot for notifications

**Check your Node.js version:**
```bash
node --version  # Should be 18.x or higher
```

## 📦 Installation

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

## ⚙️ Configuration

Create a `.env.local` file in the root directory with the following variables:

| Variable | Required | Description | Example |
|----------|:--------:|-------------|---------|
| `NEXT_PUBLIC_APP_PASSWORD` | ✅ | Shared access password for the app | `boston-shows-2024` |
| `SUPABASE_URL` | ✅ | Your Supabase project URL | `https://xxx.supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ | Supabase service role key | `eyJhbGc...` |
| `SPOTIFY_CLIENT_ID` | ✅ | Spotify API client ID | `abc123...` |
| `SPOTIFY_CLIENT_SECRET` | ✅ | Spotify API client secret | `xyz789...` |
| `TZ` | ✅ | Your timezone | `America/New_York` |
| `BLOB_READ_WRITE_TOKEN` | ⚠️ | Vercel Blob storage token | Auto-generated on Vercel |
| `DISCORD_BOT_API_URL` | ❌ | Discord webhook URL for notifications | `https://your-bot.com/api` |
| `CRON_SECRET` | ❌ | Secret for securing cron endpoints | Any random string |

**Minimal `.env.local` example:**
   ```env
   NEXT_PUBLIC_APP_PASSWORD="your-chosen-password"
   SUPABASE_URL=your_supabase_project_url
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   SPOTIFY_CLIENT_ID=your_spotify_client_id
   SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
   TZ=America/New_York
   ```

<details>
<summary><strong>🔧 Advanced Configuration (Click to expand)</strong></summary>

### Spotify API Setup
1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Create a new app
3. Copy Client ID and Client Secret to your `.env.local`
4. No redirect URI needed for this application

### Discord Bot Integration
1. Set up a Discord bot with webhook capabilities
2. Configure the webhook endpoint URL
3. Add `DISCORD_BOT_API_URL` to your environment variables
4. Notifications are sent asynchronously and won't block operations

### Vercel Blob Storage
1. Deploy to Vercel (or set up locally)
2. Enable Vercel Blob in your project settings
3. Token is auto-generated in production
4. For local development, use `blob` as placeholder

### GitHub Actions (Automated Release Checks)
See [GITHUB_ACTIONS_SETUP.md](GITHUB_ACTIONS_SETUP.md) for detailed instructions.

</details>

5. **Run the application**
   ```bash
   npm run dev
   ```

6. **Visit** [http://localhost:3000](http://localhost:3000)

---

## 📖 Usage

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

## 🚀 Deployment

### Deploy to Vercel (Recommended)

The easiest way to deploy is using [Vercel](https://vercel.com):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/emonhoque/show-tracker)

**Manual deployment:**
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add your environment variables in Vercel's dashboard (see [Configuration](#%EF%B8%8F-configuration))
4. Deploy!

> **Note:** Vercel automatically generates `BLOB_READ_WRITE_TOKEN` for Blob storage.

### Other Platforms

This app can be deployed to any platform that supports Next.js 15:
- **Netlify** - Configure build command: `npm run build`
- **Railway** - Add Dockerfile or use Node.js template
- **Self-hosted** - Run `npm run build && npm start`

> **Important:** For platforms other than Vercel, you'll need to configure alternative file storage for poster uploads (currently uses Vercel Blob).

## 🛠️ Tech Stack

### Core Framework
- **[Next.js](https://nextjs.org)** 15.5.2 - React framework with App Router
- **[React](https://react.dev)** 19.1.0 - UI library
- **[TypeScript](https://www.typescriptlang.org)** 5.x - Type safety

### Styling & UI
- **[Tailwind CSS](https://tailwindcss.com)** 4.x - Utility-first CSS
- **[Radix UI](https://radix-ui.com)** - Accessible component primitives
- **[Lucide React](https://lucide.dev)** - Icon library
- **[Recharts](https://recharts.org)** - Data visualization

### Backend & Data
- **[Supabase](https://supabase.com)** - PostgreSQL database with RLS
- **[Vercel Blob](https://vercel.com/storage/blob)** - File storage for posters
- **[Spotify API](https://developer.spotify.com)** - Music data

### Utilities
- **[date-fns](https://date-fns.org)** - Date manipulation with timezone support
- **[class-variance-authority](https://cva.style)** - Component variants
- **[clsx](https://github.com/lukeed/clsx)** & **[tailwind-merge](https://github.com/dcastil/tailwind-merge)** - Class management

### Performance & Monitoring
- **[Vercel Speed Insights](https://vercel.com/analytics)** - Performance tracking
- **Optimized Database** - Strategic indexing and caching
- **Service Worker** - Offline capabilities and caching

### Development
- **[ESLint](https://eslint.org)** - Code linting
- **[React Testing Library](https://testing-library.com)** - Component testing
- **GitHub Actions** - Automated release checking

## 🗄️ Database Setup

The app uses a single, comprehensive database setup file ([database-complete-setup.sql](database-complete-setup.sql)) that includes:

### Tables
- **`shows`** - Show information with JSONB artist data
- **`rsvps`** - RSVP tracking with composite primary key
- **`artists`** - Spotify artist data for release tracking
- **`releases`** - Music releases from tracked artists
- **`user_artists`** - Many-to-many relationship for community tracking

### Key Features
- **Optimized indexes** - For upcoming/past shows and RSVP joins
- **Row Level Security (RLS)** - Streamlined policies for performance
- **JSONB fields** - Flexible artist and metadata storage
- **Cascading deletes** - Automatic cleanup of related data
- **Statistics** - Pre-analyzed for optimal query planning

### Schema Highlights
**Shows table fields:**
- `title`, `date_time`, `time_local`, `city`, `venue`
- `ticket_url`, `spotify_url`, `apple_music_url`, `google_photos_url`
- `poster_url`, `notes`
- `show_artists` (JSONB) - Flexible artist data with roles

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

## ⚡ Performance

Show Tracker is optimized for speed and efficiency:

### Metrics
- **80% fewer database calls** - From 11+ queries to just 2 per page load
- **2-5x faster queries** - Optimized database structure and indexes
- **Instant RSVP updates** - Optimistic UI, no waiting for server
- **< 150KB bundle** - Efficient code splitting and lazy loading

### Database Optimizations
- ✅ **Combined queries** - Shows and RSVPs in single calls (eliminates N+1)
- ✅ **Strategic indexes** - Optimized for upcoming/past shows and joins
- ✅ **Streamlined RLS** - Simplified policies for better performance
- ✅ **Response caching** - API responses cached (1-5 minutes)
- ✅ **JSONB storage** - Efficient artist data without extra joins

### Frontend Optimizations
- ✅ **Optimistic updates** - Immediate UI feedback, background sync
- ✅ **Infinite scroll** - Paginated past shows (20 at a time)
- ✅ **Skeleton loading** - Smooth loading states, no layout shifts
- ✅ **Smart caching** - Service worker for static assets
- ✅ **Code splitting** - Route-based and component lazy loading
- ✅ **Error recovery** - Automatic chunk load error handling

### PWA Performance
- ✅ **Offline-first** - Critical data cached for offline access
- ✅ **Background sync** - Updates when connection restored
- ✅ **Install prompts** - Native app-like installation
- ✅ **Auto-updates** - Service worker updates on new deployment

## 🔒 Security

- ✅ **Input validation** - All user inputs validated and sanitized
- ✅ **Row Level Security** - Supabase RLS policies protect data
- ✅ **File upload security** - Type and size validation (JPEG, PNG, WebP, max 10MB)
- ✅ **XSS protection** - HTML sanitization prevents script injection
- ✅ **Environment variables** - Sensitive data in `.env.local` (never committed)
- ✅ **HTTPS only** - Secure connections in production
- ✅ **CRON_SECRET** - Optional secret for securing automated endpoints

---

## 🔧 Troubleshooting

### Service Worker Not Updating
- Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
- Clear cache in browser settings
- Check service worker update in DevTools → Application → Service Workers

### Environment Variables Not Loading
- Ensure `.env.local` is in root directory (not in subdirectories)
- Restart dev server after adding/modifying variables: `npm run dev`
- Check Vercel dashboard for production environment variables
- Verify variable names match exactly (case-sensitive)

### Database Connection Issues
- Verify Supabase URL and service role key in `.env.local`
- Check RLS policies are enabled (run `database-complete-setup.sql`)
- Ensure Supabase project is active (not paused)
- Check network connectivity and firewall settings

### Spotify API Errors
- Verify client ID and secret are correct
- Check API credentials haven't expired
- Ensure you're within Spotify API rate limits
- Test credentials at [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)

### Build/Deployment Failures
- Clear Next.js cache: `rm -rf .next`
- Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Check Node.js version: `node --version` (should be 18+)
- Review build logs for specific errors

### Poster Upload Issues
- Ensure `BLOB_READ_WRITE_TOKEN` is set (auto-generated on Vercel)
- Check file size (max 10MB) and type (JPEG, PNG, WebP only)
- Verify Vercel Blob is enabled in project settings
- Check browser console for specific error messages

---

## ❓ FAQ

**Q: Can I use this for my own group?**
A: Absolutely! This project is MIT licensed and designed to be easily customizable for any group.

**Q: Do I need a paid Supabase account?**
A: No, the free tier is sufficient for small to medium groups (up to 500MB database, 50MB file storage).

**Q: Can I customize the password?**
A: Yes, set `NEXT_PUBLIC_APP_PASSWORD` in your environment variables to any password you choose.

**Q: How do I update artist release data?**
A: Set up the GitHub Action (see [GITHUB_ACTIONS_SETUP.md](GITHUB_ACTIONS_SETUP.md)) or manually call `/api/cron/check-releases`.

**Q: Can I deploy to platforms other than Vercel?**
A: Yes, but you'll need to configure alternative file storage (currently uses Vercel Blob). Consider AWS S3, Cloudinary, or Supabase Storage.

**Q: How do I add more people to my group?**
A: Just share the password and URL! Anyone with the password can access and add their name.

**Q: Can I have multiple groups/instances?**
A: Yes, deploy separate instances with different Supabase databases and passwords for each group.

**Q: Is there a mobile app?**
A: The PWA can be installed on mobile devices as an app. Tap "Add to Home Screen" in your browser menu.

**Q: How do I backup my data?**
A: Use Supabase's built-in backup features or export data via their dashboard (Projects → Database → Backups).

---

## 📚 API Reference

<details>
<summary><strong>View API Endpoints</strong></summary>

### Shows API

#### Get Upcoming Shows
```http
GET /api/shows/upcoming
```
Returns all upcoming shows with RSVPs.

#### Get Past Shows (Paginated)
```http
GET /api/shows/past?page=1&limit=20
```
Returns past shows with pagination.

#### Create Show
```http
POST /api/shows
Content-Type: application/json

{
  "title": "Show Title",
  "date_time": "2024-12-31T20:00:00Z",
  "time_local": "20:00",
  "venue": "Venue Name",
  "city": "Boston"
}
```

#### Duplicate Show
```http
POST /api/shows/[id]/duplicate
```
Duplicates a show without RSVPs.

### RSVP API

#### Create/Update RSVP
```http
POST /api/rsvp
Content-Type: application/json

{
  "show_id": "uuid",
  "name": "User Name",
  "status": "going" | "maybe" | "not_going"
}
```

### Artists API

#### Search Artists
```http
GET /api/artists/search?query=artist+name
```
Searches Spotify for artists.

#### Get Releases
```http
GET /api/releases?weeks=13
```
Gets recent releases from tracked artists.

For complete API documentation, see the source code in [app/api/](app/api/).

</details>

---

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

**Quick start for contributors:**
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📄 License

MIT License - feel free to use this project for your own group!

See [LICENSE](LICENSE) for full details.

---

## 🙏 Acknowledgments

Built with amazing open-source technologies:
- [Next.js](https://nextjs.org) - React framework
- [Supabase](https://supabase.com) - Database and backend
- [Radix UI](https://radix-ui.com) - Accessible components
- [Tailwind CSS](https://tailwindcss.com) - Styling
- [Spotify API](https://developer.spotify.com) - Music data
- [Vercel](https://vercel.com) - Hosting and storage

---

<div align="center">

**[⬆ Back to Top](#-show-tracker)**

Made with ❤️ for music lovers everywhere

</div>
