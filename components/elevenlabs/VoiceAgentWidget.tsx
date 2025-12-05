'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { Volume2, VolumeX, X, Home, MessageCircle, HelpCircle, Search, Send, ChevronDown } from 'lucide-react';
import Image from 'next/image';

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
  const [isMuted, setIsMuted] = useState(true);
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
      {/* Collapsed State - Clean modern design */}
      {!isExpanded && (
        <div className={`fixed bottom-8 right-24 z-50 flex items-end gap-4 ${className}`}>
          {/* Main widget container - positioned to avoid ElevenLabs floating button */}
          <div className="flex items-center gap-3">
            {/* Square avatar thumbnail - larger */}
            <button
              onClick={handleExpand}
              className="relative w-20 h-20 rounded-xl overflow-hidden shadow-xl border-3 border-white hover:scale-105 transition-transform duration-300 ring-2 ring-gray-200"
            >
              <Image
                src="/images/samira-avatar.jpg"
                alt="Samira - AI Assistant"
                fill
                className="object-cover object-top"
                sizes="80px"
              />
              {/* Online indicator */}
              <div className="absolute bottom-2 right-2 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white shadow-sm"></div>
            </button>

            {/* Book demo button - larger */}
            <button
              onClick={handleExpand}
              className="px-6 py-3.5 bg-white rounded-2xl shadow-xl font-semibold text-gray-800 hover:shadow-2xl hover:scale-105 transition-all text-base whitespace-nowrap border border-gray-100"
            >
              Book demo
            </button>
          </div>

          {/* Nudge popup */}
          {showNudge && !hasInteracted && (
            <div className="absolute right-0 bottom-full mb-3 animate-fadeIn">
              <div className="bg-white rounded-lg shadow-lg p-3 w-52 border border-gray-200">
                <button
                  onClick={() => setShowNudge(false)}
                  className="absolute -top-2 -right-2 w-5 h-5 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors"
                >
                  <X className="w-3 h-3 text-gray-600" />
                </button>
                <p className="text-sm text-gray-700 font-medium">Need help?</p>
                <p className="text-xs text-gray-500 mt-1">Chat with Samira, our AI assistant</p>
                <button
                  onClick={handleExpand}
                  className="mt-2 w-full py-1.5 bg-indigo-600 text-white text-xs rounded-md hover:bg-indigo-700 transition-colors"
                >
                  Start Chat
                </button>
              </div>
              {/* Arrow pointing down */}
              <div className="absolute right-6 -bottom-2">
                <div className="w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-white"></div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Expanded State - Full Widget */}
      {isExpanded && (
        <div className="fixed bottom-6 right-8 z-50 w-[380px] bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200 animate-slideUp">
          {/* Video/Avatar Section */}
          <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 aspect-video">
            {/* Always show Samira's avatar as background */}
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center">
                <div className="w-20 h-20 rounded-lg overflow-hidden mx-auto mb-3 border-2 border-white/30">
                  <Image
                    src="/images/samira-avatar.jpg"
                    alt="Samira - AI Assistant"
                    width={80}
                    height={80}
                    className="object-cover object-top w-full h-full"
                  />
                </div>
                <p className="text-white font-semibold">Samira</p>
                <p className="text-gray-400 text-sm">AI Customer Support</p>
                {activeTab === 'home' && (
                  <p className="text-indigo-400 text-xs mt-2">Click mic to talk or use Messages to chat</p>
                )}
              </div>
            </div>

            {/* ElevenLabs Widget - overlay on Home tab only */}
            {isLoaded && activeTab === 'home' && (
              <div className="absolute inset-0 flex items-center justify-center">
                {/* @ts-expect-error - ElevenLabs custom element */}
                <elevenlabs-convai agent-id={elevenlabsAgentId}></elevenlabs-convai>
              </div>
            )}

            {/* Mute/Unmute Button */}
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="absolute bottom-4 left-4 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors"
            >
              {isMuted ? (
                <VolumeX className="w-5 h-5 text-white" />
              ) : (
                <Volume2 className="w-5 h-5 text-white" />
              )}
            </button>

            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors"
            >
              <X className="w-4 h-4 text-white" />
            </button>

            {/* Minimize Button */}
            <button
              onClick={handleClose}
              className="absolute top-4 left-4 w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors"
            >
              <ChevronDown className="w-4 h-4 text-white" />
            </button>
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
          <div className="h-[280px] overflow-hidden">
            {/* Home Tab */}
            {activeTab === 'home' && (
              <div className="p-4 h-full overflow-y-auto">
                <h3 className="font-semibold text-gray-900 mb-3">Quick Actions</h3>
                <div className="space-y-2">
                  <button className="w-full p-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition-all text-sm">
                    Book a Strategy Call
                  </button>
                  <button className="w-full p-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors text-sm">
                    View Pricing
                  </button>
                  <button className="w-full p-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors text-sm">
                    See Sample Videos
                  </button>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-xs text-gray-500 text-center">
                    Talk to Samira using the mic above
                  </p>
                  <button
                    onClick={() => setActiveTab('messages')}
                    className="mt-2 w-full py-2 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-medium hover:bg-indigo-100 transition-colors"
                  >
                    Or chat with Samira via text
                  </button>
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
                      className="flex-1 px-4 py-2 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                      className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
