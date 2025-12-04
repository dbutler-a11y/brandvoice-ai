'use client';

import { useEffect, useState } from 'react';
import { Mic, MicOff, X } from 'lucide-react';

interface VoiceAgentWidgetProps {
  agentId?: string;
  className?: string;
}

export default function VoiceAgentWidget({
  agentId,
  className = ''
}: VoiceAgentWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const elevenlabsAgentId = agentId || process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID;

  useEffect(() => {
    // Load ElevenLabs Convai widget script
    const script = document.createElement('script');
    script.src = 'https://elevenlabs.io/convai-widget/index.js';
    script.async = true;
    script.onload = () => setIsLoaded(true);
    document.body.appendChild(script);

    return () => {
      const existingScript = document.querySelector(
        'script[src="https://elevenlabs.io/convai-widget/index.js"]'
      );
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, []);

  if (!elevenlabsAgentId) {
    return null; // Don't render if no agent ID configured
  }

  return (
    <>
      {/* Floating Voice Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        data-voice-widget-trigger
        className={`fixed bottom-24 right-6 z-50 w-14 h-14 rounded-full shadow-lg
          flex items-center justify-center transition-all duration-300
          ${isListening
            ? 'bg-red-500 hover:bg-red-600 animate-pulse'
            : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700'
          }
          ${className}`}
        aria-label={isOpen ? 'Close voice assistant' : 'Open voice assistant'}
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : isListening ? (
          <MicOff className="w-6 h-6 text-white" />
        ) : (
          <Mic className="w-6 h-6 text-white" />
        )}
      </button>

      {/* Voice Agent Modal */}
      {isOpen && (
        <div className="fixed bottom-40 right-6 z-50 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Mic className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-sm">Voice Assistant</h3>
                <p className="text-purple-100 text-xs">Ask me anything</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* ElevenLabs Widget Container */}
          <div className="p-4">
            {isLoaded ? (
              <div className="min-h-[300px]">
                {/* @ts-expect-error - ElevenLabs custom element */}
                <elevenlabs-convai agent-id={elevenlabsAgentId}></elevenlabs-convai>
              </div>
            ) : (
              <div className="flex items-center justify-center min-h-[300px]">
                <div className="text-center">
                  <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-500 text-sm">Loading voice assistant...</p>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
            <p className="text-xs text-gray-500 text-center">
              Click the microphone to start talking
            </p>
          </div>
        </div>
      )}

      {/* Pulse animation ring when closed */}
      {!isOpen && (
        <div className="fixed bottom-24 right-6 z-40 w-14 h-14 rounded-full bg-purple-400 animate-ping opacity-20 pointer-events-none"></div>
      )}
    </>
  );
}
