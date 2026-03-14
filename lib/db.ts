import { createClient } from '@supabase/supabase-js'

// Demo branch — Supabase env vars are not required.
// The client below uses placeholder values and is never actually called.

// Create Supabase client with service role key for server-side operations
// In demo mode, use placeholder values (the client is never actually used)
export const supabase = createClient(
  process.env.SUPABASE_URL || 'https://placeholder.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-key',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)
