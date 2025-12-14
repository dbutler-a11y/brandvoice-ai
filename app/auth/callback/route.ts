import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') ?? '/portal'
  const error = requestUrl.searchParams.get('error')
  const errorDescription = requestUrl.searchParams.get('error_description')

  // Handle OAuth error
  if (error) {
    return NextResponse.redirect(
      new URL(`/auth/auth-code-error?error=${error}&message=${encodeURIComponent(errorDescription || '')}`, requestUrl.origin)
    )
  }

  if (code) {
    const supabase = await createClient()
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

    if (exchangeError) {
      console.error('Code exchange error:', exchangeError)
      return NextResponse.redirect(
        new URL(`/auth/auth-code-error?error=${exchangeError.name}&message=${encodeURIComponent(exchangeError.message)}`, requestUrl.origin)
      )
    }

    // Successful authentication - redirect to the intended destination
    return NextResponse.redirect(new URL(next, requestUrl.origin))
  }

  // No code provided
  return NextResponse.redirect(
    new URL('/auth/auth-code-error?error=no_code&message=No+authentication+code+provided', requestUrl.origin)
  )
}
