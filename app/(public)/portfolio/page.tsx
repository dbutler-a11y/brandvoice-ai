'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

// Brand icons paths
const ICONS = {
  play: '/images/icons/brand/play-sound.png',
  video: '/images/icons/brand/video-camera.png',
  user: '/images/icons/brand/user-avatar.png',
  check: '/images/icons/brand/checkmark.png',
  sparkle: '/images/icons/brand/sparkle-stars.png',
};

type Spokesperson = {
  id: string
  name: string
  displayName: string
  description: string
  primaryNiche: string
  avatarUrl: string | null
  thumbnailUrl: string | null
  demoVideoUrl: string | null
  featured: boolean
}

type SampleVideo = {
  id: string
  title: string
  niche: string
  duration: string
  thumbnail: string
  videoUrl?: string
  featured?: boolean
}

const sampleVideos: SampleVideo[] = [
  {
    id: '1',
    title: 'Med Spa - FAQ: How long does Botox last?',
    niche: 'Med Spa',
    duration: '0:32',
    thumbnail: 'from-purple-400 to-pink-400'
  },
  {
    id: '2',
    title: 'Real Estate - Property Tour Highlight',
    niche: 'Real Estate',
    duration: '0:45',
    thumbnail: 'from-blue-400 to-cyan-400'
  },
  {
    id: '3',
    title: 'Fitness - Quick Morning Routine',
    niche: 'Fitness',
    duration: '0:38',
    thumbnail: 'from-green-400 to-teal-400'
  },
  {
    id: '4',
    title: 'Coaching - Overcoming Limiting Beliefs',
    niche: 'Coaching',
    duration: '0:42',
    thumbnail: 'from-amber-400 to-orange-400'
  },
  {
    id: '5',
    title: 'Med Spa - Before & After Results',
    niche: 'Med Spa',
    duration: '0:35',
    thumbnail: 'from-purple-400 to-indigo-400'
  },
  {
    id: '6',
    title: 'Local Services - Customer Testimonial',
    niche: 'Local Services',
    duration: '0:40',
    thumbnail: 'from-rose-400 to-red-400'
  },
  {
    id: '7',
    title: 'Real Estate - Market Update',
    niche: 'Real Estate',
    duration: '0:50',
    thumbnail: 'from-sky-400 to-blue-400'
  },
  {
    id: '8',
    title: 'Fitness - Nutrition Tips',
    niche: 'Fitness',
    duration: '0:33',
    thumbnail: 'from-lime-400 to-green-400'
  },
  {
    id: '9',
    title: 'Coaching - Goal Setting Strategy',
    niche: 'Coaching',
    duration: '0:48',
    thumbnail: 'from-yellow-400 to-amber-400'
  },
  {
    id: '10',
    title: 'Credit Repair - $2 Million in Deleted Debt',
    niche: 'Credit Repair',
    duration: '0:45',
    thumbnail: 'from-emerald-400 to-teal-400',
    videoUrl: '/videos/samples/credit-repair-2milli.mp4'
  },
  {
    id: '11',
    title: 'Credit Repair - Client Success Story',
    niche: 'Credit Repair',
    duration: '0:40',
    thumbnail: 'from-teal-400 to-cyan-400',
    videoUrl: '/videos/samples/credit-repair-results.mp4'
  },
  {
    id: '12',
    title: 'Tax Services - $2 Million in Client Savings',
    niche: 'Tax Services',
    duration: '0:42',
    thumbnail: 'from-blue-500 to-indigo-500',
    videoUrl: '/videos/samples/tax-services-2milli.mp4',
    featured: true
  }
]

const filterCategories = [
  'All',
  'Med Spa',
  'Real Estate',
  'Fitness',
  'Coaching',
  'Local Services',
  'Credit Repair',
  'Tax Services'
]

export default function PortfolioPage() {
  const [activeFilter, setActiveFilter] = useState('All')
  const [spokespersons, setSpokespersons] = useState<Spokesperson[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedVideo, setSelectedVideo] = useState<SampleVideo | null>(null)

  useEffect(() => {
    fetchSpokespersons()
  }, [])

  const fetchSpokespersons = async () => {
    try {
      const response = await fetch('/api/spokespersons')
      if (response.ok) {
        const data = await response.json()
        setSpokespersons(data.filter((sp: Spokesperson) => sp.featured).slice(0, 4))
      }
    } catch (error) {
      console.error('Error fetching spokespersons:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredVideos = activeFilter === 'All'
    ? sampleVideos
    : sampleVideos.filter(video => video.niche === activeFilter)

  const featuredVideos = sampleVideos.filter(video => video.videoUrl)
  const [hoveredVideo, setHoveredVideo] = useState<string | null>(null)

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-purple-600/20 to-indigo-600/20 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-purple-300 text-sm font-semibold mb-6 border border-white/20">
              <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
              Real Client Content
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Content That{' '}
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Converts
              </span>
            </h1>

            <p className="text-xl sm:text-2xl text-gray-300 mb-10 max-w-3xl mx-auto">
              See real examples of viral-ready content we create for businesses
            </p>
          </div>

          {/* Featured Phone Showcase */}
          <div className="flex justify-center items-end gap-4 sm:gap-8 pb-8">
            {featuredVideos.slice(0, 3).map((video, index) => (
              <div
                key={video.id}
                className={`relative transition-all duration-500 cursor-pointer ${
                  index === 1 ? 'z-20 scale-110' : 'z-10 opacity-80 hover:opacity-100'
                } ${hoveredVideo === video.id ? 'scale-115 z-30' : ''}`}
                onMouseEnter={() => setHoveredVideo(video.id)}
                onMouseLeave={() => setHoveredVideo(null)}
                onClick={() => setSelectedVideo(video)}
              >
                {/* Phone Frame */}
                <div className={`relative bg-black rounded-[2.5rem] p-2 shadow-2xl ${
                  index === 1 ? 'w-48 sm:w-56' : 'w-36 sm:w-44 hidden sm:block'
                }`}>
                  {/* Phone Notch */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-black rounded-b-2xl z-10"></div>

                  {/* Screen */}
                  <div className="relative rounded-[2rem] overflow-hidden bg-gray-900 aspect-[9/19.5]">
                    {video.videoUrl ? (
                      <video
                        className="w-full h-full object-cover"
                        autoPlay
                        loop
                        muted
                        playsInline
                      >
                        <source src={video.videoUrl} type="video/mp4" />
                      </video>
                    ) : (
                      <div className={`w-full h-full bg-gradient-to-br ${video.thumbnail}`}></div>
                    )}

                    {/* Overlay on hover */}
                    <div className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity ${
                      hoveredVideo === video.id ? 'opacity-100' : 'opacity-0'
                    }`}>
                      <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-xl">
                        <svg className="w-6 h-6 text-purple-600 ml-1" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z"/>
                        </svg>
                      </div>
                    </div>

                    {/* Niche Tag */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-purple-600 whitespace-nowrap">
                      {video.niche}
                    </div>
                  </div>
                </div>

                {/* Glow Effect */}
                <div className={`absolute -inset-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-[3rem] blur-xl opacity-0 transition-opacity -z-10 ${
                  hoveredVideo === video.id ? 'opacity-40' : ''
                }`}></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-gradient-to-r from-purple-600 to-indigo-600 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-8 sm:gap-16 text-white">
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold">500+</div>
              <div className="text-purple-200 text-sm">Videos Created</div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold">50M+</div>
              <div className="text-purple-200 text-sm">Views Generated</div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold">12+</div>
              <div className="text-purple-200 text-sm">Industries Served</div>
            </div>
          </div>
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex overflow-x-auto py-4 space-x-2 scrollbar-hide">
            {filterCategories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveFilter(category)}
                className={`px-6 py-2 rounded-full font-semibold whitespace-nowrap transition-all ${
                  activeFilter === category
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Video Grid - Redesigned */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">All Content Examples</h2>
            <p className="text-gray-600">Click any video to watch the full preview</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {filteredVideos.map((video) => (
              <div
                key={video.id}
                className="group relative cursor-pointer"
                onClick={() => setSelectedVideo(video)}
              >
                {/* Card with Phone-like styling */}
                <div className="relative bg-gray-900 rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-[1.02]">
                  {/* Video/Thumbnail */}
                  <div className={`relative aspect-[9/16] bg-gradient-to-br ${video.thumbnail}`}>
                    {video.videoUrl ? (
                      <video
                        className="w-full h-full object-cover"
                        muted
                        playsInline
                        loop
                        onMouseEnter={(e) => e.currentTarget.play()}
                        onMouseLeave={(e) => {
                          e.currentTarget.pause()
                          e.currentTarget.currentTime = 0
                        }}
                      >
                        <source src={video.videoUrl} type="video/mp4" />
                      </video>
                    ) : null}

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20"></div>

                    {/* Play Button */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-xl transform group-hover:scale-110 transition-transform">
                        <svg className="w-6 h-6 sm:w-7 sm:h-7 text-purple-600 ml-1" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z"/>
                        </svg>
                      </div>
                    </div>

                    {/* Featured Badge */}
                    {video.featured && (
                      <div className="absolute top-3 right-3 bg-gradient-to-r from-amber-400 to-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                        </svg>
                        Featured
                      </div>
                    )}

                    {/* Has Video Indicator */}
                    {video.videoUrl && (
                      <div className="absolute top-3 left-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                        <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                        Live
                      </div>
                    )}

                    {/* Bottom Info */}
                    <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="bg-white/20 backdrop-blur-sm text-white px-2 py-0.5 rounded-full text-xs font-medium">
                          {video.niche}
                        </span>
                        <span className="bg-black/50 text-white px-2 py-0.5 rounded-full text-xs font-medium">
                          {video.duration}
                        </span>
                      </div>
                      <h3 className="text-white text-sm sm:text-base font-bold line-clamp-2 group-hover:text-purple-300 transition-colors">
                        {video.title}
                      </h3>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredVideos.length === 0 && (
            <div className="text-center py-16">
              <p className="text-gray-600 text-lg">No videos found for this category.</p>
            </div>
          )}
        </div>
      </section>

      {/* Spokesperson Showcase Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Meet Our AI Spokespersons
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Choose from our library of professional AI spokespersons, each crafted for specific industries
            </p>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
              {spokespersons.map((spokesperson) => (
                <div
                  key={spokesperson.id}
                  className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-purple-100 group hover:-translate-y-2"
                >
                  {/* Avatar Placeholder */}
                  <div className="relative mb-4">
                    {spokesperson.thumbnailUrl || spokesperson.avatarUrl ? (
                      <Image
                        src={spokesperson.thumbnailUrl || spokesperson.avatarUrl || ''}
                        alt={spokesperson.displayName}
                        width={300}
                        height={300}
                        className="w-full aspect-square object-cover rounded-lg"
                        unoptimized
                      />
                    ) : (
                      <div className="w-full aspect-square bg-gradient-to-br from-purple-400 to-indigo-500 rounded-lg flex items-center justify-center">
                        <Image
                          src={ICONS.user}
                          alt=""
                          width={80}
                          height={80}
                          className="w-20 h-20 opacity-50"
                        />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4">
                      <span className="text-white font-semibold text-sm">View Demo</span>
                    </div>
                  </div>

                  {/* Spokesperson Info */}
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {spokesperson.displayName}
                  </h3>
                  <p className="text-sm text-purple-600 font-semibold mb-3">
                    {spokesperson.primaryNiche}
                  </p>
                  <p className="text-gray-600 text-sm line-clamp-2">
                    {spokesperson.description}
                  </p>
                </div>
              ))}
            </div>
          )}

          <div className="text-center">
            <Link
              href="/voice-preview"
              className="inline-block bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-4 rounded-lg font-bold text-lg hover:from-purple-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl"
            >
              View All Spokespersons
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-purple-600 via-indigo-600 to-purple-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Ready to Create Content Like This?
          </h2>
          <p className="text-xl text-purple-100 mb-10 max-w-2xl mx-auto">
            Get your own AI spokesperson and 30 days of professional video content delivered in just 7 days.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/#book-call"
              className="bg-white text-purple-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 w-full sm:w-auto"
            >
              Book a Call
            </Link>
            <Link
              href="/pricing"
              className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white hover:text-purple-600 transition-all w-full sm:w-auto"
            >
              See Pricing
            </Link>
          </div>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8 text-white">
            <div className="flex items-center">
              <Image src={ICONS.check} alt="" width={20} height={20} className="w-5 h-5 mr-2" />
              <span>7-Day Delivery</span>
            </div>
            <div className="flex items-center">
              <Image src={ICONS.check} alt="" width={20} height={20} className="w-5 h-5 mr-2" />
              <span>No Filming Required</span>
            </div>
            <div className="flex items-center">
              <Image src={ICONS.check} alt="" width={20} height={20} className="w-5 h-5 mr-2" />
              <span>Money-Back Guarantee</span>
            </div>
          </div>
        </div>
      </section>

      {/* Video Modal Placeholder */}
      {selectedVideo && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedVideo(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-2xl w-full p-8 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedVideo(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {selectedVideo.title}
              </h3>
              {selectedVideo.videoUrl ? (
                <div className="aspect-[9/16] rounded-lg mb-4 max-h-[60vh] mx-auto overflow-hidden bg-black">
                  <video
                    className="w-full h-full object-contain"
                    controls
                    autoPlay
                    playsInline
                  >
                    <source src={selectedVideo.videoUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              ) : (
                <div className={`aspect-[9/16] bg-gradient-to-br ${selectedVideo.thumbnail} rounded-lg mb-4 flex items-center justify-center max-h-[60vh] mx-auto`}>
                  <div className="text-white text-lg font-semibold">
                    Video Preview Coming Soon
                  </div>
                </div>
              )}
              <div className="flex items-center justify-center space-x-4 text-gray-600">
                <span className="flex items-center">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                    />
                  </svg>
                  {selectedVideo.niche}
                </span>
                <span className="flex items-center">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  {selectedVideo.duration}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Animation Styles */}
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
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  )
}
