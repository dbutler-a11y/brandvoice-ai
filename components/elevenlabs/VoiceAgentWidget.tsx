'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { X, Home, MessageCircle, HelpCircle, Search, Send, ChevronDown } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface VoiceAgentWidgetProps {
  agentId?: string;
  className?: string;
}

type TabType = 'home' | 'messages' | 'help';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export default function VoiceAgentWidget({
  agentId,
  className = ''
}: VoiceAgentWidgetProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi! I'm Samira, your AI assistant. How can I help you today?",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Engagement suppression state
  const [hasInteracted, setHasInteracted] = useState(false);
  const [showNudge, setShowNudge] = useState(false);

  const elevenlabsAgentId = agentId || process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID;

  // Hide ElevenLabs native widget when our panel is expanded
  useEffect(() => {
    if (isExpanded) {
      document.body.classList.add('hide-elevenlabs-widget');
    } else {
      document.body.classList.remove('hide-elevenlabs-widget');
    }
    return () => {
      document.body.classList.remove('hide-elevenlabs-widget');
    };
  }, [isExpanded]);

  // Mark user as having interacted (suppresses future nudges)
  const handleUserInteraction = useCallback(() => {
    setHasInteracted(true);
    setShowNudge(false);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('chatWidgetInteracted', 'true');
    }
  }, []);

  // Handle expanding the widget
  const handleExpand = useCallback(() => {
    handleUserInteraction();
    setIsExpanded(true);
  }, [handleUserInteraction]);

  // Handle closing the widget
  const handleClose = useCallback(() => {
    setIsExpanded(false);
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const interacted = sessionStorage.getItem('chatWidgetInteracted');
      if (interacted === 'true') {
        setHasInteracted(true);
      }
    }

    // Load ElevenLabs Convai widget script (updated URL)
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/@elevenlabs/convai-widget-embed';
    script.async = true;
    script.type = 'text/javascript';
    script.onload = () => {
      console.log('ElevenLabs widget script loaded successfully');
      setIsLoaded(true);
    };
    script.onerror = () => {
      console.error('Failed to load ElevenLabs widget script');
      setIsLoaded(false);
    };
    document.body.appendChild(script);

    return () => {
      const existingScript = document.querySelector(
        'script[src="https://unpkg.com/@elevenlabs/convai-widget-embed"]'
      );
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, []);

  // Auto-nudge effect - only shows if user hasn't interacted
  useEffect(() => {
    if (hasInteracted || isExpanded) return;

    const nudgeTimer = setTimeout(() => {
      if (!hasInteracted && !isExpanded) {
        setShowNudge(true);
      }
    }, 5000);

    const hideTimer = setTimeout(() => {
      setShowNudge(false);
    }, 13000);

    return () => {
      clearTimeout(nudgeTimer);
      clearTimeout(hideTimer);
    };
  }, [hasInteracted, isExpanded]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Track conversation ID for ElevenLabs context
  const [conversationId, setConversationId] = useState<string | null>(null);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const messageText = inputMessage;
    setInputMessage('');
    setIsTyping(true);

    try {
      // Call the Samira chat API (uses ElevenLabs with same knowledge base as voice)
      const response = await fetch('/api/chat/samira', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: messageText,
          conversationId: conversationId,
        }),
      });

      const data = await response.json();

      if (data.conversationId) {
        setConversationId(data.conversationId);
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.response || data.error || "I'm sorry, I couldn't process that request. Please try again.",
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm having trouble connecting right now. Please try again or use the voice feature above!",
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const helpTopics = [
    { title: 'Getting Started', description: 'Learn how to create your first AI spokesperson' },
    { title: 'Pricing & Packages', description: 'View our available plans and features' },
    { title: 'Turnaround Time', description: 'How long does it take to receive content?' },
    { title: 'Customization Options', description: 'Customize your AI avatar appearance' },
    { title: 'Technical Requirements', description: 'What you need to get started' },
    { title: 'Contact Support', description: 'Get help from our team' },
  ];

  const filteredTopics = helpTopics.filter(topic =>
    topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    topic.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!elevenlabsAgentId) {
    return null;
  }

  return (
    <>
      {/* Collapsed State - Clean mic button that triggers ElevenLabs voice */}
      {!isExpanded && (
        <div className={`fixed bottom-6 right-4 sm:right-6 z-50 flex flex-col items-end gap-3 ${className}`}>
          {/* Nudge popup */}
          {showNudge && !hasInteracted && (
            <div className="animate-fadeIn">
              <div className="bg-white rounded-lg shadow-lg p-3 w-48 border border-gray-200 relative">
                <button
                  onClick={() => setShowNudge(false)}
                  className="absolute -top-2 -right-2 w-5 h-5 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors"
                >
                  <X className="w-3 h-3 text-gray-600" />
                </button>
                <p className="text-sm text-gray-700 font-medium">Need help?</p>
                <p className="text-xs text-gray-500 mt-1">Click mic to talk with Samira</p>
              </div>
              {/* Arrow pointing down */}
              <div className="absolute right-6 -bottom-2">
                <div className="w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-white"></div>
              </div>
            </div>
          )}

          {/* Main widget - Avatar only */}
          <button
            onClick={handleExpand}
            className="relative w-14 h-14 rounded-full overflow-hidden shadow-lg border-2 border-white hover:scale-105 transition-transform duration-300"
          >
            <Image
              src="/images/samira-avatar.jpg"
              alt="Samira - AI Assistant"
              fill
              className="object-cover object-top"
              sizes="56px"
            />
            <div className="absolute bottom-0.5 right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
          </button>
        </div>
      )}

      {/* Expanded State - Full Widget - Redesigned Layout */}
      {isExpanded && (
        <div className="fixed bottom-6 right-4 sm:right-8 z-50 w-full max-w-[calc(100vw-2rem)] sm:w-[380px] bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200 animate-slideUp">
          {/* Header Section with Avatar and Mic - Compact */}
          <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 px-4 py-5">
            {/* Close & Minimize buttons */}
            <button
              onClick={handleClose}
              aria-label="Minimize widget"
              className="absolute top-2 left-2 w-11 h-11 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors"
            >
              <ChevronDown className="w-5 h-5 text-white" />
            </button>
            <button
              onClick={handleClose}
              aria-label="Close widget"
              className="absolute top-2 right-2 w-11 h-11 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>

            {/* Avatar, Info, and Mic in a row */}
            <div className="flex items-center gap-4 mt-6">
              {/* Avatar */}
              <div className="w-16 h-16 rounded-lg overflow-hidden border-2 border-white/30 flex-shrink-0">
                <Image
                  src="/images/samira-avatar.jpg"
                  alt="Samira - AI Assistant"
                  width={64}
                  height={64}
                  className="object-cover object-top w-full h-full"
                />
              </div>

              {/* Info Text */}
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold text-lg">Samira</p>
                <p className="text-gray-400 text-sm">AI Customer Support</p>
                <p className="text-indigo-400 text-xs mt-1">
                  {isLoaded ? 'Click mic to talk or use Messages' : 'Use Messages tab to chat'}
                </p>
              </div>

              {/* ElevenLabs Mic Widget - Positioned here - Always visible */}
              {isLoaded && (
                <div className="elevenlabs-widget-container flex-shrink-0 relative w-14 h-14">
                  {/* @ts-expect-error - ElevenLabs custom element */}
                  <elevenlabs-convai agent-id={elevenlabsAgentId}></elevenlabs-convai>
                </div>
              )}
              {!isLoaded && (
                <div className="flex-shrink-0 w-14 h-14 flex items-center justify-center">
                  <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center animate-pulse">
                    <svg className="w-5 h-5 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                    </svg>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('home')}
              className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors
                ${activeTab === 'home'
                  ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
            >
              <Home className="w-4 h-4" />
              Home
            </button>
            <button
              onClick={() => setActiveTab('messages')}
              className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors
                ${activeTab === 'messages'
                  ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
            >
              <MessageCircle className="w-4 h-4" />
              Messages
            </button>
            <button
              onClick={() => setActiveTab('help')}
              className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors
                ${activeTab === 'help'
                  ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
            >
              <HelpCircle className="w-4 h-4" />
              Help
            </button>
          </div>

          {/* Tab Content */}
          <div className="h-[300px] overflow-hidden">
            {/* Home Tab - Quick Actions with Working Links */}
            {activeTab === 'home' && (
              <div className="p-4 h-full overflow-y-auto">
                <h3 className="font-semibold text-gray-900 mb-3">Quick Actions</h3>
                <div className="space-y-2">
                  <Link
                    href="#book-call"
                    onClick={handleClose}
                    className="block w-full p-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition-all text-sm text-center"
                  >
                    Book a Strategy Call
                  </Link>
                  <Link
                    href="#pricing"
                    onClick={handleClose}
                    className="block w-full p-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors text-sm text-center"
                  >
                    View Pricing
                  </Link>
                  <Link
                    href="/portfolio"
                    onClick={handleClose}
                    className="block w-full p-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors text-sm text-center"
                  >
                    See Sample Videos
                  </Link>
                </div>

                {/* Divider */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <h4 className="font-medium text-gray-700 text-sm mb-2">More Options</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      href="/how-it-works"
                      onClick={handleClose}
                      className="p-3 bg-gray-50 rounded-lg text-center hover:bg-gray-100 transition-colors"
                    >
                      <span className="block text-lg mb-1">🎬</span>
                      <span className="text-xs text-gray-700 font-medium">How It Works</span>
                    </Link>
                    <Link
                      href="/faq"
                      onClick={handleClose}
                      className="p-3 bg-gray-50 rounded-lg text-center hover:bg-gray-100 transition-colors"
                    >
                      <span className="block text-lg mb-1">❓</span>
                      <span className="text-xs text-gray-700 font-medium">FAQ</span>
                    </Link>
                    <Link
                      href="/voice-preview"
                      onClick={handleClose}
                      className="p-3 bg-gray-50 rounded-lg text-center hover:bg-gray-100 transition-colors"
                    >
                      <span className="block text-lg mb-1">🎤</span>
                      <span className="text-xs text-gray-700 font-medium">Voice Samples</span>
                    </Link>
                    <button
                      onClick={() => setActiveTab('messages')}
                      className="p-3 bg-gray-50 rounded-lg text-center hover:bg-gray-100 transition-colors"
                    >
                      <span className="block text-lg mb-1">💬</span>
                      <span className="text-xs text-gray-700 font-medium">Chat with Samira</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Messages Tab */}
            {activeTab === 'messages' && (
              <div className="flex flex-col h-full">
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                          message.isUser
                            ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        <p className="text-sm">{message.text}</p>
                        <p className={`text-xs mt-1 ${message.isUser ? 'text-indigo-200' : 'text-gray-400'}`}>
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  ))}
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-gray-100 rounded-2xl px-4 py-3">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                <div className="p-3 border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Type a message..."
                      className="flex-1 px-4 py-2 bg-gray-100 rounded-full text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={!inputMessage.trim()}
                      className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white flex items-center justify-center hover:from-indigo-700 hover:to-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Help Tab */}
            {activeTab === 'help' && (
              <div className="h-full flex flex-col">
                <div className="p-4 border-b border-gray-100">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search for help..."
                      className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4">
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                    Help Topics
                  </h4>
                  <div className="space-y-2">
                    {filteredTopics.map((topic, index) => (
                      <button
                        key={index}
                        onClick={async () => {
                          setActiveTab('messages');
                          const helpMessage: Message = {
                            id: Date.now().toString(),
                            text: `Tell me about: ${topic.title}`,
                            isUser: true,
                            timestamp: new Date()
                          };
                          setMessages(prev => [...prev, helpMessage]);
                          setIsTyping(true);

                          try {
                            const response = await fetch('/api/chat/samira', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({
                                message: `Tell me about ${topic.title}. ${topic.description}`,
                                conversationId: conversationId,
                              }),
                            });
                            const data = await response.json();
                            if (data.conversationId) setConversationId(data.conversationId);

                            const aiResponse: Message = {
                              id: (Date.now() + 1).toString(),
                              text: data.response || `I'd be happy to help with ${topic.title.toLowerCase()}! ${topic.description}. Would you like me to explain more?`,
                              isUser: false,
                              timestamp: new Date()
                            };
                            setMessages(prev => [...prev, aiResponse]);
                          } catch {
                            const fallbackResponse: Message = {
                              id: (Date.now() + 1).toString(),
                              text: `I'd be happy to help with ${topic.title.toLowerCase()}! ${topic.description}. Would you like me to explain more?`,
                              isUser: false,
                              timestamp: new Date()
                            };
                            setMessages(prev => [...prev, fallbackResponse]);
                          } finally {
                            setIsTyping(false);
                          }
                        }}
                        className="w-full p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-left"
                      >
                        <p className="font-medium text-gray-900 text-sm">{topic.title}</p>
                        <p className="text-gray-500 text-xs mt-0.5">{topic.description}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-2 bg-gray-50 border-t border-gray-100">
            <p className="text-xs text-gray-400 text-center">
              Powered by BrandVoice.AI
            </p>
          </div>
        </div>
      )}

      {/* Animations */}
      <style jsx>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </>
  );
}
