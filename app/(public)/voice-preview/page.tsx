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
  megaphone: '/images/icons/brand/megaphone-sparkles.png',
};

interface Voice {
  id: string;
  name: string;
  displayName: string;
  gender: 'Male' | 'Female';
  ageRange: string;
  style: string;
  description: string;
  industries: string[];
  audioUrl?: string;
}

const VoiceCard = ({
  voice,
  isPlaying,
  onPlay
}: {
  voice: Voice;
  isPlaying: boolean;
  onPlay: (voiceId: string) => void;
}) => {
  return (
    <div className="group relative bg-white rounded-2xl p-6 transition-all duration-300 hover:shadow-xl border border-gray-100 hover:border-purple-200">
      {/* Top Row - Avatar & Info */}
      <div className="flex items-start gap-4 mb-5">
        {/* Initial Circle */}
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-100 to-indigo-100 flex items-center justify-center flex-shrink-0 group-hover:from-purple-200 group-hover:to-indigo-200 transition-colors">
          <span className="text-xl font-bold text-purple-600">
            {voice.displayName.charAt(0)}
          </span>
        </div>

        {/* Name & Meta */}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {voice.displayName}
          </h3>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>{voice.ageRange}</span>
            <span className="w-1 h-1 bg-gray-300 rounded-full" />
            <span className="text-purple-600 font-medium">{voice.style}</span>
          </div>
        </div>
      </div>

      {/* Description */}
      <p className="text-gray-600 text-sm leading-relaxed mb-5">
        {voice.description}
      </p>

      {/* Play Button */}
      <button
        onClick={() => onPlay(voice.id)}
        className={`w-full flex items-center justify-center gap-3 py-3.5 rounded-xl font-medium transition-all duration-200 ${
          isPlaying
            ? 'bg-purple-600 text-white'
            : 'bg-gray-50 text-gray-700 hover:bg-purple-50 hover:text-purple-700'
        }`}
      >
        <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
          isPlaying ? 'bg-white/20' : 'bg-purple-100'
        }`}>
          {isPlaying ? (
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
            </svg>
          ) : (
            <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </div>
        <span>{isPlaying ? 'Playing...' : 'Play Preview'}</span>
      </button>
    </div>
  );
};

export default function VoicePreviewPage() {
  const [voices, setVoices] = useState<Voice[]>([]);
  const [activeGender, setActiveGender] = useState<'Female' | 'Male'>('Female');
  const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    fetchVoices();
  }, []);

  const fetchVoices = async () => {
    try {
      const response = await fetch('/api/voices');
      const data = await response.json();
      // Transform API data to match our interface
      const transformedVoices = data.voices.map((v: {
        id: string;
        name: string;
        displayName: string;
        gender: 'Male' | 'Female';
        characteristics: string[];
        industries: string[];
        sampleText: string;
        audioUrl?: string;
      }) => ({
        id: v.id,
        name: v.name,
        displayName: v.displayName,
        gender: v.gender,
        ageRange: getAgeRange(v.displayName),
        style: v.characteristics[0] || 'Professional',
        description: getDescription(v.displayName, v.characteristics, v.industries),
        industries: v.industries,
        audioUrl: v.audioUrl,
      }));
      setVoices(transformedVoices);
    } catch (error) {
      console.error('Failed to fetch voices:', error);
      // Use fallback data
      setVoices(getFallbackVoices());
    } finally {
      setLoading(false);
    }
  };

  const handlePlayVoice = (voiceId: string) => {
    const voice = voices.find(v => v.id === voiceId);
    if (playingVoiceId === voiceId) {
      setPlayingVoiceId(null);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    } else {
      if (voice?.audioUrl) {
        if (audioRef.current) {
          audioRef.current.src = voice.audioUrl;
          audioRef.current.play();
          setPlayingVoiceId(voiceId);
        }
      } else {
        // Visual feedback for demo
        setPlayingVoiceId(voiceId);
        setTimeout(() => setPlayingVoiceId(null), 2000);
      }
    }
  };

  const filteredVoices = voices.filter(v => v.gender === activeGender);
  const femaleCount = voices.filter(v => v.gender === 'Female').length;
  const maleCount = voices.filter(v => v.gender === 'Male').length;

  return (
    <div className="min-h-screen bg-white">
      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        onEnded={() => setPlayingVoiceId(null)}
        className="hidden"
      />

      {/* Hero Section - Minimal */}
      <section className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-50 text-purple-700 text-sm font-medium mb-6">
            <Image src={ICONS.waveform} alt="" width={16} height={16} className="w-4 h-4" />
            Voice Library
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Preview AI Voices
          </h1>

          <p className="text-xl text-gray-500 max-w-2xl mx-auto">
            Listen to sample voices and find the perfect match for your brand
          </p>
        </div>
      </section>

      {/* Gender Tabs */}
      <section className="pb-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center">
            <div className="inline-flex p-1.5 bg-gray-100 rounded-full">
              <button
                onClick={() => setActiveGender('Female')}
                className={`px-8 py-3 rounded-full font-medium text-sm transition-all duration-200 ${
                  activeGender === 'Female'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Female Voices
                <span className="ml-2 text-gray-400">{femaleCount}</span>
              </button>
              <button
                onClick={() => setActiveGender('Male')}
                className={`px-8 py-3 rounded-full font-medium text-sm transition-all duration-200 ${
                  activeGender === 'Male'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Male Voices
                <span className="ml-2 text-gray-400">{maleCount}</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Voice Grid */}
      <section className="pb-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
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
            <div className="text-center py-20">
              <p className="text-gray-500">No voices found.</p>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Voice Cloning Options
            </h2>
            <p className="text-xl text-gray-500">
              Choose from our library or clone your own voice
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl p-8 border border-gray-100">
              <div className="w-14 h-14 rounded-2xl bg-purple-50 flex items-center justify-center mb-6">
                <Image src={ICONS.waveform} alt="" width={28} height={28} className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Pre-Built Voices
              </h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                Select from our curated library of professional voices. Each voice is optimized for clarity, engagement, and brand consistency across all your videos.
              </p>
              <ul className="space-y-2">
                {['16+ voice options', 'Instant availability', 'No extra cost'].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-gray-600">
                    <Image src={ICONS.check} alt="" width={16} height={16} className="w-4 h-4" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-8 border border-gray-100">
              <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center mb-6">
                <Image src={ICONS.microphone} alt="" width={28} height={28} className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Custom Voice Clone
              </h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                Want your AI spokesperson to sound exactly like you? We can clone your voice with just 2-5 minutes of audio for authentic brand representation.
              </p>
              <ul className="space-y-2">
                {['85-95% voice accuracy', 'Your authentic sound', 'Add-on service'].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-gray-600">
                    <Image src={ICONS.check} alt="" width={16} height={16} className="w-4 h-4" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-16 h-16 mx-auto mb-8 rounded-2xl bg-white/10 flex items-center justify-center">
            <Image src={ICONS.megaphone} alt="" width={32} height={32} className="w-8 h-8" />
          </div>

          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to Choose Your Voice?
          </h2>

          <p className="text-xl text-gray-400 mb-10 max-w-xl mx-auto">
            Book a discovery call and we'll help you select the perfect voice for your brand.
          </p>

          <Link
            href="/#book-call"
            className="inline-flex items-center gap-2 bg-white text-gray-900 px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition-colors"
          >
            Book a Call
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>

          <p className="mt-8 text-gray-500">
            Or explore our{' '}
            <Link href="/pricing" className="text-purple-400 hover:text-purple-300 underline underline-offset-2">
              pricing options
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}

// Helper functions
function getAgeRange(name: string): string {
  const ageMap: Record<string, string> = {
    'Sarah': '30s', 'Rachel': '30s', 'Charlotte': '40s', 'Lily': '20s',
    'Olivia': '30s', 'Sophia': '30s', 'Jessica': '30s', 'Emily': '20s',
    'Charlie': '20s', 'Liam': '40s', 'Michael': '40s', 'David': '40s',
    'James': '30s', 'Alex': '20s', 'Marcus': '40s', 'Chris': '30s',
  };
  return ageMap[name] || '30s';
}

function getDescription(name: string, characteristics: string[], industries: string[]): string {
  const descMap: Record<string, string> = {
    'Sarah': 'Friendly and approachable, perfect for coaching and wellness brands',
    'Rachel': 'Refined and elegant, ideal for luxury and high-end brands',
    'Charlotte': 'Sophisticated and polished, great for professional services',
    'Lily': 'Casual and relatable, perfect for social media content',
    'Olivia': 'Caring and compassionate, ideal for healthcare and non-profits',
    'Sophia': 'Natural and authentic, perfect for sustainability and wellness',
    'Jessica': 'Friendly and conversational, ideal for hospitality and real estate',
    'Emily': 'Energetic and upbeat, great for fitness, retail, and events',
    'Charlie': 'Dynamic and energetic, great for fitness and tech brands',
    'Liam': 'Deep and reassuring, perfect for finance and healthcare',
    'Michael': 'Clear and authoritative, perfect for professional services and B2B',
    'David': 'Calm and reassuring, ideal for healthcare and education',
    'James': 'Motivating and inspiring, great for coaching and personal development',
    'Alex': 'Modern and tech-savvy, ideal for startups and innovation',
    'Marcus': 'Powerful and commanding, great for automotive and sports',
    'Chris': 'Versatile and adaptable, perfect for tech and general business',
  };
  return descMap[name] || `${characteristics.join(' and ')}, great for ${industries.slice(0, 2).join(' and ')}`;
}

function getFallbackVoices(): Voice[] {
  return [
    { id: '1', name: 'sarah', displayName: 'Sarah', gender: 'Female', ageRange: '30s', style: 'Warm & Professional', description: 'Friendly and approachable, perfect for coaching and wellness brands', industries: ['Coaching', 'Wellness'] },
    { id: '2', name: 'rachel', displayName: 'Rachel', gender: 'Female', ageRange: '30s', style: 'Sophisticated & Elegant', description: 'Refined and elegant, ideal for luxury and high-end brands', industries: ['Luxury', 'Fashion'] },
    { id: '3', name: 'charlotte', displayName: 'Charlotte', gender: 'Female', ageRange: '40s', style: 'Sophisticated & Elegant', description: 'Sophisticated and polished, great for professional services', industries: ['Professional', 'Finance'] },
    { id: '4', name: 'lily', displayName: 'Lily', gender: 'Female', ageRange: '20s', style: 'Warm & Conversational', description: 'Casual and relatable, perfect for social media content', industries: ['Social Media', 'Lifestyle'] },
    { id: '5', name: 'olivia', displayName: 'Olivia', gender: 'Female', ageRange: '30s', style: 'Caring & Compassionate', description: 'Caring and compassionate, ideal for healthcare and non-profits', industries: ['Healthcare', 'Non-profit'] },
    { id: '6', name: 'sophia', displayName: 'Sophia', gender: 'Female', ageRange: '30s', style: 'Natural & Authentic', description: 'Natural and authentic, perfect for sustainability and wellness', industries: ['Sustainability', 'Wellness'] },
    { id: '7', name: 'jessica', displayName: 'Jessica', gender: 'Female', ageRange: '30s', style: 'Friendly & Conversational', description: 'Friendly and conversational, ideal for hospitality and real estate', industries: ['Hospitality', 'Real Estate'] },
    { id: '8', name: 'emily', displayName: 'Emily', gender: 'Female', ageRange: '20s', style: 'Energetic & Upbeat', description: 'Energetic and upbeat, great for fitness, retail, and events', industries: ['Fitness', 'Retail'] },
    { id: '9', name: 'charlie', displayName: 'Charlie', gender: 'Male', ageRange: '20s', style: 'Energetic & Youthful', description: 'Dynamic and energetic, great for fitness and tech brands', industries: ['Fitness', 'Tech'] },
    { id: '10', name: 'liam', displayName: 'Liam', gender: 'Male', ageRange: '40s', style: 'Deep & Trustworthy', description: 'Deep and reassuring, perfect for finance and healthcare', industries: ['Finance', 'Healthcare'] },
    { id: '11', name: 'michael', displayName: 'Michael', gender: 'Male', ageRange: '40s', style: 'Authoritative & Clear', description: 'Clear and authoritative, perfect for professional services and B2B', industries: ['B2B', 'Professional'] },
    { id: '12', name: 'david', displayName: 'David', gender: 'Male', ageRange: '40s', style: 'Calm & Reassuring', description: 'Calm and reassuring, ideal for healthcare and education', industries: ['Healthcare', 'Education'] },
    { id: '13', name: 'james', displayName: 'James', gender: 'Male', ageRange: '30s', style: 'Motivating & Inspiring', description: 'Motivating and inspiring, great for coaching and personal development', industries: ['Coaching', 'Personal Development'] },
    { id: '14', name: 'alex', displayName: 'Alex', gender: 'Male', ageRange: '20s', style: 'Modern & Tech-Savvy', description: 'Modern and tech-savvy, ideal for startups and innovation', industries: ['Startups', 'Tech'] },
    { id: '15', name: 'marcus', displayName: 'Marcus', gender: 'Male', ageRange: '40s', style: 'Powerful & Commanding', description: 'Powerful and commanding, great for automotive and sports', industries: ['Automotive', 'Sports'] },
    { id: '16', name: 'chris', displayName: 'Chris', gender: 'Male', ageRange: '30s', style: 'Versatile & Adaptable', description: 'Versatile and adaptable, perfect for tech and general business', industries: ['Tech', 'Business'] },
  ];
}
