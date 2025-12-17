# OAuth Authentication Issue - Expert Consultation

## Problem Summary
We have a Next.js 14 application deployed on Vercel that uses Supabase for authentication with Google OAuth. The authentication flow consistently fails with a **"Token exchange failed"** error after the user successfully authenticates with Google.

---

## Technical Stack
- **Framework**: Next.js 14.2.33 (App Router)
- **Hosting**: Vercel (Production)
- **Auth Provider**: Supabase (@supabase/ssr package)
- **OAuth Provider**: Google
- **Domain**: www.brandvoice.studio

---

## The Error
After user authenticates with Google and is redirected back:
```
Error: token_exchange
Details: Token exchange failed
```

The error occurs at the `/auth/callback` route when calling `supabase.auth.exchangeCodeForSession(code)`.

---

## Current Configuration

### Supabase Dashboard Settings

**URL Configuration:**
- Site URL: `https://www.brandvoice.studio`
- Redirect URLs:
  - `https://www.brandvoice.studio/auth/callback`
  - `https://brandvoice.studio/auth/callback`
  - `https://www.brandvoice.studio/**`
  - `https://brandvoice.studio/**`

**Google Provider:**
- Enabled: Yes
- Skip nonce checks: Enabled
- Client ID: `819070388554-tn88opd57sc7hjljv2q8so3u6dqk07d5.apps.googleusercontent.com`
- Client Secret: Set (verified correct, ends with `neb-`)
- Callback URL: `https://ziudcdsctmxuwafouwbi.supabase.co/auth/v1/callback`

### Google Cloud Console Settings

**OAuth 2.0 Client:**
- Type: Web application
- Authorized JavaScript origins:
  - `https://www.brandvoice.studio`
  - `https://brandvoice.studio`
- Authorized redirect URIs:
  - `https://ziudcdsctmxuwafouwbi.supabase.co/auth/v1/callback`

---

## Code Implementation

### 1. Sign-In Button (Client-Side) - `/components/auth/SignInButton.tsx`
```typescript
'use client'

import { createClient } from '@/lib/supabase/client'
import { useState } from 'react'

export default function SignInButton({ redirectTo = '/portal' }) {
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClient()

  const handleSignIn = async () => {
    setIsLoading(true)
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            prompt: 'select_account',
            access_type: 'offline',
          },
        },
      })
      if (error) {
        console.error('OAuth error:', error)
        setIsLoading(false)
      }
    } catch (err) {
      console.error('Unexpected error:', err)
      setIsLoading(false)
    }
  }

  return (
    <button onClick={handleSignIn} disabled={isLoading}>
      Sign in with Google
    </button>
  )
}
```

### 2. Supabase Browser Client - `/lib/supabase/client.ts`
```typescript
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

### 3. Auth Callback Route - `/app/auth/callback/route.ts`
```typescript
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const error = requestUrl.searchParams.get('error')
  const errorDescription = requestUrl.searchParams.get('error_description')
  const origin = requestUrl.origin

  if (error) {
    console.error('OAuth provider error:', error, errorDescription)
    return NextResponse.redirect(
      `${origin}/auth/auth-code-error?error=${error}&message=${encodeURIComponent(errorDescription || '')}`
    )
  }

  if (!code) {
    console.error('No authorization code provided')
    return NextResponse.redirect(
      `${origin}/auth/auth-code-error?error=no_code&message=${encodeURIComponent('No authorization code provided')}`
    )
  }

  const allCookies = request.cookies.getAll()
  console.log('OAuth callback - Received cookies:', allCookies.map(c => c.name))

  let response = NextResponse.redirect(`${origin}/portal`)

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, {
              ...options,
              path: '/',
              httpOnly: name.includes('code-verifier') ? true : false,
              secure: true,
              sameSite: 'lax',
            })
          })
        },
      },
    }
  )

  try {
    const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

    if (exchangeError) {
      console.error('Token exchange failed:', exchangeError.message, exchangeError)
      return NextResponse.redirect(
        `${origin}/auth/auth-code-error?error=token_exchange&message=${encodeURIComponent(exchangeError.message || 'Token exchange failed')}`
      )
    }

    console.log('OAuth callback - Session established for user:', data.user?.email)
    return response

  } catch (err) {
    console.error('Auth callback error:', err)
    const errorMessage = err instanceof Error ? err.message : String(err)
    return NextResponse.redirect(
      `${origin}/auth/auth-code-error?error=unexpected&message=${encodeURIComponent(errorMessage)}`
    )
  }
}
```

### 4. Middleware - `/middleware.ts`
```typescript
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

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
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  await supabase.auth.getUser()

  // Route protection logic...
  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|auth/callback|.*\\.(?:svg|png|jpg|jpeg|gif|webp|mp4|mp3|wav|ogg)$).*)',
  ],
}
```

---

## What We've Verified

1. **Google Cloud Console redirect URI is correct**: `https://ziudcdsctmxuwafouwbi.supabase.co/auth/v1/callback`
2. **Supabase Google provider is enabled** with correct Client ID and Secret
3. **signInWithOAuth is called client-side** (important for PKCE cookie setting)
4. **Using @supabase/ssr package** (not the deprecated auth-helpers)
5. **No spaces in credentials** - verified multiple times
6. **Credentials were regenerated** recently (Dec 14, 2025)

---

## OAuth Flow Analysis

The flow should be:
1. User clicks "Sign in with Google" on `www.brandvoice.studio`
2. `signInWithOAuth()` is called client-side, setting PKCE `code_verifier` cookie
3. User redirected to Google OAuth consent screen
4. Google redirects to Supabase callback: `https://ziudcdsctmxuwafouwbi.supabase.co/auth/v1/callback`
5. Supabase exchanges code for tokens with Google
6. Supabase redirects to our app: `https://www.brandvoice.studio/auth/callback?code=...`
7. Our callback route calls `exchangeCodeForSession(code)` <-- **FAILS HERE**

---

## Hypotheses We've Considered

1. **PKCE cookie not being set** - We moved signInWithOAuth to client-side to fix this
2. **Redirect URI mismatch** - Verified correct in Google Console
3. **Client Secret mismatch** - Verified correct, regenerated recently
4. **www vs non-www mismatch** - Both are in Supabase redirect URLs
5. **Middleware interfering** - Callback route is excluded from middleware matcher
6. **Cookie domain issues** - Could cookies set on www.brandvoice.studio not be accessible?

---

## Environment Variables (Vercel)
```
NEXT_PUBLIC_SUPABASE_URL=https://ziudcdsctmxuwafouwbi.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[set correctly]
```

---

## Questions for You

1. What could cause `exchangeCodeForSession()` to fail with "Token exchange failed" when all configurations appear correct?

2. Is there something in the Supabase PKCE flow that we might be missing?

3. Could there be a timing issue where the code_verifier cookie expires or is lost between steps?

4. Are there any known issues with Supabase OAuth + Vercel + Next.js 14 App Router?

5. Should we try disabling PKCE and using implicit flow instead? Is that even possible with Supabase?

6. Could the issue be on Supabase's side (their auth server) rather than our configuration?

7. Any suggestions for getting more detailed error information from the token exchange?

---

## Logs We've Seen

The Vercel logs show:
- OAuth callback receives cookies (including code_verifier)
- Then immediately: "Token exchange failed"
- No detailed error message from Supabase about WHY it failed

---

## What We Need

A solution or diagnostic steps to identify why the token exchange is failing despite seemingly correct configuration on all sides (Google Console, Supabase Dashboard, and our application code).
