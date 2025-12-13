import { Metadata } from 'next';
import Link from 'next/link';
import {
  Briefcase,
  MapPin,
  Clock,
  DollarSign,
  Sparkles,
  TrendingUp,
  Users,
  Zap,
  Heart,
  Globe,
  ArrowRight,
  CheckCircle2,
  Megaphone,
  PenTool,
  BarChart3,
  HeartHandshake,
  FolderKanban
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Careers | Join BrandVoice Studio - AI Video Innovation',
  description: 'Join our team at BrandVoice Studio. We\'re hiring AI specialists, marketing experts, and sales professionals to help businesses leverage AI video technology.',
  keywords: ['AI jobs', 'video technology careers', 'marketing jobs', 'sales positions', 'startup jobs', 'remote work'],
  openGraph: {
    title: 'Careers at BrandVoice Studio',
    description: 'Join our innovative team building the future of AI-powered video content.',
    type: 'website',
  },
};

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
  icon: React.ReactNode;
  featured?: boolean;
}

const positions: JobPosition[] = [
  {
    id: 'ai-capability-specialist',
    title: 'AI Capability Specialist',
    department: 'Operations',
    location: 'Remote',
    type: 'Full-time / Contract',
    salary: 'Competitive + Equity',
    description: 'We\'re looking for an AI Capability Specialist to manage and optimize our AI-powered video production pipeline. You\'ll be the engine behind our client deliverables, ensuring smooth operations from script to final video.',
    responsibilities: [
      'Manage end-to-end AI video production workflows using tools like ElevenLabs, Synthesia, and custom AI solutions',
      'Optimize prompts and parameters for voice synthesis and avatar generation',
      'Quality control all AI-generated content before client delivery',
      'Monitor and improve production efficiency and turnaround times',
      'Stay current with emerging AI tools and recommend integrations',
      'Document processes and create SOPs for scalable operations',
      'Troubleshoot technical issues and coordinate with vendors',
      'Collaborate with clients to understand brand voice and requirements',
    ],
    requirements: [
      '2+ years experience working with AI/ML tools or automation',
      'Hands-on experience with AI video/voice generation platforms',
      'Strong attention to detail and quality standards',
      'Excellent organizational and project management skills',
      'Self-motivated with ability to work independently',
      'Strong written and verbal communication skills',
      'Comfortable learning new tools quickly',
    ],
    niceToHave: [
      'Experience with ElevenLabs, Synthesia, HeyGen, or similar platforms',
      'Background in video production or content creation',
      'Familiarity with n8n, Zapier, or other automation tools',
      'Understanding of prompt engineering principles',
      'Experience in an agency or fast-paced startup environment',
    ],
    benefits: [
      'Fully remote work - work from anywhere',
      'Flexible hours and async-friendly culture',
      'Equity participation for full-time roles',
      'Direct impact on a growing AI company',
      'Access to cutting-edge AI tools and technology',
      'Professional development budget',
    ],
    icon: <Sparkles className="w-6 h-6" />,
    featured: true,
  },
  {
    id: 'marketing-sales-specialist',
    title: 'Marketing & Sales Specialist',
    department: 'Growth',
    location: 'Remote',
    type: 'Full-time / Part-time',
    salary: 'Base + Commission',
    description: 'Join our growth team to help businesses discover the power of AI video content. You\'ll drive awareness, generate leads, and close deals while building relationships with business owners across industries.',
    responsibilities: [
      'Develop and execute marketing campaigns across digital channels',
      'Create compelling content that demonstrates AI video capabilities',
      'Manage social media presence and community engagement',
      'Generate and qualify inbound leads from marketing efforts',
      'Conduct sales calls and product demonstrations',
      'Build and maintain relationships with prospects and clients',
      'Track and report on marketing ROI and sales metrics',
      'Collaborate on pricing strategies and promotional offers',
      'Gather customer feedback to inform product development',
    ],
    requirements: [
      '2+ years in B2B marketing, sales, or business development',
      'Proven track record of meeting or exceeding targets',
      'Excellent presentation and communication skills',
      'Experience with CRM tools and sales processes',
      'Understanding of digital marketing channels',
      'Self-starter comfortable in a startup environment',
      'Passion for AI technology and its business applications',
    ],
    niceToHave: [
      'Experience selling to small/medium businesses',
      'Background in video production, marketing agencies, or SaaS',
      'Existing network in target industries (real estate, healthcare, fitness, etc.)',
      'Content creation skills (video, copywriting)',
      'Experience with paid advertising (Meta, Google)',
    ],
    benefits: [
      'Uncapped commission structure',
      'Fully remote with flexible schedule',
      'Equity options available',
      'Performance bonuses',
      'Creative freedom to build the growth function',
      'Direct line to leadership and decision-making',
    ],
    icon: <TrendingUp className="w-6 h-6" />,
    featured: true,
  },
  {
    id: 'product-marketing-manager',
    title: 'Product Marketing Manager',
    department: 'Marketing',
    location: 'Remote',
    type: 'Full-time',
    salary: 'Competitive + Equity',
    description: 'Craft the story of our product, build messaging frameworks, and ensure our brand voice speaks with one consistent, compelling narrative across all touchpoints.',
    responsibilities: [
      'Develop and own product positioning, messaging, and go-to-market strategy',
      'Create compelling sales enablement materials and product documentation',
      'Lead product launches with coordinated marketing campaigns',
      'Conduct competitive analysis and market research',
      'Collaborate with product team to translate features into customer benefits',
      'Build and maintain messaging frameworks for consistent brand voice',
      'Create case studies and customer success stories',
      'Support sales team with product knowledge and objection handling',
    ],
    requirements: [
      '3+ years in product marketing, preferably in SaaS or tech',
      'Proven experience launching products and driving adoption',
      'Excellent storytelling and copywriting skills',
      'Strong understanding of B2B buyer journeys',
      'Data-driven approach to measuring marketing effectiveness',
      'Experience with marketing automation tools',
      'Self-starter who thrives in fast-paced environments',
    ],
    niceToHave: [
      'Experience marketing AI/ML products',
      'Background in video or creative technology',
      'Experience with PLG (product-led growth) strategies',
      'Design skills for creating marketing assets',
    ],
    benefits: [
      'Fully remote with flexible hours',
      'Equity participation',
      'Shape the narrative of an emerging AI company',
      'Direct collaboration with founders',
      'Professional development budget',
      'Latest marketing tools and technology',
    ],
    icon: <Megaphone className="w-6 h-6" />,
  },
  {
    id: 'ux-writer-content-designer',
    title: 'UX Writer / Content Designer',
    department: 'Product',
    location: 'Remote',
    type: 'Full-time / Contract',
    salary: 'Competitive',
    description: 'Shape the words inside our product—from onboarding flows to error messages. You\'ll ensure our brand voice carries through every interaction users have with our platform.',
    responsibilities: [
      'Write clear, concise microcopy for product interfaces',
      'Design content for onboarding flows that drive activation',
      'Create error messages, tooltips, and help text that reduce friction',
      'Develop content guidelines and voice documentation',
      'Collaborate with designers and engineers on user flows',
      'A/B test copy to optimize conversion and comprehension',
      'Audit existing content for consistency and clarity',
      'Help establish terminology and naming conventions',
    ],
    requirements: [
      '2+ years in UX writing, content design, or related field',
      'Portfolio demonstrating product writing work',
      'Strong understanding of UX principles and user psychology',
      'Ability to simplify complex concepts into clear language',
      'Experience working in agile product teams',
      'Excellent attention to detail',
      'Empathy for users and commitment to accessibility',
    ],
    niceToHave: [
      'Experience with AI/ML products or creative tools',
      'Background in technical writing',
      'Familiarity with design tools (Figma, Sketch)',
      'Experience with localization/internationalization',
    ],
    benefits: [
      'Fully remote work',
      'Flexible schedule',
      'Shape the voice of an AI product from the ground up',
      'Work with cutting-edge technology',
      'Professional development opportunities',
      'Creative freedom and ownership',
    ],
    icon: <PenTool className="w-6 h-6" />,
  },
  {
    id: 'growth-strategist',
    title: 'Growth Strategist',
    department: 'Growth',
    location: 'Remote',
    type: 'Full-time',
    salary: 'Base + Performance Bonus',
    description: 'Own experimentation, user acquisition, funnels, and retention. You\'ll use data-driven methods to test traction, refine messaging, and scale what works.',
    responsibilities: [
      'Design and run growth experiments across the funnel',
      'Build and optimize user acquisition channels',
      'Analyze funnel metrics and identify improvement opportunities',
      'Develop and test hypotheses to improve conversion rates',
      'Create dashboards and reporting for growth metrics',
      'Collaborate with product on retention and engagement features',
      'Manage paid acquisition campaigns and budgets',
      'Identify and test new growth channels and partnerships',
    ],
    requirements: [
      '3+ years in growth marketing or related roles',
      'Strong analytical skills with experience in data analysis',
      'Proficiency with analytics tools (GA4, Mixpanel, Amplitude)',
      'Experience running A/B tests and experiments',
      'Track record of improving key growth metrics',
      'Understanding of paid acquisition (Meta, Google, LinkedIn)',
      'SQL skills or willingness to learn',
      'Comfortable with ambiguity and rapid iteration',
    ],
    niceToHave: [
      'Experience at early-stage startups',
      'Background in B2B SaaS or creative tools',
      'Experience with PLG and self-serve models',
      'Technical skills (Python, basic engineering)',
    ],
    benefits: [
      'Performance bonuses tied to growth metrics',
      'Fully remote with async culture',
      'Equity participation',
      'Budget for experimentation and tools',
      'Direct impact on company trajectory',
      'Learning and conference budget',
    ],
    icon: <BarChart3 className="w-6 h-6" />,
  },
  {
    id: 'customer-success-manager',
    title: 'Customer Success Manager',
    department: 'Customer Success',
    location: 'Remote',
    type: 'Full-time',
    salary: 'Competitive + Bonus',
    description: 'Build relationships with clients, handle onboarding, and ensure they get maximum value from our AI video services. You\'re the bridge between our clients and our product.',
    responsibilities: [
      'Own the post-sale customer journey from onboarding to renewal',
      'Conduct kickoff calls and guide clients through setup',
      'Monitor account health and proactively address issues',
      'Gather customer feedback and communicate to product team',
      'Identify upsell and expansion opportunities',
      'Create resources and documentation for client success',
      'Build scalable processes for customer engagement',
      'Track and improve key CS metrics (NPS, retention, expansion)',
    ],
    requirements: [
      '2+ years in customer success, account management, or similar',
      'Excellent communication and relationship-building skills',
      'Experience with CS tools (Intercom, HubSpot, etc.)',
      'Ability to understand and explain technical concepts',
      'Problem-solving mindset with attention to detail',
      'Comfortable with video calls and presentations',
      'Empathetic and patient with a service orientation',
    ],
    niceToHave: [
      'Experience in creative agencies or SaaS',
      'Background in video production or marketing',
      'Experience building CS processes from scratch',
      'Familiarity with AI tools and technology',
    ],
    benefits: [
      'Fully remote position',
      'Performance bonuses',
      'Equity options',
      'Direct impact on client satisfaction',
      'Build the CS function from the ground up',
      'Professional development budget',
    ],
    icon: <HeartHandshake className="w-6 h-6" />,
  },
  {
    id: 'technical-project-manager',
    title: 'Technical Project Manager',
    department: 'Operations',
    location: 'Remote',
    type: 'Full-time',
    salary: 'Competitive + Equity',
    description: 'Coordinate cross-functional teams, manage timelines, and ensure tech + creative deliverables ship smoothly. You\'re the glue that keeps projects on track.',
    responsibilities: [
      'Manage end-to-end project delivery across creative and technical teams',
      'Create and maintain project timelines, milestones, and dependencies',
      'Facilitate communication between designers, engineers, and clients',
      'Identify risks and blockers early and drive resolution',
      'Implement and improve project management processes',
      'Track resource allocation and capacity planning',
      'Run standups, retrospectives, and project reviews',
      'Maintain documentation and project status reporting',
    ],
    requirements: [
      '3+ years in project or program management',
      'Experience managing both technical and creative projects',
      'Proficiency with PM tools (Linear, Asana, Notion, Jira)',
      'Strong organizational and communication skills',
      'Ability to translate between technical and non-technical stakeholders',
      'Experience with agile methodologies',
      'Problem-solving skills and calm under pressure',
      'Attention to detail while maintaining big-picture view',
    ],
    niceToHave: [
      'Background in video production or creative agencies',
      'Experience with AI/ML project workflows',
      'Technical understanding (APIs, automation, etc.)',
      'PMP, Scrum, or other certifications',
    ],
    benefits: [
      'Fully remote work',
      'Flexible hours',
      'Equity participation',
      'Central role in company operations',
      'Work with cutting-edge AI technology',
      'Professional development budget',
    ],
    icon: <FolderKanban className="w-6 h-6" />,
  },
];

const values = [
  {
    icon: <Zap className="w-8 h-8" />,
    title: 'Move Fast',
    description: 'We ship quickly, iterate constantly, and embrace the pace of AI innovation.',
  },
  {
    icon: <Heart className="w-8 h-8" />,
    title: 'Client Obsessed',
    description: 'Every decision starts with "How does this help our clients succeed?"',
  },
  {
    icon: <Users className="w-8 h-8" />,
    title: 'Team First',
    description: 'We support each other, share knowledge, and win together.',
  },
  {
    icon: <Globe className="w-8 h-8" />,
    title: 'Remote Native',
    description: 'Built for distributed work with async communication and trust.',
  },
];

function JobCard({ position }: { position: JobPosition }) {
  return (
    <div
      className={`bg-white rounded-2xl p-6 md:p-8 shadow-sm border transition-all hover:shadow-lg ${
        position.featured ? 'border-purple-200 ring-1 ring-purple-100' : 'border-gray-100'
      }`}
    >
      {position.featured && (
        <span className="inline-block px-3 py-1 text-xs font-semibold text-purple-700 bg-purple-100 rounded-full mb-4">
          Featured Role
        </span>
      )}

      <div className="flex items-start gap-4 mb-4">
        <div className="p-3 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-xl text-purple-600">
          {position.icon}
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900">{position.title}</h3>
          <p className="text-gray-500">{position.department}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 mb-4 text-sm">
        <span className="flex items-center gap-1.5 text-gray-600">
          <MapPin className="w-4 h-4" />
          {position.location}
        </span>
        <span className="flex items-center gap-1.5 text-gray-600">
          <Clock className="w-4 h-4" />
          {position.type}
        </span>
        {position.salary && (
          <span className="flex items-center gap-1.5 text-gray-600">
            <DollarSign className="w-4 h-4" />
            {position.salary}
          </span>
        )}
      </div>

      <p className="text-gray-600 mb-6">{position.description}</p>

      <Link
        href={`/careers/${position.id}`}
        className="inline-flex items-center gap-2 text-purple-600 font-semibold hover:text-purple-700 transition-colors"
      >
        View Details <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
}

export default function CareersPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white py-20 md:py-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="text-center max-w-3xl mx-auto">
            <span className="inline-block px-4 py-1.5 text-sm font-semibold text-purple-300 bg-purple-900/50 rounded-full mb-6">
              We're Hiring
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Build the Future of{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                AI Video
              </span>
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Join a fast-growing team revolutionizing how businesses create video content.
              Remote-first, innovation-driven, and making real impact.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#positions"
                className="px-8 py-4 bg-white text-gray-900 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
              >
                View Open Positions
              </a>
              <Link
                href="/how-it-works"
                className="px-8 py-4 border border-white/30 text-white rounded-xl font-semibold hover:bg-white/10 transition-colors"
              >
                Learn About Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Why Join Us */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Join BrandVoice Studio?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We're a small team with big ambitions, building at the intersection of AI and creative content.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 text-center shadow-sm border border-gray-100"
              >
                <div className="inline-flex p-4 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-2xl text-purple-600 mb-4">
                  {value.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{value.title}</h3>
                <p className="text-gray-600 text-sm">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What We Offer */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                More Than Just a Job
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                We believe in building a workplace where talented people can do their best work
                while maintaining balance and autonomy.
              </p>
              <ul className="space-y-4">
                {[
                  'Fully remote - work from anywhere in the world',
                  'Flexible hours - we care about output, not hours',
                  'Equity options - share in our success',
                  'Learning budget - grow your skills',
                  'Latest AI tools - work with cutting-edge technology',
                  'Direct impact - your work matters from day one',
                ].map((benefit, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-gradient-to-br from-purple-100 to-indigo-100 rounded-2xl p-8 md:p-12">
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <Briefcase className="w-12 h-12 text-purple-600 mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Ready to Apply?</h3>
                <p className="text-gray-600 mb-4">
                  We review every application personally. Include a note about why you're excited
                  about AI and what you'd bring to the team.
                </p>
                <a
                  href="#positions"
                  className="inline-flex items-center gap-2 text-purple-600 font-semibold hover:text-purple-700"
                >
                  See open positions <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section id="positions" className="py-16 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Open Positions
            </h2>
            <p className="text-xl text-gray-600">
              Find your role in shaping the future of AI-powered content creation.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {positions.map((position) => (
              <JobCard key={position.id} position={position} />
            ))}
          </div>

          {/* No positions fallback - hidden when we have positions */}
          {positions.length === 0 && (
            <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
              <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No Open Positions</h3>
              <p className="text-gray-500 mb-6">
                We don't have any open roles right now, but we're always looking for talented people.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors"
              >
                Send Us Your Resume
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-purple-600 to-indigo-600">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Don't See the Right Role?
          </h2>
          <p className="text-xl text-purple-100 mb-8">
            We're always interested in meeting talented people. Send us your resume
            and tell us how you'd contribute to BrandVoice Studio.
          </p>
          <a
            href="mailto:careers@brandvoice.studio?subject=General Application - BrandVoice Studio"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-purple-600 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
          >
            Send General Application <ArrowRight className="w-5 h-5" />
          </a>
        </div>
      </section>
    </main>
  );
}
