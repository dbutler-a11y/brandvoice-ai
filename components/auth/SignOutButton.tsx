'use client'

import { useState } from 'react'

interface SignOutButtonProps {
  className?: string
  children?: React.ReactNode
}

export default function SignOutButton({
  className = '',
  children
}: SignOutButtonProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleSignOut = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/auth/signout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.redirected) {
        window.location.href = response.url
      } else if (response.ok) {
        // Fallback redirect if the response doesn't redirect automatically
        window.location.href = '/portal/login'
      } else {
        console.error('Error signing out')
        alert('Error signing out. Please try again.')
      }
    } catch (err) {
      console.error('Unexpected error:', err)
      alert('An unexpected error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button
      onClick={handleSignOut}
      disabled={isLoading}
      className={`
        inline-flex items-center justify-center gap-2 rounded-md px-6 py-3
        font-medium transition-colors
        ${isLoading
          ? 'bg-gray-400 cursor-not-allowed'
          : 'bg-red-600 hover:bg-red-700 text-white'
        }
        ${className}
      `}
    >
      {isLoading ? (
        <>
          <svg
            className="animate-spin h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span>Signing out...</span>
        </>
      ) : (
        <>
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          <span>{children || 'Sign Out'}</span>
        </>
      )}
    </button>
  )
}
