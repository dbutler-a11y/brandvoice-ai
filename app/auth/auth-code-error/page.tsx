'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function AuthCodeErrorContent() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')
  const message = searchParams.get('message')

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-red-100 rounded-xl flex items-center justify-center">
              <svg
                className="w-10 h-10 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Authentication Error
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            There was a problem signing you in. This could be due to:
          </p>
          <ul className="mt-4 text-sm text-left text-gray-600 space-y-2">
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Invalid or expired authentication code</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Session timeout during the authentication process</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>OAuth configuration issue</span>
            </li>
          </ul>
          {(error || message) && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-left">
              <p className="text-xs font-mono text-red-800">
                {error && <span className="block"><strong>Error:</strong> {error}</span>}
                {message && <span className="block mt-1"><strong>Details:</strong> {message}</span>}
              </p>
            </div>
          )}
        </div>

        <div className="bg-white py-8 px-6 shadow-xl rounded-xl border border-gray-100">
          <div className="space-y-4">
            <a
              href="/portal/login"
              className="w-full block text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all shadow-md hover:shadow-lg"
            >
              Try Again
            </a>
            <p className="text-center text-sm text-gray-600">
              Need help?{' '}
              <a
                href="mailto:support@brandvoice.studio"
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Contact Support
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function AuthCodeError() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    }>
      <AuthCodeErrorContent />
    </Suspense>
  )
}
