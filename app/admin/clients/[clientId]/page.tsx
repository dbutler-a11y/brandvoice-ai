'use client'

import { useEffect, useState, useCallback, useMemo } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { SCRIPT_TYPE_LABELS, getWordCount, estimateDuration, formatDuration } from '@/lib/utils'
import type { ClientWithRelations, ScriptData } from '@/lib/types'
import ClientUserManager from '@/components/admin/ClientUserManager'
import ProjectStatusWorkflow from '@/components/admin/ProjectStatusWorkflow'

export default function ClientDetailPage() {
  const params = useParams()
  const clientId = params.clientId as string

  const [client, setClient] = useState<ClientWithRelations | null>(null)
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showIntake, setShowIntake] = useState(false)
  const [editingScript, setEditingScript] = useState<string | null>(null)
  const [editForm, setEditForm] = useState({ scriptText: '', status: '' })
  const [generatingEmails, setGeneratingEmails] = useState(false)
  const [emailSequence, setEmailSequence] = useState<Array<{ subject: string; body: string; sendDay: number }> | null>(null)
  const [expandedEmail, setExpandedEmail] = useState<number | null>(null)
  const [copiedEmail, setCopiedEmail] = useState<number | null>(null)
  const [selectedScripts, setSelectedScripts] = useState<Set<string>>(new Set())
  const [bulkUpdating, setBulkUpdating] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [generatingAds, setGeneratingAds] = useState(false)
  const [facebookAds, setFacebookAds] = useState<Array<{
    type: string
    headline: string
    primaryText: string
    description: string
    callToAction: string
  }> | null>(null)
  const [adsError, setAdsError] = useState<string | null>(null)
  const [copiedAdField, setCopiedAdField] = useState<string | null>(null)

  // Calculate totals for all scripts
  const scriptTotals = useMemo(() => {
    if (!client) return { count: 0, words: 0, minutes: 0 }

    const totalWords = client.scripts.reduce((sum, script) => {
      return sum + getWordCount(script.scriptText)
    }, 0)

    const totalSeconds = client.scripts.reduce((sum, script) => {
      return sum + estimateDuration(script.scriptText)
    }, 0)

    return {
      count: client.scripts.length,
      words: totalWords,
      minutes: Math.round(totalSeconds / 60)
    }
  }, [client])

  const fetchClient = useCallback(async () => {
    try {
      const response = await fetch(`/api/clients/${clientId}`)
      if (!response.ok) throw new Error('Failed to fetch client')
      const data = await response.json()
      setClient(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }, [clientId])

  useEffect(() => {
    fetchClient()
  }, [fetchClient])

  const handleGenerateScripts = async () => {
    if (!confirm('Generate 30-day script pack? This will create 30 new scripts.')) {
      return
    }

    setGenerating(true)
    setError(null)

    try {
      const response = await fetch(`/api/clients/${clientId}/generate-scripts`, {
        method: 'POST',
      })

      if (!response.ok) throw new Error('Failed to generate scripts')

      await fetchClient()
      alert('30 scripts generated successfully!')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate scripts')
    } finally {
      setGenerating(false)
    }
  }

  const handleGenerateEmails = async () => {
    setGeneratingEmails(true)
    setError(null)

    try {
      const response = await fetch(`/api/clients/${clientId}/generate-emails`, {
        method: 'POST',
      })

      if (!response.ok) throw new Error('Failed to generate email sequence')

      const data = await response.json()
      setEmailSequence(data.emails)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate email sequence')
    } finally {
      setGeneratingEmails(false)
    }
  }

  const handleCopyEmail = async (index: number, emailText: string, subject: string) => {
    try {
      const fullEmail = `Subject: ${subject}\n\n${emailText}`
      await navigator.clipboard.writeText(fullEmail)
      setCopiedEmail(index)
      setTimeout(() => setCopiedEmail(null), 2000)
    } catch {
      alert('Failed to copy to clipboard. Please try again.')
    }
  }

  const handleGenerateFacebookAds = async () => {
    setGeneratingAds(true)
    setAdsError(null)

    try {
      const response = await fetch(`/api/clients/${clientId}/generate-ads`, {
        method: 'POST',
      })

      if (!response.ok) throw new Error('Failed to generate Facebook ads')

      const data = await response.json()
      setFacebookAds(data.ads)
    } catch (err) {
      setAdsError(err instanceof Error ? err.message : 'Failed to generate Facebook ads')
    } finally {
      setGeneratingAds(false)
    }
  }

  const handleCopyAdField = async (fieldValue: string, fieldKey: string) => {
    try {
      await navigator.clipboard.writeText(fieldValue)
      setCopiedAdField(fieldKey)
      setTimeout(() => setCopiedAdField(null), 2000)
    } catch {
      alert('Failed to copy to clipboard. Please try again.')
    }
  }

  const startEditScript = (script: ScriptData) => {
    setEditingScript(script.id)
    setEditForm({
      scriptText: script.scriptText,
      status: script.status,
    })
  }

  const cancelEdit = () => {
    setEditingScript(null)
    setEditForm({ scriptText: '', status: '' })
  }

  const saveScript = async (scriptId: string) => {
    try {
      const response = await fetch(`/api/scripts/${scriptId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editForm),
      })

      if (!response.ok) throw new Error('Failed to update script')

      await fetchClient()
      setEditingScript(null)
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to save script')
    }
  }

  // Bulk selection handlers
  const toggleScriptSelection = (scriptId: string) => {
    const newSelection = new Set(selectedScripts)
    if (newSelection.has(scriptId)) {
      newSelection.delete(scriptId)
    } else {
      newSelection.add(scriptId)
    }
    setSelectedScripts(newSelection)
  }

  const toggleSelectAll = () => {
    if (!client) return

    if (selectedScripts.size === client.scripts.length) {
      // Deselect all
      setSelectedScripts(new Set())
    } else {
      // Select all
      const allScriptIds = new Set(client.scripts.map(s => s.id))
      setSelectedScripts(allScriptIds)
    }
  }

  const handleBulkStatusUpdate = async (newStatus: string) => {
    if (selectedScripts.size === 0) return

    if (!confirm(`Update ${selectedScripts.size} script(s) to "${newStatus}" status?`)) {
      return
    }

    setBulkUpdating(true)
    setError(null)

    try {
      const response = await fetch('/api/scripts/bulk-update', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          scriptIds: Array.from(selectedScripts),
          status: newStatus,
        }),
      })

      if (!response.ok) throw new Error('Failed to bulk update scripts')

      const data = await response.json()

      // Show success message
      setSuccessMessage(`Successfully updated ${data.count} script(s) to "${newStatus}"`)
      setTimeout(() => setSuccessMessage(null), 5000)

      // Clear selection and refresh
      setSelectedScripts(new Set())
      await fetchClient()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to bulk update scripts')
    } finally {
      setBulkUpdating(false)
    }
  }

  // Export helper functions
  const formatScriptsAsText = () => {
    if (!client) return ''

    const currentDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })

    let output = '================================\n'
    output += `${client.businessName.toUpperCase()} - 30-Day Script Pack\n`
    output += `Generated: ${currentDate}\n`
    output += '================================\n\n'

    const scriptTypes = [
      { key: 'FAQ', label: 'FAQ SCRIPTS' },
      { key: 'SERVICE', label: 'SERVICE/EXPLAINER SCRIPTS' },
      { key: 'PROMO', label: 'PROMO SCRIPTS' },
      { key: 'TESTIMONIAL', label: 'TESTIMONIAL SCRIPTS' },
      { key: 'TIP', label: 'TIP/EDUCATIONAL SCRIPTS' },
      { key: 'BRAND', label: 'BRAND/CREDIBILITY SCRIPTS' },
    ]

    scriptTypes.forEach(({ key, label }) => {
      const scripts = client.scripts.filter((s) => s.type === key)
      if (scripts.length === 0) return

      output += `--- ${label} (${scripts.length}) ---\n\n`

      scripts.forEach((script, index) => {
        output += `[${index + 1}] ${script.title}\n`
        output += `${script.scriptText}\n`
        const duration = script.durationSeconds || estimateDuration(script.scriptText)
        output += `Duration: ~${duration} seconds\n\n`
      })

      output += '\n'
    })

    return output
  }

  const handleCopyToClipboard = async () => {
    try {
      const textContent = formatScriptsAsText()
      await navigator.clipboard.writeText(textContent)
      alert('All scripts copied to clipboard!')
    } catch {
      alert('Failed to copy to clipboard. Please try again.')
    }
  }

  const handleDownloadTXT = () => {
    if (!client) return

    const textContent = formatScriptsAsText()
    const blob = new Blob([textContent], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${client.businessName.replace(/\s+/g, '_')}_scripts.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleDownloadJSON = () => {
    if (!client) return

    const exportData = {
      client: {
        businessName: client.businessName,
        contactName: client.contactName,
        email: client.email,
        niche: client.niche,
        tone: client.tone,
      },
      exportedAt: new Date().toISOString(),
      scripts: client.scripts.map((script) => ({
        type: script.type,
        title: script.title,
        scriptText: script.scriptText,
        durationSeconds: script.durationSeconds || estimateDuration(script.scriptText),
        status: script.status,
      })),
      scriptsByType: {
        FAQ: client.scripts.filter((s) => s.type === 'FAQ').map((s) => ({
          title: s.title,
          scriptText: s.scriptText,
          durationSeconds: s.durationSeconds || estimateDuration(s.scriptText),
        })),
        SERVICE: client.scripts.filter((s) => s.type === 'SERVICE').map((s) => ({
          title: s.title,
          scriptText: s.scriptText,
          durationSeconds: s.durationSeconds || estimateDuration(s.scriptText),
        })),
        PROMO: client.scripts.filter((s) => s.type === 'PROMO').map((s) => ({
          title: s.title,
          scriptText: s.scriptText,
          durationSeconds: s.durationSeconds || estimateDuration(s.scriptText),
        })),
        TESTIMONIAL: client.scripts.filter((s) => s.type === 'TESTIMONIAL').map((s) => ({
          title: s.title,
          scriptText: s.scriptText,
          durationSeconds: s.durationSeconds || estimateDuration(s.scriptText),
        })),
        TIP: client.scripts.filter((s) => s.type === 'TIP').map((s) => ({
          title: s.title,
          scriptText: s.scriptText,
          durationSeconds: s.durationSeconds || estimateDuration(s.scriptText),
        })),
        BRAND: client.scripts.filter((s) => s.type === 'BRAND').map((s) => ({
          title: s.title,
          scriptText: s.scriptText,
          durationSeconds: s.durationSeconds || estimateDuration(s.scriptText),
        })),
      },
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${client.businessName.replace(/\s+/g, '_')}_scripts.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleDownloadPDF = async () => {
    if (!client) return

    try {
      const response = await fetch(`/api/clients/${clientId}/export-pdf`)

      if (!response.ok) {
        throw new Error('Failed to generate PDF')
      }

      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${client.businessName.replace(/\s+/g, '_')}_scripts.pdf`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      alert('Failed to generate PDF. Please try again.')
      console.error('PDF export error:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Loading...</div>
      </div>
    )
  }

  if (error || !client) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        {error || 'Client not found'}
      </div>
    )
  }

  const scriptsByType = {
    FAQ: client.scripts.filter((s) => s.type === 'FAQ'),
    SERVICE: client.scripts.filter((s) => s.type === 'SERVICE'),
    PROMO: client.scripts.filter((s) => s.type === 'PROMO'),
    TESTIMONIAL: client.scripts.filter((s) => s.type === 'TESTIMONIAL'),
    TIP: client.scripts.filter((s) => s.type === 'TIP'),
    BRAND: client.scripts.filter((s) => s.type === 'BRAND'),
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl font-bold text-gray-900">{client.businessName}</h1>
          <Link
            href={`/admin/clients/${clientId}/assets`}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md font-medium transition-colors flex items-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
            <span>Manage Assets</span>
          </Link>
        </div>
        <p className="text-gray-600 mt-1">{client.niche}</p>
      </div>

      {/* Client Info Card */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Client Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-500">Contact Name</label>
            <p className="text-gray-900">{client.contactName}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Email</label>
            <p className="text-gray-900">{client.email}</p>
          </div>
          {client.phone && (
            <div>
              <label className="text-sm font-medium text-gray-500">Phone</label>
              <p className="text-gray-900">{client.phone}</p>
            </div>
          )}
          {client.website && (
            <div>
              <label className="text-sm font-medium text-gray-500">Website</label>
              <a
                href={client.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800"
              >
                {client.website}
              </a>
            </div>
          )}
          <div>
            <label className="text-sm font-medium text-gray-500">Tone</label>
            <p className="text-gray-900">{client.tone}</p>
          </div>
          <div className="md:col-span-2 lg:col-span-3">
            <label className="text-sm font-medium text-gray-500">Goals</label>
            <p className="text-gray-900">{client.goals}</p>
          </div>
        </div>
      </div>

      {/* Package & Pricing Info */}
      {(client.package || client.addOns) && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Package & Pricing</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {client.package && (
              <div>
                <label className="text-sm font-medium text-gray-500">Package</label>
                <p className="text-gray-900 capitalize">{client.package.replace(/-/g, ' ')}</p>
              </div>
            )}
            {client.packagePrice && (
              <div>
                <label className="text-sm font-medium text-gray-500">Package Price</label>
                <p className="text-gray-900">${(client.packagePrice / 100).toFixed(2)}</p>
              </div>
            )}
            {client.isSubscription && (
              <div>
                <label className="text-sm font-medium text-gray-500">Subscription</label>
                <p className="text-gray-900">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    Monthly Recurring
                  </span>
                </p>
              </div>
            )}
            {client.paymentStatus && (
              <div>
                <label className="text-sm font-medium text-gray-500">Payment Status</label>
                <p className="text-gray-900">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      client.paymentStatus === 'paid'
                        ? 'bg-green-100 text-green-800'
                        : client.paymentStatus === 'refunded'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {client.paymentStatus.charAt(0).toUpperCase() + client.paymentStatus.slice(1)}
                  </span>
                </p>
              </div>
            )}
            {client.addOns && (
              <div className="md:col-span-2 lg:col-span-3">
                <label className="text-sm font-medium text-gray-500">Add-ons</label>
                <div className="mt-1 flex flex-wrap gap-2">
                  {JSON.parse(client.addOns).map((addon: string) => (
                    <span
                      key={addon}
                      className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                    >
                      {addon.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                    </span>
                  ))}
                </div>
                {client.addOnsTotal && (
                  <p className="text-sm text-gray-600 mt-2">
                    Add-ons Total: ${(client.addOnsTotal / 100).toFixed(2)}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Project Status Workflow */}
      <ProjectStatusWorkflow
        clientId={clientId}
        currentStatus={client.projectStatus as 'discovery' | 'onboarding' | 'avatar-creation' | 'scriptwriting' | 'video-production' | 'qa-review' | 'delivered' | 'ongoing'}
        projectStartDate={client.projectStartDate}
        projectDeliveryDate={client.projectDeliveryDate}
        onStatusUpdate={fetchClient}
      />

      {/* Intake Data Card */}
      {client.intake && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Intake Data</h2>
            <button
              onClick={() => setShowIntake(!showIntake)}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              {showIntake ? 'Hide' : 'Show'}
            </button>
          </div>

          {showIntake && (
            <div className="space-y-4 border-t pt-4">
              {client.intake.rawFaqs && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Raw FAQs</label>
                  <p className="text-gray-900 whitespace-pre-wrap">{client.intake.rawFaqs}</p>
                </div>
              )}
              {client.intake.rawOffers && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Raw Offers</label>
                  <p className="text-gray-900 whitespace-pre-wrap">{client.intake.rawOffers}</p>
                </div>
              )}
              {client.intake.rawTestimonials && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Raw Testimonials</label>
                  <p className="text-gray-900 whitespace-pre-wrap">{client.intake.rawTestimonials}</p>
                </div>
              )}
              {client.intake.rawPromos && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Raw Promos</label>
                  <p className="text-gray-900 whitespace-pre-wrap">{client.intake.rawPromos}</p>
                </div>
              )}
              {client.intake.brandVoiceNotes && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Brand Voice Notes</label>
                  <p className="text-gray-900 whitespace-pre-wrap">{client.intake.brandVoiceNotes}</p>
                </div>
              )}
              {client.intake.references && (
                <div>
                  <label className="text-sm font-medium text-gray-500">References</label>
                  <p className="text-gray-900 whitespace-pre-wrap">{client.intake.references}</p>
                </div>
              )}
              {client.intake.brandColors && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Brand Colors</label>
                  <p className="text-gray-900">{client.intake.brandColors}</p>
                </div>
              )}
              {client.intake.logoUrl && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Logo URL</label>
                  <a
                    href={client.intake.logoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    {client.intake.logoUrl}
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Portal Access Section */}
      <ClientUserManager clientId={clientId} />

      {/* Cold Email Sequence Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Cold Email Outreach Sequence</h2>
            <p className="text-sm text-gray-500 mt-1">
              Generate a 5-email sequence to promote your AI spokesperson videos
            </p>
          </div>
          <button
            onClick={handleGenerateEmails}
            disabled={generatingEmails}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-md font-medium disabled:bg-indigo-400 disabled:cursor-not-allowed"
          >
            {generatingEmails ? 'Generating...' : 'Generate Cold Emails'}
          </button>
        </div>

        {emailSequence && emailSequence.length > 0 && (
          <div className="space-y-3">
            {emailSequence.map((email, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg overflow-hidden hover:border-gray-300 transition-colors"
              >
                <button
                  onClick={() => setExpandedEmail(expandedEmail === index ? null : index)}
                  className="w-full px-4 py-3 flex justify-between items-center bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <span className="bg-indigo-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      Day {email.sendDay}
                    </span>
                    <span className="font-medium text-gray-900">{email.subject}</span>
                  </div>
                  <svg
                    className={`w-5 h-5 text-gray-500 transition-transform ${
                      expandedEmail === index ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {expandedEmail === index && (
                  <div className="p-4 border-t border-gray-200">
                    <div className="mb-3">
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        Subject Line
                      </label>
                      <p className="text-gray-900 font-medium mt-1">{email.subject}</p>
                    </div>
                    <div className="mb-4">
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        Email Body
                      </label>
                      <div className="mt-1 p-3 bg-gray-50 rounded border border-gray-200">
                        <pre className="text-gray-900 whitespace-pre-wrap font-sans text-sm leading-relaxed">
                          {email.body}
                        </pre>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">
                        Recommended send: Day {email.sendDay}
                      </span>
                      <button
                        onClick={() => handleCopyEmail(index, email.body, email.subject)}
                        className={`px-4 py-2 rounded-md font-medium transition-colors ${
                          copiedEmail === index
                            ? 'bg-green-600 text-white'
                            : 'bg-blue-600 hover:bg-blue-700 text-white'
                        }`}
                      >
                        {copiedEmail === index ? 'Copied!' : 'Copy Email'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {!emailSequence && !generatingEmails && (
          <p className="text-gray-500 text-center py-8">
            Click the button above to generate a personalized 5-email cold outreach sequence.
          </p>
        )}
      </div>

      {/* Facebook Ads Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Facebook Ad Copy Generator</h2>
            <p className="text-sm text-gray-500 mt-1">
              Generate 4 ad variations to promote AI spokesperson videos
            </p>
          </div>
          <button
            onClick={handleGenerateFacebookAds}
            disabled={generatingAds}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-md font-medium disabled:bg-purple-400 disabled:cursor-not-allowed"
          >
            {generatingAds ? 'Generating...' : 'Generate Facebook Ads'}
          </button>
        </div>

        {adsError && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {adsError}
          </div>
        )}

        {facebookAds && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {facebookAds.map((ad, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-5 hover:border-purple-300 transition-colors"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">{ad.type}</h3>
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded-full">
                    {ad.type}
                  </span>
                </div>

                <div className="space-y-4">
                  {/* Headline */}
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-sm font-medium text-gray-700">Headline</label>
                      <span className="text-xs text-gray-500">{ad.headline.length}/40</span>
                    </div>
                    <div className="relative">
                      <p className="text-gray-900 bg-gray-50 p-3 rounded border border-gray-200 pr-20">
                        {ad.headline}
                      </p>
                      <button
                        onClick={() => handleCopyAdField(ad.headline, `ad-${index}-headline`)}
                        className="absolute right-2 top-2 px-3 py-1.5 bg-white border border-gray-300 rounded text-xs font-medium hover:bg-gray-50"
                      >
                        {copiedAdField === `ad-${index}-headline` ? 'Copied!' : 'Copy'}
                      </button>
                    </div>
                  </div>

                  {/* Primary Text */}
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-sm font-medium text-gray-700">Primary Text</label>
                      <span className="text-xs text-gray-500">{ad.primaryText.length}/125</span>
                    </div>
                    <div className="relative">
                      <p className="text-gray-900 bg-gray-50 p-3 rounded border border-gray-200 pr-20">
                        {ad.primaryText}
                      </p>
                      <button
                        onClick={() => handleCopyAdField(ad.primaryText, `ad-${index}-primaryText`)}
                        className="absolute right-2 top-2 px-3 py-1.5 bg-white border border-gray-300 rounded text-xs font-medium hover:bg-gray-50"
                      >
                        {copiedAdField === `ad-${index}-primaryText` ? 'Copied!' : 'Copy'}
                      </button>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-sm font-medium text-gray-700">Description</label>
                      <span className="text-xs text-gray-500">{ad.description.length}/30</span>
                    </div>
                    <div className="relative">
                      <p className="text-gray-900 bg-gray-50 p-3 rounded border border-gray-200 pr-20">
                        {ad.description}
                      </p>
                      <button
                        onClick={() => handleCopyAdField(ad.description, `ad-${index}-description`)}
                        className="absolute right-2 top-2 px-3 py-1.5 bg-white border border-gray-300 rounded text-xs font-medium hover:bg-gray-50"
                      >
                        {copiedAdField === `ad-${index}-description` ? 'Copied!' : 'Copy'}
                      </button>
                    </div>
                  </div>

                  {/* Call to Action */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1">Call to Action</label>
                    <div className="relative">
                      <p className="text-gray-900 bg-gray-50 p-3 rounded border border-gray-200 pr-20 font-medium">
                        {ad.callToAction}
                      </p>
                      <button
                        onClick={() => handleCopyAdField(ad.callToAction, `ad-${index}-cta`)}
                        className="absolute right-2 top-2 px-3 py-1.5 bg-white border border-gray-300 rounded text-xs font-medium hover:bg-gray-50"
                      >
                        {copiedAdField === `ad-${index}-cta` ? 'Copied!' : 'Copy'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!facebookAds && !generatingAds && (
          <p className="text-gray-500 text-center py-8">
            Click the button above to generate Facebook ad copy variations.
          </p>
        )}
      </div>

      {/* Scripts Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Scripts ({client.scripts.length})
            </h2>
            {client.scripts.length > 0 && (
              <p className="text-sm text-gray-500 mt-1">
                Total: {scriptTotals.count} scripts | {scriptTotals.words.toLocaleString()} words | ~{scriptTotals.minutes} minutes of content
              </p>
            )}
          </div>
          <button
            onClick={handleGenerateScripts}
            disabled={generating}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-md font-medium disabled:bg-green-400 disabled:cursor-not-allowed"
          >
            {generating ? 'Generating...' : 'Generate 30-Day Script Pack'}
          </button>
        </div>

        {/* Export Scripts Section */}
        {client.scripts.length > 0 && (
          <div className="mb-6 pb-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Export Scripts</h3>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleCopyToClipboard}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-md font-medium transition-colors"
              >
                Copy All to Clipboard
              </button>
              <button
                onClick={handleDownloadTXT}
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-md font-medium transition-colors"
              >
                Download as TXT
              </button>
              <button
                onClick={handleDownloadJSON}
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-md font-medium transition-colors"
              >
                Download as JSON
              </button>
              <button
                onClick={handleDownloadPDF}
                className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-md font-medium transition-colors flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
                Download as PDF
              </button>
            </div>
          </div>
        )}

        {/* Success Message */}
        {successMessage && (
          <div className="mb-4 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-md">
            {successMessage}
          </div>
        )}

        {/* Bulk Action Toolbar */}
        {selectedScripts.size > 0 && (
          <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-gray-900">
                  {selectedScripts.size} script(s) selected
                </span>
                <button
                  onClick={() => setSelectedScripts(new Set())}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  Clear Selection
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleBulkStatusUpdate('draft')}
                  disabled={bulkUpdating}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md font-medium text-sm disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  Mark as Draft
                </button>
                <button
                  onClick={() => handleBulkStatusUpdate('approved')}
                  disabled={bulkUpdating}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md font-medium text-sm disabled:bg-green-400 disabled:cursor-not-allowed transition-colors"
                >
                  Mark as Approved
                </button>
                <button
                  onClick={() => handleBulkStatusUpdate('exported')}
                  disabled={bulkUpdating}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium text-sm disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors"
                >
                  Mark as Exported
                </button>
              </div>
            </div>
          </div>
        )}

        {client.scripts.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No scripts yet. Click the button above to generate a 30-day pack.
          </p>
        ) : (
          <div className="space-y-6">
            {/* Select All Checkbox */}
            {client.scripts.length > 0 && (
              <div className="flex items-center space-x-2 pb-3 border-b border-gray-200">
                <input
                  type="checkbox"
                  id="select-all"
                  checked={selectedScripts.size === client.scripts.length && client.scripts.length > 0}
                  onChange={toggleSelectAll}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
                />
                <label htmlFor="select-all" className="text-sm font-medium text-gray-700 cursor-pointer">
                  Select All ({client.scripts.length} scripts)
                </label>
              </div>
            )}

            {Object.entries(scriptsByType).map(([type, scripts]) => {
              if (scripts.length === 0) return null

              return (
                <div key={type}>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 pb-2 border-b">
                    {SCRIPT_TYPE_LABELS[type]} ({scripts.length})
                  </h3>
                  <div className="space-y-3">
                    {scripts.map((script) => {
                      const wordCount = getWordCount(script.scriptText)
                      const duration = estimateDuration(script.scriptText)
                      const formattedDuration = formatDuration(duration)

                      return (
                        <div
                          key={script.id}
                          className="border border-gray-200 rounded-lg p-4 hover:border-gray-300"
                        >
                          {editingScript === script.id ? (
                            // Edit mode
                            <div className="space-y-3">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Script Text
                                </label>
                                <textarea
                                  value={editForm.scriptText}
                                  onChange={(e) =>
                                    setEditForm({ ...editForm, scriptText: e.target.value })
                                  }
                                  rows={6}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400"
                                />
                                <div className="mt-2 text-sm text-gray-500">
                                  {getWordCount(editForm.scriptText)} words | {formatDuration(estimateDuration(editForm.scriptText))}
                                </div>
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Status
                                </label>
                                <select
                                  value={editForm.status}
                                  onChange={(e) =>
                                    setEditForm({ ...editForm, status: e.target.value })
                                  }
                                  className="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                                >
                                  <option value="draft">Draft</option>
                                  <option value="approved">Approved</option>
                                  <option value="exported">Exported</option>
                                </select>
                              </div>
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => saveScript(script.id)}
                                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                >
                                  Save
                                </button>
                                <button
                                  onClick={cancelEdit}
                                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            // View mode
                            <div className="flex space-x-3">
                              <div className="flex-shrink-0 pt-1">
                                <input
                                  type="checkbox"
                                  checked={selectedScripts.has(script.id)}
                                  onChange={() => toggleScriptSelection(script.id)}
                                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
                                />
                              </div>
                              <div className="flex-grow">
                                <div className="flex justify-between items-start mb-2">
                                  <h4 className="font-semibold text-gray-900">{script.title}</h4>
                                  <div className="flex items-center space-x-2">
                                    <span
                                      className={`px-2 py-1 text-xs font-medium rounded ${
                                        script.status === 'approved'
                                          ? 'bg-green-100 text-green-800'
                                          : script.status === 'exported'
                                          ? 'bg-blue-100 text-blue-800'
                                          : 'bg-gray-100 text-gray-800'
                                      }`}
                                    >
                                      {script.status}
                                    </span>
                                    <button
                                      onClick={() => startEditScript(script)}
                                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                    >
                                      Edit
                                    </button>
                                  </div>
                                </div>
                                <p className="text-gray-600 text-sm whitespace-pre-wrap line-clamp-2">
                                  {script.scriptText.split('\n').slice(0, 2).join('\n')}
                                </p>
                                <div className="mt-2 text-sm text-gray-500">
                                  {wordCount} words | {formattedDuration}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
