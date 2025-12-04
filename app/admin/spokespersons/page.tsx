'use client'

import { useEffect, useState, useCallback } from 'react'

interface Spokesperson {
  id: string
  name: string
  displayName: string
  description: string
  primaryNiche: string
  secondaryNiches: string | null
  tone: string
  personality: string
  ageRange: string
  gender: string
  avatarUrl: string | null
  demoVideoUrl: string | null
  tier: string
  basePrice: number
  isAvailable: boolean
  isExclusive: boolean
  featured: boolean
  timesUsed: number
  createdAt: string
}

const NICHE_OPTIONS = [
  'Med Spa / Aesthetics',
  'Real Estate',
  'Legal / Law',
  'Finance / Insurance',
  'Fitness / Wellness',
  'Restaurant / Hospitality',
  'Dental / Medical',
  'Tech / SaaS',
  'E-commerce / Retail',
  'Coaching / Consulting',
]

const TIER_OPTIONS = [
  { value: 'standard', label: 'Standard', color: 'bg-gray-100 text-gray-800' },
  { value: 'premium', label: 'Premium', color: 'bg-purple-100 text-purple-800' },
  { value: 'exclusive', label: 'Exclusive', color: 'bg-amber-100 text-amber-800' },
]

export default function SpokespersonsPage() {
  const [spokespersons, setSpokespersons] = useState<Spokesperson[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // Quick import states
  const [showImportPanel, setShowImportPanel] = useState(false)
  const [bulkPasteText, setBulkPasteText] = useState('')
  const [clientDescription, setClientDescription] = useState('')
  const [generating, setGenerating] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    displayName: '',
    description: '',
    primaryNiche: 'Med Spa / Aesthetics',
    secondaryNiches: '',
    tone: '',
    personality: '',
    ageRange: '',
    gender: 'Female',
    avatarUrl: '',
    demoVideoUrl: '',
    demoVideoThumb: '',
    voiceSample: '',
    voiceStyle: '',
    tier: 'standard',
    basePrice: 99700,
    isAvailable: true,
    featured: false,
    vidbuzzActorId: '',
    vidbuzzVoiceId: '',
  })

  const fetchSpokespersons = useCallback(async () => {
    try {
      const response = await fetch('/api/spokespersons')
      if (!response.ok) throw new Error('Failed to fetch')
      const data = await response.json()
      setSpokespersons(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchSpokespersons()
  }, [fetchSpokespersons])

  const resetForm = () => {
    setFormData({
      name: '',
      displayName: '',
      description: '',
      primaryNiche: 'Med Spa / Aesthetics',
      secondaryNiches: '',
      tone: '',
      personality: '',
      ageRange: '',
      gender: 'Female',
      avatarUrl: '',
      demoVideoUrl: '',
      demoVideoThumb: '',
      voiceSample: '',
      voiceStyle: '',
      tier: 'standard',
      basePrice: 99700,
      isAvailable: true,
      featured: false,
      vidbuzzActorId: '',
      vidbuzzVoiceId: '',
    })
    setEditingId(null)
  }

  // Parse bulk text into form fields
  const parseBulkText = (text: string) => {
    const getValue = (label: string): string => {
      const patterns = [
        new RegExp(`${label}:\\s*[""]?([^""\\n]+)[""]?`, 'i'),
        new RegExp(`\\*\\*${label}:\\*\\*\\s*([^\\n]+)`, 'i'),
        new RegExp(`${label}:\\s*([^\\n]+)`, 'i'),
      ]
      for (const pattern of patterns) {
        const match = text.match(pattern)
        if (match) return match[1].trim().replace(/^[""]|[""]$/g, '')
      }
      return ''
    }

    // Extract multi-line sections
    const getSection = (label: string): string => {
      const pattern = new RegExp(`${label}[:\\s]*([\\s\\S]*?)(?=\\n\\n|\\n[A-Z][a-z]+:|\\n\\*\\*|$)`, 'i')
      const match = text.match(pattern)
      if (match) {
        return match[1].trim().replace(/^[""]|[""]$/g, '').replace(/\n/g, ' ').trim()
      }
      return ''
    }

    const name = getValue('Name') || ''
    const tagline = getValue('Tagline') || getValue('Display Name') || ''
    const bestFor = getValue('Best For') || getSection('Best For') || ''
    const ageRange = getValue('Age Range') || ''
    const gender = getValue('Gender') || 'Female'
    const appearance = getSection('Appearance') || ''
    const wardrobe = getSection('Wardrobe') || ''
    const voiceStyle = getSection('Voice Style') || ''
    const personality = getSection('Personality') || getValue('Personality') || ''

    // Determine primary niche from "Best For"
    let primaryNiche = 'Med Spa / Aesthetics'
    const bestForLower = bestFor.toLowerCase()
    if (bestForLower.includes('real estate') || bestForLower.includes('property')) {
      primaryNiche = 'Real Estate'
    } else if (bestForLower.includes('legal') || bestForLower.includes('law')) {
      primaryNiche = 'Legal / Law'
    } else if (bestForLower.includes('fitness') || bestForLower.includes('gym')) {
      primaryNiche = 'Fitness / Wellness'
    } else if (bestForLower.includes('restaurant') || bestForLower.includes('food')) {
      primaryNiche = 'Restaurant / Hospitality'
    } else if (bestForLower.includes('dental') || bestForLower.includes('medical')) {
      primaryNiche = 'Dental / Medical'
    } else if (bestForLower.includes('tech') || bestForLower.includes('saas')) {
      primaryNiche = 'Tech / SaaS'
    } else if (bestForLower.includes('finance') || bestForLower.includes('insurance')) {
      primaryNiche = 'Finance / Insurance'
    } else if (bestForLower.includes('coaching') || bestForLower.includes('consulting')) {
      primaryNiche = 'Coaching / Consulting'
    } else if (bestForLower.includes('med spa') || bestForLower.includes('beauty') || bestForLower.includes('aesthetics')) {
      primaryNiche = 'Med Spa / Aesthetics'
    }

    // Build description from appearance + wardrobe
    const description = [appearance, wardrobe].filter(Boolean).join(' ').slice(0, 500) ||
      `${name} is a ${gender.toLowerCase()} AI spokesperson specializing in ${bestFor}.`

    // Extract tone from personality/voice style
    const toneKeywords = ['warm', 'professional', 'friendly', 'authoritative', 'energetic', 'calm', 'soothing', 'confident', 'approachable', 'nurturing', 'knowledgeable', 'empathetic']
    const foundTones = toneKeywords.filter(t =>
      personality.toLowerCase().includes(t) || voiceStyle.toLowerCase().includes(t)
    )
    const tone = foundTones.slice(0, 3).map(t => t.charAt(0).toUpperCase() + t.slice(1)).join(', ') || 'Professional, Friendly'

    setFormData({
      ...formData,
      name,
      displayName: tagline || `${name} - AI Spokesperson`,
      description,
      primaryNiche,
      secondaryNiches: bestFor,
      tone,
      personality: personality.slice(0, 200) || 'Professional, Knowledgeable',
      ageRange,
      gender: gender.includes('Female') || gender.includes('female') ? 'Female' :
              gender.includes('Male') || gender.includes('male') ? 'Male' : 'Non-binary',
      voiceStyle: voiceStyle.slice(0, 200) || '',
    })

    setSuccessMessage('Form fields populated from paste! Review and adjust as needed.')
    setTimeout(() => setSuccessMessage(null), 4000)
    setShowImportPanel(false)
    setBulkPasteText('')
    setShowForm(true)
  }

  // Generate spokesperson from client description using AI
  const generateFromDescription = async () => {
    if (!clientDescription.trim()) {
      setError('Please enter a client description first')
      return
    }

    setGenerating(true)
    setError(null)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{
            role: 'user',
            content: `Based on this client description for a custom AI spokesperson, generate a complete character profile in a structured format.

Client Description:
${clientDescription}

Please respond with ONLY the following format (no extra text):
Name: [First name only]
Tagline: "[Name] - [Title/Role]"
Best For: [Industry and specializations]
Age Range: [e.g., 28-35]
Gender: [Female/Male/Non-binary]
Appearance: [2-3 sentences describing physical appearance]
Wardrobe: [Clothing style recommendations]
Voice Style: [Voice characteristics and accent if any]
Personality: [Key personality traits]
Background/Setting: [Recommended settings for videos]
Sample Script: [A 30-second intro script in their voice]`
          }],
        }),
      })

      if (!response.ok) throw new Error('Failed to generate')

      const data = await response.json()
      const generatedText = data.message.content

      // Parse the generated text
      parseBulkText(generatedText)
      setClientDescription('')
      setSuccessMessage('AI character generated! Review and adjust the details.')
      setTimeout(() => setSuccessMessage(null), 4000)
    } catch {
      setError('Failed to generate character. Please try again or paste manually.')
    } finally {
      setGenerating(false)
    }
  }

  const handleEdit = (sp: Spokesperson) => {
    setFormData({
      name: sp.name,
      displayName: sp.displayName,
      description: sp.description,
      primaryNiche: sp.primaryNiche,
      secondaryNiches: sp.secondaryNiches || '',
      tone: sp.tone,
      personality: sp.personality,
      ageRange: sp.ageRange,
      gender: sp.gender,
      avatarUrl: sp.avatarUrl || '',
      demoVideoUrl: sp.demoVideoUrl || '',
      demoVideoThumb: '',
      voiceSample: '',
      voiceStyle: '',
      tier: sp.tier,
      basePrice: sp.basePrice,
      isAvailable: sp.isAvailable,
      featured: sp.featured,
      vidbuzzActorId: '',
      vidbuzzVoiceId: '',
    })
    setEditingId(sp.id)
    setShowForm(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)

    try {
      const url = editingId
        ? `/api/spokespersons/${editingId}`
        : '/api/spokespersons'

      const response = await fetch(url, {
        method: editingId ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) throw new Error('Failed to save')

      setSuccessMessage(editingId ? 'Spokesperson updated!' : 'Spokesperson created!')
      setTimeout(() => setSuccessMessage(null), 3000)

      resetForm()
      setShowForm(false)
      fetchSpokespersons()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this spokesperson?')) return

    try {
      const response = await fetch(`/api/spokespersons/${id}`, {
        method: 'DELETE',
      })
      if (!response.ok) throw new Error('Failed to delete')

      setSuccessMessage('Spokesperson deleted!')
      setTimeout(() => setSuccessMessage(null), 3000)
      fetchSpokespersons()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete')
    }
  }

  const formatPrice = (cents: number) => {
    return `$${(cents / 100).toLocaleString()}`
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Loading spokespersons...</div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">AI Spokespersons</h1>
          <p className="text-gray-600 mt-1">Manage your AI character library</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => {
              setShowImportPanel(!showImportPanel)
              setShowForm(false)
            }}
            className={`px-4 py-2 rounded-md font-medium ${
              showImportPanel
                ? 'bg-purple-100 text-purple-700'
                : 'bg-purple-600 text-white hover:bg-purple-700'
            }`}
          >
            {showImportPanel ? 'Hide Import' : 'Quick Import'}
          </button>
          <button
            onClick={() => {
              resetForm()
              setShowForm(!showForm)
              setShowImportPanel(false)
            }}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 font-medium"
          >
            {showForm ? 'Cancel' : '+ Add Spokesperson'}
          </button>
        </div>
      </div>

      {/* Quick Import Panel */}
      {showImportPanel && (
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg shadow mb-6 p-6 border border-purple-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Import Options</h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Bulk Paste */}
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <span className="text-xl">📋</span>
                Paste Character Profile
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                Paste a formatted character profile (Name, Tagline, Best For, Age Range, Gender, Appearance, Wardrobe, Voice Style, Personality, etc.)
              </p>
              <textarea
                value={bulkPasteText}
                onChange={(e) => setBulkPasteText(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 text-sm font-mono"
                rows={8}
                placeholder={`Name: Aria

Tagline: "Aria - The Beauty Expert"

Best For: Med spa industry; specializing in skincare treatments

Age Range: 28-35

Gender: Female

Appearance: Aria is a stunning woman with long, wavy blonde hair...

Wardrobe: Stylish, professional attire...

Voice Style: Soothing, melodic voice...

Personality: Warm, knowledgeable, nurturing...`}
              />
              <button
                onClick={() => parseBulkText(bulkPasteText)}
                disabled={!bulkPasteText.trim()}
                className="mt-3 w-full px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-medium"
              >
                Parse & Fill Form
              </button>
            </div>

            {/* AI Generate from Description */}
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <span className="text-xl">🤖</span>
                Generate from Client Description
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                Paste a rough description from a client requesting a custom AI character, and AI will generate a complete profile.
              </p>
              <textarea
                value={clientDescription}
                onChange={(e) => setClientDescription(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 text-sm"
                rows={8}
                placeholder={`Example client request:

"I need a friendly female spokesperson for my dental practice. She should look professional but approachable, maybe in her 30s. I want her to explain dental procedures in a way that doesn't scare patients. Calm, reassuring voice."`}
              />
              <button
                onClick={generateFromDescription}
                disabled={!clientDescription.trim() || generating}
                className="mt-3 w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-medium flex items-center justify-center gap-2"
              >
                {generating ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating...
                  </>
                ) : (
                  'Generate with AI'
                )}
              </button>
            </div>
          </div>

          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-sm text-amber-800">
              <strong>Tip:</strong> After importing, review and adjust the generated fields before saving. You can also add avatar images and demo video URLs.
            </p>
          </div>
        </div>
      )}

      {/* Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-6">
          {successMessage}
        </div>
      )}

      {/* Add/Edit Form */}
      {showForm && (
        <div className="bg-white rounded-lg shadow mb-6 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            {editingId ? 'Edit Spokesperson' : 'Add New Spokesperson'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900"
                  placeholder="e.g., Sarah"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Display Name *
                </label>
                <input
                  type="text"
                  value={formData.displayName}
                  onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900"
                  placeholder="e.g., Sarah - The Beauty Expert"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900"
                rows={2}
                placeholder="Short bio describing this AI spokesperson..."
                required
              />
            </div>

            {/* Industry & Character */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Primary Niche *
                </label>
                <select
                  value={formData.primaryNiche}
                  onChange={(e) => setFormData({ ...formData, primaryNiche: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900"
                  required
                >
                  {NICHE_OPTIONS.map(niche => (
                    <option key={niche} value={niche}>{niche}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gender *
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900"
                  required
                >
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Non-binary">Non-binary</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Age Range *
                </label>
                <input
                  type="text"
                  value={formData.ageRange}
                  onChange={(e) => setFormData({ ...formData, ageRange: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900"
                  placeholder="e.g., 30-40"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tone *
                </label>
                <input
                  type="text"
                  value={formData.tone}
                  onChange={(e) => setFormData({ ...formData, tone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900"
                  placeholder="e.g., Luxury, Sophisticated"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Personality *
                </label>
                <input
                  type="text"
                  value={formData.personality}
                  onChange={(e) => setFormData({ ...formData, personality: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900"
                  placeholder="e.g., Warm, Professional, Knowledgeable"
                  required
                />
              </div>
            </div>

            {/* Media URLs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Avatar URL
                </label>
                <input
                  type="url"
                  value={formData.avatarUrl}
                  onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900"
                  placeholder="https://..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Demo Video URL (YouTube/Vimeo)
                </label>
                <input
                  type="url"
                  value={formData.demoVideoUrl}
                  onChange={(e) => setFormData({ ...formData, demoVideoUrl: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900"
                  placeholder="https://youtube.com/watch?v=..."
                />
              </div>
            </div>

            {/* Pricing & Tier */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tier
                </label>
                <select
                  value={formData.tier}
                  onChange={(e) => setFormData({ ...formData, tier: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900"
                >
                  {TIER_OPTIONS.map(tier => (
                    <option key={tier.value} value={tier.value}>{tier.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Base Price (cents)
                </label>
                <input
                  type="number"
                  value={formData.basePrice}
                  onChange={(e) => setFormData({ ...formData, basePrice: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900"
                  placeholder="99700 = $997"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formatPrice(formData.basePrice)}
                </p>
              </div>
              <div className="flex items-center gap-6 pt-6">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.isAvailable}
                    onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm text-gray-700">Available</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm text-gray-700">Featured</span>
                </label>
              </div>
            </div>

            {/* VidBuzz Integration */}
            <div className="border-t pt-4">
              <h3 className="text-sm font-medium text-gray-700 mb-3">VidBuzz Integration (Optional)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    VidBuzz Actor ID
                  </label>
                  <input
                    type="text"
                    value={formData.vidbuzzActorId}
                    onChange={(e) => setFormData({ ...formData, vidbuzzActorId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900"
                    placeholder="Actor ID from VidBuzz"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    VidBuzz Voice ID
                  </label>
                  <input
                    type="text"
                    value={formData.vidbuzzVoiceId}
                    onChange={(e) => setFormData({ ...formData, vidbuzzVoiceId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900"
                    placeholder="Voice ID from VidBuzz"
                  />
                </div>
              </div>
            </div>

            {/* Submit */}
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  resetForm()
                  setShowForm(false)
                }}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-indigo-400"
              >
                {saving ? 'Saving...' : editingId ? 'Update' : 'Create'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Spokespersons Grid */}
      {spokespersons.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <div className="text-6xl mb-4">🎭</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Spokespersons Yet</h3>
          <p className="text-gray-600 mb-6">Add your first AI spokesperson to get started.</p>
          <button
            onClick={() => setShowForm(true)}
            className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            + Add First Spokesperson
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {spokespersons.map((sp) => (
            <div key={sp.id} className="bg-white rounded-lg shadow overflow-hidden">
              {/* Avatar/Image */}
              <div className="h-48 bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center relative">
                {sp.avatarUrl ? (
                  <img
                    src={sp.avatarUrl}
                    alt={sp.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-6xl">👤</div>
                )}
                {sp.featured && (
                  <span className="absolute top-2 right-2 px-2 py-1 bg-amber-500 text-white text-xs font-medium rounded">
                    Featured
                  </span>
                )}
                {!sp.isAvailable && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <span className="text-white font-medium">Unavailable</span>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-bold text-gray-900">{sp.name}</h3>
                  <span className={`px-2 py-1 text-xs font-medium rounded ${
                    TIER_OPTIONS.find(t => t.value === sp.tier)?.color || 'bg-gray-100'
                  }`}>
                    {sp.tier.charAt(0).toUpperCase() + sp.tier.slice(1)}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">{sp.displayName}</p>
                <p className="text-sm text-gray-500 mb-3 line-clamp-2">{sp.description}</p>

                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs rounded">
                    {sp.primaryNiche}
                  </span>
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                    {sp.gender}
                  </span>
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                    {sp.ageRange}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-gray-900">{formatPrice(sp.basePrice)}</span>
                  <span className="text-gray-500">Used {sp.timesUsed}x</span>
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-4 pt-4 border-t">
                  <button
                    onClick={() => handleEdit(sp)}
                    className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 text-sm font-medium"
                  >
                    Edit
                  </button>
                  {sp.demoVideoUrl && (
                    <a
                      href={sp.demoVideoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-2 bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200 text-sm font-medium"
                    >
                      Demo
                    </a>
                  )}
                  <button
                    onClick={() => handleDelete(sp.id)}
                    className="px-3 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200 text-sm font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
