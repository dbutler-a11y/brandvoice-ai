'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Bell,
  Plus,
  CheckCircle,
  Clock,
  AlertCircle,
  Calendar,
  Filter,
  List,
  Trash2,
  X,
} from 'lucide-react'

interface Reminder {
  id: string
  type: string
  title: string
  description?: string
  priority: string
  dueAt: string
  status: string
  createdAt: string
  completedAt?: string
  leadId?: string
  clientId?: string
  lead?: {
    id: string
    fullName?: string
    businessName?: string
    email?: string
  }
  client?: {
    id: string
    businessName: string
    contactName: string
    email?: string
  }
}

type ViewMode = 'list' | 'calendar'

export default function RemindersPage() {
  const [reminders, setReminders] = useState<Reminder[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const [showNewModal, setShowNewModal] = useState(false)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedReminder, setSelectedReminder] = useState<Reminder | null>(null)

  // Filters
  const [statusFilter, setStatusFilter] = useState<string>('pending')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [priorityFilter, setPriorityFilter] = useState<string>('all')

  useEffect(() => {
    fetchReminders()
  }, [statusFilter, typeFilter, priorityFilter])

  const fetchReminders = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()

      if (statusFilter && statusFilter !== 'all') {
        params.append('status', statusFilter)
      }
      if (typeFilter && typeFilter !== 'all') {
        params.append('type', typeFilter)
      }

      const response = await fetch(`/api/reminders?${params.toString()}`)
      const data = await response.json()

      if (data.success) {
        let filteredReminders = data.reminders

        // Apply priority filter
        if (priorityFilter !== 'all') {
          filteredReminders = filteredReminders.filter(
            (r: Reminder) => r.priority === priorityFilter
          )
        }

        setReminders(filteredReminders)
      }
    } catch (error) {
      console.error('Error fetching reminders:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleComplete = async (reminderId: string) => {
    try {
      const response = await fetch(`/api/reminders/${reminderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'complete' }),
      })

      if (response.ok) {
        fetchReminders()
      }
    } catch (error) {
      console.error('Error completing reminder:', error)
    }
  }

  const handleSnooze = async (reminderId: string, days: number = 1) => {
    try {
      const response = await fetch(`/api/reminders/${reminderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'snooze', days }),
      })

      if (response.ok) {
        fetchReminders()
      }
    } catch (error) {
      console.error('Error snoozing reminder:', error)
    }
  }

  const handleDelete = async (reminderId: string) => {
    if (!confirm('Are you sure you want to delete this reminder?')) return

    try {
      const response = await fetch(`/api/reminders/${reminderId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        fetchReminders()
      }
    } catch (error) {
      console.error('Error deleting reminder:', error)
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800 border-red-300'
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-300'
      case 'normal':
        return 'bg-blue-100 text-blue-800 border-blue-300'
      case 'low':
        return 'bg-gray-100 text-gray-800 border-gray-300'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'follow_up':
        return <Bell className="w-4 h-4" />
      case 'payment_reminder':
        return <AlertCircle className="w-4 h-4" />
      case 'check_in':
        return <Clock className="w-4 h-4" />
      default:
        return <Bell className="w-4 h-4" />
    }
  }

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })
  }

  const isOverdue = (dueAt: string, status: string) => {
    return status === 'pending' && new Date(dueAt) < new Date()
  }

  const groupByDate = (reminders: Reminder[]) => {
    const groups: { [key: string]: Reminder[] } = {}

    reminders.forEach((reminder) => {
      const date = new Date(reminder.dueAt).toDateString()
      if (!groups[date]) {
        groups[date] = []
      }
      groups[date].push(reminder)
    })

    return groups
  }

  const groupedReminders = groupByDate(reminders)
  const sortedDates = Object.keys(groupedReminders).sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime()
  )

  const stats = {
    total: reminders.length,
    overdue: reminders.filter((r) => isOverdue(r.dueAt, r.status)).length,
    today: reminders.filter((r) => {
      const today = new Date().toDateString()
      const reminderDate = new Date(r.dueAt).toDateString()
      return reminderDate === today && r.status === 'pending'
    }).length,
    upcoming: reminders.filter((r) => {
      const reminderDate = new Date(r.dueAt)
      const today = new Date()
      return reminderDate > today && r.status === 'pending'
    }).length,
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Bell className="w-8 h-8 text-indigo-600" />
                Reminders
              </h1>
              <p className="text-gray-600 mt-1">
                Manage follow-ups and tasks for leads and clients
              </p>
            </div>
            <button
              onClick={() => setShowNewModal(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-colors"
            >
              <Plus className="w-5 h-5" />
              New Reminder
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <Bell className="w-8 h-8 text-gray-400" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Overdue</p>
                <p className="text-2xl font-bold text-red-600">{stats.overdue}</p>
              </div>
              <AlertCircle className="w-8 h-8 text-red-400" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Today</p>
                <p className="text-2xl font-bold text-blue-600">{stats.today}</p>
              </div>
              <Clock className="w-8 h-8 text-blue-400" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Upcoming</p>
                <p className="text-2xl font-bold text-green-600">{stats.upcoming}</p>
              </div>
              <Calendar className="w-8 h-8 text-green-400" />
            </div>
          </div>
        </div>

        {/* Filters and View Toggle */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Filters:</span>
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="snoozed">Snoozed</option>
              <option value="cancelled">Cancelled</option>
            </select>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Types</option>
              <option value="follow_up">Follow Up</option>
              <option value="payment_reminder">Payment Reminder</option>
              <option value="check_in">Check In</option>
            </select>

            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Priorities</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="normal">Normal</option>
              <option value="low">Low</option>
            </select>

            <div className="ml-auto flex items-center gap-2">
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'list'
                    ? 'bg-indigo-100 text-indigo-600'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <List className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('calendar')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'calendar'
                    ? 'bg-indigo-100 text-indigo-600'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Calendar className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading reminders...</p>
          </div>
        ) : reminders.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No reminders found</h3>
            <p className="text-gray-600 mb-6">
              {statusFilter === 'pending'
                ? "You're all caught up!"
                : 'Try adjusting your filters or create a new reminder'}
            </p>
            <button
              onClick={() => setShowNewModal(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg inline-flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Create Reminder
            </button>
          </div>
        ) : viewMode === 'list' ? (
          <div className="space-y-6">
            {sortedDates.map((dateString) => {
              const date = new Date(dateString)
              const isToday = date.toDateString() === new Date().toDateString()
              const dateReminders = groupedReminders[dateString]

              return (
                <div key={dateString} className="bg-white rounded-lg shadow">
                  <div
                    className={`px-6 py-3 border-b ${
                      isToday ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <h3
                      className={`text-lg font-semibold ${
                        isToday ? 'text-blue-900' : 'text-gray-900'
                      }`}
                    >
                      {date.toLocaleDateString('en-US', {
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                      {isToday && (
                        <span className="ml-2 text-sm font-normal text-blue-600">(Today)</span>
                      )}
                    </h3>
                  </div>

                  <div className="divide-y divide-gray-200">
                    {dateReminders.map((reminder) => {
                      const overdueStatus = isOverdue(reminder.dueAt, reminder.status)

                      return (
                        <div
                          key={reminder.id}
                          className={`p-4 hover:bg-gray-50 transition-colors ${
                            overdueStatus ? 'bg-red-50' : ''
                          }`}
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-3 mb-2">
                                <div className="flex-shrink-0">{getTypeIcon(reminder.type)}</div>
                                <h4 className="text-base font-semibold text-gray-900">
                                  {reminder.title}
                                </h4>
                                <span
                                  className={`text-xs px-2 py-1 rounded-full border font-medium ${getPriorityColor(
                                    reminder.priority
                                  )}`}
                                >
                                  {reminder.priority}
                                </span>
                                {overdueStatus && (
                                  <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-800 border border-red-300 font-semibold">
                                    OVERDUE
                                  </span>
                                )}
                              </div>

                              {reminder.description && (
                                <p className="text-sm text-gray-600 mb-2">
                                  {reminder.description}
                                </p>
                              )}

                              <div className="flex items-center gap-4 text-xs text-gray-500">
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {formatDateTime(reminder.dueAt)}
                                </span>
                                {reminder.lead && (
                                  <Link
                                    href={`/admin/leads/${reminder.lead.id}`}
                                    className="text-blue-600 hover:underline"
                                  >
                                    Lead: {reminder.lead.fullName || reminder.lead.businessName}
                                  </Link>
                                )}
                                {reminder.client && (
                                  <Link
                                    href={`/admin/clients/${reminder.client.id}`}
                                    className="text-blue-600 hover:underline"
                                  >
                                    Client: {reminder.client.businessName}
                                  </Link>
                                )}
                              </div>
                            </div>

                            {reminder.status === 'pending' && (
                              <div className="flex items-center gap-2 flex-shrink-0">
                                <button
                                  onClick={() => handleComplete(reminder.id)}
                                  className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                  title="Complete"
                                >
                                  <CheckCircle className="w-5 h-5" />
                                </button>
                                <button
                                  onClick={() => handleSnooze(reminder.id, 1)}
                                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                  title="Snooze 1 day"
                                >
                                  <Clock className="w-5 h-5" />
                                </button>
                                <button
                                  onClick={() => handleDelete(reminder.id)}
                                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                  title="Delete"
                                >
                                  <Trash2 className="w-5 h-5" />
                                </button>
                              </div>
                            )}

                            {reminder.status === 'completed' && reminder.completedAt && (
                              <div className="text-sm text-green-600 flex items-center gap-2">
                                <CheckCircle className="w-4 h-4" />
                                Completed
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Calendar View</h3>
              <p className="text-gray-600">
                Calendar view coming soon! For now, use the list view to manage your reminders.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* New Reminder Modal */}
      {showNewModal && <NewReminderModal onClose={() => setShowNewModal(false)} onSuccess={fetchReminders} />}
    </div>
  )
}

function NewReminderModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    type: 'follow_up',
    title: '',
    description: '',
    priority: 'normal',
    dueAt: '',
    leadId: '',
    clientId: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/reminders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          leadId: formData.leadId || null,
          clientId: formData.clientId || null,
        }),
      })

      if (response.ok) {
        onSuccess()
        onClose()
      } else {
        const data = await response.json()
        alert(data.error || 'Failed to create reminder')
      }
    } catch (error) {
      console.error('Error creating reminder:', error)
      alert('Failed to create reminder')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Create New Reminder</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            >
              <option value="follow_up">Follow Up</option>
              <option value="payment_reminder">Payment Reminder</option>
              <option value="check_in">Check In</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="e.g., Follow up with lead"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              rows={3}
              placeholder="Additional details..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="low">Low</option>
              <option value="normal">Normal</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Due Date & Time *</label>
            <input
              type="datetime-local"
              value={formData.dueAt}
              onChange={(e) => setFormData({ ...formData, dueAt: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Lead ID (optional)
            </label>
            <input
              type="text"
              value={formData.leadId}
              onChange={(e) => setFormData({ ...formData, leadId: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Lead ID"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Client ID (optional)
            </label>
            <input
              type="text"
              value={formData.clientId}
              onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Client ID"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : 'Create Reminder'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
