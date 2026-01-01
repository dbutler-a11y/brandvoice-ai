'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

// Brand icons
const ICONS = {
  waveform: '/images/icons/brand/waveform.png',
  microphone: '/images/icons/brand/microphone.png',
  sparkle: '/images/icons/brand/sparkle-stars.png',
  check: '/images/icons/brand/checkmark.png',
};

interface Voice {
  id: string;
  name: string;
  description: string;
  gender: string;
  age: string;
  tone: string;
  previewText: string;
  audioUrl: string;
}

// Voice Card Component
function VoiceCard({
  voice,
  isPlaying,
  isLoading,
  onPlay,
  onStop
}: {
  voice: Voice;
  isPlaying: boolean;
  isLoading: boolean;
  onPlay: () => void;
  onStop: () => void;
}) {
  return (
    <div className="group relative bg-white rounded-2xl p-6 transition-all duration-300 hover:shadow-xl border border-gray-100 hover:border-purple-200">
      {/* Top Row - Avatar & Info */}
      <div className="flex items-start gap-4 mb-4">
        {/* Initial Circle */}
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-100 to-indigo-100 flex items-center justify-center flex-shrink-0 group-hover:from-purple-200 group-hover:to-indigo-200 transition-colors">
          <span className="text-lg font-bold text-purple-600">
            {voice.name.charAt(0)}
          </span>
        </div>

        {/* Name & Meta */}
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-gray-900 mb-1">
            {voice.name}
          </h4>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>{voice.age}</span>
            <span className="w-1 h-1 bg-gray-300 rounded-full" />
            <span className="text-purple-600 font-medium">{voice.description}</span>
          </div>
        </div>
      </div>

      {/* Tone/Style Description */}
      <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-2">
        {voice.tone}
      </p>

      {/* Play Button */}
      <button
        onClick={isPlaying ? onStop : onPlay}
        disabled={isLoading}
        className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
          isPlaying
            ? 'bg-purple-600 text-white'
            : isLoading
            ? 'bg-gray-100 text-gray-400 cursor-wait'
            : 'bg-gray-50 text-gray-700 hover:bg-purple-50 hover:text-purple-700'
        }`}
      >
        <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
          isPlaying ? 'bg-white/20' : 'bg-purple-100'
        }`}>
          {isLoading ? (
            <svg className="w-3.5 h-3.5 animate-spin text-gray-400" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          ) : isPlaying ? (
            <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
            </svg>
          ) : (
            <svg className="w-3.5 h-3.5 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </div>
        <span>{isLoading ? 'Loading...' : isPlaying ? 'Playing...' : 'Play Preview'}</span>
      </button>

      {/* Playing Indicator */}
      {isPlaying && (
        <div className="absolute -top-1 -right-1 w-3 h-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-purple-500"></span>
        </div>
      )}
    </div>
  );
}

export default function VoicePreviewSection() {
  const [voices, setVoices] = useState<Voice[]>([]);
  const [activeGender, setActiveGender] = useState<'female' | 'male'>('female');
  const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);
  const [loadingVoiceId, setLoadingVoiceId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Fetch available voices on mount
  useEffect(() => {
    const fetchVoices = async () => {
      try {
        const response = await fetch('/api/voice-preview');
        const data = await response.json();
        setVoices(data.voices || []);
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

    setLoadingVoiceId(voice.id);

    try {
      audioRef.current = new Audio(voice.audioUrl);
      audioRef.current.onended = () => {
        setPlayingVoiceId(null);
      };
      audioRef.current.onerror = () => {
        setPlayingVoiceId(null);
        setLoadingVoiceId(null);
        setError('Failed to play audio');
      };
      audioRef.current.oncanplaythrough = () => {
        setLoadingVoiceId(null);
      };

      await audioRef.current.play();
      setPlayingVoiceId(voice.id);
      setLoadingVoiceId(null);
    } catch (err) {
      console.error('Voice preview error:', err);
      setError('Unable to play voice preview');
      setLoadingVoiceId(null);
    }
  };

  const stopPlayback = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setPlayingVoiceId(null);
  };

  // Filter and count voices
  const filteredVoices = voices.filter(v => v.gender === activeGender);
  const femaleCount = voices.filter(v => v.gender === 'female').length;
  const maleCount = voices.filter(v => v.gender === 'male').length;

  return (
    <section className="py-24 bg-gray-50/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-50 text-purple-700 text-sm font-medium mb-6">
            <Image src={ICONS.waveform} alt="" width={16} height={16} className="w-4 h-4" />
            Voice Library
          </div>

          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Preview AI Voices
          </h2>

          <p className="text-lg text-gray-500 max-w-xl mx-auto">
            Listen to sample voices and find the perfect match for your brand
          </p>
        </div>

        {/* Gender Tabs */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex p-1.5 bg-white rounded-full shadow-sm border border-gray-100">
            <button
              onClick={() => setActiveGender('female')}
              className={`px-6 py-2.5 rounded-full font-medium text-sm transition-all duration-200 ${
                activeGender === 'female'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Female Voices
              {femaleCount > 0 && (
                <span className={`ml-2 ${activeGender === 'female' ? 'text-purple-200' : 'text-gray-400'}`}>
                  {femaleCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveGender('male')}
              className={`px-6 py-2.5 rounded-full font-medium text-sm transition-all duration-200 ${
                activeGender === 'male'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Male Voices
              {maleCount > 0 && (
                <span className={`ml-2 ${activeGender === 'male' ? 'text-purple-200' : 'text-gray-400'}`}>
                  {maleCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Voice Grid */}
        {filteredVoices.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
            {filteredVoices.map((voice) => (
              <VoiceCard
                key={voice.id}
                voice={voice}
                isPlaying={playingVoiceId === voice.id}
                isLoading={loadingVoiceId === voice.id}
                onPlay={() => playVoicePreview(voice)}
                onStop={stopPlayback}
              />
            ))}
          </div>
        ) : (
          <div className="flex justify-center py-16 mb-12">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                <Image src={ICONS.microphone} alt="" width={24} height={24} className="w-6 h-6 opacity-40" />
              </div>
              <p className="text-gray-500">Loading voices...</p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="text-center text-red-600 text-sm mb-8">
            {error}
          </div>
        )}

        {/* Explore More Link */}
        <div className="text-center mb-16">
          <Link
            href="/voice-preview"
            className="inline-flex items-center gap-2 text-purple-600 font-medium hover:text-purple-700 transition-colors"
          >
            Explore all voices
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>

        {/* Voice Cloning CTA */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 sm:p-10">
          <div className="flex flex-col lg:flex-row items-center gap-8">
            {/* Left - Icon */}
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500/20 to-indigo-500/20 flex items-center justify-center flex-shrink-0">
              <Image src={ICONS.microphone} alt="" width={32} height={32} className="w-8 h-8" />
            </div>

            {/* Center - Content */}
            <div className="flex-1 text-center lg:text-left">
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
                Want Your Own Voice?
              </h3>
              <p className="text-gray-400 max-w-lg">
                Clone your voice or create a custom voice that matches your brand perfectly.
                Use it across all your videos for consistent brand recognition.
              </p>
            </div>

            {/* Right - CTA */}
            <div className="flex-shrink-0">
              <a
                href="#book-call"
                className="inline-flex items-center gap-2 bg-white text-gray-900 px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
              >
                <Image src={ICONS.sparkle} alt="" width={16} height={16} className="w-4 h-4" />
                Learn More
              </a>
            </div>
          </div>

          {/* Features */}
          <div className="mt-8 pt-8 border-t border-gray-700/50 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex items-center gap-3">
              <Image src={ICONS.check} alt="" width={16} height={16} className="w-4 h-4" />
              <span className="text-gray-300 text-sm">30-second voice sample</span>
            </div>
            <div className="flex items-center gap-3">
              <Image src={ICONS.check} alt="" width={16} height={16} className="w-4 h-4" />
              <span className="text-gray-300 text-sm">85-95% voice likeness</span>
            </div>
            <div className="flex items-center gap-3">
              <Image src={ICONS.check} alt="" width={16} height={16} className="w-4 h-4" />
              <span className="text-gray-300 text-sm">Unlimited video usage</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
