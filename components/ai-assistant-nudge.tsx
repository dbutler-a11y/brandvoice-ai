'use client';

import { useState, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { X, Mic, MessageCircle, Sparkles, ArrowRight } from 'lucide-react';

interface NudgeConfig {
  id: string;
  title: string;
  message: string;
  highlightVoice?: boolean;
  highlightChat?: boolean;
  icon: 'sparkles' | 'mic' | 'chat';
  gradient: string;
}

// Context-aware nudge configurations
const nudgeConfigs: Record<string, NudgeConfig> = {
  homepage: {
    id: 'homepage',
    title: 'Meet Your AI Guide',
    message: 'Have questions? Talk to our AI assistant—literally. Click the mic to have a real conversation.',
    highlightVoice: true,
    icon: 'mic',
    gradient: 'from-purple-600 to-indigo-600',
  },
  pricing: {
    id: 'pricing',
    title: 'Need Help Choosing?',
    message: 'Not sure which package fits your needs? Our AI can help you find the perfect match in under 2 minutes.',
    highlightVoice: true,
    highlightChat: true,
    icon: 'sparkles',
    gradient: 'from-amber-500 to-orange-500',
  },
  checkout: {
    id: 'checkout',
    title: 'Questions Before You Buy?',
    message: 'Our AI assistant can answer any questions about your order, add-ons, or the process.',
    highlightChat: true,
    icon: 'chat',
    gradient: 'from-green-500 to-emerald-500',
  },
  howItWorks: {
    id: 'howItWorks',
    title: 'Want a Personalized Walkthrough?',
    message: 'Our voice AI can explain exactly how BrandVoice Studio works for your specific business.',
    highlightVoice: true,
    icon: 'mic',
    gradient: 'from-blue-500 to-cyan-500',
  },
  intake: {
    id: 'intake',
    title: 'Let AI Help You Fill This Out',
    message: 'Prefer talking over typing? Our voice assistant can help complete your intake form conversationally.',
    highlightVoice: true,
    icon: 'mic',
    gradient: 'from-violet-500 to-purple-500',
  },
  default: {
    id: 'default',
    title: 'AI Assistant Available',
    message: 'Questions? Our AI is here to help—chat or talk live anytime.',
    highlightVoice: true,
    highlightChat: true,
    icon: 'sparkles',
    gradient: 'from-purple-600 to-indigo-600',
  },
};

// Get nudge config based on pathname
function getNudgeForPath(pathname: string): NudgeConfig {
  if (pathname === '/' || pathname === '') return nudgeConfigs.homepage;
  if (pathname.includes('/pricing')) return nudgeConfigs.pricing;
  if (pathname.includes('/checkout')) return nudgeConfigs.checkout;
  if (pathname.includes('/how-it-works')) return nudgeConfigs.howItWorks;
  if (pathname.includes('/intake')) return nudgeConfigs.intake;
  return nudgeConfigs.default;
}

export function AIAssistantNudge() {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [, setTriggerType] = useState<'scroll' | 'time' | 'exit' | null>(null);

  const nudgeConfig = getNudgeForPath(pathname);

  // Check if user has seen this nudge recently
  useEffect(() => {
    const dismissedNudges = JSON.parse(localStorage.getItem('dismissedNudges') || '{}');
    const lastDismissed = dismissedNudges[nudgeConfig.id];

    // Don't show if dismissed in the last 24 hours
    if (lastDismissed && Date.now() - lastDismissed < 24 * 60 * 60 * 1000) {
      setIsDismissed(true);
    }

    // Check if user has ever interacted with voice/chat
    const hasUsedAssistant = localStorage.getItem('hasUsedAIAssistant');
    if (hasUsedAssistant) {
      setHasInteracted(true);
    }
  }, [nudgeConfig.id]);

  // Scroll trigger - show after 30% scroll
  useEffect(() => {
    if (isDismissed || hasInteracted || isVisible) return;

    const handleScroll = () => {
      const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
      if (scrollPercent > 30 && !isVisible) {
        setTriggerType('scroll');
        setIsVisible(true);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isDismissed, hasInteracted, isVisible]);

  // Time trigger - show after 45 seconds on page
  useEffect(() => {
    if (isDismissed || hasInteracted || isVisible) return;

    const timer = setTimeout(() => {
      if (!isVisible) {
        setTriggerType('time');
        setIsVisible(true);
      }
    }, 45000);

    return () => clearTimeout(timer);
  }, [isDismissed, hasInteracted, isVisible]);

  // Exit intent trigger (desktop only)
  useEffect(() => {
    if (isDismissed || hasInteracted || isVisible) return;

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !isVisible) {
        setTriggerType('exit');
        setIsVisible(true);
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, [isDismissed, hasInteracted, isVisible]);

  const handleDismiss = useCallback(() => {
    setIsVisible(false);
    setIsDismissed(true);

    // Remember dismissal
    const dismissedNudges = JSON.parse(localStorage.getItem('dismissedNudges') || '{}');
    dismissedNudges[nudgeConfig.id] = Date.now();
    localStorage.setItem('dismissedNudges', JSON.stringify(dismissedNudges));
  }, [nudgeConfig.id]);

  const handleVoiceClick = useCallback(() => {
    localStorage.setItem('hasUsedAIAssistant', 'true');
    setIsVisible(false);

    // Trigger the voice widget to open
    const voiceButton = document.querySelector('[data-voice-widget-trigger]') as HTMLButtonElement;
    if (voiceButton) {
      voiceButton.click();
    }
  }, []);

  const handleChatClick = useCallback(() => {
    localStorage.setItem('hasUsedAIAssistant', 'true');
    setIsVisible(false);

    // Trigger the chat widget to open
    const chatButton = document.querySelector('[data-chat-widget-trigger]') as HTMLButtonElement;
    if (chatButton) {
      chatButton.click();
    }
  }, []);

  if (!isVisible || isDismissed || hasInteracted) return null;

  const IconComponent = {
    sparkles: Sparkles,
    mic: Mic,
    chat: MessageCircle,
  }[nudgeConfig.icon];

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[9998] animate-fade-in"
        onClick={handleDismiss}
      />

      {/* Nudge Card */}
      <div className="fixed bottom-24 right-6 z-[9999] max-w-sm animate-slide-up">
        <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
          {/* Gradient Header */}
          <div className={`bg-gradient-to-r ${nudgeConfig.gradient} p-4 pb-6`}>
            <button
              onClick={handleDismiss}
              className="absolute top-3 right-3 text-white/80 hover:text-white transition-colors"
              aria-label="Dismiss"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
                <IconComponent className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-white font-bold text-lg">{nudgeConfig.title}</h3>
                <p className="text-white/80 text-sm">AI-powered assistance</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-4 -mt-2">
            <div className="bg-gray-50 rounded-xl p-4 mb-4">
              <p className="text-gray-700 text-sm leading-relaxed">
                {nudgeConfig.message}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              {nudgeConfig.highlightVoice && (
                <button
                  onClick={handleVoiceClick}
                  className={`flex-1 flex items-center justify-center gap-2 bg-gradient-to-r ${nudgeConfig.gradient} text-white py-3 px-4 rounded-xl font-semibold text-sm hover:shadow-lg transition-all transform hover:-translate-y-0.5`}
                >
                  <Mic className="w-4 h-4" />
                  Talk to AI
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}

              {nudgeConfig.highlightChat && (
                <button
                  onClick={handleChatClick}
                  className={`flex-1 flex items-center justify-center gap-2 ${
                    nudgeConfig.highlightVoice
                      ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      : `bg-gradient-to-r ${nudgeConfig.gradient} text-white hover:shadow-lg transform hover:-translate-y-0.5`
                  } py-3 px-4 rounded-xl font-semibold text-sm transition-all`}
                >
                  <MessageCircle className="w-4 h-4" />
                  Chat Instead
                </button>
              )}
            </div>

            {/* Social Proof */}
            <p className="text-center text-xs text-gray-400 mt-4">
              Join 500+ brands using our AI assistant
            </p>
          </div>

          {/* Animated Pulse Ring (points to voice widget) */}
          {nudgeConfig.highlightVoice && (
            <div className="absolute -bottom-16 -right-16 w-32 h-32 pointer-events-none">
              <div className="absolute inset-0 rounded-full bg-purple-400/30 animate-ping" />
              <div className="absolute inset-4 rounded-full bg-purple-400/40 animate-pulse" />
            </div>
          )}
        </div>

        {/* Arrow pointing to widgets */}
        <div className="absolute -bottom-3 right-8 w-6 h-6 bg-white transform rotate-45 border-r border-b border-gray-100" />
      </div>

      <style jsx>{`
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-slide-up {
          animation: slide-up 0.4s ease-out;
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </>
  );
}

// Floating indicator that pulses near the voice widget
export function VoiceWidgetHighlight({ show }: { show: boolean }) {
  if (!show) return null;

  return (
    <div className="fixed bottom-24 right-6 z-[9997] pointer-events-none">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full bg-purple-500/30 animate-ping" />
        <div className="absolute inset-2 rounded-full bg-purple-500/40 animate-pulse" />
        <div className="absolute inset-4 rounded-full bg-purple-500/50" />
      </div>
    </div>
  );
}
