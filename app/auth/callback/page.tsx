'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Suspense } from 'react'

function AuthCallbackContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const handleCallback = async () => {
      const supabase = createClient()
      const next = searchParams.get('next') ?? '/portal'

      // Check for error in URL params (from OAuth provider)
      const errorParam = searchParams.get('error')
      const errorDescription = searchParams.get('error_description')

      if (errorParam) {
        router.push(`/auth/auth-code-error?error=${errorParam}&message=${encodeURIComponent(errorDescription || '')}`)
        return
      }

      // The code is in the URL hash fragment for PKCE flow
      // Supabase client will automatically detect and exchange it
      const { data, error } = await supabase.auth.getSession()

      if (error) {
        console.error('Auth callback error:', error)
        router.push(`/auth/auth-code-error?error=${error.name}&message=${encodeURIComponent(error.message)}`)
        return
      }

      if (data.session) {
        // Successfully authenticated
        router.push(next)
      } else {
        // No session yet, try to exchange the code
        // The code should be in the URL
        const code = searchParams.get('code')

        if (code) {
          const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

          if (exchangeError) {
            console.error('Code exchange error:', exchangeError)
            router.push(`/auth/auth-code-error?error=${exchangeError.name}&message=${encodeURIComponent(exchangeError.message)}`)
            return
          }

          router.push(next)
        } else {
          // No code and no session
          router.push('/auth/auth-code-error?error=no_code&message=No+authentication+code+provided')
        }
      }
    }

    handleCallback()
  }, [router, searchParams])

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Completing sign in...</p>
      </div>
    </div>
  )
}

export default function AuthCallback() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <AuthCallbackContent />
    </Suspense>
  )
}
