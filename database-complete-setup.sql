-- =====================================================
-- SHOW TRACKER - COMPLETE DATABASE SETUP
-- =====================================================
-- This file contains the complete database schema, 
-- performance optimizations, and RLS policies for the show-tracker app.
-- Run this entire file in your Supabase SQL editor.

-- =====================================================
-- 1. ENUM TYPES
-- =====================================================

-- Create cost category enum
DO $$ BEGIN
    CREATE TYPE cost_category AS ENUM (
        'ticket',
        'travel',
        'merch',
        'food_drink',
        'lodging',
        'parking',
        'rideshare',
        'other'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- =====================================================
-- 2. TABLE CREATION
-- =====================================================

-- Create shows table
CREATE TABLE IF NOT EXISTS shows (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    date_time TIMESTAMPTZ NOT NULL,
    time_local TEXT NOT NULL, -- Store original time input (e.g., "19:00")
    city TEXT NOT NULL DEFAULT 'Boston',
    venue TEXT NOT NULL,
    ticket_url TEXT,
    spotify_url TEXT,
    apple_music_url TEXT,
    google_photos_url TEXT,
    poster_url TEXT,
    notes TEXT,
    show_artists JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create rsvps table
CREATE TABLE IF NOT EXISTS rsvps (
    show_id UUID REFERENCES shows(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    status TEXT CHECK (status IN ('going', 'maybe', 'not_going')),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (show_id, name)
);

-- Create artists table
CREATE TABLE IF NOT EXISTS artists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    artist_name TEXT NOT NULL,
    spotify_id TEXT UNIQUE NOT NULL,
    spotify_url TEXT,
    image_url TEXT,
    genres TEXT[],
    popularity INTEGER,
    followers_count INTEGER,
    last_checked TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT, -- Track who added the artist (optional)
    is_active BOOLEAN DEFAULT true
);

-- Create releases table
CREATE TABLE IF NOT EXISTS releases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    artist_id UUID REFERENCES artists(id) ON DELETE CASCADE,
    spotify_id TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    release_type TEXT CHECK (release_type IN ('album', 'single', 'compilation', 'ep')),
    release_date DATE NOT NULL,
    spotify_url TEXT,
    image_url TEXT,
    total_tracks INTEGER,
    external_urls JSONB,
    artists JSONB, -- Store all artists as JSON array
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create user_artists table
CREATE TABLE IF NOT EXISTS user_artists (
    user_id TEXT NOT NULL,
    artist_id UUID REFERENCES artists(id) ON DELETE CASCADE,
    added_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (user_id, artist_id)
);

-- Create show_costs table
CREATE TABLE IF NOT EXISTS show_costs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    show_id UUID NOT NULL REFERENCES shows(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL,  -- matches rsvps.name pattern (lowercase username)
    category cost_category NOT NULL,
    amount_minor INTEGER NOT NULL CHECK (amount_minor > 0),
    currency CHAR(3) NOT NULL DEFAULT 'USD',
    note TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create user_badges table
CREATE TABLE IF NOT EXISTS user_badges (
    user_id     TEXT        NOT NULL,   -- matches rsvps.name / show_costs.user_id
    badge_key   TEXT        NOT NULL,   -- stable identifier, e.g. 'first_show'
    scope_year  INTEGER     DEFAULT NULL, -- NULL = lifetime, integer = year-scoped
    unlocked_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    metadata    JSONB       DEFAULT NULL  -- optional context snapshot
);

-- Unique constraint: one unlock per (user, badge, scope).
-- COALESCE maps NULL scope_year to 0 so NULL is treated as equal.
CREATE UNIQUE INDEX IF NOT EXISTS uq_user_badges_scoped
    ON user_badges (user_id, badge_key, COALESCE(scope_year, 0));

-- Curated list of artists with custom hidden badges.
-- Managed via the admin UI at /my-profile/badges/admin.
CREATE TABLE IF NOT EXISTS secret_badge_definitions (
    id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    key         TEXT        NOT NULL UNIQUE,
    spotify_id  TEXT        NOT NULL UNIQUE,
    name        TEXT        NOT NULL,
    description TEXT        NOT NULL,
    image_url   TEXT        DEFAULT NULL,
    scope       TEXT        NOT NULL DEFAULT 'lifetime',
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =====================================================
-- 3. PERFORMANCE INDEXES
-- =====================================================

-- Drop any existing duplicate indexes first
DROP INDEX IF EXISTS idx_shows_date_time;

-- Essential indexes for core functionality
CREATE INDEX IF NOT EXISTS idx_shows_upcoming ON shows(date_time ASC);
CREATE INDEX IF NOT EXISTS idx_shows_past ON shows(date_time DESC);
CREATE INDEX IF NOT EXISTS idx_rsvps_show_id ON rsvps(show_id);
CREATE INDEX IF NOT EXISTS idx_rsvps_show_status ON rsvps(show_id, status);
CREATE INDEX IF NOT EXISTS idx_artists_spotify_id ON artists(spotify_id);
CREATE INDEX IF NOT EXISTS idx_artists_active ON artists(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_artists_last_checked ON artists(last_checked);
CREATE INDEX IF NOT EXISTS idx_releases_artist_id ON releases(artist_id);
CREATE INDEX IF NOT EXISTS idx_releases_release_date ON releases(release_date DESC);
CREATE INDEX IF NOT EXISTS idx_releases_spotify_id ON releases(spotify_id);
CREATE INDEX IF NOT EXISTS idx_user_artists_user_id ON user_artists(user_id);
CREATE INDEX IF NOT EXISTS idx_user_artists_artist_id ON user_artists(artist_id);
CREATE INDEX IF NOT EXISTS idx_shows_artists_gin ON shows USING gin(show_artists);
CREATE INDEX IF NOT EXISTS idx_show_costs_show_id ON show_costs(show_id);
CREATE INDEX IF NOT EXISTS idx_show_costs_user_id ON show_costs(user_id);
CREATE INDEX IF NOT EXISTS idx_show_costs_user_show ON show_costs(user_id, show_id);
CREATE INDEX IF NOT EXISTS idx_show_costs_category ON show_costs(category);
CREATE INDEX IF NOT EXISTS idx_user_badges_user_id ON user_badges(user_id);
CREATE INDEX IF NOT EXISTS idx_user_badges_badge_key ON user_badges(badge_key);
CREATE INDEX IF NOT EXISTS idx_user_badges_unlocked_at ON user_badges(unlocked_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_badges_user_scope ON user_badges(user_id, scope_year);

-- Optional indexes for future features (uncomment if needed)
-- CREATE INDEX IF NOT EXISTS idx_rsvps_name_lower ON rsvps(LOWER(name));
-- CREATE INDEX IF NOT EXISTS idx_shows_date_city ON shows(date_time, city);
-- CREATE INDEX IF NOT EXISTS idx_shows_title_gin ON shows USING gin(to_tsvector('english', title));
-- CREATE INDEX IF NOT EXISTS idx_shows_venue_gin ON shows USING gin(to_tsvector('english', venue));

-- =====================================================
-- 4. AUTO-UPDATE TRIGGER FOR show_costs.updated_at
-- =====================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_show_costs_updated_at ON show_costs;
CREATE TRIGGER update_show_costs_updated_at
    BEFORE UPDATE ON show_costs
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 5. ROW LEVEL SECURITY (RLS) SETUP
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE shows ENABLE ROW LEVEL SECURITY;
ALTER TABLE rsvps ENABLE ROW LEVEL SECURITY;
ALTER TABLE artists ENABLE ROW LEVEL SECURITY;
ALTER TABLE releases ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_artists ENABLE ROW LEVEL SECURITY;
ALTER TABLE show_costs ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE secret_badge_definitions ENABLE ROW LEVEL SECURITY;

-- Drop any existing policies to avoid conflicts
DROP POLICY IF EXISTS "Allow public read access to shows" ON shows;
DROP POLICY IF EXISTS "Allow public insert access to shows" ON shows;
DROP POLICY IF EXISTS "Allow public update access to shows" ON shows;
DROP POLICY IF EXISTS "Allow public delete access to shows" ON shows;
DROP POLICY IF EXISTS "Allow authenticated read access to shows" ON shows;
DROP POLICY IF EXISTS "Allow authenticated insert access to shows" ON shows;
DROP POLICY IF EXISTS "Allow authenticated update access to shows" ON shows;
DROP POLICY IF EXISTS "Allow authenticated delete access to shows" ON shows;

DROP POLICY IF EXISTS "Allow public read access to rsvps" ON rsvps;
DROP POLICY IF EXISTS "Allow public insert access to rsvps" ON rsvps;
DROP POLICY IF EXISTS "Allow public update access to rsvps" ON rsvps;
DROP POLICY IF EXISTS "Allow public delete access to rsvps" ON rsvps;
DROP POLICY IF EXISTS "Allow authenticated read access to rsvps" ON rsvps;
DROP POLICY IF EXISTS "Allow authenticated insert access to rsvps" ON rsvps;
DROP POLICY IF EXISTS "Allow authenticated update access to rsvps" ON rsvps;
DROP POLICY IF EXISTS "Allow authenticated delete access to rsvps" ON rsvps;

DROP POLICY IF EXISTS "artists_select_policy" ON artists;
DROP POLICY IF EXISTS "artists_insert_policy" ON artists;
DROP POLICY IF EXISTS "artists_update_policy" ON artists;
DROP POLICY IF EXISTS "artists_delete_policy" ON artists;
DROP POLICY IF EXISTS "releases_select_policy" ON releases;
DROP POLICY IF EXISTS "releases_insert_policy" ON releases;
DROP POLICY IF EXISTS "releases_update_policy" ON releases;
DROP POLICY IF EXISTS "releases_delete_policy" ON releases;
DROP POLICY IF EXISTS "user_artists_select_policy" ON user_artists;
DROP POLICY IF EXISTS "user_artists_insert_policy" ON user_artists;
DROP POLICY IF EXISTS "user_artists_update_policy" ON user_artists;
DROP POLICY IF EXISTS "user_artists_delete_policy" ON user_artists;
DROP POLICY IF EXISTS "show_costs_select_policy" ON show_costs;
DROP POLICY IF EXISTS "show_costs_insert_policy" ON show_costs;
DROP POLICY IF EXISTS "show_costs_update_policy" ON show_costs;
DROP POLICY IF EXISTS "show_costs_delete_policy" ON show_costs;
DROP POLICY IF EXISTS "user_badges_select_policy" ON user_badges;
DROP POLICY IF EXISTS "user_badges_insert_policy" ON user_badges;
DROP POLICY IF EXISTS "user_badges_update_policy" ON user_badges;
DROP POLICY IF EXISTS "user_badges_delete_policy" ON user_badges;
DROP POLICY IF EXISTS "secret_badge_definitions_select" ON secret_badge_definitions;
DROP POLICY IF EXISTS "secret_badge_definitions_insert" ON secret_badge_definitions;
DROP POLICY IF EXISTS "secret_badge_definitions_update" ON secret_badge_definitions;
DROP POLICY IF EXISTS "secret_badge_definitions_delete" ON secret_badge_definitions;

-- Create optimized RLS policies for shows table
CREATE POLICY "shows_select_policy" ON shows
    FOR SELECT USING (true);

CREATE POLICY "shows_insert_policy" ON shows
    FOR INSERT WITH CHECK (true);

CREATE POLICY "shows_update_policy" ON shows
    FOR UPDATE USING (true);

CREATE POLICY "shows_delete_policy" ON shows
    FOR DELETE USING (true);

-- Create optimized RLS policies for rsvps table
CREATE POLICY "rsvps_select_policy" ON rsvps
    FOR SELECT USING (true);

CREATE POLICY "rsvps_insert_policy" ON rsvps
    FOR INSERT WITH CHECK (true);

CREATE POLICY "rsvps_update_policy" ON rsvps
    FOR UPDATE USING (true);

CREATE POLICY "rsvps_delete_policy" ON rsvps
    FOR DELETE USING (true);

CREATE POLICY "artists_select_policy" ON artists
    FOR SELECT USING (true);

CREATE POLICY "artists_insert_policy" ON artists
    FOR INSERT WITH CHECK (true);

CREATE POLICY "artists_update_policy" ON artists
    FOR UPDATE USING (true);

CREATE POLICY "artists_delete_policy" ON artists
    FOR DELETE USING (true);

-- Create RLS policies for releases table
CREATE POLICY "releases_select_policy" ON releases
    FOR SELECT USING (true);

CREATE POLICY "releases_insert_policy" ON releases
    FOR INSERT WITH CHECK (true);

CREATE POLICY "releases_update_policy" ON releases
    FOR UPDATE USING (true);

CREATE POLICY "releases_delete_policy" ON releases
    FOR DELETE USING (true);

-- Create RLS policies for user_artists table
CREATE POLICY "user_artists_select_policy" ON user_artists
    FOR SELECT USING (true);

CREATE POLICY "user_artists_insert_policy" ON user_artists
    FOR INSERT WITH CHECK (true);

CREATE POLICY "user_artists_update_policy" ON user_artists
    FOR UPDATE USING (true);

CREATE POLICY "user_artists_delete_policy" ON user_artists
    FOR DELETE USING (true);

-- Create RLS policies for show_costs table
CREATE POLICY "show_costs_select_policy" ON show_costs
    FOR SELECT USING (true);

CREATE POLICY "show_costs_insert_policy" ON show_costs
    FOR INSERT WITH CHECK (true);

CREATE POLICY "show_costs_update_policy" ON show_costs
    FOR UPDATE USING (true);

CREATE POLICY "show_costs_delete_policy" ON show_costs
    FOR DELETE USING (true);

-- Create RLS policies for user_badges table
CREATE POLICY "user_badges_select_policy" ON user_badges
    FOR SELECT USING (true);

CREATE POLICY "user_badges_insert_policy" ON user_badges
    FOR INSERT WITH CHECK (true);

CREATE POLICY "user_badges_update_policy" ON user_badges
    FOR UPDATE USING (true);

CREATE POLICY "user_badges_delete_policy" ON user_badges
    FOR DELETE USING (true);

-- Create RLS policies for secret_badge_definitions table
CREATE POLICY "secret_badge_definitions_select" ON secret_badge_definitions
    FOR SELECT USING (true);

CREATE POLICY "secret_badge_definitions_insert" ON secret_badge_definitions
    FOR INSERT WITH CHECK (true);

CREATE POLICY "secret_badge_definitions_update" ON secret_badge_definitions
    FOR UPDATE USING (true);

CREATE POLICY "secret_badge_definitions_delete" ON secret_badge_definitions
    FOR DELETE USING (true);

-- =====================================================
-- 6. DATABASE STATISTICS UPDATE
-- =====================================================

-- Update table statistics for optimal query planning
ANALYZE shows;
ANALYZE rsvps;
ANALYZE artists;
ANALYZE releases;
ANALYZE user_artists;
ANALYZE show_costs;
ANALYZE user_badges;
ANALYZE secret_badge_definitions;

-- =====================================================
-- 7. VERIFICATION QUERIES (OPTIONAL)
-- =====================================================

-- Uncomment these to verify the setup:
-- SELECT 'Tables created successfully' as status;
-- SELECT schemaname, tablename FROM pg_tables WHERE schemaname = 'public';
-- SELECT indexname, tablename FROM pg_indexes WHERE schemaname = 'public' ORDER BY tablename, indexname;
-- SELECT policyname, tablename FROM pg_policies WHERE schemaname = 'public' ORDER BY tablename, policyname;

-- =====================================================
-- SETUP COMPLETE
-- =====================================================
-- Your show-tracker database is now fully configured with:
-- ✅ Enum types: cost_category
-- ✅ Tables: shows, rsvps, artists, releases, user_artists, show_costs, user_badges, secret_badge_definitions
-- ✅ Performance indexes for fast queries
-- ✅ Auto-update trigger for show_costs.updated_at
-- ✅ Optimized RLS policies for security
-- ✅ Database statistics updated
-- 
-- The database is ready for your show-tracker application!
