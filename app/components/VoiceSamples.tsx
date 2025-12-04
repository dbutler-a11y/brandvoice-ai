'use client'

import { useState, useRef } from 'react'

// Sample voice data - easily update with real audio URLs later
export const sampleVoices = [
  {
    id: 1,
    name: 'Professional Female',
    style: 'Warm & Authoritative',
    audioUrl: '', // PLACEHOLDER - Add real audio URL here
    duration: '0:15',
    description: 'Perfect for healthcare, finance, and corporate content'
  },
  {
    id: 2,
    name: 'Confident Male',
    style: 'Bold & Trustworthy',
    audioUrl: '', // PLACEHOLDER - Add real audio URL here
    duration: '0:18',
    description: 'Ideal for law firms, real estate, and professional services'
  },
  {
    id: 3,
    name: 'Friendly Female',
    style: 'Energetic & Approachable',
    audioUrl: '', // PLACEHOLDER - Add real audio URL here
    duration: '0:12',
    description: 'Great for lifestyle, fitness, and consumer brands'
  },
  {
    id: 4,
    name: 'Casual Male',
    style: 'Relatable & Down-to-Earth',
    audioUrl: '', // PLACEHOLDER - Add real audio URL here
    duration: '0:16',
    description: 'Perfect for restaurants, local businesses, and retail'
  }
]

export default function VoiceSamples() {
  const [playingId, setPlayingId] = useState<number | null>(null)
  const [progress, setProgress] = useState<{ [key: number]: number }>({})
  const audioRefs = useRef<{ [key: number]: HTMLAudioElement | null }>({})

  const togglePlay = (id: number) => {
    const audio = audioRefs.current[id]
    if (!audio) return

    if (playingId === id) {
      audio.pause()
      setPlayingId(null)
    } else {
      // Pause any currently playing audio
      if (playingId !== null) {
        audioRefs.current[playingId]?.pause()
      }
      audio.play()
      setPlayingId(id)
    }
  }

  const handleTimeUpdate = (id: number) => {
    const audio = audioRefs.current[id]
    if (!audio) return

    const progressPercent = (audio.currentTime / audio.duration) * 100
    setProgress((prev) => ({ ...prev, [id]: progressPercent }))
  }

  const handleEnded = (id: number) => {
    setPlayingId(null)
    setProgress((prev) => ({ ...prev, [id]: 0 }))
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {sampleVoices.map((voice) => (
        <div
          key={voice.id}
          className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100"
        >
          {/* Voice Info */}
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">{voice.name}</h3>
            <p className="text-sm text-indigo-600 font-medium">{voice.style}</p>
          </div>

          {/* Waveform Visualization (Decorative) */}
          <div className="mb-4 h-16 flex items-center justify-center gap-1 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-3">
            {[...Array(30)].map((_, i) => (
              <div
                key={i}
                className={`w-1 rounded-full transition-all duration-300 ${
                  playingId === voice.id
                    ? 'bg-indigo-600 animate-wave'
                    : 'bg-indigo-300'
                }`}
                style={{
                  height: `${Math.random() * 60 + 20}%`,
                  animationDelay: `${i * 0.05}s`
                }}
              />
            ))}
          </div>

          {/* Controls */}
          <div className="space-y-3">
            {/* Play Button and Duration */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => togglePlay(voice.id)}
                disabled={!voice.audioUrl}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                  voice.audioUrl
                    ? 'bg-indigo-600 hover:bg-indigo-700 shadow-lg hover:shadow-xl'
                    : 'bg-gray-300 cursor-not-allowed'
                }`}
              >
                {playingId === voice.id ? (
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                )}
              </button>
              <span className="text-sm text-gray-500 font-medium">{voice.duration}</span>
            </div>

            {/* Progress Bar */}
            <div className="relative h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="absolute top-0 left-0 h-full bg-indigo-600 transition-all duration-100 rounded-full"
                style={{ width: `${progress[voice.id] || 0}%` }}
              />
            </div>

            {/* Description */}
            <p className="text-xs text-gray-600">{voice.description}</p>
          </div>

          {/* Hidden Audio Element */}
          {voice.audioUrl && (
            <audio
              ref={(el) => {
                audioRefs.current[voice.id] = el
              }}
              src={voice.audioUrl}
              onTimeUpdate={() => handleTimeUpdate(voice.id)}
              onEnded={() => handleEnded(voice.id)}
            />
          )}

          {/* Placeholder Notice */}
          {!voice.audioUrl && (
            <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-700 text-center">
              Audio placeholder - add real URL
            </div>
          )}
        </div>
      ))}

      <style jsx>{`
        @keyframes wave {
          0%, 100% {
            transform: scaleY(1);
          }
          50% {
            transform: scaleY(1.5);
          }
        }

        .animate-wave {
          animation: wave 1s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
