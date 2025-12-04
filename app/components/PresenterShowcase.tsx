'use client'

import { useState } from 'react'

// Sample presenter data - easily update with real images later
export const samplePresenters = [
  {
    id: 1,
    name: 'Sarah',
    image: 'https://i.pravatar.cc/300?img=47', // PLACEHOLDER - Replace with real AI avatar
    tags: ['Professional', 'Warm', 'Trustworthy'],
    description: 'Perfect for healthcare, finance, and professional services'
  },
  {
    id: 2,
    name: 'Marcus',
    image: 'https://i.pravatar.cc/300?img=12', // PLACEHOLDER - Replace with real AI avatar
    tags: ['Authoritative', 'Confident', 'Bold'],
    description: 'Ideal for law firms, real estate, and corporate content'
  },
  {
    id: 3,
    name: 'Elena',
    image: 'https://i.pravatar.cc/300?img=45', // PLACEHOLDER - Replace with real AI avatar
    tags: ['Friendly', 'Energetic', 'Approachable'],
    description: 'Great for fitness, lifestyle, and consumer brands'
  },
  {
    id: 4,
    name: 'David',
    image: 'https://i.pravatar.cc/300?img=14', // PLACEHOLDER - Replace with real AI avatar
    tags: ['Casual', 'Relatable', 'Down-to-Earth'],
    description: 'Perfect for restaurants, local businesses, and retail'
  },
  {
    id: 5,
    name: 'Priya',
    image: 'https://i.pravatar.cc/300?img=49', // PLACEHOLDER - Replace with real AI avatar
    tags: ['Sophisticated', 'Elegant', 'Refined'],
    description: 'Ideal for luxury brands, spas, and premium services'
  },
  {
    id: 6,
    name: 'James',
    image: 'https://i.pravatar.cc/300?img=33', // PLACEHOLDER - Replace with real AI avatar
    tags: ['Expert', 'Knowledgeable', 'Reliable'],
    description: 'Great for tech, education, and consulting services'
  }
]

export default function PresenterShowcase() {
  const [hoveredId, setHoveredId] = useState<number | null>(null)

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 lg:gap-8">
      {samplePresenters.map((presenter) => (
        <div
          key={presenter.id}
          className="text-center group"
          onMouseEnter={() => setHoveredId(presenter.id)}
          onMouseLeave={() => setHoveredId(null)}
        >
          {/* Avatar Circle */}
          <div className="relative mb-4 mx-auto">
            <div
              className={`w-32 h-32 mx-auto rounded-full overflow-hidden border-4 transition-all duration-300 ${
                hoveredId === presenter.id
                  ? 'border-indigo-600 shadow-2xl transform scale-110'
                  : 'border-gray-200 shadow-lg'
              }`}
            >
              <img
                src={presenter.image}
                alt={presenter.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Glow effect on hover */}
            {hoveredId === presenter.id && (
              <div className="absolute inset-0 rounded-full bg-indigo-400 opacity-20 blur-xl animate-pulse" />
            )}
          </div>

          {/* Name */}
          <h3
            className={`text-lg font-semibold mb-2 transition-colors duration-300 ${
              hoveredId === presenter.id ? 'text-indigo-600' : 'text-gray-900'
            }`}
          >
            {presenter.name}
          </h3>

          {/* Tags */}
          <div className="flex flex-wrap justify-center gap-1.5 mb-3">
            {presenter.tags.map((tag, index) => (
              <span
                key={index}
                className={`px-2 py-1 text-xs font-medium rounded-full transition-all duration-300 ${
                  hoveredId === presenter.id
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Description - shown on hover */}
          <div
            className={`overflow-hidden transition-all duration-300 ${
              hoveredId === presenter.id ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            <p className="text-sm text-gray-600 px-2">{presenter.description}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
