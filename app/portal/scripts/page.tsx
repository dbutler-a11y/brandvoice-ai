'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

interface Script {
  id: string
  title: string
  scriptText: string
  type: string
  status: string
  createdAt: string
  wordCount: number
  durationSeconds: number | null
}

const SCRIPT_TYPE_LABELS: Record<string, string> = {
  FAQ: 'FAQ',
  SERVICE: 'Service/Explainer',
  PROMO: 'Promotional',
  TESTIMONIAL: 'Testimonial',
  TIP: 'Tips/Educational',
  BRAND: 'Brand Story'
}

const STATUS_COLORS: Record<string, string> = {
  draft: 'bg-gray-100 text-gray-800',
  approved: 'bg-green-100 text-green-800',
  exported: 'bg-blue-100 text-blue-800',
  in_production: 'bg-yellow-100 text-yellow-800'
}

export default function PortalScriptsPage() {
  const router = useRouter()
  const supabase = createClient()
  const [scripts, setScripts] = useState<Script[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expandedScript, setExpandedScript] = useState<string | null>(null)
  const [copiedScript, setCopiedScript] = useState<string | null>(null)
  const [filterType, setFilterType] = useState<string>('ALL')

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

      // Fetch scripts from API
      const response = await fetch('/api/portal/scripts')

      if (response.status === 401) {
        router.push('/portal/login')
        return
      }

      if (!response.ok) {
        throw new Error('Failed to fetch scripts')
      }

      const scriptsData = await response.json()
      setScripts(scriptsData)
    } catch (err) {
      console.error('Error loading scripts:', err)
      setError('Failed to load scripts. Please try refreshing the page.')
    } finally {
      setLoading(false)
    }
  }

  const handleCopyScript = async (script: Script) => {
    try {
      await navigator.clipboard.writeText(script.scriptText)
      setCopiedScript(script.id)
      setTimeout(() => setCopiedScript(null), 2000)
    } catch {
      alert('Failed to copy to clipboard. Please try again.')
    }
  }

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return 'N/A'
    if (seconds < 60) return `${seconds}s`
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}m ${secs}s`
  }

  const filteredScripts = filterType === 'ALL'
    ? scripts
    : scripts.filter(s => s.type === filterType)

  const scriptTypes = ['ALL', ...Object.keys(SCRIPT_TYPE_LABELS)]

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
          <p className="text-gray-600 mt-2">
            View and copy your AI-generated video scripts
          </p>
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
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Scripts</h1>
        <p className="text-gray-600 mt-2">
          View and copy your AI-generated video scripts
        </p>
      </div>

      {/* Filter Tabs */}
      {scripts.length > 0 && (
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4">
          <div className="flex flex-wrap gap-2">
            {scriptTypes.map((type) => {
              const count = type === 'ALL' ? scripts.length : scripts.filter(s => s.type === type).length
              return (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`px-4 py-2 rounded-md font-medium text-sm transition-colors ${
                    filterType === type
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {type === 'ALL' ? 'All Scripts' : SCRIPT_TYPE_LABELS[type]} ({count})
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
            Need help? <a href="mailto:support@brandvoice.ai" className="text-blue-600 hover:text-blue-800">Contact Support</a>
          </p>
        </div>
      ) : filteredScripts.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-12 text-center">
          <p className="text-gray-600">No scripts found for this category.</p>
        </div>
      ) : (
        <>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <svg className="w-5 h-5 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm text-blue-800">
                <strong>{filteredScripts.length} script{filteredScripts.length !== 1 ? 's' : ''}</strong> available. Click any script to expand and copy.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {filteredScripts.map((script) => (
              <div
                key={script.id}
                className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Script Header */}
                <button
                  onClick={() => setExpandedScript(expandedScript === script.id ? null : script.id)}
                  className="w-full px-6 py-4 flex justify-between items-center hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-4 flex-grow text-left">
                    <div className="flex-shrink-0">
                      <span className="px-3 py-1 bg-purple-100 text-purple-800 text-xs font-semibold rounded-full">
                        {SCRIPT_TYPE_LABELS[script.type]}
                      </span>
                    </div>
                    <div className="flex-grow">
                      <h3 className="font-semibold text-gray-900">{script.title}</h3>
                      <div className="flex items-center space-x-3 mt-1 text-sm text-gray-600">
                        <span>{script.wordCount} words</span>
                        <span>•</span>
                        <span>{formatDuration(script.durationSeconds)}</span>
                        <span>•</span>
                        <span className={`px-2 py-0.5 text-xs font-medium rounded ${STATUS_COLORS[script.status]}`}>
                          {script.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  <svg
                    className={`w-5 h-5 text-gray-500 transition-transform flex-shrink-0 ${
                      expandedScript === script.id ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Script Content (Expanded) */}
                {expandedScript === script.id && (
                  <div className="px-6 pb-6 border-t border-gray-200">
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <pre className="text-gray-900 whitespace-pre-wrap font-sans text-sm leading-relaxed">
                        {script.scriptText}
                      </pre>
                    </div>
                    <div className="mt-4 flex justify-between items-center">
                      <div className="text-sm text-gray-500">
                        Created {new Date(script.createdAt).toLocaleDateString()}
                      </div>
                      <button
                        onClick={() => handleCopyScript(script)}
                        className={`px-5 py-2 rounded-md font-medium transition-all flex items-center space-x-2 ${
                          copiedScript === script.id
                            ? 'bg-green-600 text-white'
                            : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
                        }`}
                      >
                        {copiedScript === script.id ? (
                          <>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span>Copied!</span>
                          </>
                        ) : (
                          <>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                            <span>Copy Script</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
