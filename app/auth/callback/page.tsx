'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function AuthCallback() {
  const router = useRouter()

  useEffect(() => {
    const handleCallback = async () => {
      const supabase = createClient()

      // For implicit flow, the tokens are in the URL hash
      // Supabase client automatically detects and handles them
      const { data, error } = await supabase.auth.getSession()

      if (error) {
        console.error('Auth callback error:', error)
        router.push(`/auth/auth-code-error?error=${error.name}&message=${encodeURIComponent(error.message)}`)
        return
      }

      if (data.session) {
        // Successfully authenticated
        router.push('/portal')
      } else {
        // Try to get session from URL hash (implicit flow)
        const hashParams = new URLSearchParams(window.location.hash.substring(1))
        const accessToken = hashParams.get('access_token')

        if (accessToken) {
          // Refresh to pick up the session
          const { error: refreshError } = await supabase.auth.refreshSession()
          if (refreshError) {
            router.push(`/auth/auth-code-error?error=${refreshError.name}&message=${encodeURIComponent(refreshError.message)}`)
            return
          }
          router.push('/portal')
        } else {
          router.push('/auth/auth-code-error?error=no_session&message=No+session+found')
        }
      }
    }

    handleCallback()
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Completing sign in...</p>
      </div>
    </div>
  )
}
