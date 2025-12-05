'use client';

import { useState, useRef, useEffect } from 'react';

interface Voice {
  id: string;
  name: string;
  description: string;
  gender: string;
  age: string;
  tone: string;
  previewText: string;
}

export default function VoicePreviewSection() {
  const [voices, setVoices] = useState<Voice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<Voice | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [, setIsLoading] = useState(false);
  const [loadingVoiceId, setLoadingVoiceId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Fetch available voices on mount
  useEffect(() => {
    const fetchVoices = async () => {
      try {
        const response = await fetch('/api/voice-preview');
        const data = await response.json();
        setVoices(data.voices);
        if (data.voices.length > 0) {
          setSelectedVoice(data.voices[0]);
        }
      } catch (err) {
        console.error('Failed to fetch voices:', err);
      }
    };
    fetchVoices();
  }, []);

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const playVoicePreview = async (voice: Voice) => {
    setError(null);

    // Stop any currently playing audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    setSelectedVoice(voice);
    setIsLoading(true);
    setLoadingVoiceId(voice.id);

    try {
      const response = await fetch('/api/voice-preview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          voiceId: voice.id,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate preview');
      }

      const data = await response.json();

      // Create audio from base64
      const audioBlob = new Blob(
        [Uint8Array.from(atob(data.audio), c => c.charCodeAt(0))],
        { type: 'audio/mpeg' }
      );
      const audioUrl = URL.createObjectURL(audioBlob);

      audioRef.current = new Audio(audioUrl);
      audioRef.current.onended = () => {
        setIsPlaying(false);
        URL.revokeObjectURL(audioUrl);
      };
      audioRef.current.onerror = () => {
        setIsPlaying(false);
        setError('Failed to play audio');
      };

      await audioRef.current.play();
      setIsPlaying(true);

    } catch (err) {
      console.error('Voice preview error:', err);
      setError('Unable to generate voice preview. Please try again.');
    } finally {
      setIsLoading(false);
      setLoadingVoiceId(null);
    }
  };

  const stopPlayback = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setIsPlaying(false);
  };

  // Group voices by gender
  const femaleVoices = voices.filter(v => v.gender === 'female');
  const maleVoices = voices.filter(v => v.gender === 'male');

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Preview AI Voices
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Listen to sample voices and find the perfect match for your brand
          </p>
        </div>

        {/* Female Voices Section */}
        <div className="mb-10">
          <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
            <span className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center mr-2">
              <svg className="w-4 h-4 text-pink-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </span>
            Female Voices
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {femaleVoices.map((voice) => (
              <VoiceCard
                key={voice.id}
                voice={voice}
                isSelected={selectedVoice?.id === voice.id}
                isPlaying={isPlaying && selectedVoice?.id === voice.id}
                isLoading={loadingVoiceId === voice.id}
                onPlay={() => playVoicePreview(voice)}
                onStop={stopPlayback}
              />
            ))}
          </div>
        </div>

        {/* Male Voices Section */}
        <div className="mb-12">
          <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
            <span className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-2">
              <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </span>
            Male Voices
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {maleVoices.map((voice) => (
              <VoiceCard
                key={voice.id}
                voice={voice}
                isSelected={selectedVoice?.id === voice.id}
                isPlaying={isPlaying && selectedVoice?.id === voice.id}
                isLoading={loadingVoiceId === voice.id}
                onPlay={() => playVoicePreview(voice)}
                onStop={stopPlayback}
              />
            ))}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="text-center text-red-600 mb-8">
            {error}
          </div>
        )}

        {/* CTA */}
        <div className="text-center bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-3">
            Want a Custom Voice?
          </h3>
          <p className="text-gray-600 mb-6 max-w-xl mx-auto">
            We can clone your own voice or create a unique custom voice that perfectly matches your brand identity.
          </p>
          <a
            href="#book-call"
            className="inline-block bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-3 rounded-lg font-bold hover:from-purple-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl"
          >
            Book a Call to Learn More
          </a>
        </div>
      </div>
    </section>
  );
}

// Voice Card Component
interface VoiceCardProps {
  voice: Voice;
  isSelected: boolean;
  isPlaying: boolean;
  isLoading: boolean;
  onPlay: () => void;
  onStop: () => void;
}

function VoiceCard({ voice, isSelected, isPlaying, isLoading, onPlay, onStop }: VoiceCardProps) {
  const bgGradient = voice.gender === 'female'
    ? 'from-pink-500 to-rose-500'
    : 'from-blue-500 to-indigo-500';

  const bgGradientLight = voice.gender === 'female'
    ? 'from-pink-50 to-rose-50'
    : 'from-blue-50 to-indigo-50';

  return (
    <div
      className={`relative bg-white rounded-xl border-2 transition-all duration-300 ${
        isSelected
          ? 'border-purple-500 shadow-lg'
          : 'border-gray-200 hover:border-purple-300 hover:shadow-md'
      }`}
    >
      <div className="p-5">
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${bgGradient} flex items-center justify-center flex-shrink-0 shadow-md`}>
            <span className="text-white text-xl font-bold">
              {voice.name.charAt(0)}
            </span>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <h4 className="font-bold text-gray-900 text-lg">{voice.name}</h4>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r ${bgGradientLight} ${
                voice.gender === 'female' ? 'text-pink-700' : 'text-blue-700'
              }`}>
                {voice.age}
              </span>
            </div>
            <p className="text-purple-600 font-semibold text-sm mb-1">
              {voice.description}
            </p>
            <p className="text-gray-500 text-sm line-clamp-2">
              {voice.tone}
            </p>
          </div>
        </div>

        {/* Play Button */}
        <div className="mt-4 flex items-center gap-3">
          <button
            onClick={isPlaying ? onStop : onPlay}
            disabled={isLoading}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-semibold transition-all ${
              isPlaying
                ? 'bg-red-100 text-red-700 hover:bg-red-200'
                : isLoading
                ? 'bg-gray-100 text-gray-400 cursor-wait'
                : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700 shadow-md hover:shadow-lg'
            }`}
          >
            {isLoading ? (
              <>
                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Generating...</span>
              </>
            ) : isPlaying ? (
              <>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                </svg>
                <span>Stop</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
                <span>Play Preview</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Playing Indicator */}
      {isPlaying && (
        <div className="absolute -top-1 -right-1 w-4 h-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-purple-500"></span>
        </div>
      )}
    </div>
  );
}
