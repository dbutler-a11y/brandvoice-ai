'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ChevronDown, MessageCircle } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQCategory {
  title: string;
  items: FAQItem[];
}

export default function FAQPage() {
  const [openItems, setOpenItems] = useState<{ [key: string]: boolean }>({});

  const toggleItem = (id: string) => {
    setOpenItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const faqCategories: FAQCategory[] = [
    {
      title: 'General Questions',
      items: [
        {
          question: 'What is an AI spokesperson?',
          answer: 'An AI spokesperson is a digital avatar created using artificial intelligence that looks, sounds, and speaks like a real person. It can deliver your message consistently across all your videos without you ever having to appear on camera. Our AI spokespersons are hyper-realistic and customizable to match your brand aesthetic.'
        },
        {
          question: 'How does the DFY service work?',
          answer: 'Done-For-You means we handle everything from start to finish. After your kickoff call, we create your custom AI spokesperson, write 30 scripts tailored to your business, produce all the videos, add professional editing and captions, and deliver everything to your client portal. You simply download and post - no filming, editing, or content creation required on your end.'
        },
        {
          question: 'How long does it take to get my content?',
          answer: 'Our standard turnaround is 7 days from your kickoff call to final delivery. This includes spokesperson creation, script writing, video production, and editing. If you need expedited delivery, we offer rush options for an additional fee - just ask during your strategy call.'
        },
        {
          question: 'What do I need to provide?',
          answer: 'Very little! We just need some basic information about your business during the onboarding call: what you do, who you serve, your key services/products, and any specific topics or angles you want covered. We can also review your existing content for inspiration. Our team handles all the research, scripting, and production from there.'
        }
      ]
    },
    {
      title: 'Content & Videos',
      items: [
        {
          question: 'What types of videos do you create?',
          answer: 'We specialize in short-form vertical videos (under 60 seconds) optimized for Instagram Reels, TikTok, YouTube Shorts, and Facebook Reels. These include educational content, tips, behind-the-scenes insights, myth-busting, testimonials, promotional content, and trending topic commentary - all tailored to your specific industry and audience.'
        },
        {
          question: 'Can I request specific topics for my videos?',
          answer: 'Absolutely! During your onboarding call, we discuss your content goals and any specific topics you want covered. You can also provide a list of FAQs, common client questions, services you want to highlight, or industry trends you want to address. We build your content calendar around your priorities and business goals.'
        },
        {
          question: 'What video formats do you deliver?',
          answer: 'All videos are delivered in 9:16 vertical format (1080x1920), which is the standard for Instagram Reels, TikTok, and YouTube Shorts. Videos are rendered in high-quality MP4 format, ready to upload directly to any platform. If you need additional formats (1:1 square or 16:9 landscape), those are available as add-ons.'
        },
        {
          question: 'Can I use the videos for ads?',
          answer: 'Yes! All videos are delivered ad-ready and formatted specifically for paid advertising on Facebook, Instagram, TikTok, and YouTube. You receive full commercial usage rights with your package, meaning you can use the videos for organic posts, paid ads, email marketing, website content, or any other business purpose.'
        }
      ]
    },
    {
      title: 'AI Spokesperson',
      items: [
        {
          question: "Can I customize my AI spokesperson's appearance?",
          answer: "Yes! You can choose from our library of diverse AI spokespersons with different ages, ethnicities, styles, and aesthetics. Want something specific? We can create a custom spokesperson that matches your brand perfectly. During your onboarding, we'll show you options and work with you to select or design the perfect avatar for your business."
        },
        {
          question: 'Can I clone my own voice?',
          answer: "Yes! We offer custom voice cloning as an add-on. For quick cloning (good for social media and demos), we need just 30 seconds to 1 minute of audio, achieving approximately 70-80% voice likeness. For professional quality with better emotional range and clearer pronunciation (recommended for ads, voiceovers, and client-facing content), we need 2-5 minutes of audio, achieving 85-95% voice likeness. This is perfect if you want the benefits of AI video production while maintaining your personal voice and authenticity."
        },
        {
          question: 'Will my spokesperson look realistic?',
          answer: "Absolutely. We use cutting-edge AI technology to create hyper-realistic spokespersons with natural facial movements, expressions, and lip-sync. Most viewers can't tell the difference between our AI spokespersons and real humans. We include natural gestures, breathing patterns, and micro-expressions to ensure your videos look authentic and professional."
        }
      ]
    },
    {
      title: 'Pricing & Packages',
      items: [
        {
          question: "What's included in the Launch Kit?",
          answer: "The Launch Kit includes: 1 custom AI spokesperson avatar, 1 custom brand voice, 30 professionally written scripts (20-40 seconds each), 30 fully produced short-form videos with captions and hashtags, simple branding elements, 9:16 ad-ready format, client portal access, and delivery in 7 days. It's the perfect one-time package to get started with AI spokesperson content."
        },
        {
          question: "What's the difference between packages?",
          answer: "The Launch Kit ($1,500) is a one-time delivery of 30 videos. Content Engine Monthly ($997/mo) gives you 30 new videos every month with ongoing support. Content Engine PRO ($2,497/mo) includes more videos (30-40), multiple avatars and voices, faster turnaround, and A/B testing variations. AUTHORITY Engine ($4,997/mo) is our highest tier with 60+ videos, 3 avatars, multi-language support, and full campaign management."
        },
        {
          question: 'Do you offer refunds?',
          answer: "Due to the custom nature of our AI spokesperson creation and the significant work involved in scripting and producing your content, we don't offer refunds once production has started. However, we're committed to your satisfaction - each package includes revision rounds to ensure you're happy with the final deliverables. We also offer a pre-production preview so you can approve your spokesperson and sample video before we create all 30 videos."
        },
        {
          question: 'Can I upgrade my package later?',
          answer: "Yes! You can upgrade from the Launch Kit to a monthly package at any time. If you're on Content Engine Monthly and want to upgrade to PRO or AUTHORITY, you can do so starting with your next billing cycle. We'll prorate any remaining time on your current subscription. Upgrading gives you access to more videos, additional features, and priority support."
        }
      ]
    },
    {
      title: 'Premium Add-Ons',
      items: [
        {
          question: 'What is Voice Cloning?',
          answer: "Voice Cloning lets you use YOUR authentic voice for your AI spokesperson - without ever recording again! We offer two quality tiers: Quick Clone (30 seconds to 1 minute sample) achieves 70-80% voice likeness - perfect for social media content and quick demos. Professional Clone (2-5 minutes sample) achieves 85-95% voice likeness with superior emotional range, clearer pronunciation, and more natural delivery - recommended for ads, YouTube content, tutorials, and professional voiceovers. Your cloned voice captures your unique tone and can be used across all your videos. Available as an add-on to any package."
        },
        {
          question: 'Do you offer Multi-Language Dubbing?',
          answer: "Yes! Expand your reach globally with our Multi-Language Dubbing add-on. We can automatically translate and dub your videos into 20+ languages including Spanish, French, German, Portuguese, Italian, Japanese, Korean, Chinese, and more. The AI preserves your spokesperson's natural delivery while speaking fluently in the target language - perfect for reaching international audiences, serving multilingual communities, or expanding into new markets."
        },
        {
          question: 'What is Audio Cleanup / Isolation?',
          answer: "Our Audio Cleanup service uses AI-powered audio isolation to remove background noise from any recordings. If you have existing content with unwanted background noise, echo, or low-quality audio, we can clean it up for crystal-clear sound. This is great for repurposing old content, cleaning up recordings from noisy environments, or enhancing audio from virtual meetings and webinars."
        },
        {
          question: 'Can you add Custom Sound Effects?',
          answer: "Absolutely! Make your videos more engaging with professional sound effects. We can add whooshes for transitions, subtle background music beds, emphasis sounds for key points, notification sounds, crowd reactions, and more. AI-generated sound effects are customized to match the tone of your content - whether that's professional and corporate, fun and energetic, or calm and educational. Available as an add-on to enhance your video package."
        },
        {
          question: 'How do I add these features to my package?',
          answer: "Just mention your interest during your discovery call, and we'll include them in your custom quote! You can add any of these premium features to any package - Launch Kit, Content Engine, or Authority Engine. If you're an existing client, simply reach out to your account manager or contact us through your client portal to discuss adding these features to your next content batch."
        }
      ]
    },
    {
      title: 'Technical',
      items: [
        {
          question: 'How do I access my videos?',
          answer: "All your content is delivered through your private client portal. You'll receive login credentials after your kickoff call. In the portal, you can preview videos, download individual files or bulk downloads, access captions and hashtags, track your project progress, and communicate with your production team. Videos are stored securely and available for download anytime."
        },
        {
          question: 'What platforms can I post to?',
          answer: "Your videos are optimized for all major social platforms: Instagram (Reels and Feed), TikTok, YouTube (Shorts and regular posts), Facebook (Reels and Feed), LinkedIn, Twitter/X, Pinterest (Idea Pins), and Snapchat. The 9:16 vertical format is native to all these platforms. You can also embed videos on your website, include them in email campaigns, or use them in paid advertising."
        },
        {
          question: 'Do you offer revisions?',
          answer: "Yes! Each package includes up to 2 revision rounds. After reviewing your videos in the client portal, you can request changes to scripts, voiceover tone, pacing, visual elements, or any other aspect. We'll make the adjustments and re-deliver updated versions. Most clients are happy with the first delivery, but we want to ensure you're completely satisfied with your content before final sign-off."
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-purple-50 via-indigo-50 to-white overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-purple-100 text-purple-700 text-sm font-semibold mb-6">
              <MessageCircle className="w-4 h-4 mr-2" />
              Everything You Need to Know
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Frequently Asked{' '}
              <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Questions
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-xl sm:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
              Get answers to common questions about our AI spokesperson service, content creation process, and packages.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {faqCategories.map((category, categoryIndex) => (
            <div key={categoryIndex} className="mb-16">
              {/* Category Header */}
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  {category.title}
                </h2>
                <div className="h-1 w-20 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full"></div>
              </div>

              {/* FAQ Items */}
              <div className="space-y-4">
                {category.items.map((item, itemIndex) => {
                  const id = `faq-${categoryIndex}-${itemIndex}`;
                  const isOpen = openItems[id];

                  return (
                    <div
                      key={id}
                      className="bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-all duration-200"
                    >
                      {/* Question Button */}
                      <button
                        onClick={() => toggleItem(id)}
                        className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 hover:bg-gray-50 transition-colors"
                      >
                        <span className="text-lg font-semibold text-gray-900 pr-4">
                          {item.question}
                        </span>
                        <ChevronDown
                          className={`w-6 h-6 text-purple-600 flex-shrink-0 transition-transform duration-200 ${
                            isOpen ? 'transform rotate-180' : ''
                          }`}
                        />
                      </button>

                      {/* Answer */}
                      <div
                        className={`transition-all duration-200 ease-in-out ${
                          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                        } overflow-hidden`}
                      >
                        <div className="px-6 pb-5 pt-2">
                          <div className="h-px bg-gradient-to-r from-purple-200 to-indigo-200 mb-4"></div>
                          <p className="text-gray-700 leading-relaxed">
                            {item.answer}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-purple-600 via-indigo-600 to-purple-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Still Have Questions?
          </h2>
          <p className="text-xl text-purple-100 mb-10 max-w-2xl mx-auto">
            Let&apos;s talk! Book a free 15-minute strategy call and we&apos;ll answer all your questions about getting started with AI spokesperson content.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/#book-call"
              className="bg-white text-purple-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 w-full sm:w-auto"
            >
              Book a Free Call
            </Link>
            <Link
              href="/pricing"
              className="bg-purple-700 text-white px-8 py-4 rounded-lg font-bold text-lg border-2 border-white/30 hover:bg-purple-800 transition-all shadow-lg w-full sm:w-auto"
            >
              View Pricing
            </Link>
          </div>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-6 text-white text-sm">
            <div className="flex items-center">
              <svg
                className="w-5 h-5 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>No obligation</span>
            </div>
            <div className="flex items-center">
              <svg
                className="w-5 h-5 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>15 minutes</span>
            </div>
            <div className="flex items-center">
              <svg
                className="w-5 h-5 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Free strategy session</span>
            </div>
          </div>
        </div>
      </section>

      {/* Animation styles */}
      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
}
