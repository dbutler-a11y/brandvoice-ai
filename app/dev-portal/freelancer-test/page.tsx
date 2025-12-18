'use client'

import { useState } from 'react'
import Link from 'next/link'

interface Submission {
  id: string
  freelancerName: string
  email: string
  submittedAt: string
  status: 'pending' | 'reviewing' | 'approved' | 'rejected'
  videoUrl?: string
  notes?: string
}

// Mock submissions for demo
const mockSubmissions: Submission[] = [
  {
    id: '1',
    freelancerName: 'John D.',
    email: 'john@example.com',
    submittedAt: '2024-12-15',
    status: 'reviewing',
    notes: 'Good quality, checking motion smoothness'
  },
]

export default function FreelancerTestPage() {
  const [activeTab, setActiveTab] = useState<'instructions' | 'submit' | 'submissions'>('instructions')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    videoUrl: '',
    notes: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    // Simulate submission
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsSubmitting(false)
    setSubmitted(true)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl p-8 text-white">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold">Freelancer Skills Test</h1>
            <p className="text-orange-100">Cinematic AI Video Production</p>
          </div>
        </div>
        <p className="text-orange-100 max-w-2xl">
          Welcome! This test evaluates your ability to create cinematic AI-generated sports advertisements
          using Higgsfield.ai tools. Review the instructions, watch the reference video, and submit your best work.
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {[
            { id: 'instructions', label: 'Instructions & Resources', icon: '📋' },
            { id: 'submit', label: 'Submit Your Work', icon: '📤' },
            { id: 'submissions', label: 'All Submissions', icon: '📊' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Instructions Tab */}
      {activeTab === 'instructions' && (
        <div className="space-y-8">
          {/* Overview Card */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="text-2xl">🎯</span> Your Task
            </h2>
            <p className="text-gray-600 mb-4">
              Create a <strong>cinematic sports advertisement</strong> using AI tools. Your goal is to replicate
              or come as close as possible to the quality shown in the reference video below.
            </p>
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <p className="text-orange-800 text-sm">
                <strong>Evaluation Criteria:</strong> We're testing 3-5 freelancers. The one who produces
                the closest match to the reference quality will be selected for ongoing work.
              </p>
            </div>
          </div>

          {/* Reference Videos */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="text-2xl">🎬</span> Reference Videos
            </h2>
            <p className="text-gray-600 mb-6">
              Watch both videos carefully. These demonstrate the quality standards you should aim to match or exceed.
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Video 1 - Cinematic AI Ads */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Cinematic AI Ads Tutorial</h3>
                <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                  <iframe
                    src="https://www.youtube.com/embed/P7pH_1zFKbE"
                    title="Reference Video - Cinematic AI Ads"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                    className="absolute top-0 left-0 w-full h-full rounded-lg"
                  />
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Cinematic sports ad production workflow
                </p>
              </div>

              {/* Video 2 - UGC Content Examples */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">UGC Video Content Examples</h3>
                <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                  <iframe
                    src="https://www.youtube.com/embed/1e2THXih1Fo"
                    title="UGC Video Content Examples"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                    className="absolute top-0 left-0 w-full h-full rounded-lg"
                  />
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  UGC-style video content examples
                </p>
              </div>
            </div>
          </div>

          {/* Workflow Instructions */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="text-2xl">📖</span> Production Workflow
            </h2>

            <div className="space-y-6">
              {/* Segment 1 */}
              <div className="border-l-4 border-blue-500 pl-4">
                <h3 className="font-bold text-gray-900 mb-2">Segment 1: Image Generation</h3>
                <div className="text-gray-600 space-y-2">
                  <p><strong>Tools:</strong> Higgsfield.ai → Image Option → Nano Banana Pro model</p>
                  <p><strong>Settings:</strong> Quality = 4K</p>
                  <p><strong>Key Technique:</strong> Use "dark moody aesthetic with deep contrast and subtle cinematic tones" in prompts. Always specify professional camera equipment (Sony A7R V with various lenses).</p>

                  <div className="bg-gray-50 rounded-lg p-4 mt-3">
                    <p className="text-sm font-medium text-gray-700 mb-2">Example Shots to Generate:</p>
                    <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
                      <li>LeBron James body shot during free throw</li>
                      <li>Extreme close-up of athlete's eyes with arena lighting reflections</li>
                      <li>Detailed hand-and-basketball composition</li>
                      <li>Cristiano Ronaldo in free-kick stance (side-view)</li>
                      <li>Serena Williams back-view on tennis court</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Segment 2 */}
              <div className="border-l-4 border-purple-500 pl-4">
                <h3 className="font-bold text-gray-900 mb-2">Segment 2: Video Generation</h3>
                <div className="text-gray-600 space-y-2">
                  <p><strong>Tools:</strong> Higgsfield.ai → Video Option → Kling 2.5 model</p>
                  <p><strong>Settings:</strong> Quality = 1080p, Duration = 5-10 seconds</p>
                  <p><strong>Camera Technique:</strong> Use "soft handheld drift" and shallow depth of field in prompts.</p>

                  <div className="bg-gray-50 rounded-lg p-4 mt-3">
                    <p className="text-sm font-medium text-gray-700 mb-2">Shot Types to Create:</p>
                    <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
                      <li><strong>Simple motions:</strong> Basketball rotation, bouncing, stepping mechanics</li>
                      <li><strong>Transitions:</strong> Ball morphing from football to tennis ball mid-air with catch</li>
                      <li><strong>Cinematic continuity:</strong> Tennis swing with POV positioning, camera following</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Reference Documents */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="text-2xl">📄</span> Reference Documents
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <a
                href="https://docs.google.com/document/d/1v_gWcIyjQ95-sOTVvHEzoqU2pPZgyZSP85cHCQdHcik/edit"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors"
              >
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-blue-900">Original Tutorial Document</p>
                  <p className="text-sm text-blue-700">Full workflow instructions & prompts</p>
                </div>
                <svg className="w-5 h-5 text-blue-500 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>

              <a
                href="https://docs.google.com/document/d/1pHJV1-JUofCweU4Rr4h3Y0JoeqrYlGq6sdBFnmkHoVc/edit"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 bg-green-50 rounded-lg border border-green-200 hover:bg-green-100 transition-colors"
              >
                <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-green-900">Our Work-in-Progress (~75%)</p>
                  <p className="text-sm text-green-700">See our current attempt & approach</p>
                </div>
                <svg className="w-5 h-5 text-green-500 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </div>

          {/* What We're Looking For */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="text-2xl">✅</span> What We're Looking For
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3 text-green-600">Do's</h3>
                <ul className="space-y-2">
                  {[
                    'Match the dark, moody cinematic aesthetic',
                    'Use proper camera specifications in prompts',
                    'Create smooth, natural motion in videos',
                    'Pay attention to lighting and shadows',
                    'Include multiple shot types (wide, close-up, detail)',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                      <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-3 text-red-600">Don'ts</h3>
                <ul className="space-y-2">
                  {[
                    'Overly bright or flat lighting',
                    'Jerky or unnatural motion',
                    'Low resolution or blurry outputs',
                    'Generic prompts without camera specs',
                    'Inconsistent style across shots',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                      <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="bg-gradient-to-r from-orange-100 to-red-100 rounded-xl p-6 text-center">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Ready to Submit?</h3>
            <p className="text-gray-600 mb-4">Once you've created your video, head to the submission tab.</p>
            <button
              onClick={() => setActiveTab('submit')}
              className="inline-flex items-center gap-2 bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
            >
              Go to Submission
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Submit Tab */}
      {activeTab === 'submit' && (
        <div className="max-w-2xl mx-auto">
          {submitted ? (
            <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-green-900 mb-2">Submission Received!</h2>
              <p className="text-green-700 mb-6">
                Thank you for your submission. We'll review your work and get back to you within 48-72 hours.
              </p>
              <button
                onClick={() => {
                  setSubmitted(false)
                  setFormData({ name: '', email: '', videoUrl: '', notes: '' })
                }}
                className="text-green-600 hover:text-green-700 font-medium"
              >
                Submit another entry
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <span className="text-2xl">📤</span> Submit Your Work
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Video URL *
                  </label>
                  <input
                    type="url"
                    required
                    value={formData.videoUrl}
                    onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors"
                    placeholder="https://drive.google.com/... or https://dropbox.com/..."
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    Upload your video to Google Drive, Dropbox, WeTransfer, or YouTube (unlisted) and paste the link here.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes (Optional)
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors resize-none"
                    placeholder="Any notes about your process, tools used, or challenges faced..."
                  />
                </div>

                <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600">
                  <p className="font-medium text-gray-900 mb-1">Before submitting:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Make sure your video link is publicly accessible</li>
                    <li>Double-check the video quality matches 1080p</li>
                    <li>Ensure the cinematic style matches the reference</li>
                  </ul>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-4 rounded-lg font-semibold hover:from-orange-600 hover:to-red-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Submitting...
                    </>
                  ) : (
                    <>
                      Submit My Work
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </>
                  )}
                </button>
              </form>
            </div>
          )}
        </div>
      )}

      {/* Submissions Tab */}
      {activeTab === 'submissions' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="text-2xl">📊</span> All Submissions
            </h2>
            <p className="text-gray-600 mb-6">
              Track all freelancer submissions and their review status.
            </p>

            {mockSubmissions.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                <p className="text-gray-500">No submissions yet</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Freelancer</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Submitted</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Status</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Notes</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockSubmissions.map((submission) => (
                      <tr key={submission.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-4 px-4">
                          <p className="font-medium text-gray-900">{submission.freelancerName}</p>
                          <p className="text-sm text-gray-500">{submission.email}</p>
                        </td>
                        <td className="py-4 px-4 text-sm text-gray-600">
                          {submission.submittedAt}
                        </td>
                        <td className="py-4 px-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            submission.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            submission.status === 'reviewing' ? 'bg-blue-100 text-blue-800' :
                            submission.status === 'approved' ? 'bg-green-100 text-green-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-sm text-gray-600">
                          {submission.notes || '-'}
                        </td>
                        <td className="py-4 px-4">
                          <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Contact */}
      <div className="bg-gray-100 rounded-xl p-6 text-center">
        <p className="text-gray-600">
          Questions? Contact us at{' '}
          <a href="mailto:hello@brandvoice.studio" className="text-orange-600 hover:text-orange-700 font-medium">
            hello@brandvoice.studio
          </a>
        </p>
      </div>
    </div>
  )
}
