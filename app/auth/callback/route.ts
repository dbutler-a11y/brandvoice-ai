import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const error = requestUrl.searchParams.get('error')
  const errorDescription = requestUrl.searchParams.get('error_description')

  // Determine the origin for redirects
  const origin = requestUrl.origin

  // Handle OAuth errors
  if (error) {
    return NextResponse.redirect(
      `${origin}/auth/auth-code-error?error=${error}&message=${encodeURIComponent(errorDescription || '')}`
    )
  }

  if (code) {
    const cookieStore = await cookies()

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options)
            })
          },
        },
      }
    )

    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

    if (exchangeError) {
      console.error('Code exchange error:', exchangeError)
      return NextResponse.redirect(
        `${origin}/auth/auth-code-error?error=${exchangeError.name}&message=${encodeURIComponent(exchangeError.message)}`
      )
    }

    // Successfully exchanged code for session
    return NextResponse.redirect(`${origin}/portal`)
  }

  // No code provided - redirect to error page
  return NextResponse.redirect(
    `${origin}/auth/auth-code-error?error=no_code&message=${encodeURIComponent('No authorization code provided')}`
  )
}
