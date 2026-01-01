'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

interface AdminLayoutClientProps {
  children: React.ReactNode
}

const navLinks = [
  { href: '/admin', label: 'Clients', color: 'gray' },
  { href: '/admin/crm', label: 'CRM', color: 'blue' },
  { href: '/admin/spokespersons', label: 'Spokespersons', color: 'gray' },
  { href: '/admin/roadmap', label: 'Roadmap', color: 'gray' },
  { href: '/admin/strategy', label: 'Strategy', color: 'gray' },
  { href: '/admin/alerts', label: 'Alerts', color: 'red' },
  { href: '/admin/reminders', label: 'Reminders', color: 'gray' },
  { href: '/admin/playground', label: 'Playground', color: 'indigo' },
  { href: '/admin/studio', label: 'Studio', color: 'purple' },
]

export default function AdminLayoutClient({ children }: AdminLayoutClientProps) {
  const pathname = usePathname()
  const [showMobileMenu, setShowMobileMenu] = useState(false)

  // Close mobile menu on route change
  useEffect(() => {
    setShowMobileMenu(false)
  }, [pathname])

  const getColorClasses = (color: string, isActive: boolean) => {
    if (isActive) {
      const activeColors: Record<string, string> = {
        gray: 'bg-gray-100 text-gray-900',
        blue: 'bg-blue-50 text-blue-700',
        red: 'bg-red-50 text-red-700',
        indigo: 'bg-indigo-50 text-indigo-700',
        purple: 'bg-purple-50 text-purple-700',
      }
      return activeColors[color] || activeColors.gray
    }
    const hoverColors: Record<string, string> = {
      gray: 'text-gray-700 hover:text-gray-900 hover:bg-gray-100',
      blue: 'text-blue-600 hover:text-blue-800 hover:bg-blue-50',
      red: 'text-red-600 hover:text-red-800 hover:bg-red-50',
      indigo: 'text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50',
      purple: 'text-purple-600 hover:text-purple-800 hover:bg-purple-50',
    }
    return hoverColors[color] || hoverColors.gray
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              {/* Mobile Menu Button */}
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                aria-label="Toggle menu"
              >
                {showMobileMenu ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>

              {/* Logo */}
              <Link href="/admin" className="text-xl font-bold text-gray-900 flex-shrink-0">
                BrandVoice Studio
              </Link>

              {/* Desktop Navigation */}
              <nav className="hidden lg:flex space-x-1">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href ||
                    (link.href !== '/admin' && pathname.startsWith(link.href))
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${getColorClasses(link.color, isActive)}`}
                    >
                      {link.label}
                    </Link>
                  )
                })}
              </nav>
            </div>

            <Link
              href="/"
              className="text-gray-600 hover:text-gray-900 text-sm font-medium whitespace-nowrap flex-shrink-0"
            >
              View Site
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      {showMobileMenu && (
        <div className="lg:hidden bg-white border-b border-gray-200 shadow-lg">
          <nav className="px-4 py-3 space-y-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href ||
                (link.href !== '/admin' && pathname.startsWith(link.href))
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`block px-4 py-3 rounded-lg text-base font-medium transition-colors ${getColorClasses(link.color, isActive)}`}
                >
                  {link.label}
                </Link>
              )
            })}
            <div className="pt-2 mt-2 border-t border-gray-200">
              <Link
                href="/"
                className="block px-4 py-3 rounded-lg text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              >
                View Site
              </Link>
            </div>
          </nav>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  )
}
