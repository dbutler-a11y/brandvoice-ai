import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import ClientsTable from './components/ClientsTable'

// Check if using SQLite (local development)
const isLocalDatabase = process.env.DATABASE_URL?.includes('file:')

export default async function AdminDashboardPage() {
  const clients = await prisma.client.findMany({
    include: {
      _count: {
        select: { scripts: true }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  // Trigger: Show go-live banner when you have 3+ real clients
  const showGoLiveBanner = clients.length >= 3 && isLocalDatabase

  return (
    <div>
      {/* Go-Live Trigger Banner */}
      {showGoLiveBanner && (
        <div className="mb-6 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg shadow-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🚀</span>
              <div>
                <h3 className="font-bold text-white">Ready for your first paying customer?</h3>
                <p className="text-amber-100 text-sm">
                  You have {clients.length} clients! Time to migrate to Supabase and go live.
                </p>
              </div>
            </div>
            <Link
              href="/admin/roadmap"
              className="bg-white text-orange-600 px-4 py-2 rounded-md font-semibold hover:bg-orange-50 transition-colors whitespace-nowrap"
            >
              View Go-Live Checklist
            </Link>
          </div>
        </div>
      )}

      {/* SQLite Warning Banner (always show in dev) */}
      {isLocalDatabase && !showGoLiveBanner && (
        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <span className="text-xl">💡</span>
            <div>
              <p className="text-blue-800 text-sm">
                <strong>Development Mode:</strong> Using local SQLite database.
                <Link href="/admin/roadmap" className="underline ml-1 hover:text-blue-600">
                  View migration guide
                </Link> when ready for production.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Clients</h1>
        <Link
          href="/admin/clients/new"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
        >
          New Client
        </Link>
      </div>

      <ClientsTable clients={clients} />
    </div>
  )
}
