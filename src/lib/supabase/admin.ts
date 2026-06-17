import { createClient } from '@supabase/supabase-js'

// Service-role Supabase client. Server-only — never import in Client Components.
// Bypasses Row Level Security; used for booking inserts and admin data reads.
// Returned as a factory so module evaluation never runs at build time.
export function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )
}
