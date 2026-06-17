import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

// SSR Supabase client for Server Components and Server Actions.
// Reads/writes session cookies so auth state is preserved across requests.
// Uses anon key — session-scoped access only.
export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            for (const { name, value, options } of cookiesToSet) {
              cookieStore.set(name, value, options)
            }
          } catch {
            // setAll may be called from a Server Component where mutation
            // is not allowed. The middleware handles token refresh instead.
          }
        },
      },
    },
  )
}
