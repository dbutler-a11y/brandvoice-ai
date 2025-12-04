'use client'

import { useState } from 'react'

export default function BusinessPlanPage() {
  const [activeSection, setActiveSection] = useState('overview')

  const sections = [
    { id: 'overview', label: 'Overview' },
    { id: 'packages', label: 'Packages' },
    { id: 'addons', label: 'Add-Ons' },
    { id: 'how-it-works', label: 'How It Works' },
    { id: 'mvp-checklist', label: 'MVP Checklist' },
    { id: 'next-actions', label: 'Next Actions' },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Business Plan v1.4</h1>
            <p className="text-purple-100 mt-1">DFY AI Spokesperson Agency</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-purple-200">Last Updated</p>
            <p className="font-semibold">December 3, 2024</p>
          </div>
        </div>
        <p className="mt-4 text-lg font-medium">
          &quot;Your Own AI Spokesperson + 30 Days of Content — Done For You in 7 Days&quot;
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8 overflow-x-auto">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeSection === section.id
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {section.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Content Sections */}
      <div className="bg-white rounded-lg shadow p-6">
        {activeSection === 'overview' && <OverviewSection />}
        {activeSection === 'packages' && <PackagesSection />}
        {activeSection === 'addons' && <AddOnsSection />}
        {activeSection === 'how-it-works' && <HowItWorksSection />}
        {activeSection === 'mvp-checklist' && <MVPChecklistSection />}
        {activeSection === 'next-actions' && <NextActionsSection />}
      </div>
    </div>
  )
}

function OverviewSection() {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-900">Product Overview</h2>

      <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
        <h3 className="font-semibold text-purple-900">Core Promise</h3>
        <p className="text-purple-800 mt-2 text-lg">
          &quot;We give you your own AI spokesperson and 30 days of content, delivered in 7 days, so you never have to film yourself again.&quot;
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-semibold text-gray-900 mb-3">Key Characteristics</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              Clients log in to download files and view status
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              Custom AI spokesperson per client
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              30 days of short-form video content
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              Optional Facebook ad creative add-on
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              On-site voice preview (ElevenLabs)
            </li>
          </ul>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-semibold text-gray-900 mb-3">Production Tools</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-center">
              <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-xs mr-2">Avatar</span>
              VidBuzz / HeyGen / KIE / Kling
            </li>
            <li className="flex items-center">
              <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded text-xs mr-2">Voice</span>
              ElevenLabs
            </li>
            <li className="flex items-center">
              <span className="bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded text-xs mr-2">Captions</span>
              Captions.ai / Veed.io / CapCut
            </li>
          </ul>
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-gray-900 mb-3">Target Audience</h3>
        <div className="flex flex-wrap gap-2">
          {['Med spas', 'Real estate agents', 'Credit repair & tax pros', 'Car sales professionals',
            'Coaches & course creators', 'Fitness trainers', 'Local service providers', 'Agencies'].map((niche) => (
            <span key={niche} className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm">
              {niche}
            </span>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-gray-900 mb-3">Video Usage</h3>
        <div className="flex flex-wrap gap-2">
          {['Instagram Reels', 'TikTok', 'YouTube Shorts', 'Facebook & IG Ads',
            'Retargeting creatives', 'Stories', 'Sales pages'].map((use) => (
            <span key={use} className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm">
              {use}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

function PackagesSection() {
  const packages = [
    {
      name: 'AI Spokesperson Launch Kit',
      price: '$1,500',
      priceType: 'One-Time',
      tier: 'starter',
      features: [
        '1 Custom AI spokesperson avatar',
        '1 Brand voice (preset or cloned)',
        '30 scripts (20-40 seconds each)',
        '30 short-form videos',
        'Viral-style captions',
        'Simple branding (logo, colors)',
        'Delivered in 7 days',
        '9:16 format, ad-ready',
        'Client portal access',
      ],
      ideal: 'Clients who want a one-time, done-for-you package'
    },
    {
      name: 'Content Engine Monthly',
      price: '$997',
      priceType: '/month (3-mo min)',
      tier: 'standard',
      features: [
        'Everything in Launch Kit',
        '30 new videos every 30 days',
        'Monthly strategy call',
        'Priority delivery',
        'Ad-ready formatting',
        'Ongoing portal access',
      ],
      ideal: 'Clients who need consistent monthly content'
    },
    {
      name: 'Content Engine PRO',
      price: '$2,497',
      priceType: '/month',
      tier: 'premium',
      features: [
        '30-40 videos per month',
        'Up to 2 custom AI avatars',
        'Up to 2 custom brand voices',
        'Hook & CTA variations (A/B)',
        'Multi-format: 9:16, 1:1, 16:9',
        'Faster turnaround (3-5 days)',
        'Full portal access',
      ],
      ideal: 'Higher-volume businesses and agencies'
    },
    {
      name: 'AUTHORITY Engine',
      price: '$4,997',
      priceType: '/month',
      tier: 'enterprise',
      features: [
        '60+ videos per month',
        'Up to 3 custom AI avatars',
        'Up to 3 custom voices',
        'Multi-language versions',
        'Full funnel scripting',
        'Posting & scheduling support',
        'Campaign-ready variations',
        'Premium portal access',
      ],
      ideal: 'Serious brands, franchises, or agencies'
    },
  ]

  const tierColors: Record<string, string> = {
    starter: 'border-gray-300',
    standard: 'border-blue-400',
    premium: 'border-purple-500',
    enterprise: 'border-yellow-500',
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-900">DFY Packages</h2>

      <div className="grid md:grid-cols-2 gap-6">
        {packages.map((pkg) => (
          <div key={pkg.name} className={`border-2 ${tierColors[pkg.tier]} rounded-lg p-5`}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-bold text-lg text-gray-900">{pkg.name}</h3>
                <p className="text-sm text-gray-500">{pkg.ideal}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-900">{pkg.price}</p>
                <p className="text-sm text-gray-500">{pkg.priceType}</p>
              </div>
            </div>
            <ul className="space-y-2">
              {pkg.features.map((feature, i) => (
                <li key={i} className="flex items-start text-sm text-gray-700">
                  <span className="text-green-500 mr-2 mt-0.5">✓</span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}

function AddOnsSection() {
  const addons = [
    { name: 'Custom Avatar', price: '$500', description: 'One additional AI avatar look, style, or persona' },
    { name: 'Custom Voice', price: '$250', description: 'One additional brand voice using ElevenLabs' },
    { name: 'Promo Campaign Pack', price: '$1,500', description: '10-15 focused videos for a single campaign' },
    { name: 'Posting & Scheduling', price: '$500/mo', description: 'Light posting on IG + TikTok + Facebook' },
  ]

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-900">Add-Ons</h2>

      <div className="grid md:grid-cols-2 gap-4">
        {addons.map((addon) => (
          <div key={addon.name} className="bg-gray-50 rounded-lg p-4 flex justify-between items-center">
            <div>
              <h3 className="font-semibold text-gray-900">{addon.name}</h3>
              <p className="text-sm text-gray-600">{addon.description}</p>
            </div>
            <p className="text-lg font-bold text-purple-600">{addon.price}</p>
          </div>
        ))}
      </div>

      {/* Facebook Ad Package */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-6 text-white">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-bold">Facebook Ad Creative Engine</h3>
            <p className="text-blue-100 mt-1">Premium Add-On</p>
          </div>
          <p className="text-2xl font-bold">+$1,000/mo</p>
        </div>
        <ul className="mt-4 grid md:grid-cols-2 gap-2 text-sm">
          {[
            '8-12 ad-focused video variants/month',
            'Scroll-stopping hooks',
            'Multiple CTA variants',
            'Thumbnail text overlays',
            'Cold & warm audience versions',
            '1:1 and 9:16 formats',
          ].map((feature, i) => (
            <li key={i} className="flex items-center">
              <span className="text-blue-200 mr-2">→</span>
              {feature}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

function HowItWorksSection() {
  const steps = [
    {
      step: 1,
      title: 'Discovery & Booking',
      client: '"Book a Call" or "Get Started"',
      internal: ['Lead captured in CRM', 'Discovery call scheduled', 'Payment collected via Stripe'],
      deliverable: 'Signed client, payment received',
    },
    {
      step: 2,
      title: 'Onboarding & Voice Selection',
      client: 'Intake form + Voice Preview tool',
      internal: ['Client completes intake form', 'Voice selection via ElevenLabs preview', 'Client linked to portal'],
      deliverable: 'Complete client profile, voice confirmed',
    },
    {
      step: 3,
      title: 'Avatar & Voice Creation',
      client: 'Status: "Creating Your AI Spokesperson"',
      internal: ['Generate avatar (VidBuzz/HeyGen/KIE)', 'Configure voice in ElevenLabs', 'Internal quality review'],
      deliverable: 'Approved avatar + voice ready',
    },
    {
      step: 4,
      title: 'Scriptwriting',
      client: 'Status: "Writing Your Scripts"',
      internal: ['Generate 30 scripts with AI', 'Mix content types (FAQs, CTAs, tips)', 'Optional client approval'],
      deliverable: '30 approved scripts',
    },
    {
      step: 5,
      title: 'Video Production',
      client: 'Status: "Producing Your Videos"',
      internal: ['Generate videos (HeyGen/VidBuzz)', 'Add viral-style captions', 'Export in required formats'],
      deliverable: '30 captioned videos ready for QA',
    },
    {
      step: 6,
      title: 'Quality Assurance',
      client: 'Status: "Final Review"',
      internal: ['Internal QA check', 'Verify captions, audio, branding', 'Organize by day (1-30)'],
      deliverable: 'QA-approved content package',
    },
    {
      step: 7,
      title: 'Delivery',
      client: '"Your Content is Ready!" + Portal access',
      internal: ['Upload to Supabase Storage', 'Update ClientAssets in DB', 'Send delivery notification'],
      deliverable: 'Client has full access via portal',
    },
    {
      step: 8,
      title: 'Ongoing (Monthly)',
      client: 'Monthly call + new content in portal',
      internal: ['Monthly strategy call', 'Repeat Steps 4-7', 'Track subscription renewal'],
      deliverable: 'Fresh 30 videos each month',
    },
  ]

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-900">How It Works — Client Journey</h2>

      <div className="space-y-4">
        {steps.map((step) => (
          <div key={step.step} className="border rounded-lg overflow-hidden">
            <div className="bg-gray-100 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center">
                <span className="bg-purple-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold mr-3">
                  {step.step}
                </span>
                <h3 className="font-semibold text-gray-900">{step.title}</h3>
              </div>
              <span className="text-sm text-gray-500 bg-white px-2 py-1 rounded">
                {step.deliverable}
              </span>
            </div>
            <div className="p-4 grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase mb-2">What Client Sees</p>
                <p className="text-sm text-gray-700 bg-blue-50 px-3 py-2 rounded">{step.client}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase mb-2">Internal Tasks</p>
                <ul className="text-sm text-gray-700 space-y-1">
                  {step.internal.map((task, i) => (
                    <li key={i} className="flex items-center">
                      <span className="text-gray-400 mr-2">•</span>
                      {task}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function MVPChecklistSection() {
  const categories = [
    {
      name: 'Website (Public-Facing)',
      icon: '🌐',
      items: [
        { task: 'Homepage with hero message and CTA', status: 'pending', priority: 'CRITICAL' },
        { task: 'How It Works page (8-step visual flow)', status: 'pending', priority: 'CRITICAL' },
        { task: 'Pricing page (4 packages + add-ons)', status: 'pending', priority: 'CRITICAL' },
        { task: 'Portfolio/Samples page (3-10 videos)', status: 'pending', priority: 'CRITICAL' },
        { task: 'Voice Preview page (ElevenLabs)', status: 'pending', priority: 'HIGH' },
        { task: 'Book a Call page (Calendly)', status: 'pending', priority: 'CRITICAL' },
        { task: 'Checkout page (Stripe)', status: 'pending', priority: 'CRITICAL' },
        { task: 'Thank You / Onboarding page', status: 'pending', priority: 'HIGH' },
      ]
    },
    {
      name: 'Client Portal',
      icon: '🔐',
      items: [
        { task: 'Google OAuth login', status: 'done', priority: 'CRITICAL' },
        { task: 'User authentication flow', status: 'done', priority: 'CRITICAL' },
        { task: 'Portal dashboard', status: 'done', priority: 'CRITICAL' },
        { task: 'Videos page with download', status: 'done', priority: 'CRITICAL' },
        { task: 'Scripts page', status: 'done', priority: 'HIGH' },
        { task: 'Project status display', status: 'pending', priority: 'HIGH' },
        { task: 'Notification when content ready', status: 'pending', priority: 'MEDIUM' },
      ]
    },
    {
      name: 'Admin Dashboard',
      icon: '👨‍💼',
      items: [
        { task: 'Client list view', status: 'done', priority: 'CRITICAL' },
        { task: 'Client detail view', status: 'done', priority: 'CRITICAL' },
        { task: 'Client-User linking', status: 'done', priority: 'HIGH' },
        { task: 'File upload for clients', status: 'done', priority: 'HIGH' },
        { task: 'Spokesperson management', status: 'done', priority: 'HIGH' },
        { task: 'Project status workflow (8 steps)', status: 'pending', priority: 'HIGH' },
        { task: 'Package & add-on tracking per client', status: 'pending', priority: 'HIGH' },
        { task: 'Facebook Ad campaign tracking', status: 'pending', priority: 'MEDIUM' },
      ]
    },
    {
      name: 'Payments & Billing',
      icon: '💳',
      items: [
        { task: 'Stripe account setup', status: 'pending', priority: 'CRITICAL' },
        { task: 'Product/Price configuration', status: 'pending', priority: 'CRITICAL' },
        { task: 'Checkout integration', status: 'pending', priority: 'CRITICAL' },
        { task: 'Subscription handling', status: 'pending', priority: 'HIGH' },
        { task: 'Invoice generation', status: 'pending', priority: 'MEDIUM' },
      ]
    },
    {
      name: 'Sales & Marketing',
      icon: '📣',
      items: [
        { task: '2-3 Facebook ad creatives', status: 'pending', priority: 'CRITICAL' },
        { task: 'Landing page for ads', status: 'pending', priority: 'CRITICAL' },
        { task: 'Retargeting pixel setup', status: 'pending', priority: 'HIGH' },
        { task: 'Lead tracking (CRM)', status: 'pending', priority: 'HIGH' },
        { task: 'Discovery call script', status: 'pending', priority: 'HIGH' },
        { task: 'Follow-up email templates', status: 'pending', priority: 'MEDIUM' },
      ]
    },
    {
      name: 'Production Capability',
      icon: '🎬',
      items: [
        { task: 'VidBuzz/HeyGen account ready', status: 'pending', priority: 'CRITICAL' },
        { task: 'ElevenLabs account ready', status: 'pending', priority: 'CRITICAL' },
        { task: 'Captions tool ready', status: 'pending', priority: 'CRITICAL' },
        { task: 'Sample avatar created', status: 'pending', priority: 'CRITICAL' },
        { task: 'Sample video produced end-to-end', status: 'pending', priority: 'CRITICAL' },
        { task: 'Intake form created', status: 'pending', priority: 'HIGH' },
        { task: 'Script templates ready', status: 'pending', priority: 'HIGH' },
      ]
    },
  ]

  const priorityColors: Record<string, string> = {
    CRITICAL: 'bg-red-100 text-red-800',
    HIGH: 'bg-yellow-100 text-yellow-800',
    MEDIUM: 'bg-blue-100 text-blue-800',
    LOW: 'bg-gray-100 text-gray-800',
  }

  const totalItems = categories.reduce((acc, cat) => acc + cat.items.length, 0)
  const doneItems = categories.reduce((acc, cat) => acc + cat.items.filter(i => i.status === 'done').length, 0)
  const progress = Math.round((doneItems / totalItems) * 100)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">MVP Launch Checklist</h2>
        <div className="flex items-center space-x-3">
          <span className="text-sm text-gray-600">{doneItems} of {totalItems} complete</span>
          <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-green-500 transition-all" style={{ width: `${progress}%` }} />
          </div>
          <span className="font-bold text-green-600">{progress}%</span>
        </div>
      </div>

      <div className="space-y-6">
        {categories.map((category) => {
          const catDone = category.items.filter(i => i.status === 'done').length
          const catTotal = category.items.length
          return (
            <div key={category.name} className="border rounded-lg overflow-hidden">
              <div className="bg-gray-50 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center">
                  <span className="text-xl mr-2">{category.icon}</span>
                  <h3 className="font-semibold text-gray-900">{category.name}</h3>
                </div>
                <span className="text-sm text-gray-500">{catDone}/{catTotal}</span>
              </div>
              <div className="divide-y">
                {category.items.map((item, i) => (
                  <div key={i} className="px-4 py-2 flex items-center justify-between hover:bg-gray-50">
                    <div className="flex items-center">
                      {item.status === 'done' ? (
                        <span className="text-green-500 mr-3">✓</span>
                      ) : (
                        <span className="w-4 h-4 border-2 border-gray-300 rounded mr-3" />
                      )}
                      <span className={item.status === 'done' ? 'text-gray-500 line-through' : 'text-gray-700'}>
                        {item.task}
                      </span>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded ${priorityColors[item.priority]}`}>
                      {item.priority}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function NextActionsSection() {
  const actions = [
    {
      number: 1,
      title: 'Update Prisma Schema',
      description: 'Add package, status workflow, and pricing fields to Client model',
      status: 'in-progress',
    },
    {
      number: 2,
      title: 'Build Voice Preview Page',
      description: 'ElevenLabs API integration with cached samples for client voice selection',
      status: 'pending',
    },
    {
      number: 3,
      title: 'Create Public Marketing Pages',
      description: 'Homepage, How It Works, Pricing, Portfolio pages for lead generation',
      status: 'in-progress',
    },
    {
      number: 4,
      title: 'Integrate Stripe',
      description: 'Checkout flow for packages with subscription support',
      status: 'pending',
    },
    {
      number: 5,
      title: 'Add Project Status Workflow',
      description: 'Visual progress tracker in admin and portal showing 8-step journey',
      status: 'pending',
    },
  ]

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-900">Next Actions</h2>
      <p className="text-gray-600">Immediate steps to reach MVP launch readiness.</p>

      <div className="space-y-4">
        {actions.map((action) => (
          <div
            key={action.number}
            className={`border-l-4 ${
              action.status === 'in-progress' ? 'border-yellow-500 bg-yellow-50' : 'border-gray-300 bg-gray-50'
            } p-4 rounded-r-lg`}
          >
            <div className="flex items-start">
              <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold mr-4 ${
                action.status === 'in-progress' ? 'bg-yellow-500 text-white' : 'bg-gray-300 text-gray-700'
              }`}>
                {action.number}
              </span>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">{action.title}</h3>
                  {action.status === 'in-progress' && (
                    <span className="bg-yellow-200 text-yellow-800 text-xs px-2 py-0.5 rounded">
                      In Progress
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 mt-1">{action.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mt-6">
        <h3 className="font-semibold text-purple-900">Important Note</h3>
        <p className="text-sm text-purple-800 mt-1">
          &quot;Cold Emails&quot; are NOT part of this service. Do not include in any website copy, package descriptions, or deliverables.
        </p>
      </div>
    </div>
  )
}
