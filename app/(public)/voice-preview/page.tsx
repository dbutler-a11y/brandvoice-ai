'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

// Simple toast notification component
const Toast = ({ message, onClose }: { message: string; onClose: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in">
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-4 rounded-lg shadow-2xl flex items-center gap-3 max-w-md">
        <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="font-medium">{message}</p>
        <button onClick={onClose} className="ml-auto hover:bg-white/20 rounded p-1 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

interface Voice {
  id: string;
  name: string;
  displayName: string;
  gender: 'Male' | 'Female';
  characteristics: string[];
  industries: string[];
  category: string[];
  sampleText: string;
  audioUrl?: string;
}

const VoiceCard = ({ voice, isPlaying, onPlay }: {
  voice: Voice;
  isPlaying: boolean;
  onPlay: (voiceId: string) => void;
}) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 border border-gray-200">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900">{voice.displayName}</h3>
          <span className="inline-block mt-1 px-3 py-1 bg-purple-100 text-purple-700 text-sm rounded-full">
            {voice.gender}
          </span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {voice.characteristics.map((char) => (
          <span
            key={char}
            className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
          >
            {char}
          </span>
        ))}
      </div>

      <div className="mb-4">
        <p className="text-sm text-gray-600 font-semibold mb-1">Great for:</p>
        <p className="text-sm text-gray-700">{voice.industries.join(', ')}</p>
      </div>

      <div className="bg-gray-50 rounded-lg p-4 mb-4">
        <p className="text-sm text-gray-700 italic">
          &quot;{voice.sampleText}&quot;
        </p>
      </div>

      <button
        onClick={() => onPlay(voice.id)}
        className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-semibold transition-colors duration-200 ${
          isPlaying
            ? 'bg-purple-600 text-white hover:bg-purple-700'
            : 'bg-indigo-600 text-white hover:bg-indigo-700'
        }`}
      >
        {isPlaying ? (
          <>
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            Pause Preview
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
            </svg>
            Play Sample
          </>
        )}
      </button>
    </div>
  );
};

export default function VoicePreviewPage() {
  const [voices, setVoices] = useState<Voice[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All Voices');
  const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const categories = [
    'All Voices',
    'Warm & Friendly',
    'Professional & Authoritative',
    'Energetic & Motivating',
    'Calm & Reassuring',
  ];

  useEffect(() => {
    fetchVoices();
  }, []);

  const fetchVoices = async () => {
    try {
      const response = await fetch('/api/voices');
      const data = await response.json();
      setVoices(data.voices);
    } catch (error) {
      console.error('Failed to fetch voices:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePlayVoice = (voiceId: string) => {
    if (playingVoiceId === voiceId) {
      // Stop playing
      setPlayingVoiceId(null);
    } else {
      // Show toast notification about upcoming feature
      const voice = voices.find(v => v.id === voiceId);
      setToastMessage(`Voice preview coming soon - ElevenLabs integration pending for ${voice?.name || 'this voice'}`);
      setShowToast(true);

      // Visual feedback: briefly show as "playing" then reset
      setPlayingVoiceId(voiceId);
      setTimeout(() => {
        setPlayingVoiceId(null);
      }, 1500);
    }
  };

  const filteredVoices = selectedCategory === 'All Voices'
    ? voices
    : voices.filter((voice) => voice.category.includes(selectedCategory));

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50">
      {/* Toast Notification */}
      {showToast && (
        <Toast
          message={toastMessage}
          onClose={() => setShowToast(false)}
        />
      )}

      {/* Hidden audio element for future use */}
      <audio
        ref={audioRef}
        onEnded={() => setPlayingVoiceId(null)}
        className="hidden"
      />

      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Preview Your{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">
              AI Voice
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
            Preview our AI voices below. Full audio samples coming soon!
          </p>
          {/* Info Banner */}
          <div className="max-w-2xl mx-auto mt-6 bg-gradient-to-r from-purple-100 to-indigo-100 border border-purple-200 rounded-lg p-4">
            <div className="flex items-center justify-center gap-3">
              <svg className="w-6 h-6 text-purple-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              </svg>
              <p className="text-purple-800 font-medium">
                Audio samples are being prepared. Click any voice to explore their characteristics!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Voice Categories/Filters */}
      <section className="pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-3 rounded-full font-semibold transition-all duration-200 ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg scale-105'
                    : 'bg-white text-gray-700 hover:bg-gray-50 shadow-md hover:shadow-lg'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Voice Selection Grid */}
      <section className="pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
              <p className="mt-4 text-gray-600">Loading voices...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredVoices.map((voice) => (
                <VoiceCard
                  key={voice.id}
                  voice={voice}
                  isPlaying={playingVoiceId === voice.id}
                  onPlay={handlePlayVoice}
                />
              ))}
            </div>
          )}

          {!loading && filteredVoices.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No voices found in this category.</p>
            </div>
          )}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-8 border border-purple-200">
              <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Consistent Voice Across All Videos
              </h3>
              <p className="text-gray-700">
                Your selected voice will be used for all 30 videos in your campaign, ensuring brand consistency and recognition.
              </p>
            </div>

            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-8 border border-indigo-200">
              <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Custom Voice Clone Available
              </h3>
              <p className="text-gray-700">
                Want a custom voice clone that sounds exactly like you or your spokesperson? Ask about our Custom Voice add-on during your consultation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-purple-600 to-indigo-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Choose Your Voice?
          </h2>
          <p className="text-xl text-purple-100 mb-8">
            Book a call and we&apos;ll help you pick the perfect voice for your brand.
          </p>
          <Link
            href="https://calendly.com/your-calendly-link"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-white text-purple-600 px-8 py-4 rounded-full text-lg font-bold hover:bg-gray-100 transition-colors duration-200 shadow-xl hover:shadow-2xl transform hover:scale-105"
          >
            Book a Call
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
          <p className="mt-6 text-purple-100">
            Or continue exploring our{' '}
            <Link href="/pricing" className="underline hover:text-white">
              pricing options
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}
