'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { ScriptCard } from '../components'
import { PortalScript } from '../types'

const SCRIPT_TYPE_LABELS: Record<string, string> = {
  FAQ: 'FAQ',
  SERVICE: 'Service/Explainer',
  PROMO: 'Promotional',
  TESTIMONIAL: 'Testimonial',
  TIP: 'Tips/Educational',
  BRAND: 'Brand Story'
}

interface DashboardData {
  hasClients: boolean
  clients: Array<{ voiceId?: string }>
  stats: {
    scriptsApproved: number
    scriptsPending: number
  }
}

export default function PortalScriptsPage() {
  const router = useRouter()
  const supabase = createClient()
  const [scripts, setScripts] = useState<PortalScript[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filterType, setFilterType] = useState<string>('ALL')
  const [filterStatus, setFilterStatus] = useState<string>('ALL')
  const [voiceId, setVoiceId] = useState<string | undefined>()
  const [stats, setStats] = useState({ approved: 0, pending: 0 })

  useEffect(() => {
    checkAuthAndLoadScripts()
  }, [])

  const checkAuthAndLoadScripts = async () => {
    try {
      setError(null)

      // Check authentication
      const { data: { user }, error: authError } = await supabase.auth.getUser()

      if (authError || !user) {
        router.push('/portal/login')
        return
      }

      // Fetch scripts and dashboard data in parallel
      const [scriptsRes, dashboardRes] = await Promise.all([
        fetch('/api/portal/scripts'),
        fetch('/api/portal/dashboard')
      ])

      if (scriptsRes.status === 401 || dashboardRes.status === 401) {
        router.push('/portal/login')
        return
      }

      if (!scriptsRes.ok) {
        throw new Error('Failed to fetch scripts')
      }

      const scriptsData = await scriptsRes.json()
      setScripts(scriptsData)

      if (dashboardRes.ok) {
        const dashboardData: DashboardData = await dashboardRes.json()
        // Get voice ID from client
        if (dashboardData.clients?.[0]?.voiceId) {
          setVoiceId(dashboardData.clients[0].voiceId)
        }
        setStats({
          approved: dashboardData.stats.scriptsApproved,
          pending: dashboardData.stats.scriptsPending
        })
      }
    } catch (err) {
      console.error('Error loading scripts:', err)
      setError('Failed to load scripts. Please try refreshing the page.')
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = (scriptId: string, newStatus: string) => {
    setScripts(prev => prev.map(s =>
      s.id === scriptId ? { ...s, status: newStatus as PortalScript['status'] } : s
    ))
    // Update stats
    if (newStatus === 'approved') {
      setStats(prev => ({ approved: prev.approved + 1, pending: Math.max(0, prev.pending - 1) }))
    }
  }

  const filteredScripts = scripts.filter(s => {
    const typeMatch = filterType === 'ALL' || s.type === filterType
    const statusMatch = filterStatus === 'ALL' ||
      (filterStatus === 'pending' && (s.status === 'draft' || s.status === 'revision_requested')) ||
      (filterStatus === 'approved' && s.status === 'approved')
    return typeMatch && statusMatch
  })

  const scriptTypes = ['ALL', ...Object.keys(SCRIPT_TYPE_LABELS)]
  const pendingCount = scripts.filter(s => s.status === 'draft' || s.status === 'revision_requested').length
  const approvedCount = scripts.filter(s => s.status === 'approved').length

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <div className="text-gray-500">Loading your scripts...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Scripts</h1>
          <p className="text-gray-600 mt-2">Review, approve, and preview your AI-generated video scripts</p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-red-900 mb-2">Error Loading Scripts</h3>
          <p className="text-red-700 mb-4">{error}</p>
          <button
            onClick={() => {
              setLoading(true)
              checkAuthAndLoadScripts()
            }}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Scripts</h1>
          <p className="text-gray-600 mt-1">Review, approve, and preview your AI-generated video scripts</p>
        </div>
        {scripts.length > 0 && (
          <div className="flex gap-3">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-2">
              <span className="text-sm font-medium text-yellow-800">{pendingCount} Pending Review</span>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-2">
              <span className="text-sm font-medium text-green-800">{approvedCount} Approved</span>
            </div>
          </div>
        )}
      </div>

      {/* Filters */}
      {scripts.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 space-y-4">
          {/* Status Filter */}
          <div className="flex gap-2">
            <button
              onClick={() => setFilterStatus('ALL')}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                filterStatus === 'ALL'
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All ({scripts.length})
            </button>
            <button
              onClick={() => setFilterStatus('pending')}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                filterStatus === 'pending'
                  ? 'bg-yellow-500 text-white'
                  : 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100'
              }`}
            >
              Needs Review ({pendingCount})
            </button>
            <button
              onClick={() => setFilterStatus('approved')}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                filterStatus === 'approved'
                  ? 'bg-green-500 text-white'
                  : 'bg-green-50 text-green-700 hover:bg-green-100'
              }`}
            >
              Approved ({approvedCount})
            </button>
          </div>

          {/* Type Filter */}
          <div className="flex flex-wrap gap-2">
            {scriptTypes.map((type) => {
              const count = type === 'ALL' ? scripts.length : scripts.filter(s => s.type === type).length
              if (type !== 'ALL' && count === 0) return null
              return (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`px-3 py-1.5 rounded-md font-medium text-xs transition-colors ${
                    filterType === type
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {type === 'ALL' ? 'All Types' : SCRIPT_TYPE_LABELS[type]}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Scripts List */}
      {scripts.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-12 text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No scripts yet</h3>
          <p className="text-gray-600 mb-4">
            Your scripts will appear here once they are generated.
          </p>
          <p className="text-sm text-gray-500">
            Need help? <a href="mailto:support@brandvoice.studio" className="text-blue-600 hover:text-blue-800">Contact Support</a>
          </p>
        </div>
      ) : filteredScripts.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-12 text-center">
          <p className="text-gray-600">No scripts found matching your filters.</p>
          <button
            onClick={() => { setFilterType('ALL'); setFilterStatus('ALL') }}
            className="mt-4 text-blue-600 hover:text-blue-800 font-medium"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <>
          {/* Tip Banner */}
          {pendingCount > 0 && (
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                <div>
                  <p className="text-sm font-medium text-blue-900">
                    Click &quot;Preview Voice&quot; to hear how your script will sound with AI voiceover
                  </p>
                  <p className="text-xs text-blue-700 mt-1">
                    Review each script and click Approve or Request Changes to proceed
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="grid gap-4">
            {filteredScripts.map((script) => (
              <ScriptCard
                key={script.id}
                script={script}
                voiceId={voiceId}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
