import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { buildCSP } from '@/lib/security/csp'

// Security headers to protect against common attacks
const securityHeaders = {
  // Content Security Policy - prevents XSS attacks
  'Content-Security-Policy': buildCSP(),
  // Prevent clickjacking - only allow your site to frame itself
  'X-Frame-Options': 'SAMEORIGIN',
  // Prevent MIME type sniffing
  'X-Content-Type-Options': 'nosniff',
  // Enable XSS filter in older browsers
  'X-XSS-Protection': '1; mode=block',
  // Control referrer information
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  // Prevent DNS prefetching leaks
  'X-DNS-Prefetch-Control': 'on',
  // Permission policy - control browser features
  'Permissions-Policy': 'camera=(), microphone=(self), geolocation=()',
  // Strict Transport Security - force HTTPS (only in production)
  ...(process.env.NODE_ENV === 'production' && {
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
  }),
}

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  // Add security headers to all responses
  Object.entries(securityHeaders).forEach(([key, value]) => {
    if (value) supabaseResponse.headers.set(key, value)
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Refresh session
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl

  // Public routes that don't require authentication
  const publicRoutes = [
    '/',
    '/samples',
    '/blog',
    '/portal/login',
    '/auth/callback',
    '/auth/auth-code-error',
  ]

  // Check if the route starts with /blog/
  const isBlogRoute = pathname.startsWith('/blog/')

  // Check if the route starts with /intake/
  const isIntakeRoute = pathname.startsWith('/intake/')

  // Check if the route is dev-portal (bypasses auth for development)
  const isDevPortalRoute = pathname.startsWith('/dev-portal')

  // Check if the route is exactly /api/spokespersons and is a GET request
  const isPublicSpokespersonsRoute = pathname === '/api/spokespersons' && request.method === 'GET'

  // Allow public routes
  if (publicRoutes.includes(pathname) || isIntakeRoute || isBlogRoute || isDevPortalRoute || isPublicSpokespersonsRoute) {
    return supabaseResponse
  }

  // Protect /portal/* routes (except /portal/login)
  if (pathname.startsWith('/portal')) {
    if (!user) {
      const redirectUrl = new URL('/portal/login', request.url)
      return NextResponse.redirect(redirectUrl)
    }
  }

  // Protect /admin/* routes - require admin role
  if (pathname.startsWith('/admin')) {
    if (!user) {
      const redirectUrl = new URL('/portal/login', request.url)
      return NextResponse.redirect(redirectUrl)
    }

    // Check if user is admin - lookup by email since Supabase auth ID may differ
    const { data: userData } = await supabase
      .from('User')
      .select('role')
      .eq('email', user.email)
      .single()

    if (!userData || userData.role !== 'ADMIN') {
      // Redirect non-admins to portal
      const redirectUrl = new URL('/portal', request.url)
      return NextResponse.redirect(redirectUrl)
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - auth/callback (OAuth callback - needs special handling)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|auth/callback|.*\\.(?:svg|png|jpg|jpeg|gif|webp|mp4|mp3|wav|ogg)$).*)',
  ],
}
