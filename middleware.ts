import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
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
    '/portal/login',
    '/auth/callback',
    '/auth/auth-code-error',
  ]

  // Check if the route starts with /intake/
  const isIntakeRoute = pathname.startsWith('/intake/')

  // Check if the route is exactly /api/spokespersons and is a GET request
  const isPublicSpokespersonsRoute = pathname === '/api/spokespersons' && request.method === 'GET'

  // Allow public routes
  if (publicRoutes.includes(pathname) || isIntakeRoute || isPublicSpokespersonsRoute) {
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
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|mp4|mp3|wav|ogg)$).*)',
  ],
}
