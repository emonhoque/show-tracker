-- =====================================================
-- MIGRATION: USER BADGES
-- =====================================================
-- Adds the user_badges table for tracking unlocked badges.
-- Each (user_id, badge_key) pair can exist at most once.
-- Badge definitions live in application code (lib/badges.ts).
-- Badge images will be stored in Vercel Blob and referenced
-- by convention: {BLOB_BASE}/badges/{badge_key}.png
-- Until images are uploaded, the UI shows a placeholder.

-- =====================================================
-- 1. TABLE CREATION
-- =====================================================

CREATE TABLE IF NOT EXISTS user_badges (
    user_id    TEXT        NOT NULL,   -- matches rsvps.name / show_costs.user_id
    badge_key  TEXT        NOT NULL,   -- stable identifier, e.g. 'first_show'
    unlocked_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    metadata   JSONB       DEFAULT NULL, -- optional context (e.g. which artist, which venue)
    PRIMARY KEY (user_id, badge_key)
);

-- =====================================================
-- 2. INDEXES
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_user_badges_user_id ON user_badges(user_id);
CREATE INDEX IF NOT EXISTS idx_user_badges_badge_key ON user_badges(badge_key);
CREATE INDEX IF NOT EXISTS idx_user_badges_unlocked_at ON user_badges(unlocked_at DESC);

-- =====================================================
-- 3. ROW LEVEL SECURITY
-- =====================================================

ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;

-- Follow the same fully-permissive pattern used by all other tables.
-- Security is enforced at the application layer via the shared
-- password gate and server-side service-role Supabase client.

CREATE POLICY "user_badges_select_policy" ON user_badges
    FOR SELECT USING (true);

CREATE POLICY "user_badges_insert_policy" ON user_badges
    FOR INSERT WITH CHECK (true);

CREATE POLICY "user_badges_update_policy" ON user_badges
    FOR UPDATE USING (true);

CREATE POLICY "user_badges_delete_policy" ON user_badges
    FOR DELETE USING (true);

-- =====================================================
-- 4. STATISTICS
-- =====================================================

ANALYZE user_badges;
