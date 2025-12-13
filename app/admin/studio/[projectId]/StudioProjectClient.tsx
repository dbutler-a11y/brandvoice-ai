'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

// Types
interface ExternalLink {
  label: string
  url: string
}

interface Checkpoint {
  type: string
  completedAt: string
  completedBy?: string
  notes?: string
}

interface Revision {
  id: string
  timestamp: string
  field: string
  previousValue: string
  newValue: string
}

interface Note {
  id: string
  createdAt: string
  author: string
  content: string
  type: string
}

interface Frame {
  id: string
  athleteId: string
  order: number
  label: string
  description: string
  aiPrompt: string | null
  status: string
  imageUrl: string | null
  thumbnailUrl: string | null
  priority: string
  dueDate: Date | null
  assignedTo: string | null
  externalLinks: ExternalLink[]
  checkpoints: Checkpoint[]
  revisions: Revision[]
  notes: Note[]
  createdAt: Date
  updatedAt: Date
}

interface Athlete {
  id: string
  projectId: string
  name: string
  sport: string
  notes: string | null
  frames: Frame[]
  createdAt: Date
  updatedAt: Date
}

interface Project {
  id: string
  name: string
  description: string
  status: string
  projectType: string
  primaryChannel: string
  primaryGoal: string | null
  brandName: string | null
  client: { id: string; businessName: string } | null
  athletes: Athlete[]
}

// Status configuration
const statusConfig: Record<string, { label: string; color: string; bgColor: string }> = {
  idea: { label: 'Idea', color: 'text-gray-700', bgColor: 'bg-gray-100' },
  prompt_ready: { label: 'Prompt Ready', color: 'text-blue-700', bgColor: 'bg-blue-100' },
  sent_to_ai: { label: 'Sent to AI', color: 'text-purple-700', bgColor: 'bg-purple-100' },
  rendered: { label: 'Rendered', color: 'text-orange-700', bgColor: 'bg-orange-100' },
  revision_requested: { label: 'Revision Requested', color: 'text-red-700', bgColor: 'bg-red-100' },
  approved: { label: 'Approved', color: 'text-green-700', bgColor: 'bg-green-100' },
}

const priorityConfig: Record<string, { label: string; color: string; bgColor: string; icon: string }> = {
  low: { label: 'Low', color: 'text-gray-600', bgColor: 'bg-gray-50', icon: '↓' },
  normal: { label: 'Normal', color: 'text-blue-600', bgColor: 'bg-blue-50', icon: '−' },
  high: { label: 'High', color: 'text-orange-600', bgColor: 'bg-orange-50', icon: '↑' },
  urgent: { label: 'Urgent', color: 'text-red-600', bgColor: 'bg-red-50', icon: '!!' },
}

const checkpointTypes = [
  'concept_approved',
  'prompt_finalized',
  'first_render',
  'client_review',
  'final_approval',
  'delivered'
] as const

const checkpointLabels: Record<string, string> = {
  concept_approved: 'Concept',
  prompt_finalized: 'Prompt',
  first_render: 'Render',
  client_review: 'Review',
  final_approval: 'Approved',
  delivered: 'Delivered'
}

interface StudioProjectClientProps {
  project: Project
}

export default function StudioProjectClient({ project: initialProject }: StudioProjectClientProps) {
  const router = useRouter()
  const [project, setProject] = useState(initialProject)
  const [selectedAthlete, setSelectedAthlete] = useState<Athlete | null>(
    project.athletes.length > 0 ? project.athletes[0] : null
  )
  const [selectedFrame, setSelectedFrame] = useState<Frame | null>(null)
  const [viewMode, setViewMode] = useState<'athletes' | 'timeline'>('athletes')
  const [showAddAthlete, setShowAddAthlete] = useState(false)
  const [showAddFrame, setShowAddFrame] = useState(false)
  const [loading, setLoading] = useState(false)

  // New athlete form
  const [newAthlete, setNewAthlete] = useState({ name: '', sport: '', notes: '' })

  // New frame form
  const [newFrame, setNewFrame] = useState({ label: '', description: '' })

  // Calculate stats
  const totalFrames = project.athletes.reduce((sum, a) => sum + a.frames.length, 0)
  const approvedFrames = project.athletes.reduce(
    (sum, a) => sum + a.frames.filter(f => f.status === 'approved').length, 0
  )
  const progressPercentage = totalFrames > 0 ? Math.round((approvedFrames / totalFrames) * 100) : 0

  const handleAddAthlete = async () => {
    if (!newAthlete.name || !newAthlete.sport) return
    setLoading(true)

    try {
      const response = await fetch(`/api/studio/projects/${project.id}/athletes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAthlete),
      })

      if (response.ok) {
        router.refresh()
        setShowAddAthlete(false)
        setNewAthlete({ name: '', sport: '', notes: '' })
      }
    } finally {
      setLoading(false)
    }
  }

  const handleAddFrame = async () => {
    if (!selectedAthlete || !newFrame.label || !newFrame.description) return
    setLoading(true)

    try {
      const response = await fetch(`/api/studio/athletes/${selectedAthlete.id}/frames`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newFrame,
          order: selectedAthlete.frames.length + 1,
        }),
      })

      if (response.ok) {
        router.refresh()
        setShowAddFrame(false)
        setNewFrame({ label: '', description: '' })
      }
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateFrameStatus = async (frameId: string, newStatus: string) => {
    try {
      await fetch(`/api/studio/frames/${frameId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      router.refresh()
    } catch (error) {
      console.error('Failed to update frame status:', error)
    }
  }

  const handleGeneratePrompt = async (athleteId: string, frameId: string) => {
    setLoading(true)
    try {
      const response = await fetch('/api/studio/ai/generate-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ athleteId, frameId }),
      })

      if (response.ok) {
        router.refresh()
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Project Overview Card */}
      <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-3">
              <span className="text-lg">{project.athletes.length} athletes</span>
              <span className="text-white/60">|</span>
              <span className="text-lg">{totalFrames} frames</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{progressPercentage}%</div>
            <div className="text-sm text-purple-200">Complete</div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-3 bg-white/20 rounded-full overflow-hidden">
          <div
            className="h-full bg-white transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* View Toggle */}
      <div className="flex items-center justify-between bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('athletes')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              viewMode === 'athletes'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Athletes
          </button>
          <button
            onClick={() => setViewMode('timeline')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              viewMode === 'timeline'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Timeline
          </button>
        </div>
        <button
          onClick={() => setShowAddAthlete(true)}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Athlete
        </button>
      </div>

      {/* Athletes View */}
      {viewMode === 'athletes' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Athletes List */}
          <div className="lg:col-span-1 bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <h3 className="font-semibold text-gray-900">Athletes</h3>
            </div>
            <div className="divide-y divide-gray-200">
              {project.athletes.map(athlete => (
                <button
                  key={athlete.id}
                  onClick={() => {
                    setSelectedAthlete(athlete)
                    setSelectedFrame(null)
                  }}
                  className={`w-full p-4 text-left hover:bg-gray-50 transition-colors ${
                    selectedAthlete?.id === athlete.id ? 'bg-purple-50 border-l-4 border-purple-500' : ''
                  }`}
                >
                  <div className="font-medium text-gray-900">{athlete.name}</div>
                  <div className="text-sm text-gray-500">{athlete.sport}</div>
                  <div className="text-xs text-gray-400 mt-1">{athlete.frames.length} frames</div>
                </button>
              ))}
              {project.athletes.length === 0 && (
                <div className="p-8 text-center text-gray-500">
                  <p>No athletes yet</p>
                </div>
              )}
            </div>
          </div>

          {/* Frames Grid */}
          <div className="lg:col-span-3">
            {selectedAthlete ? (
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">{selectedAthlete.name}&apos;s Frames</h3>
                    <p className="text-sm text-gray-500">{selectedAthlete.sport}</p>
                  </div>
                  <button
                    onClick={() => setShowAddFrame(true)}
                    className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium flex items-center gap-1"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Frame
                  </button>
                </div>

                {/* Frames */}
                <div className="p-4 grid grid-cols-2 gap-4">
                  {selectedAthlete.frames.map(frame => {
                    const status = statusConfig[frame.status] || statusConfig.idea
                    const priority = priorityConfig[frame.priority] || priorityConfig.normal

                    return (
                      <div
                        key={frame.id}
                        onClick={() => setSelectedFrame(frame)}
                        className={`border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
                          selectedFrame?.id === frame.id ? 'border-purple-500 ring-2 ring-purple-200' : 'border-gray-200'
                        }`}
                      >
                        {/* Frame thumbnail */}
                        <div className="aspect-video bg-gray-100 rounded-lg mb-3 overflow-hidden">
                          {frame.imageUrl ? (
                            <img src={frame.imageUrl} alt={frame.label} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                          )}
                        </div>

                        {/* Frame info */}
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-medium text-gray-900">{frame.label}</h4>
                            <p className="text-sm text-gray-500 line-clamp-1">{frame.description}</p>
                          </div>
                          {priority.icon !== '−' && (
                            <span className={`px-2 py-0.5 text-xs rounded ${priority.bgColor} ${priority.color}`}>
                              {priority.icon}
                            </span>
                          )}
                        </div>

                        {/* Status and checkpoints */}
                        <div className="flex items-center justify-between">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${status.bgColor} ${status.color}`}>
                            {status.label}
                          </span>
                          <div className="flex items-center gap-0.5">
                            {checkpointTypes.map(type => {
                              const isComplete = frame.checkpoints?.some(c => c.type === type)
                              return (
                                <div
                                  key={type}
                                  className={`w-3 h-3 rounded-full ${
                                    isComplete ? 'bg-green-500' : 'bg-gray-200'
                                  }`}
                                  title={checkpointLabels[type]}
                                />
                              )
                            })}
                          </div>
                        </div>
                      </div>
                    )
                  })}

                  {selectedAthlete.frames.length === 0 && (
                    <div className="col-span-2 p-12 text-center text-gray-500">
                      <p>No frames yet. Add a frame to start building the storyboard.</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg border border-gray-200 p-12 text-center text-gray-500">
                <p>Select an athlete to view their frames</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Timeline View */}
      {viewMode === 'timeline' && (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <h3 className="font-semibold text-gray-900">All Frames</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {project.athletes.flatMap(athlete =>
              athlete.frames.map(frame => {
                const status = statusConfig[frame.status] || statusConfig.idea
                return (
                  <div key={frame.id} className="p-4 flex items-center gap-4 hover:bg-gray-50">
                    {/* Thumbnail */}
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
                      {frame.imageUrl ? (
                        <img src={frame.imageUrl} alt={frame.label} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900">{frame.label}</div>
                      <div className="text-sm text-gray-500">{athlete.name} ({athlete.sport})</div>
                    </div>

                    {/* Status */}
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${status.bgColor} ${status.color}`}>
                      {status.label}
                    </span>

                    {/* Checkpoints */}
                    <div className="flex items-center gap-0.5">
                      {checkpointTypes.map(type => {
                        const isComplete = frame.checkpoints?.some(c => c.type === type)
                        return (
                          <div
                            key={type}
                            className={`w-3 h-3 rounded-full ${isComplete ? 'bg-green-500' : 'bg-gray-200'}`}
                            title={checkpointLabels[type]}
                          />
                        )
                      })}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      {frame.status === 'idea' && (
                        <button
                          onClick={() => handleGeneratePrompt(athlete.id, frame.id)}
                          disabled={loading}
                          className="px-3 py-1 text-xs bg-purple-600 hover:bg-purple-700 text-white rounded-md"
                        >
                          Generate Prompt
                        </button>
                      )}
                      {frame.status === 'rendered' && (
                        <>
                          <button
                            onClick={() => handleUpdateFrameStatus(frame.id, 'approved')}
                            className="px-3 py-1 text-xs bg-green-600 hover:bg-green-700 text-white rounded-md"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleUpdateFrameStatus(frame.id, 'revision_requested')}
                            className="px-3 py-1 text-xs bg-red-600 hover:bg-red-700 text-white rounded-md"
                          >
                            Revision
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                )
              })
            )}
            {totalFrames === 0 && (
              <div className="p-12 text-center text-gray-500">
                <p>No frames yet. Add athletes and frames to see them here.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add Athlete Modal */}
      {showAddAthlete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Add New Athlete</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                <input
                  type="text"
                  value={newAthlete.name}
                  onChange={(e) => setNewAthlete({ ...newAthlete, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="Athlete name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sport *</label>
                <input
                  type="text"
                  value={newAthlete.sport}
                  onChange={(e) => setNewAthlete({ ...newAthlete, sport: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="e.g., Basketball, Soccer"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  value={newAthlete.notes}
                  onChange={(e) => setNewAthlete({ ...newAthlete, notes: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  rows={3}
                  placeholder="Additional notes..."
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowAddAthlete(false)}
                className="px-4 py-2 text-gray-700 hover:text-gray-900"
              >
                Cancel
              </button>
              <button
                onClick={handleAddAthlete}
                disabled={loading || !newAthlete.name || !newAthlete.sport}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg disabled:opacity-50"
              >
                {loading ? 'Adding...' : 'Add Athlete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Frame Modal */}
      {showAddFrame && selectedAthlete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Add Frame for {selectedAthlete.name}</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Label *</label>
                <input
                  type="text"
                  value={newFrame.label}
                  onChange={(e) => setNewFrame({ ...newFrame, label: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="e.g., Opening Shot, Product Reveal"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                <textarea
                  value={newFrame.description}
                  onChange={(e) => setNewFrame({ ...newFrame, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  rows={4}
                  placeholder="Describe what should happen in this frame..."
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowAddFrame(false)}
                className="px-4 py-2 text-gray-700 hover:text-gray-900"
              >
                Cancel
              </button>
              <button
                onClick={handleAddFrame}
                disabled={loading || !newFrame.label || !newFrame.description}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg disabled:opacity-50"
              >
                {loading ? 'Adding...' : 'Add Frame'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
