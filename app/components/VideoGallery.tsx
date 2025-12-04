'use client'

import { useState } from 'react'

// Sample video data - easily update with real URLs later
export const sampleVideos = [
  {
    id: 1,
    title: 'Med Spa - Anti-Aging Treatment',
    niche: 'Med Spa',
    duration: '0:32',
    thumbnail: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&h=400&fit=crop',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // PLACEHOLDER - Replace with real video
    description: 'AI spokesperson introducing cutting-edge anti-aging treatments with a warm, professional tone.'
  },
  {
    id: 2,
    title: 'Real Estate - Luxury Home Tour',
    niche: 'Real Estate',
    duration: '0:45',
    thumbnail: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&h=400&fit=crop',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // PLACEHOLDER - Replace with real video
    description: 'Engaging property showcase highlighting key features and neighborhood benefits.'
  },
  {
    id: 3,
    title: 'Law Firm - Personal Injury',
    niche: 'Lawyer',
    duration: '0:38',
    thumbnail: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&h=400&fit=crop',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // PLACEHOLDER - Replace with real video
    description: 'Authoritative yet compassionate message about client rights and legal services.'
  },
  {
    id: 4,
    title: 'Fitness Coach - Weight Loss Tips',
    niche: 'Fitness',
    duration: '0:30',
    thumbnail: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&h=400&fit=crop',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // PLACEHOLDER - Replace with real video
    description: 'Energetic and motivational content sharing actionable fitness advice.'
  },
  {
    id: 5,
    title: 'Restaurant - Weekly Special',
    niche: 'Restaurant',
    duration: '0:28',
    thumbnail: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&h=400&fit=crop',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // PLACEHOLDER - Replace with real video
    description: 'Mouth-watering promotion of seasonal menu items and chef specials.'
  },
  {
    id: 6,
    title: 'Dental Practice - Smile Transformation',
    niche: 'Dental',
    duration: '0:35',
    thumbnail: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=600&h=400&fit=crop',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // PLACEHOLDER - Replace with real video
    description: 'Friendly introduction to cosmetic dentistry services and patient testimonials.'
  }
]

export default function VideoGallery() {
  const [selectedVideo, setSelectedVideo] = useState<typeof sampleVideos[0] | null>(null)

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        {sampleVideos.map((video) => (
          <div
            key={video.id}
            className="group relative bg-white rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
            onClick={() => setSelectedVideo(video)}
          >
            {/* Thumbnail */}
            <div className="relative aspect-video overflow-hidden bg-gray-200">
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />

              {/* Play Button Overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-30 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <svg
                    className="w-8 h-8 text-indigo-600 ml-1"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>

              {/* Duration Badge */}
              <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs font-semibold px-2 py-1 rounded">
                {video.duration}
              </div>
            </div>

            {/* Card Content */}
            <div className="p-4">
              <div className="mb-2">
                <span className="inline-block px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-full">
                  {video.niche}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                {video.title}
              </h3>
            </div>
          </div>
        ))}
      </div>

      {/* Video Modal */}
      {selectedVideo && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4 animate-fadeIn"
          onClick={() => setSelectedVideo(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-4xl w-full overflow-hidden shadow-2xl animate-scaleIn"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <div className="flex justify-between items-center p-4 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">{selectedVideo.title}</h3>
              <button
                onClick={() => setSelectedVideo(null)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Video Player */}
            <div className="relative aspect-video bg-black">
              <iframe
                src={selectedVideo.videoUrl}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            {/* Video Info */}
            <div className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <span className="inline-block px-3 py-1 bg-indigo-100 text-indigo-700 text-sm font-semibold rounded-full">
                  {selectedVideo.niche}
                </span>
                <span className="text-sm text-gray-500">{selectedVideo.duration}</span>
              </div>
              <p className="text-gray-600">{selectedVideo.description}</p>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }

        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out;
        }
      `}</style>
    </>
  )
}
