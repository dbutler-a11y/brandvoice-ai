'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const NICHE_OPTIONS = [
  'Real Estate Agent',
  'Med Spa',
  'Dentist',
  'Chiropractor',
  'Personal Injury Lawyer',
  'Financial Advisor',
  'Insurance Agent',
  'Home Services',
  'Fitness',
  'Restaurant',
  'E-commerce',
  'SaaS',
  'Coaching',
  'Other'
]

const TONE_OPTIONS = [
  'Warm and friendly',
  'Professional and authoritative',
  'High-energy',
  'Calm and reassuring',
  'Casual',
  'Luxury',
  'Fun and playful',
  'Educational'
]

export default function IntakePage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    // Section 1: Business Basics
    businessName: '',
    niche: '',
    website: '',
    contactName: '',
    email: '',
    phone: '',

    // Section 2: Brand Voice & Goals
    tone: '',
    goals: '',
    brandVoiceNotes: '',

    // Section 3: Raw Material
    rawFaqs: '',
    rawOffers: '',
    rawTestimonials: '',
    rawPromos: '',
    references: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
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
        throw new Error('Failed to submit form')
      }

      // Redirect to thank you page
      router.push('/thank-you')
    } catch (err) {
      console.error('Error submitting form:', err)
      setError('Failed to submit form. Please try again.')
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="text-indigo-600 hover:text-indigo-700 font-medium mb-4 inline-block">
            ← Back to Home
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Client Intake Form
          </h1>
          <p className="text-lg text-gray-600">
            Tell us about your business so we can create your perfect AI spokesperson
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg p-8 space-y-8">
          {/* Section 1: Business Basics */}
          <div className="space-y-6">
            <div className="border-b border-gray-200 pb-4">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                1. Business Basics
              </h2>
              <p className="text-gray-600">Let&apos;s start with the essentials about your business</p>
            </div>

            <div>
              <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 mb-1">
                Business Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="businessName"
                name="businessName"
                required
                value={formData.businessName}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 placeholder-gray-400"
                placeholder="e.g., Smith & Associates Real Estate"
              />
            </div>

            <div>
              <label htmlFor="niche" className="block text-sm font-medium text-gray-700 mb-1">
                Industry/Niche <span className="text-red-500">*</span>
              </label>
              <select
                id="niche"
                name="niche"
                required
                value={formData.niche}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
              >
                <option value="">Select your industry...</option>
                {NICHE_OPTIONS.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1">
                Website
              </label>
              <input
                type="url"
                id="website"
                name="website"
                value={formData.website}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 placeholder-gray-400"
                placeholder="https://yourwebsite.com"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="contactName" className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="contactName"
                  name="contactName"
                  required
                  value={formData.contactName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 placeholder-gray-400"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 placeholder-gray-400"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 placeholder-gray-400"
                placeholder="(555) 123-4567"
              />
            </div>
          </div>

          {/* Section 2: Brand Voice & Goals */}
          <div className="space-y-6">
            <div className="border-b border-gray-200 pb-4">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                2. Brand Voice & Goals
              </h2>
              <p className="text-gray-600">Help us understand how you want your AI to communicate</p>
            </div>

            <div>
              <label htmlFor="tone" className="block text-sm font-medium text-gray-700 mb-1">
                Desired Tone <span className="text-red-500">*</span>
              </label>
              <select
                id="tone"
                name="tone"
                required
                value={formData.tone}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
              >
                <option value="">Select a tone...</option>
                {TONE_OPTIONS.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="goals" className="block text-sm font-medium text-gray-700 mb-1">
                Goals for This Content <span className="text-red-500">*</span>
              </label>
              <textarea
                id="goals"
                name="goals"
                required
                value={formData.goals}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 placeholder-gray-400"
                placeholder="e.g., Generate leads, build brand awareness, educate customers..."
              />
            </div>

            <div>
              <label htmlFor="brandVoiceNotes" className="block text-sm font-medium text-gray-700 mb-1">
                Brand Voice Notes <span className="text-red-500">*</span>
              </label>
              <textarea
                id="brandVoiceNotes"
                name="brandVoiceNotes"
                required
                value={formData.brandVoiceNotes}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 placeholder-gray-400"
                placeholder="How do you want to come across? Any specific phrases you use? Words to avoid?"
              />
              <p className="mt-1 text-sm text-gray-500">
                Include any specific language, phrases, or style preferences
              </p>
            </div>
          </div>

          {/* Section 3: Raw Material */}
          <div className="space-y-6">
            <div className="border-b border-gray-200 pb-4">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                3. Raw Material
              </h2>
              <p className="text-gray-600">
                Paste any raw content we can use to create your scripts. The more you give us, the better!
              </p>
            </div>

            <div>
              <label htmlFor="rawFaqs" className="block text-sm font-medium text-gray-700 mb-1">
                FAQs / Common Questions <span className="text-red-500">*</span>
              </label>
              <textarea
                id="rawFaqs"
                name="rawFaqs"
                required
                value={formData.rawFaqs}
                onChange={handleChange}
                rows={6}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 placeholder-gray-400"
                placeholder="List common questions your customers ask. e.g., 'How much does a consultation cost?' 'Do you offer financing?'"
              />
              <p className="mt-1 text-sm text-gray-500">
                Paste any FAQ pages, common objections, or questions you hear regularly
              </p>
            </div>

            <div>
              <label htmlFor="rawOffers" className="block text-sm font-medium text-gray-700 mb-1">
                Services / Products / Offers <span className="text-red-500">*</span>
              </label>
              <textarea
                id="rawOffers"
                name="rawOffers"
                required
                value={formData.rawOffers}
                onChange={handleChange}
                rows={6}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 placeholder-gray-400"
                placeholder="List your services, products, or special offers. Include descriptions, benefits, pricing if relevant."
              />
              <p className="mt-1 text-sm text-gray-500">
                Copy from your website, brochures, or service menu
              </p>
            </div>

            <div>
              <label htmlFor="rawTestimonials" className="block text-sm font-medium text-gray-700 mb-1">
                Testimonials / Reviews <span className="text-red-500">*</span>
              </label>
              <textarea
                id="rawTestimonials"
                name="rawTestimonials"
                required
                value={formData.rawTestimonials}
                onChange={handleChange}
                rows={6}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 placeholder-gray-400"
                placeholder="Paste customer testimonials, reviews, success stories..."
              />
              <p className="mt-1 text-sm text-gray-500">
                Include any positive feedback from customers or clients
              </p>
            </div>

            <div>
              <label htmlFor="rawPromos" className="block text-sm font-medium text-gray-700 mb-1">
                Promotions / Special Announcements <span className="text-red-500">*</span>
              </label>
              <textarea
                id="rawPromos"
                name="rawPromos"
                required
                value={formData.rawPromos}
                onChange={handleChange}
                rows={6}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 placeholder-gray-400"
                placeholder="Any current or upcoming promotions, events, seasonal offers..."
              />
              <p className="mt-1 text-sm text-gray-500">
                Include limited-time offers, seasonal promotions, or special events
              </p>
            </div>

            <div>
              <label htmlFor="references" className="block text-sm font-medium text-gray-700 mb-1">
                References / Inspiration <span className="text-red-500">*</span>
              </label>
              <textarea
                id="references"
                name="references"
                required
                value={formData.references}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 placeholder-gray-400"
                placeholder="Links to competitors you admire, influencers in your space, or content styles you like..."
              />
              <p className="mt-1 text-sm text-gray-500">
                Share any examples of content or creators that inspire you
              </p>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <div className="pt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-indigo-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-indigo-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Intake Form'}
            </button>
            <p className="mt-4 text-center text-sm text-gray-500">
              This usually takes 2-3 minutes. We&apos;ll be in touch within 24-48 hours.
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}
