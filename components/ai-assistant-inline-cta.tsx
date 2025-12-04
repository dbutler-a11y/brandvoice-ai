'use client';

import { useState } from 'react';
import { Mic, MessageCircle, X, Sparkles } from 'lucide-react';

interface AIAssistantInlineCTAProps {
  variant?: 'default' | 'pricing' | 'intake' | 'minimal';
  className?: string;
}

export function AIAssistantInlineCTA({ variant = 'default', className = '' }: AIAssistantInlineCTAProps) {
  const [isDismissed, setIsDismissed] = useState(false);

  const handleVoiceClick = () => {
    localStorage.setItem('hasUsedAIAssistant', 'true');
    const voiceButton = document.querySelector('[data-voice-widget-trigger]') as HTMLButtonElement;
    if (voiceButton) {
      voiceButton.click();
    }
  };

  const handleChatClick = () => {
    localStorage.setItem('hasUsedAIAssistant', 'true');
    const chatButton = document.querySelector('[data-chat-widget-trigger]') as HTMLButtonElement;
    if (chatButton) {
      chatButton.click();
    }
  };

  if (isDismissed) return null;

  // Minimal version - just a subtle text link
  if (variant === 'minimal') {
    return (
      <div className={`flex items-center justify-center gap-2 text-sm ${className}`}>
        <Sparkles className="w-4 h-4 text-purple-500" />
        <span className="text-gray-600">Need help deciding?</span>
        <button
          onClick={handleVoiceClick}
          className="text-purple-600 hover:text-purple-700 font-medium underline underline-offset-2"
        >
          Talk to our AI
        </button>
        <span className="text-gray-400">or</span>
        <button
          onClick={handleChatClick}
          className="text-purple-600 hover:text-purple-700 font-medium underline underline-offset-2"
        >
          chat now
        </button>
      </div>
    );
  }

  // Pricing variant - focused on package selection help
  if (variant === 'pricing') {
    return (
      <div className={`relative bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-2xl p-6 ${className}`}>
        <button
          onClick={() => setIsDismissed(true)}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="flex-shrink-0">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
          </div>

          <div className="flex-1 text-center md:text-left">
            <h3 className="text-lg font-bold text-gray-900 mb-1">
              Not sure which package is right for you?
            </h3>
            <p className="text-gray-600 text-sm">
              Our AI assistant can analyze your needs and recommend the perfect package in under 2 minutes.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleVoiceClick}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-5 py-3 rounded-xl font-semibold text-sm hover:shadow-lg transition-all transform hover:-translate-y-0.5"
            >
              <Mic className="w-4 h-4" />
              Talk to AI
            </button>
            <button
              onClick={handleChatClick}
              className="flex items-center justify-center gap-2 bg-white text-gray-700 px-5 py-3 rounded-xl font-semibold text-sm border border-gray-200 hover:bg-gray-50 transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              Chat Instead
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Intake variant - help with form completion
  if (variant === 'intake') {
    return (
      <div className={`relative bg-gradient-to-r from-violet-50 to-purple-50 border border-violet-200 rounded-2xl p-6 ${className}`}>
        <button
          onClick={() => setIsDismissed(true)}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-4">
          <div className="flex-shrink-0 hidden sm:block">
            <div className="w-12 h-12 bg-gradient-to-br from-violet-600 to-purple-600 rounded-xl flex items-center justify-center">
              <Mic className="w-6 h-6 text-white" />
            </div>
          </div>

          <div className="flex-1">
            <h3 className="text-base font-bold text-gray-900 mb-1">
              Prefer talking over typing?
            </h3>
            <p className="text-gray-600 text-sm">
              Let our voice AI help you complete this form conversationally.
            </p>
          </div>

          <button
            onClick={handleVoiceClick}
            className="flex-shrink-0 flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-purple-600 text-white px-4 py-2.5 rounded-xl font-semibold text-sm hover:shadow-lg transition-all"
          >
            <Mic className="w-4 h-4" />
            <span className="hidden sm:inline">Start Voice</span>
          </button>
        </div>
      </div>
    );
  }

  // Default variant
  return (
    <div className={`relative bg-gradient-to-r from-gray-50 to-purple-50 border border-gray-200 rounded-2xl p-6 ${className}`}>
      <button
        onClick={() => setIsDismissed(true)}
        className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
      >
        <X className="w-4 h-4" />
      </button>

      <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
        </div>

        <div className="flex-1">
          <h3 className="text-base font-bold text-gray-900 mb-1">
            Have questions? Our AI is here to help
          </h3>
          <p className="text-gray-600 text-sm">
            Get instant answers by voice or chat—available 24/7.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleVoiceClick}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2.5 rounded-xl font-semibold text-sm hover:shadow-lg transition-all"
          >
            <Mic className="w-4 h-4" />
            Voice
          </button>
          <button
            onClick={handleChatClick}
            className="flex items-center justify-center gap-2 bg-white text-gray-700 px-4 py-2.5 rounded-xl font-semibold text-sm border border-gray-200 hover:bg-gray-50 transition-all"
          >
            <MessageCircle className="w-4 h-4" />
            Chat
          </button>
        </div>
      </div>
    </div>
  );
}
