'use client'

import { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

function AuthCallbackContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    const handleCallback = async () => {
      // Check for OAuth errors from provider
      const error = searchParams.get('error')
      const errorDescription = searchParams.get('error_description')

      if (error) {
        console.error('OAuth provider error:', error, errorDescription)
        setStatus('error')
        setErrorMessage(errorDescription || error)
        return
      }

      // Get the authorization code
      const code = searchParams.get('code')

      if (!code) {
        console.error('No authorization code provided')
        setStatus('error')
        setErrorMessage('No authorization code provided')
        return
      }

      // Log cookies for debugging (Trial 4 - verify PKCE cookie presence)
      console.log('OAuth callback - All cookies:', document.cookie)
      console.log('OAuth callback - Code verifier cookie present:', document.cookie.includes('code-verifier'))
      console.log('OAuth callback - Auth code (first 20 chars):', code.substring(0, 20) + '...')

      try {
        // Create Supabase client - this runs in the BROWSER where PKCE cookies are set
        const supabase = createClient()

        console.log('OAuth callback - Attempting token exchange in browser...')

        // Exchange the code for a session - THIS IS THE KEY CHANGE
        // Running in browser means it has access to the PKCE code_verifier cookie
        const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

        if (exchangeError) {
          console.error('Token exchange failed:', {
            message: exchangeError.message,
            status: (exchangeError as any)?.status,
            name: exchangeError.name,
            code: (exchangeError as any)?.code,
          })
          setStatus('error')
          setErrorMessage(exchangeError.message || 'Token exchange failed')
          return
        }

        console.log('OAuth callback - Session established for user:', data.user?.email)
        setStatus('success')

        // Redirect to portal after successful authentication
        const next = searchParams.get('next') || '/portal'
        router.push(next)

      } catch (err) {
        console.error('Auth callback error:', err)
        setStatus('error')
        setErrorMessage(err instanceof Error ? err.message : 'An unexpected error occurred')
      }
    }

    handleCallback()
  }, [router, searchParams])

  // Loading state
  if (status === 'processing') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#f8f4ff] via-[#fdf2f8] to-white flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-12 h-12 mx-auto">
            <div className="absolute inset-0 rounded-full border-2 border-purple-200"></div>
            <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-purple-600 animate-spin"></div>
          </div>
          <p className="mt-4 text-gray-600 text-sm">Completing sign in...</p>
        </div>
      </div>
    )
  }

  // Success state (brief moment before redirect)
  if (status === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#f8f4ff] via-[#fdf2f8] to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto bg-green-100 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="mt-4 text-gray-600 text-sm">Sign in successful! Redirecting...</p>
        </div>
      </div>
    )
  }

  // Error state
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f8f4ff] via-[#fdf2f8] to-white flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        <div className="w-12 h-12 mx-auto bg-red-100 rounded-full flex items-center justify-center">
          <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h1 className="mt-4 text-xl font-semibold text-gray-900">Authentication Failed</h1>
        <p className="mt-2 text-gray-500 text-sm">{errorMessage}</p>
        <button
          onClick={() => router.push('/portal/login')}
          className="mt-6 w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white py-3 px-4 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-600 transition-all"
        >
          Try Again
        </button>
      </div>
    </div>
  )
}

// Loading fallback for Suspense
function LoadingFallback() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f8f4ff] via-[#fdf2f8] to-white flex items-center justify-center">
      <div className="text-center">
        <div className="relative w-12 h-12 mx-auto">
          <div className="absolute inset-0 rounded-full border-2 border-purple-200"></div>
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-purple-600 animate-spin"></div>
        </div>
        <p className="mt-4 text-gray-600 text-sm">Loading...</p>
      </div>
    </div>
  )
}

// Main export with Suspense wrapper for useSearchParams
export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <AuthCallbackContent />
    </Suspense>
  )
}
