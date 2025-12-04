'use client'

import { useEffect, useState, useCallback } from 'react'

export default function RoadmapPage() {
  const [content, setContent] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const fetchRoadmap = useCallback(async () => {
    try {
      const response = await fetch('/api/roadmap')
      if (!response.ok) throw new Error('Failed to fetch roadmap')
      const data = await response.json()
      setContent(data.content)
      setEditContent(data.content)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchRoadmap()
  }, [fetchRoadmap])

  const handleSave = async () => {
    setSaving(true)
    setError(null)
    setSuccessMessage(null)

    try {
      const response = await fetch('/api/roadmap', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: editContent }),
      })

      if (!response.ok) throw new Error('Failed to save roadmap')

      setContent(editContent)
      setIsEditing(false)
      setSuccessMessage('Roadmap saved successfully!')
      setTimeout(() => setSuccessMessage(null), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    setEditContent(content)
    setIsEditing(false)
  }

  // Simple markdown to HTML converter for display
  const renderMarkdown = (md: string) => {
    const html = md
      // Headers
      .replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold text-gray-900 mt-6 mb-2">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold text-gray-900 mt-8 mb-3 pb-2 border-b">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold text-gray-900 mb-4">$1</h1>')
      // Checkboxes
      .replace(/^- \[x\] (.*$)/gim, '<div class="flex items-center gap-2 ml-4 my-1"><span class="text-green-600">✓</span><span class="line-through text-gray-500">$1</span></div>')
      .replace(/^- \[ \] (.*$)/gim, '<div class="flex items-center gap-2 ml-4 my-1"><span class="text-gray-400">○</span><span class="text-gray-700">$1</span></div>')
      // Bold
      .replace(/\*\*(.*)\*\*/gim, '<strong class="font-semibold">$1</strong>')
      // Italic
      .replace(/\*(.*)\*/gim, '<em>$1</em>')
      // Code blocks
      .replace(/`([^`]+)`/gim, '<code class="bg-gray-100 px-1 py-0.5 rounded text-sm text-gray-800">$1</code>')
      // Blockquotes
      .replace(/^> (.*$)/gim, '<blockquote class="border-l-4 border-indigo-500 pl-4 py-1 my-2 text-gray-600 italic">$1</blockquote>')
      // Horizontal rules
      .replace(/^---$/gim, '<hr class="my-6 border-gray-200" />')
      // Lists
      .replace(/^- (.*$)/gim, '<li class="ml-4 text-gray-700">• $1</li>')
      // Tables (basic)
      .replace(/\|(.+)\|/gim, (match) => {
        const cells = match.split('|').filter(c => c.trim())
        if (cells.some(c => c.includes('---'))) return ''
        return `<tr>${cells.map(c => `<td class="border border-gray-200 px-3 py-2 text-gray-900">${c.trim()}</td>`).join('')}</tr>`
      })
      // Paragraphs
      .replace(/^\s*$/gim, '</p><p class="my-2 text-gray-700">')
      // Comments
      .replace(/<!--[\s\S]*?-->/gim, '')

    return `<div class="prose max-w-none"><p class="text-gray-700">${html}</p></div>`
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Loading roadmap...</div>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Roadmap & Goals</h1>
          <p className="text-gray-600 mt-1">Track your business goals and development roadmap</p>
        </div>
        <div className="flex gap-3">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 font-medium"
            >
              Edit Roadmap
            </button>
          ) : (
            <>
              <button
                onClick={handleCancel}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 font-medium"
                disabled={saving}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 font-medium disabled:bg-green-400"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-6">
          {successMessage}
        </div>
      )}

      {/* Content */}
      <div className="bg-white rounded-lg shadow">
        {isEditing ? (
          <div className="p-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Edit Markdown Content
            </label>
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full h-[70vh] px-4 py-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 font-mono text-sm text-gray-900"
              placeholder="Write your roadmap in Markdown..."
            />
            <p className="mt-2 text-sm text-gray-500">
              Supports Markdown: # Headers, **bold**, *italic*, `code`, - [ ] checkboxes, --- dividers
            </p>
          </div>
        ) : (
          <div
            className="p-8"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
          />
        )}
      </div>
    </div>
  )
}
