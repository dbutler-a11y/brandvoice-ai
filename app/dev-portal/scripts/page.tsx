'use client'

import { useState } from 'react'

interface Script {
  id: string
  title: string
  content: string
  type: string
  status: 'draft' | 'approved' | 'revision_requested'
  createdAt: string
}

const SCRIPT_TYPE_LABELS: Record<string, string> = {
  FAQ: 'FAQ',
  SERVICE: 'Service/Explainer',
  PROMO: 'Promotional',
  TESTIMONIAL: 'Testimonial',
  TIP: 'Tips/Educational',
  BRAND: 'Brand Story'
}

// Mock scripts for development
const mockScripts: Script[] = [
  {
    id: '1',
    title: 'Welcome to Our Platform',
    content: 'Welcome to BrandVoice! I\'m Sarah, and I\'m here to help you understand how our AI spokesperson technology can transform your business communications. Our platform makes it easy to create professional videos with realistic AI presenters that speak your brand\'s message with authenticity and clarity.',
    type: 'BRAND',
    status: 'draft',
    createdAt: '2024-12-12T10:00:00Z'
  },
  {
    id: '2',
    title: 'Return Policy FAQ',
    content: 'Have questions about returns? We\'ve got you covered. Our hassle-free return policy allows you to return any item within 30 days of purchase for a full refund. Simply visit our returns portal, print your prepaid shipping label, and drop it off at any carrier location. It\'s that simple!',
    type: 'FAQ',
    status: 'approved',
    createdAt: '2024-12-10T14:30:00Z'
  },
  {
    id: '3',
    title: 'Premium Service Overview',
    content: 'Discover the power of our Premium tier. With unlimited video generations, priority support, and access to our exclusive spokesperson library, you\'ll have everything you need to scale your video content. Premium members also get early access to new features and dedicated account management.',
    type: 'SERVICE',
    status: 'draft',
    createdAt: '2024-12-08T09:15:00Z'
  },
  {
    id: '4',
    title: 'Holiday Special Promo',
    content: 'This holiday season, give your marketing the gift of AI! For a limited time, get 50% off your first three months of BrandVoice. Use code HOLIDAY50 at checkout. Don\'t miss this chance to elevate your brand\'s video presence!',
    type: 'PROMO',
    status: 'revision_requested',
    createdAt: '2024-12-05T16:45:00Z'
  },
  {
    id: '5',
    title: '5 Tips for Better Video Content',
    content: 'Here are five tips to make your AI spokesperson videos even more engaging. First, keep scripts concise - aim for 60 seconds or less. Second, use natural language that sounds conversational. Third, include a clear call-to-action. Fourth, match your spokesperson to your brand\'s tone. Fifth, test different versions to see what resonates best with your audience.',
    type: 'TIP',
    status: 'approved',
    createdAt: '2024-12-01T11:20:00Z'
  }
]

export default function DevPortalScriptsPage() {
  const [scripts, setScripts] = useState(mockScripts)
  const [filterType, setFilterType] = useState<string>('ALL')
  const [filterStatus, setFilterStatus] = useState<string>('ALL')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const handleStatusChange = (scriptId: string, newStatus: Script['status']) => {
    setScripts(prev => prev.map(s =>
      s.id === scriptId ? { ...s, status: newStatus } : s
    ))
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

  const getStatusBadge = (status: Script['status']) => {
    switch (status) {
      case 'approved':
        return <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">Approved</span>
      case 'revision_requested':
        return <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs font-semibold rounded-full">Needs Revision</span>
      default:
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full">Pending Review</span>
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Scripts</h1>
          <p className="text-gray-600 mt-1">Review, approve, and preview your AI-generated video scripts</p>
        </div>
        <div className="flex gap-3">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-2">
            <span className="text-sm font-medium text-yellow-800">{pendingCount} Pending Review</span>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-2">
            <span className="text-sm font-medium text-green-800">{approvedCount} Approved</span>
          </div>
        </div>
      </div>

      {/* Filters */}
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

      {/* Scripts List */}
      {filteredScripts.length === 0 ? (
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
        <div className="grid gap-4">
          {filteredScripts.map((script) => (
            <div
              key={script.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Header */}
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium text-gray-500 uppercase">
                        {SCRIPT_TYPE_LABELS[script.type]}
                      </span>
                      {getStatusBadge(script.status)}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">{script.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Created {new Date(script.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  <button
                    onClick={() => setExpandedId(expandedId === script.id ? null : script.id)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className={`w-5 h-5 transition-transform ${expandedId === script.id ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Expandable Content */}
              {expandedId === script.id && (
                <div className="p-4 bg-gray-50">
                  <div className="bg-white rounded-lg p-4 mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Script Content:</h4>
                    <p className="text-gray-600 text-sm whitespace-pre-wrap">{script.content}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => alert('DEV MODE: Would preview voice')}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                      </svg>
                      Preview Voice
                    </button>

                    {script.status !== 'approved' && (
                      <>
                        <button
                          onClick={() => handleStatusChange(script.id, 'approved')}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Approve
                        </button>
                        <button
                          onClick={() => handleStatusChange(script.id, 'revision_requested')}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm font-medium"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Request Changes
                        </button>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
