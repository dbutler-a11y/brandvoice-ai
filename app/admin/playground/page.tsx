'use client'

import { useState, useRef, useEffect } from 'react'

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

const QUICK_PROMPTS = [
  { label: '🎭 New AI Actor', prompt: 'Create a new AI spokesperson character for the real estate industry. Give me their full profile including name, appearance, voice style, personality, and a sample intro script.' },
  { label: '👥 Actor Lineup', prompt: 'Design a lineup of 6 diverse AI spokespersons covering different industries: Med Spa, Real Estate, Legal, Fitness, Restaurant, and Tech. Give me a brief profile for each.' },
  { label: '🔄 Customize Actor', prompt: 'I have a female AI spokesperson named Sarah (30s, professional). How can I customize her for different industries? Give me variations for med spa, real estate, and fitness.' },
  { label: '📝 Script Ideas', prompt: 'Give me 3 video script ideas for a med spa targeting women 35-55' },
  { label: '❓ FAQ Generator', prompt: 'Generate 5 FAQs with answers for a real estate agent' },
  { label: '📧 Email Sequence', prompt: 'Write a 5-email cold outreach sequence for a fitness coach' },
  { label: '📱 Social Hooks', prompt: 'Give me 10 attention-grabbing hooks for short-form video content' },
  { label: '🎯 Ad Copy', prompt: 'Write 3 Facebook ad variations for a dental practice' },
]

export default function PlaygroundPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [context, setContext] = useState('')
  const [showContext, setShowContext] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async (e?: React.FormEvent, overridePrompt?: string) => {
    e?.preventDefault()
    const prompt = overridePrompt || input.trim()
    if (!prompt || loading) return

    const userMessage: Message = {
      role: 'user',
      content: prompt,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(m => ({
            role: m.role,
            content: m.content
          })),
          context: context || undefined
        }),
      })

      if (!response.ok) throw new Error('Failed to get response')

      const data = await response.json()

      const assistantMessage: Message = {
        role: 'assistant',
        content: data.message.content,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Chat error:', error)
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, something went wrong. Please try again.',
        timestamp: new Date()
      }])
    } finally {
      setLoading(false)
      inputRef.current?.focus()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const clearChat = () => {
    setMessages([])
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const formatMessage = (content: string) => {
    // Basic markdown-like formatting
    return content
      .split('\n')
      .map((line, i) => {
        // Headers
        if (line.startsWith('**') && line.endsWith('**')) {
          return <p key={i} className="font-bold text-gray-900 mt-3 mb-1">{line.replace(/\*\*/g, '')}</p>
        }
        // Bold inline
        if (line.includes('**')) {
          const parts = line.split(/\*\*/)
          return (
            <p key={i} className="mb-1">
              {parts.map((part, j) =>
                j % 2 === 1 ? <strong key={j}>{part}</strong> : part
              )}
            </p>
          )
        }
        // List items
        if (line.startsWith('- ') || line.startsWith('• ')) {
          return <li key={i} className="ml-4 mb-1">{line.substring(2)}</li>
        }
        // Numbered lists
        if (/^\d+\.\s/.test(line)) {
          return <li key={i} className="ml-4 mb-1">{line.replace(/^\d+\.\s/, '')}</li>
        }
        // Horizontal rule
        if (line === '---') {
          return <hr key={i} className="my-3 border-gray-200" />
        }
        // Empty line
        if (line === '') {
          return <br key={i} />
        }
        // Regular paragraph
        return <p key={i} className="mb-1">{line}</p>
      })
  }

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-140px)] flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">AI Playground</h1>
          <p className="text-gray-600">Brainstorm ideas, generate content, and explore concepts</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowContext(!showContext)}
            className={`px-3 py-2 rounded-md text-sm font-medium ${
              showContext ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {showContext ? 'Hide Context' : 'Add Context'}
          </button>
          <button
            onClick={clearChat}
            className="px-3 py-2 bg-gray-100 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-200"
          >
            Clear Chat
          </button>
        </div>
      </div>

      {/* Context Input */}
      {showContext && (
        <div className="mb-4 p-4 bg-indigo-50 rounded-lg border border-indigo-200">
          <label className="block text-sm font-medium text-indigo-700 mb-2">
            Context (optional) - Add client info, niche details, or specific requirements
          </label>
          <textarea
            value={context}
            onChange={(e) => setContext(e.target.value)}
            className="w-full px-3 py-2 border border-indigo-200 rounded-md text-gray-900 text-sm"
            rows={2}
            placeholder="e.g., Client: Luxe Med Spa, Target: Women 35-55, Tone: Luxury and sophisticated"
          />
        </div>
      )}

      {/* Quick Prompts */}
      <div className="flex flex-wrap gap-2 mb-4">
        {QUICK_PROMPTS.map((qp) => (
          <button
            key={qp.label}
            onClick={() => handleSubmit(undefined, qp.prompt)}
            disabled={loading}
            className="px-3 py-1.5 bg-white border border-gray-200 rounded-full text-sm text-gray-700 hover:bg-gray-50 hover:border-indigo-300 transition-colors disabled:opacity-50"
          >
            {qp.label}
          </button>
        ))}
      </div>

      {/* Messages Area */}
      <div className="flex-1 bg-white rounded-lg shadow overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-500">
              <div className="text-6xl mb-4">💡</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Start Brainstorming</h3>
              <p className="text-center max-w-md">
                Ask me anything about video scripts, marketing ideas, client strategies, or content creation.
                Try one of the quick prompts above!
              </p>
            </div>
          ) : (
            messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-3 ${
                    msg.role === 'user'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {msg.role === 'assistant' ? (
                    <div className="prose prose-sm max-w-none">
                      {formatMessage(msg.content)}
                    </div>
                  ) : (
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  )}

                  {msg.role === 'assistant' && (
                    <button
                      onClick={() => copyToClipboard(msg.content)}
                      className="mt-2 text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      Copy
                    </button>
                  )}
                </div>
              </div>
            ))
          )}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-lg px-4 py-3">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t p-4">
          <form onSubmit={handleSubmit} className="flex gap-3">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything... (Shift+Enter for new line)"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg resize-none text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              rows={2}
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              )}
            </button>
          </form>
          <p className="text-xs text-gray-500 mt-2 text-center">
            Powered by GPT-4o • Your conversations are not saved
          </p>
        </div>
      </div>
    </div>
  )
}
