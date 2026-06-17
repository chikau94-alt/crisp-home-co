import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // Build a mutable response so Supabase can refresh session cookies.
  let response = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          // Mirror cookies onto both the request and the response.
          for (const { name, value } of cookiesToSet) {
            request.cookies.set(name, value)
          }
          response = NextResponse.next({ request })
          for (const { name, value, options } of cookiesToSet) {
            response.cookies.set(name, value, options)
          }
        },
      },
    },
  )

  // Refresh session (required by @supabase/ssr).
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl

  // Protect /admin — redirect to login if unauthenticated or wrong email.
  if (
    pathname.startsWith('/admin') &&
    pathname !== '/admin/login' &&
    (!user || user.email !== process.env.ADMIN_EMAIL)
  ) {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  // Already logged-in admin hitting login page → send to dashboard.
  if (pathname === '/admin/login' && user?.email === process.env.ADMIN_EMAIL) {
    return NextResponse.redirect(new URL('/admin', request.url))
  }

  return response
}

export const config = {
  matcher: ['/admin/:path*'],
}
