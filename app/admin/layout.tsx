import Link from 'next/link'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header/Sidebar */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4 lg:space-x-8 overflow-hidden">
              <h1 className="text-xl font-bold text-gray-900 flex-shrink-0">
                BrandVoice.AI
              </h1>
              <nav className="flex space-x-2 sm:space-x-4 overflow-x-auto scrollbar-hide -webkit-overflow-scrolling-touch">
                <Link
                  href="/admin"
                  className="text-gray-700 hover:text-gray-900 px-2 sm:px-3 py-2 rounded-md text-xs sm:text-sm font-medium hover:bg-gray-100 whitespace-nowrap"
                >
                  Clients
                </Link>
                <Link
                  href="/admin/crm"
                  className="text-blue-600 hover:text-blue-800 px-2 sm:px-3 py-2 rounded-md text-xs sm:text-sm font-medium hover:bg-blue-50 whitespace-nowrap"
                >
                  CRM
                </Link>
                <Link
                  href="/admin/spokespersons"
                  className="text-gray-700 hover:text-gray-900 px-2 sm:px-3 py-2 rounded-md text-xs sm:text-sm font-medium hover:bg-gray-100 whitespace-nowrap"
                >
                  Spokespersons
                </Link>
                <Link
                  href="/admin/roadmap"
                  className="text-gray-700 hover:text-gray-900 px-2 sm:px-3 py-2 rounded-md text-xs sm:text-sm font-medium hover:bg-gray-100 whitespace-nowrap"
                >
                  Roadmap
                </Link>
                <Link
                  href="/admin/strategy"
                  className="text-gray-700 hover:text-gray-900 px-2 sm:px-3 py-2 rounded-md text-xs sm:text-sm font-medium hover:bg-gray-100 whitespace-nowrap"
                >
                  Strategy
                </Link>
                <Link
                  href="/admin/alerts"
                  className="text-red-600 hover:text-red-800 px-2 sm:px-3 py-2 rounded-md text-xs sm:text-sm font-medium hover:bg-red-50 whitespace-nowrap"
                >
                  Alerts
                </Link>
                <Link
                  href="/admin/reminders"
                  className="text-gray-700 hover:text-gray-900 px-2 sm:px-3 py-2 rounded-md text-xs sm:text-sm font-medium hover:bg-gray-100 whitespace-nowrap"
                >
                  Reminders
                </Link>
                <Link
                  href="/admin/playground"
                  className="text-indigo-600 hover:text-indigo-800 px-2 sm:px-3 py-2 rounded-md text-xs sm:text-sm font-medium hover:bg-indigo-50 whitespace-nowrap"
                >
                  Playground
                </Link>
              </nav>
            </div>
            <Link
              href="/"
              className="text-gray-600 hover:text-gray-900 text-xs sm:text-sm font-medium whitespace-nowrap flex-shrink-0"
            >
              View Site
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  )
}
