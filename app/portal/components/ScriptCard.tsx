'use client'

import { useState } from 'react'
import { PortalScript } from '../types'
import { VoicePreviewButton } from './VoicePreviewButton'

interface ScriptCardProps {
  script: PortalScript
  voiceId?: string
  onStatusChange?: (scriptId: string, newStatus: string) => void
}

const typeColors: Record<string, { bg: string; text: string; label: string }> = {
  FAQ: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'FAQ' },
  SERVICE: { bg: 'bg-purple-100', text: 'text-purple-700', label: 'Service' },
  PROMO: { bg: 'bg-orange-100', text: 'text-orange-700', label: 'Promo' },
  TESTIMONIAL: { bg: 'bg-green-100', text: 'text-green-700', label: 'Testimonial' },
  TIP: { bg: 'bg-teal-100', text: 'text-teal-700', label: 'Tip' },
  BRAND: { bg: 'bg-indigo-100', text: 'text-indigo-700', label: 'Brand Story' }
}

const statusConfig: Record<string, { bg: string; text: string; label: string }> = {
  draft: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Needs Review' },
  approved: { bg: 'bg-green-100', text: 'text-green-700', label: 'Approved' },
  exported: { bg: 'bg-gray-100', text: 'text-gray-700', label: 'In Production' },
  revision_requested: { bg: 'bg-red-100', text: 'text-red-700', label: 'Revision Requested' }
}

export function ScriptCard({ script, voiceId, onStatusChange }: ScriptCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isApproving, setIsApproving] = useState(false)
  const [isRequestingRevision, setIsRequestingRevision] = useState(false)
  const [revisionNotes, setRevisionNotes] = useState('')
  const [showRevisionModal, setShowRevisionModal] = useState(false)
  const [localStatus, setLocalStatus] = useState(script.status)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const typeConfig = typeColors[script.type] || typeColors.FAQ
  const currentStatusConfig = statusConfig[localStatus] || statusConfig.draft

  const handleApprove = async () => {
    setIsApproving(true)
    setMessage(null)

    try {
      const response = await fetch(`/api/portal/scripts/${script.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'approve' })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to approve')
      }

      setLocalStatus('approved')
      setMessage({ type: 'success', text: 'Script approved!' })
      onStatusChange?.(script.id, 'approved')
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Failed to approve' })
    } finally {
      setIsApproving(false)
    }
  }

  const handleRequestRevision = async () => {
    if (!revisionNotes.trim()) {
      setMessage({ type: 'error', text: 'Please describe what changes you need' })
      return
    }

    setIsRequestingRevision(true)
    setMessage(null)

    try {
      const response = await fetch(`/api/portal/scripts/${script.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'request_revision',
          notes: revisionNotes
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to request revision')
      }

      setLocalStatus('revision_requested')
      setMessage({ type: 'success', text: 'Revision requested! Our team will update this script.' })
      setShowRevisionModal(false)
      setRevisionNotes('')
      onStatusChange?.(script.id, 'revision_requested')
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Failed to request revision' })
    } finally {
      setIsRequestingRevision(false)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(script.scriptText)
    setMessage({ type: 'success', text: 'Copied to clipboard!' })
    setTimeout(() => setMessage(null), 2000)
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
        {/* Header */}
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${typeConfig.bg} ${typeConfig.text}`}>
                  {typeConfig.label}
                </span>
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${currentStatusConfig.bg} ${currentStatusConfig.text}`}>
                  {currentStatusConfig.label}
                </span>
              </div>
              <h3 className="font-semibold text-gray-900 truncate">{script.title}</h3>
              <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                <span>{script.wordCount} words</span>
                {script.durationSeconds && (
                  <span>~{Math.ceil(script.durationSeconds / 60)} min</span>
                )}
              </div>
            </div>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <svg
                className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Expanded Content */}
        {isExpanded && (
          <div className="p-4">
            {/* Script Text */}
            <div className="bg-gray-50 rounded-lg p-4 mb-4 max-h-64 overflow-y-auto">
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{script.scriptText}</p>
            </div>

            {/* Message */}
            {message && (
              <div className={`mb-4 p-3 rounded-lg text-sm ${
                message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
              }`}>
                {message.text}
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-2">
              <VoicePreviewButton
                text={script.scriptText}
                voiceId={voiceId}
                size="sm"
              />

              <button
                onClick={copyToClipboard}
                className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Copy
              </button>

              {localStatus === 'draft' && (
                <>
                  <button
                    onClick={handleApprove}
                    disabled={isApproving}
                    className="px-3 py-1.5 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-1 disabled:opacity-50"
                  >
                    {isApproving ? (
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                    Approve
                  </button>

                  <button
                    onClick={() => setShowRevisionModal(true)}
                    className="px-3 py-1.5 text-sm bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors flex items-center gap-1"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Request Changes
                  </button>
                </>
              )}

              {localStatus === 'approved' && (
                <span className="px-3 py-1.5 text-sm text-green-600 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Ready for production
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Revision Modal */}
      {showRevisionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Request Script Changes</h3>
            <p className="text-sm text-gray-600 mb-4">
              Describe what changes you&apos;d like to see in this script. Our team will revise it based on your feedback.
            </p>

            <textarea
              value={revisionNotes}
              onChange={(e) => setRevisionNotes(e.target.value)}
              placeholder="e.g., Make the tone more casual, shorten the intro, add a stronger call-to-action..."
              className="w-full h-32 p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />

            {message && message.type === 'error' && (
              <p className="mt-2 text-sm text-red-600">{message.text}</p>
            )}

            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => {
                  setShowRevisionModal(false)
                  setRevisionNotes('')
                  setMessage(null)
                }}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleRequestRevision}
                disabled={isRequestingRevision}
                className="px-4 py-2 text-sm bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50"
              >
                {isRequestingRevision ? 'Submitting...' : 'Submit Request'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
