'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'

export default function PortalLoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)
  const [showEmailForm, setShowEmailForm] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        router.push('/portal')
      } else {
        setIsCheckingAuth(false)
      }
    }
    checkAuth()

    const errorParam = searchParams.get('error')
    const errorDescription = searchParams.get('error_description')
    if (errorParam || errorDescription) {
      setError(errorDescription || 'Authentication failed. Please try again.')
    }
  }, [router, searchParams, supabase])

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      if (data.user) {
        router.push('/portal')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign in')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    // Always use www.brandvoice.studio for consistency with PKCE cookies
    const getCallbackUrl = () => {
      if (typeof window === 'undefined') return '/auth/callback'
      const hostname = window.location.hostname
      // In production, always use www.brandvoice.studio to match cookie domain
      if (hostname.includes('brandvoice.studio')) {
        return 'https://www.brandvoice.studio/auth/callback'
      }
      // For local development and other environments
      return `${window.location.origin}/auth/callback`
    }

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: getCallbackUrl(),
        queryParams: {
          prompt: 'select_account',
          access_type: 'offline',
        },
      },
    })
    if (error) setError(error.message)
  }

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#f8f4ff] via-[#fdf2f8] to-white flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-12 h-12 mx-auto">
            <div className="absolute inset-0 rounded-full border-2 border-purple-200"></div>
            <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-purple-600 animate-spin"></div>
          </div>
          <p className="mt-4 text-gray-500 text-sm">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-12 lg:px-16 xl:px-24 relative bg-gradient-to-b from-[#f8f4ff] via-[#fdf2f8] to-white">
        {/* Animated gradient orbs - matching homepage */}
        <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-gradient-to-br from-purple-200/40 to-pink-200/40 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-gradient-to-br from-indigo-200/30 to-purple-200/30 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>

        <div className="relative z-10 max-w-md mx-auto w-full">
          {/* Logo */}
          <Link href="/" className="inline-flex items-center gap-3 mb-12 group">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <span className="text-xl font-semibold text-gray-900">BrandVoice</span>
          </Link>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-3 tracking-tight">
            Welcome back
          </h1>
          <p className="text-gray-500 text-lg mb-10">
            Sign in to access your AI spokespersons and content
          </p>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl text-sm">
              {error}
            </div>
          )}

          {/* OAuth Buttons */}
          <div className="space-y-3 mb-6">
            {/* Google Sign In */}
            <button
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-white hover:bg-gray-50 border border-gray-200 hover:border-gray-300 rounded-2xl text-gray-700 font-medium transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span>Continue with Google</span>
            </button>

            {/* Email Sign In Toggle */}
            <button
              onClick={() => setShowEmailForm(!showEmailForm)}
              className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-white hover:bg-gray-50 border border-gray-200 hover:border-gray-300 rounded-2xl text-gray-700 font-medium transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span>Continue with Email</span>
            </button>

            {/* Apple Sign In (Coming Soon) */}
            <button
              disabled
              className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-gray-400 font-medium cursor-not-allowed"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
              <span>Continue with Apple</span>
              <span className="text-xs bg-gray-200 text-gray-500 px-2 py-0.5 rounded-full">Soon</span>
            </button>
          </div>

          {/* Email Form */}
          {showEmailForm && (
            <form onSubmit={handleEmailLogin} className="space-y-4 mb-6 p-6 bg-white rounded-2xl border border-gray-100 shadow-sm animate-in slide-in-from-top-2 duration-200">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 text-gray-900 placeholder-gray-400 transition-all outline-none"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 text-gray-900 placeholder-gray-400 transition-all outline-none"
                  placeholder="Enter your password"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white py-3.5 px-4 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>

              <button
                type="button"
                onClick={async () => {
                  if (!email) {
                    setError('Please enter your email address first');
                    return;
                  }
                  setLoading(true);
                  try {
                    const { error } = await supabase.auth.resetPasswordForEmail(email, {
                      redirectTo: `${window.location.origin}/portal/reset-password`,
                    });
                    if (error) throw error;
                    setError(null);
                    alert('Password reset email sent! Check your inbox.');
                  } catch (err) {
                    setError(err instanceof Error ? err.message : 'Failed to send reset email');
                  } finally {
                    setLoading(false);
                  }
                }}
                className="w-full text-center text-sm text-gray-500 hover:text-purple-600 transition-colors"
              >
                Forgot your password?
              </button>
            </form>
          )}

          {/* Footer Links */}
          <div className="pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Need help?{' '}
              <a href="mailto:support@brandvoice.ai" className="text-purple-600 hover:text-purple-700 font-medium">
                Contact Support
              </a>
            </p>
          </div>

          {/* Terms */}
          <p className="mt-6 text-xs text-gray-400">
            By continuing, you agree to BrandVoice&apos;s{' '}
            <Link href="/terms" className="text-gray-500 hover:text-purple-600 underline underline-offset-2">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="text-gray-500 hover:text-purple-600 underline underline-offset-2">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>

      {/* Right Side - Image Background */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
        {/* Liquid Metal Image */}
        <Image
          src="/images/login-hero.png"
          alt="Abstract liquid metal"
          fill
          className="object-cover"
          priority
        />

        {/* Soft gradient overlay to blend with left side */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#fdf2f8]/80 via-transparent to-transparent" />

        {/* Bottom gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#f8f4ff]/60 to-transparent" />

        {/* Floating badge */}
        <div className="absolute bottom-12 left-12 bg-white/90 backdrop-blur-xl rounded-2xl p-6 shadow-2xl max-w-xs">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-gray-900">Trusted by 500+</p>
              <p className="text-sm text-gray-500">brands worldwide</p>
            </div>
          </div>
          <div className="flex -space-x-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 ring-2 ring-white" />
            ))}
            <div className="w-8 h-8 rounded-full bg-gray-100 ring-2 ring-white flex items-center justify-center text-xs font-medium text-gray-600">
              +99
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
