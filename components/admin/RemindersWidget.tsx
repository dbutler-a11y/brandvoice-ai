'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Bell, CheckCircle, Clock, AlertCircle, Snooze, X } from 'lucide-react'

interface Reminder {
  id: string
  type: string
  title: string
  description?: string
  priority: string
  dueAt: string
  status: string
  leadId?: string
  clientId?: string
  lead?: {
    id: string
    fullName?: string
    businessName?: string
  }
  client?: {
    id: string
    businessName: string
    contactName: string
  }
}

export default function RemindersWidget() {
  const [reminders, setReminders] = useState<Reminder[]>([])
  const [overdue, setOverdue] = useState<Reminder[]>([])
  const [loading, setLoading] = useState(true)
  const [actingOnId, setActingOnId] = useState<string | null>(null)

  useEffect(() => {
    fetchReminders()
  }, [])

  const fetchReminders = async () => {
    try {
      setLoading(true)

      // Fetch today's reminders and overdue reminders
      const [todayRes, overdueRes] = await Promise.all([
        fetch('/api/reminders?today=true'),
        fetch('/api/reminders?overdue=true'),
      ])

      const todayData = await todayRes.json()
      const overdueData = await overdueRes.json()

      if (todayData.success) {
        setReminders(todayData.reminders)
      }

      if (overdueData.success) {
        setOverdue(overdueData.reminders)
      }
    } catch (error) {
      console.error('Error fetching reminders:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleComplete = async (reminderId: string) => {
    try {
      setActingOnId(reminderId)
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
    } finally {
      setActingOnId(null)
    }
  }

  const handleSnooze = async (reminderId: string, days: number = 1) => {
    try {
      setActingOnId(reminderId)
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
    } finally {
      setActingOnId(null)
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'text-red-600 bg-red-50 border-red-200'
      case 'high':
        return 'text-orange-600 bg-orange-50 border-orange-200'
      case 'normal':
        return 'text-blue-600 bg-blue-50 border-blue-200'
      case 'low':
        return 'text-gray-600 bg-gray-50 border-gray-200'
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200'
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

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) {
      return 'Today'
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday'
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      })
    }
  }

  const ReminderCard = ({ reminder, isOverdue = false }: { reminder: Reminder; isOverdue?: boolean }) => (
    <div
      className={`p-3 rounded-lg border-2 ${
        isOverdue ? 'bg-red-50 border-red-300' : 'bg-white border-gray-200'
      } hover:shadow-md transition-shadow`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <div className={`flex-shrink-0 ${isOverdue ? 'text-red-600' : 'text-gray-600'}`}>
              {getTypeIcon(reminder.type)}
            </div>
            <h4 className="text-sm font-semibold text-gray-900 truncate">{reminder.title}</h4>
          </div>

          {reminder.description && (
            <p className="text-xs text-gray-600 mb-2 line-clamp-2">{reminder.description}</p>
          )}

          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`text-xs px-2 py-0.5 rounded-full border ${getPriorityColor(
                reminder.priority
              )}`}
            >
              {reminder.priority}
            </span>
            <span className={`text-xs ${isOverdue ? 'text-red-600 font-semibold' : 'text-gray-500'}`}>
              {formatDate(reminder.dueAt)} at {formatTime(reminder.dueAt)}
            </span>
          </div>

          {(reminder.lead || reminder.client) && (
            <div className="mt-2 text-xs text-gray-600">
              {reminder.lead && (
                <Link
                  href={`/admin/leads/${reminder.lead.id}`}
                  className="text-blue-600 hover:underline"
                >
                  Lead: {reminder.lead.fullName || reminder.lead.businessName || 'Unknown'}
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
          )}
        </div>

        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            onClick={() => handleComplete(reminder.id)}
            disabled={actingOnId === reminder.id}
            className="p-1.5 text-green-600 hover:bg-green-50 rounded transition-colors disabled:opacity-50"
            title="Complete"
          >
            <CheckCircle className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleSnooze(reminder.id, 1)}
            disabled={actingOnId === reminder.id}
            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors disabled:opacity-50"
            title="Snooze 1 day"
          >
            <Clock className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Reminders
          </h2>
        </div>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="text-sm text-gray-500 mt-2">Loading reminders...</p>
        </div>
      </div>
    )
  }

  const totalReminders = overdue.length + reminders.length

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Bell className="w-5 h-5" />
          Reminders
          {totalReminders > 0 && (
            <span className="text-xs font-normal text-gray-500">({totalReminders})</span>
          )}
        </h2>
        <Link
          href="/admin/reminders"
          className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
        >
          View all
        </Link>
      </div>

      {totalReminders === 0 ? (
        <div className="text-center py-8">
          <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
          <p className="text-sm text-gray-600">All caught up!</p>
          <p className="text-xs text-gray-500 mt-1">No reminders for today</p>
        </div>
      ) : (
        <div className="space-y-3">
          {overdue.length > 0 && (
            <>
              <div className="flex items-center gap-2 text-sm font-semibold text-red-600">
                <AlertCircle className="w-4 h-4" />
                Overdue ({overdue.length})
              </div>
              {overdue.slice(0, 3).map((reminder) => (
                <ReminderCard key={reminder.id} reminder={reminder} isOverdue />
              ))}
            </>
          )}

          {reminders.length > 0 && (
            <>
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <Clock className="w-4 h-4" />
                Today ({reminders.length})
              </div>
              {reminders.slice(0, 3).map((reminder) => (
                <ReminderCard key={reminder.id} reminder={reminder} />
              ))}
            </>
          )}

          {totalReminders > 6 && (
            <div className="pt-3 border-t border-gray-200">
              <Link
                href="/admin/reminders"
                className="text-sm text-indigo-600 hover:text-indigo-700 font-medium block text-center"
              >
                View {totalReminders - 6} more reminders
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
