'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function AuthCallback() {
  const router = useRouter()
  const [status, setStatus] = useState('Completing sign in...')

  useEffect(() => {
    const handleCallback = async () => {
      const supabase = createClient()

      // Check for error in URL
      const hashParams = new URLSearchParams(window.location.hash.substring(1))
      const errorParam = hashParams.get('error')
      const errorDescription = hashParams.get('error_description')

      if (errorParam) {
        router.push(`/auth/auth-code-error?error=${errorParam}&message=${encodeURIComponent(errorDescription || '')}`)
        return
      }

      // Check URL params for code (PKCE flow)
      const urlParams = new URLSearchParams(window.location.search)
      const code = urlParams.get('code')

      if (code) {
        setStatus('Exchanging code...')
        const { error } = await supabase.auth.exchangeCodeForSession(code)
        if (error) {
          router.push(`/auth/auth-code-error?error=${error.name}&message=${encodeURIComponent(error.message)}`)
          return
        }
        router.push('/portal')
        return
      }

      // For implicit flow, tokens are in the hash - Supabase handles this automatically
      // Just need to wait a moment for it to process
      setStatus('Processing authentication...')

      // Give Supabase a moment to process the hash tokens
      await new Promise(resolve => setTimeout(resolve, 500))

      const { data, error } = await supabase.auth.getSession()

      if (error) {
        console.error('Auth callback error:', error)
        router.push(`/auth/auth-code-error?error=${error.name}&message=${encodeURIComponent(error.message)}`)
        return
      }

      if (data.session) {
        router.push('/portal')
      } else {
        // One more try after a delay
        await new Promise(resolve => setTimeout(resolve, 1000))
        const { data: retryData } = await supabase.auth.getSession()

        if (retryData.session) {
          router.push('/portal')
        } else {
          router.push('/auth/auth-code-error?error=no_session&message=Authentication+completed+but+no+session+found.+Please+try+again.')
        }
      }
    }

    handleCallback()
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">{status}</p>
      </div>
    </div>
  )
}
