import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Force Node.js runtime (not Edge)
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const error = requestUrl.searchParams.get('error')
  const errorDescription = requestUrl.searchParams.get('error_description')
  const origin = requestUrl.origin

  // Handle OAuth errors from provider
  if (error) {
    return NextResponse.redirect(
      `${origin}/auth/auth-code-error?error=${error}&message=${encodeURIComponent(errorDescription || '')}`
    )
  }

  if (!code) {
    return NextResponse.redirect(
      `${origin}/auth/auth-code-error?error=no_code&message=${encodeURIComponent('No authorization code provided')}`
    )
  }

  const cookieStore = await cookies()
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

  // Get the code verifier from cookies (set during signInWithOAuth)
  const codeVerifier = cookieStore.get('sb-code-verifier')?.value ||
                       cookieStore.get(`sb-${new URL(supabaseUrl).hostname.split('.')[0]}-auth-token-code-verifier`)?.value

  try {
    // Direct API call to Supabase token endpoint - bypassing SDK
    const tokenResponse = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=pkce`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseAnonKey,
      },
      body: JSON.stringify({
        auth_code: code,
        code_verifier: codeVerifier || '',
      }),
    })

    const tokenData = await tokenResponse.json()

    if (!tokenResponse.ok) {
      console.error('Token exchange failed:', tokenData)
      return NextResponse.redirect(
        `${origin}/auth/auth-code-error?error=token_exchange&message=${encodeURIComponent(tokenData.error_description || tokenData.error || 'Token exchange failed')}`
      )
    }

    // Successfully got tokens - set them as cookies
    const { access_token, refresh_token, expires_in } = tokenData

    // Create the session cookie value (matches Supabase format)
    const projectRef = new URL(supabaseUrl).hostname.split('.')[0]
    const cookieName = `sb-${projectRef}-auth-token`

    const sessionData = JSON.stringify({
      access_token,
      refresh_token,
      expires_in,
      expires_at: Math.floor(Date.now() / 1000) + expires_in,
      token_type: 'bearer',
      user: tokenData.user,
    })

    // Set the auth cookie
    const response = NextResponse.redirect(`${origin}/portal`)

    response.cookies.set(cookieName, sessionData, {
      path: '/',
      httpOnly: false, // Supabase needs to read this client-side
      secure: true,
      sameSite: 'lax',
      maxAge: expires_in,
    })

    // Clean up the code verifier cookie
    response.cookies.delete('sb-code-verifier')
    response.cookies.delete(`sb-${projectRef}-auth-token-code-verifier`)

    return response

  } catch (err) {
    console.error('Auth callback error:', err)
    const errorMessage = err instanceof Error ? err.message : String(err)
    return NextResponse.redirect(
      `${origin}/auth/auth-code-error?error=unexpected&message=${encodeURIComponent(errorMessage)}`
    )
  }
}
