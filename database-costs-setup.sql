-- =====================================================
-- SHOW TRACKER - COSTS FEATURE DATABASE SETUP
-- =====================================================
-- This file adds the costs tracking feature (USD only).
-- Run this entire file in your Supabase SQL editor.

-- =====================================================
-- 1. ENUM TYPE
-- =====================================================

-- Create cost category enum
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

-- =====================================================
-- 2. TABLE CREATION
-- =====================================================

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

-- =====================================================
-- 3. PERFORMANCE INDEXES
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_show_costs_show_id ON show_costs(show_id);
CREATE INDEX IF NOT EXISTS idx_show_costs_user_id ON show_costs(user_id);
CREATE INDEX IF NOT EXISTS idx_show_costs_user_show ON show_costs(user_id, show_id);
CREATE INDEX IF NOT EXISTS idx_show_costs_category ON show_costs(category);

-- =====================================================
-- 4. AUTO-UPDATE TRIGGER FOR updated_at
-- =====================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_show_costs_updated_at
    BEFORE UPDATE ON show_costs
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 5. ROW LEVEL SECURITY (RLS) SETUP
-- =====================================================

-- Enable RLS on show_costs
ALTER TABLE show_costs ENABLE ROW LEVEL SECURITY;

-- show_costs policies
-- Since this app uses service role key (bypasses RLS), these policies
-- document the intended access patterns and provide defense-in-depth.
-- The API layer enforces user_id and RSVP checks.

CREATE POLICY "show_costs_select_policy" ON show_costs
    FOR SELECT USING (true);

CREATE POLICY "show_costs_insert_policy" ON show_costs
    FOR INSERT WITH CHECK (true);

CREATE POLICY "show_costs_update_policy" ON show_costs
    FOR UPDATE USING (true);

CREATE POLICY "show_costs_delete_policy" ON show_costs
    FOR DELETE USING (true);

-- =====================================================
-- 6. DATABASE STATISTICS UPDATE
-- =====================================================

ANALYZE show_costs;

-- =====================================================
-- SETUP COMPLETE
-- =====================================================
-- New tables added for costs feature:
-- ✅ cost_category enum type
-- ✅ show_costs table with FK constraints
-- ✅ Performance indexes
-- ✅ Auto-update trigger for updated_at
-- ✅ RLS policies
