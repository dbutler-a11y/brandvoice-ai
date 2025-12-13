import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  MapPin,
  Clock,
  DollarSign,
  Sparkles,
  TrendingUp,
  ArrowLeft,
  CheckCircle2,
  Building2,
  Send,
  Megaphone,
  PenTool,
  BarChart3,
  HeartHandshake,
  FolderKanban
} from 'lucide-react';

interface JobPosition {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  salary?: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  niceToHave?: string[];
  benefits: string[];
  applyEmail: string;
}

const positions: Record<string, JobPosition> = {
  'ai-capability-specialist': {
    id: 'ai-capability-specialist',
    title: 'AI Capability Specialist',
    department: 'Operations',
    location: 'Remote',
    type: 'Full-time / Contract',
    salary: 'Competitive + Equity',
    description: `We're looking for an AI Capability Specialist to manage and optimize our AI-powered video production pipeline. You'll be the engine behind our client deliverables, ensuring smooth operations from script to final video.

This role is perfect for someone who loves working with cutting-edge AI tools, has a keen eye for quality, and thrives in a fast-paced environment. You'll work directly with our clients' content, using tools like ElevenLabs for voice synthesis, Synthesia and HeyGen for avatar videos, and various other AI platforms.

As our AI Capability Specialist, you'll have direct impact on the quality of every video we produce and the satisfaction of every client we serve.`,
    responsibilities: [
      'Manage end-to-end AI video production workflows using tools like ElevenLabs, Synthesia, HeyGen, and custom AI solutions',
      'Optimize prompts and parameters for voice synthesis and avatar generation to achieve natural, high-quality results',
      'Quality control all AI-generated content before client delivery, ensuring brand voice consistency and technical quality',
      'Monitor and improve production efficiency, reducing turnaround times while maintaining quality',
      'Stay current with emerging AI tools and recommend new integrations that could improve our service',
      'Document processes and create SOPs for scalable operations as we grow',
      'Troubleshoot technical issues and coordinate with vendors when needed',
      'Collaborate with clients to understand their brand voice, tone preferences, and requirements',
      'Maintain organized project files and asset libraries',
      'Provide feedback to leadership on operational improvements and tool recommendations',
    ],
    requirements: [
      '2+ years experience working with AI/ML tools, automation, or related technology',
      'Hands-on experience with AI video or voice generation platforms (ElevenLabs, Synthesia, HeyGen, D-ID, etc.)',
      'Strong attention to detail and commitment to quality standards',
      'Excellent organizational and project management skills',
      'Self-motivated with ability to work independently and manage your own schedule',
      'Strong written and verbal communication skills',
      'Comfortable learning new tools quickly - the AI landscape changes fast',
      'Reliable internet connection and professional remote work setup',
    ],
    niceToHave: [
      'Direct experience with ElevenLabs voice cloning and synthesis',
      'Background in video production, editing, or content creation',
      'Familiarity with n8n, Zapier, Make, or other automation tools',
      'Understanding of prompt engineering principles and best practices',
      'Experience in an agency, production house, or fast-paced startup environment',
      'Basic scripting or coding knowledge (Python, JavaScript)',
      'Experience with project management tools (Linear, Notion, Asana)',
    ],
    benefits: [
      'Fully remote work - work from anywhere with reliable internet',
      'Flexible hours and async-friendly culture - we care about results, not when you work',
      'Equity participation for full-time roles - share in our growth',
      'Direct impact on a growing AI company - your work matters from day one',
      'Access to cutting-edge AI tools and technology - stay at the forefront',
      'Professional development budget - grow your skills',
      'Collaborative team environment with regular check-ins',
      'Opportunity for advancement as the company scales',
    ],
    applyEmail: 'careers@brandvoice.studio',
  },
  'marketing-sales-specialist': {
    id: 'marketing-sales-specialist',
    title: 'Marketing & Sales Specialist',
    department: 'Growth',
    location: 'Remote',
    type: 'Full-time / Part-time',
    salary: 'Base + Commission',
    description: `Join our growth team to help businesses discover the power of AI video content. You'll drive awareness, generate leads, and close deals while building relationships with business owners across industries.

This is a unique opportunity to shape the growth function at an early-stage AI company. You'll have creative freedom to test channels, craft messaging, and build the playbook for how we acquire customers.

The ideal candidate is entrepreneurial, comfortable with ambiguity, and excited about AI technology. You should be equally comfortable creating a LinkedIn post as you are hopping on a sales call.`,
    responsibilities: [
      'Develop and execute marketing campaigns across digital channels (social media, email, paid ads, content)',
      'Create compelling content that demonstrates AI video capabilities and drives engagement',
      'Manage social media presence across LinkedIn, Instagram, TikTok, and other relevant platforms',
      'Generate and qualify inbound leads from marketing efforts',
      'Conduct sales calls and product demonstrations with prospective clients',
      'Build and maintain relationships with prospects through the sales cycle',
      'Track and report on marketing ROI, sales metrics, and pipeline health',
      'Collaborate on pricing strategies and promotional offers',
      'Gather customer feedback and market insights to inform product development',
      'Identify and pursue partnership opportunities',
      'Attend industry events and networking opportunities (virtual and in-person)',
    ],
    requirements: [
      '2+ years in B2B marketing, sales, or business development',
      'Proven track record of meeting or exceeding sales/marketing targets',
      'Excellent presentation and communication skills - both written and verbal',
      'Experience with CRM tools and sales processes',
      'Understanding of digital marketing channels and best practices',
      'Self-starter comfortable in a startup environment with minimal structure',
      'Passion for AI technology and its business applications',
      'Results-driven mindset with strong analytical skills',
      'Professional presence for client-facing interactions',
    ],
    niceToHave: [
      'Experience selling to small/medium business owners',
      'Background in video production, marketing agencies, or SaaS sales',
      'Existing network in target industries (real estate, healthcare, fitness, legal, e-commerce)',
      'Content creation skills - video production, copywriting, design',
      'Experience running paid advertising campaigns (Meta, Google, LinkedIn)',
      'Familiarity with marketing automation tools (HubSpot, Mailchimp, etc.)',
      'Track record of closing deals in the $500-$5,000 range',
    ],
    benefits: [
      'Uncapped commission structure - no ceiling on your earnings',
      'Fully remote with flexible schedule - work on your terms',
      'Equity options available - own a piece of what you help build',
      'Performance bonuses for hitting milestones',
      'Creative freedom to build the growth function your way',
      'Direct line to leadership and decision-making',
      'Marketing budget to test and scale winning strategies',
      'Professional development and training opportunities',
    ],
    applyEmail: 'careers@brandvoice.studio',
  },
  'product-marketing-manager': {
    id: 'product-marketing-manager',
    title: 'Product Marketing Manager',
    department: 'Marketing',
    location: 'Remote',
    type: 'Full-time',
    salary: '$90K - $130K + Equity',
    description: `We're looking for a Product Marketing Manager to craft and communicate the story of our AI spokesperson platform. You'll be the bridge between our product team and our customers, translating technical capabilities into compelling narratives that drive adoption and growth.

In this role, you'll own our go-to-market strategy, positioning, and messaging. You'll work closely with sales, product, and creative teams to ensure our value proposition resonates with business owners looking to scale their content creation with AI.

This is an opportunity to shape how the market perceives AI video content creation. You'll help define what "brand voice" means in the age of AI and position BrandVoice Studio as the leader in this emerging category.`,
    responsibilities: [
      'Develop and execute go-to-market strategies for new features, use cases, and market segments',
      'Craft compelling product positioning, messaging, and value propositions that differentiate us in the market',
      'Create sales enablement materials including pitch decks, case studies, battle cards, and demo scripts',
      'Conduct customer research and competitive analysis to inform product and marketing decisions',
      'Partner with content team to develop thought leadership and educational content',
      'Define and track key product marketing metrics (win rates, adoption, market share)',
      'Lead product launches from planning through execution and measurement',
      'Train sales team on new features, positioning, and objection handling',
      'Gather and synthesize customer feedback to inform product roadmap',
      'Represent the voice of the customer in product planning discussions',
    ],
    requirements: [
      '4+ years in product marketing, preferably in B2B SaaS or creative/marketing technology',
      'Proven track record of successful product launches and go-to-market execution',
      'Excellent storytelling and communication skills - both written and verbal',
      'Strong analytical skills with ability to translate data into actionable insights',
      'Experience with customer research methodologies (interviews, surveys, win/loss analysis)',
      'Ability to translate complex technical concepts into clear, compelling messaging',
      'Cross-functional collaboration experience with product, sales, and creative teams',
      'Self-starter comfortable with ambiguity in a fast-paced startup environment',
    ],
    niceToHave: [
      'Experience marketing AI/ML products or creative tools',
      'Background in video production, content marketing, or creator economy',
      'Experience with product-led growth strategies',
      'Familiarity with marketing automation and CRM tools',
      'Portfolio of product launch materials and case studies',
      'Experience at an early-stage startup (seed to Series B)',
    ],
    benefits: [
      'Competitive salary with equity participation',
      'Fully remote work with flexible hours',
      'Own the product marketing function and build your team',
      'Direct impact on company growth and market positioning',
      'Professional development budget',
      'Health, dental, and vision insurance',
      'Unlimited PTO policy',
      'Latest tools and technology to do your best work',
    ],
    applyEmail: 'careers@brandvoice.studio',
  },
  'ux-writer-content-designer': {
    id: 'ux-writer-content-designer',
    title: 'UX Writer / Content Designer',
    department: 'Product',
    location: 'Remote',
    type: 'Full-time',
    salary: '$80K - $110K + Equity',
    description: `Words shape experiences. As our UX Writer / Content Designer, you'll craft every word our users encounter - from onboarding flows to error messages to feature announcements. You'll ensure that every touchpoint feels human, helpful, and on-brand.

This role sits at the intersection of design, product, and brand. You'll work closely with our product team to create content that guides users effortlessly through our AI video creation platform while maintaining the warmth and personality that defines BrandVoice Studio.

We believe that great UX writing is invisible - it just makes sense. You'll help our customers accomplish their goals without friction, confusion, or frustration. In a space as new as AI video, clear communication is everything.`,
    responsibilities: [
      'Write clear, concise, and compelling UX copy for our web application and marketing site',
      'Develop and maintain our voice and tone guidelines across all user touchpoints',
      'Craft onboarding flows that educate and delight new users',
      'Write microcopy that guides users through complex AI features with confidence',
      'Create error messages, tooltips, and help content that actually help',
      'Collaborate with designers to ensure copy and visual design work harmoniously',
      'Conduct content audits and identify opportunities to improve user experience',
      'Write in-product messaging for feature launches and updates',
      'Develop email templates and notification copy',
      'Contribute to content strategy and information architecture decisions',
    ],
    requirements: [
      '3+ years experience in UX writing, content design, or related field',
      'Portfolio demonstrating excellent product writing across various contexts',
      'Strong understanding of UX principles and user-centered design',
      'Ability to distill complex concepts into simple, clear language',
      'Experience working with design systems and maintaining content consistency',
      'Collaboration skills to work effectively with designers, developers, and product managers',
      'Attention to detail and commitment to quality',
      'Empathy for users and ability to anticipate their needs and questions',
    ],
    niceToHave: [
      'Experience writing for AI or ML products',
      'Background in video production or creative tools',
      'Familiarity with accessibility standards for content',
      'Experience with localization and writing for global audiences',
      'Knowledge of HTML/CSS and how copy renders in code',
      'Experience with content management systems and documentation tools',
    ],
    benefits: [
      'Competitive salary with equity stake',
      'Remote-first culture with flexible scheduling',
      'Shape the voice of an emerging AI brand',
      'Collaborative, creative team environment',
      'Professional development opportunities',
      'Health, dental, and vision coverage',
      'Home office setup allowance',
      'Regular team retreats and events',
    ],
    applyEmail: 'careers@brandvoice.studio',
  },
  'growth-strategist': {
    id: 'growth-strategist',
    title: 'Growth Strategist',
    department: 'Growth',
    location: 'Remote',
    type: 'Full-time',
    salary: '$100K - $140K + Equity',
    description: `We're looking for a data-driven Growth Strategist to own our experimentation engine and scale our customer acquisition. You'll design and execute growth experiments across the entire funnel, from awareness to activation to revenue.

In this role, you'll be part strategist, part analyst, part builder. You'll identify growth opportunities, develop hypotheses, run tests, and scale what works. You'll work cross-functionally with marketing, product, and engineering to implement growth initiatives.

This is a high-impact role at a critical stage of our company. You'll have the autonomy to define our growth playbook and the resources to execute against it. If you love the intersection of creativity and data, this is your opportunity.`,
    responsibilities: [
      'Develop and execute a comprehensive growth strategy across acquisition, activation, and retention',
      'Design and run rapid experiments to test growth hypotheses across channels and touchpoints',
      'Build and optimize conversion funnels from ad click to paying customer',
      'Manage paid acquisition channels (Meta, Google, LinkedIn) with focus on efficiency and scale',
      'Implement and analyze growth metrics, attribution, and cohort analysis',
      'Identify and pursue viral and referral growth opportunities',
      'Collaborate with product team on growth features (onboarding, activation, engagement)',
      'Optimize landing pages, signup flows, and trial experiences for conversion',
      'Build dashboards and reporting to track growth KPIs',
      'Stay current with growth tactics, tools, and best practices',
    ],
    requirements: [
      '4+ years in growth marketing, performance marketing, or growth product roles',
      'Proven track record of scaling customer acquisition profitably',
      'Strong analytical skills with experience in SQL, Excel, and analytics tools',
      'Experience managing paid acquisition channels with significant budgets',
      'Understanding of funnel metrics, unit economics, and growth modeling',
      'A/B testing experience with statistical rigor',
      'Technical comfort to work with engineering on growth implementations',
      'Data-driven decision making with strong business intuition',
    ],
    niceToHave: [
      'Experience in B2B SaaS or subscription businesses',
      'Background in video, content, or creative tools',
      'Experience with marketing automation and CRM platforms',
      'Familiarity with product-led growth strategies',
      'Technical skills (HTML/CSS, basic scripting)',
      'Experience at high-growth startups',
    ],
    benefits: [
      'Competitive base plus performance bonuses',
      'Significant equity participation',
      'Budget to run experiments and scale winners',
      'Direct line to leadership and strategic input',
      'Remote-first with flexible hours',
      'Health, dental, vision insurance',
      'Professional development budget',
      'Annual company retreats',
    ],
    applyEmail: 'careers@brandvoice.studio',
  },
  'customer-success-manager': {
    id: 'customer-success-manager',
    title: 'Customer Success Manager',
    department: 'Customer Success',
    location: 'Remote',
    type: 'Full-time',
    salary: '$70K - $95K + Bonus',
    description: `Our customers' success is our success. As Customer Success Manager, you'll be the primary relationship owner for our growing client base, ensuring they get maximum value from their AI spokesperson and content packages.

You'll guide clients from onboarding through ongoing engagement, helping them understand best practices, troubleshoot issues, and expand their usage. You'll be their advocate internally, bringing their feedback to product and helping shape our roadmap.

This role combines relationship building, strategic thinking, and operational execution. You'll work with everyone from solo entrepreneurs to marketing teams at established brands, helping them transform their content strategy with AI.`,
    responsibilities: [
      'Own the end-to-end customer journey from onboarding to renewal and expansion',
      'Develop and execute onboarding programs that drive time-to-value',
      'Build strong relationships with customers through regular check-ins and business reviews',
      'Monitor customer health metrics and proactively address at-risk accounts',
      'Identify upsell and expansion opportunities based on customer needs',
      'Create and deliver training materials, webinars, and best practice guides',
      'Gather and synthesize customer feedback for product and leadership teams',
      'Collaborate with sales on renewals and account growth strategies',
      'Manage customer support escalations and ensure timely resolution',
      'Build scalable processes and playbooks as we grow the CS function',
    ],
    requirements: [
      '3+ years in customer success, account management, or client services',
      'Experience managing a portfolio of B2B customers',
      'Excellent communication and relationship-building skills',
      'Problem-solving mindset with ability to navigate complex customer situations',
      'Organizational skills to manage multiple accounts and priorities',
      'Comfort with technology and ability to learn new tools quickly',
      'Data-driven approach to measuring and improving customer outcomes',
      'Collaborative spirit and ability to work cross-functionally',
    ],
    niceToHave: [
      'Experience in video production, marketing, or creative services',
      'Background in SaaS customer success',
      'Familiarity with customer success platforms (Gainsight, ChurnZero, etc.)',
      'Experience with AI or emerging technology products',
      'Training or coaching experience',
      'Experience building CS processes from scratch',
    ],
    benefits: [
      'Base salary plus customer success bonuses',
      'Equity participation',
      'Remote work with flexible hours',
      'Be the founding CS team member with growth opportunities',
      'Direct impact on customer experience and company culture',
      'Health, dental, and vision insurance',
      'Professional development budget',
      'Regular team collaboration and social events',
    ],
    applyEmail: 'careers@brandvoice.studio',
  },
  'technical-project-manager': {
    id: 'technical-project-manager',
    title: 'Technical Project Manager',
    department: 'Operations',
    location: 'Remote',
    type: 'Full-time',
    salary: '$85K - $120K + Equity',
    description: `We need a Technical Project Manager to orchestrate our cross-functional teams and ensure we deliver exceptional AI video products on time and on quality. You'll be the connective tissue between engineering, design, content, and client delivery.

In this role, you'll manage complex projects involving AI video production, platform development, and client implementations. You'll bring structure to our fast-moving environment while maintaining the flexibility needed at a growing startup.

This is ideal for someone who loves solving operational puzzles, communicates clearly across technical and non-technical teams, and thrives on bringing order to creative chaos. You'll directly impact our ability to scale and delight customers.`,
    responsibilities: [
      'Plan and manage cross-functional projects from initiation to delivery',
      'Coordinate between engineering, design, content, and client success teams',
      'Develop project timelines, resource plans, and risk mitigation strategies',
      'Run effective meetings and maintain clear project documentation',
      'Track project progress and communicate status to stakeholders',
      'Identify and resolve blockers, dependencies, and resource conflicts',
      'Implement and improve project management tools and processes',
      'Manage client implementation projects and custom development requests',
      'Support sprint planning and agile ceremonies for product teams',
      'Build scalable operations processes as we grow',
    ],
    requirements: [
      '4+ years in project management, preferably in software or creative production',
      'Experience managing cross-functional teams in fast-paced environments',
      'Strong understanding of software development lifecycle and agile methodologies',
      'Excellent organizational and communication skills',
      'Proficiency with project management tools (Linear, Asana, Jira, etc.)',
      'Problem-solving ability and grace under pressure',
      'Technical literacy to understand engineering constraints and tradeoffs',
      'Stakeholder management skills across multiple levels',
    ],
    niceToHave: [
      'Experience in video production or creative agencies',
      'Background in AI/ML product development',
      'PMP, Scrum Master, or similar certifications',
      'Experience with production workflows and creative operations',
      'Familiarity with no-code tools and automation',
      'Experience at early-stage startups',
    ],
    benefits: [
      'Competitive salary with equity',
      'Remote-first with flexible scheduling',
      'High-impact role shaping company operations',
      'Work with cutting-edge AI technology',
      'Professional development opportunities',
      'Health, dental, and vision coverage',
      'Home office setup allowance',
      'Team retreats and collaborative culture',
    ],
    applyEmail: 'careers@brandvoice.studio',
  },
};

interface JobPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: JobPageProps): Promise<Metadata> {
  const { id } = await params;
  const position = positions[id];

  if (!position) {
    return {
      title: 'Position Not Found | BrandVoice Studio Careers',
    };
  }

  return {
    title: `${position.title} | BrandVoice Studio Careers`,
    description: position.description.slice(0, 160),
    openGraph: {
      title: `${position.title} at BrandVoice Studio`,
      description: position.description.slice(0, 160),
      type: 'website',
    },
  };
}

export function generateStaticParams() {
  return Object.keys(positions).map((id) => ({ id }));
}

function getIcon(id: string) {
  switch (id) {
    case 'ai-capability-specialist':
      return <Sparkles className="w-8 h-8" />;
    case 'marketing-sales-specialist':
      return <TrendingUp className="w-8 h-8" />;
    case 'product-marketing-manager':
      return <Megaphone className="w-8 h-8" />;
    case 'ux-writer-content-designer':
      return <PenTool className="w-8 h-8" />;
    case 'growth-strategist':
      return <BarChart3 className="w-8 h-8" />;
    case 'customer-success-manager':
      return <HeartHandshake className="w-8 h-8" />;
    case 'technical-project-manager':
      return <FolderKanban className="w-8 h-8" />;
    default:
      return <Building2 className="w-8 h-8" />;
  }
}

export default async function JobDetailPage({ params }: JobPageProps) {
  const { id } = await params;
  const position = positions[id];

  if (!position) {
    notFound();
  }

  const applyUrl = `mailto:${position.applyEmail}?subject=Application: ${encodeURIComponent(position.title)}&body=${encodeURIComponent(`Hi BrandVoice Studio Team,

I'm excited to apply for the ${position.title} position.

[Please attach your resume and include a brief note about why you're interested in this role and what you'd bring to the team.]

Best regards,
[Your Name]`)}`;

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white py-16 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <Link
            href="/careers"
            className="inline-flex items-center gap-2 text-purple-300 hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to All Positions
          </Link>

          <div className="flex items-start gap-4 mb-6">
            <div className="p-4 bg-white/10 rounded-xl text-purple-300">
              {getIcon(id)}
            </div>
            <div>
              <p className="text-purple-300 font-medium mb-1">{position.department}</p>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold">{position.title}</h1>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 text-sm">
            <span className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full">
              <MapPin className="w-4 h-4" />
              {position.location}
            </span>
            <span className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full">
              <Clock className="w-4 h-4" />
              {position.type}
            </span>
            {position.salary && (
              <span className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full">
                <DollarSign className="w-4 h-4" />
                {position.salary}
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-10">
              {/* About the Role */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">About the Role</h2>
                <div className="prose prose-gray max-w-none">
                  {position.description.split('\n\n').map((paragraph, index) => (
                    <p key={index} className="text-gray-600 mb-4">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>

              {/* Responsibilities */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">What You'll Do</h2>
                <ul className="space-y-3">
                  {position.responsibilities.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-600">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Requirements */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">What We're Looking For</h2>
                <ul className="space-y-3">
                  {position.requirements.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-600">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Nice to Have */}
              {position.niceToHave && position.niceToHave.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Nice to Have</h2>
                  <ul className="space-y-3">
                    {position.niceToHave.map((item, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <span className="w-5 h-5 flex items-center justify-center text-gray-400 flex-shrink-0">+</span>
                        <span className="text-gray-600">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Benefits */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">What We Offer</h2>
                <ul className="space-y-3">
                  {position.benefits.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-600">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* Apply Card */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Apply for this Role</h3>
                  <p className="text-gray-600 text-sm mb-6">
                    Send us your resume along with a note about why you're excited about this role and what you'd bring to the team.
                  </p>
                  <a
                    href={applyUrl}
                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-indigo-700 transition-colors"
                  >
                    <Send className="w-4 h-4" />
                    Apply Now
                  </a>
                </div>

                {/* Quick Info */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Info</h3>
                  <dl className="space-y-4 text-sm">
                    <div>
                      <dt className="text-gray-500">Department</dt>
                      <dd className="font-medium text-gray-900">{position.department}</dd>
                    </div>
                    <div>
                      <dt className="text-gray-500">Location</dt>
                      <dd className="font-medium text-gray-900">{position.location}</dd>
                    </div>
                    <div>
                      <dt className="text-gray-500">Employment Type</dt>
                      <dd className="font-medium text-gray-900">{position.type}</dd>
                    </div>
                    {position.salary && (
                      <div>
                        <dt className="text-gray-500">Compensation</dt>
                        <dd className="font-medium text-gray-900">{position.salary}</dd>
                      </div>
                    )}
                  </dl>
                </div>

                {/* Share */}
                <div className="bg-gray-100 rounded-xl p-6">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">Know someone perfect for this role?</h3>
                  <p className="text-sm text-gray-600">
                    Share this position with your network and help us find great talent.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Other Positions */}
      <section className="py-12 bg-white border-t border-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Other Open Positions</h2>
          <div className="grid gap-4">
            {Object.values(positions)
              .filter((p) => p.id !== id)
              .map((otherPosition) => (
                <Link
                  key={otherPosition.id}
                  href={`/careers/${otherPosition.id}`}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
                      {getIcon(otherPosition.id)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{otherPosition.title}</h3>
                      <p className="text-sm text-gray-500">{otherPosition.department} - {otherPosition.location}</p>
                    </div>
                  </div>
                  <ArrowLeft className="w-5 h-5 text-gray-400 rotate-180" />
                </Link>
              ))}
          </div>
        </div>
      </section>
    </main>
  );
}
