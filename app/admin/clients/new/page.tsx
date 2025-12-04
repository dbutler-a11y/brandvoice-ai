'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { NICHE_OPTIONS, TONE_OPTIONS } from '@/lib/utils'
import type { FullIntakeFormData } from '@/lib/types'

export default function NewClientPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState<FullIntakeFormData>({
    businessName: '',
    contactName: '',
    email: '',
    phone: '',
    website: '',
    niche: '',
    tone: '',
    goals: '',
    notes: '',
    rawFaqs: '',
    rawOffers: '',
    rawTestimonials: '',
    rawPromos: '',
    brandVoiceNotes: '',
    references: '',
    brandColors: '',
    logoUrl: '',
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch('/api/clients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error('Failed to create client')
      }

      const client = await response.json()
      router.push(`/admin/clients/${client.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">New Client</h1>
        <p className="text-gray-600 mt-1">Create a new client and intake form</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Section 1: Business Basics */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            1. Business Basics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Business Name *
              </label>
              <input
                type="text"
                name="businessName"
                value={formData.businessName}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Niche *
              </label>
              <select
                name="niche"
                value={formData.niche}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-900"
              >
                <option value="">Select a niche</option>
                {NICHE_OPTIONS.map((niche) => (
                  <option key={niche} value={niche}>
                    {niche}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Website
              </label>
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleChange}
                placeholder="https://example.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contact Name *
              </label>
              <input
                type="text"
                name="contactName"
                value={formData.contactName}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Brand Voice & Goals */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            2. Brand Voice & Goals
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tone *
              </label>
              <select
                name="tone"
                value={formData.tone}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-900"
              >
                <option value="">Select a tone</option>
                {TONE_OPTIONS.map((tone) => (
                  <option key={tone} value={tone}>
                    {tone}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Goals *
              </label>
              <textarea
                name="goals"
                value={formData.goals}
                onChange={handleChange}
                required
                rows={3}
                placeholder="What are the main goals for this content?"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Brand Voice Notes
              </label>
              <textarea
                name="brandVoiceNotes"
                value={formData.brandVoiceNotes}
                onChange={handleChange}
                rows={4}
                placeholder="Any specific brand voice guidelines, language preferences, or style notes..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Raw Material */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            3. Raw Material
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Raw FAQs
              </label>
              <textarea
                name="rawFaqs"
                value={formData.rawFaqs}
                onChange={handleChange}
                rows={4}
                placeholder="List common questions customers ask..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Raw Offers/Services
              </label>
              <textarea
                name="rawOffers"
                value={formData.rawOffers}
                onChange={handleChange}
                rows={4}
                placeholder="List services, packages, or products offered..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Raw Testimonials
              </label>
              <textarea
                name="rawTestimonials"
                value={formData.rawTestimonials}
                onChange={handleChange}
                rows={4}
                placeholder="Paste customer reviews, testimonials, or success stories..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Raw Promos
              </label>
              <textarea
                name="rawPromos"
                value={formData.rawPromos}
                onChange={handleChange}
                rows={4}
                placeholder="List current promotions, special offers, or seasonal campaigns..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                References
              </label>
              <textarea
                name="references"
                value={formData.references}
                onChange={handleChange}
                rows={3}
                placeholder="Links to competitor videos, inspiration, or style references..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Brand Colors
                </label>
                <input
                  type="text"
                  name="brandColors"
                  value={formData.brandColors}
                  onChange={handleChange}
                  placeholder="e.g., #FF5733, #3498DB"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Logo URL
                </label>
                <input
                  type="url"
                  name="logoUrl"
                  value={formData.logoUrl}
                  onChange={handleChange}
                  placeholder="https://example.com/logo.png"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 font-medium"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium disabled:bg-blue-400 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Creating...' : 'Create Client'}
          </button>
        </div>
      </form>
    </div>
  )
}
