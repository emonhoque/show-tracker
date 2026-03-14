import { createClient } from '@supabase/supabase-js'

const isDemo = process.env.NEXT_PUBLIC_DEMO_MODE === 'true'

if (!isDemo && !process.env.SUPABASE_URL) {
  throw new Error('Missing env.SUPABASE_URL')
}
if (!isDemo && !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('Missing env.SUPABASE_SERVICE_ROLE_KEY')
}

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
