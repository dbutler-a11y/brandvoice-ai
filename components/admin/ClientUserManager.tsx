'use client'

import { useEffect, useState, useCallback } from 'react'
import { formatDate } from '@/lib/utils'

type ClientUserData = {
  id: string
  userId: string
  clientId: string
  createdAt: Date
  user: {
    id: string
    email: string
    name: string | null
    role: string
    createdAt: Date
  }
}

type ClientUserManagerProps = {
  clientId: string
}

export default function ClientUserManager({ clientId }: ClientUserManagerProps) {
  const [users, setUsers] = useState<ClientUserData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [adding, setAdding] = useState(false)
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(`/api/clients/${clientId}/users`)
      if (!response.ok) throw new Error('Failed to fetch users')
      const data = await response.json()
      setUsers(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }, [clientId])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email.trim()) {
      setError('Email is required')
      return
    }

    setAdding(true)
    setError(null)
    setSuccessMessage(null)

    try {
      const response = await fetch(`/api/clients/${clientId}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
          name: name.trim() || undefined,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to add user')
      }

      setSuccessMessage(`Successfully granted access to ${email}`)
      setEmail('')
      setName('')
      await fetchUsers()

      // Clear success message after 5 seconds
      setTimeout(() => setSuccessMessage(null), 5000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add user')
    } finally {
      setAdding(false)
    }
  }

  const handleRemoveUser = async (userId: string, userEmail: string) => {
    if (!confirm(`Are you sure you want to remove access for ${userEmail}?`)) {
      return
    }

    setDeletingUserId(userId)
    setError(null)
    setSuccessMessage(null)

    try {
      const response = await fetch(`/api/clients/${clientId}/users?userId=${userId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to remove user')
      }

      setSuccessMessage(`Successfully removed access for ${userEmail}`)
      await fetchUsers()

      // Clear success message after 5 seconds
      setTimeout(() => setSuccessMessage(null), 5000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove user')
    } finally {
      setDeletingUserId(null)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-1">Portal Access</h2>
        <p className="text-sm text-gray-500">
          Manage which users can access this client&apos;s data in the client portal.
        </p>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="mb-4 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-md flex items-start">
          <svg
            className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          <span>{successMessage}</span>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-start">
          <svg
            className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
          <span>{error}</span>
        </div>
      )}

      {/* Add User Form */}
      <form onSubmit={handleAddUser} className="mb-6 pb-6 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-3">Grant Portal Access</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="user-email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address *
            </label>
            <input
              id="user-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@example.com"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400"
            />
          </div>
          <div>
            <label htmlFor="user-name" className="block text-sm font-medium text-gray-700 mb-1">
              Name (Optional)
            </label>
            <input
              id="user-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400"
            />
          </div>
        </div>
        <div className="mt-4">
          <button
            type="submit"
            disabled={adding || !email.trim()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors"
          >
            {adding ? 'Granting Access...' : 'Grant Access'}
          </button>
          <p className="mt-2 text-sm text-gray-500">
            If the user doesn&apos;t exist, a new account will be created automatically.
          </p>
        </div>
      </form>

      {/* Users List */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-3">
          Users with Access ({users.length})
        </h3>

        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="text-gray-500">Loading...</div>
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <svg
              className="mx-auto h-12 w-12 text-gray-400 mb-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
            <p>No users have access to this client yet.</p>
            <p className="text-sm mt-1">Add a user above to grant portal access.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {users.map((clientUser) => (
              <div
                key={clientUser.id}
                className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-grow">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <span className="text-blue-600 font-semibold text-sm">
                            {clientUser.user.name
                              ? clientUser.user.name.charAt(0).toUpperCase()
                              : clientUser.user.email.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <p className="font-medium text-gray-900">
                            {clientUser.user.name || clientUser.user.email}
                          </p>
                          <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-gray-100 text-gray-700">
                            {clientUser.user.role}
                          </span>
                        </div>
                        {clientUser.user.name && (
                          <p className="text-sm text-gray-500">{clientUser.user.email}</p>
                        )}
                        <p className="text-xs text-gray-400 mt-1">
                          Access granted {formatDate(clientUser.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveUser(clientUser.user.id, clientUser.user.email)}
                    disabled={deletingUserId === clientUser.user.id}
                    className="ml-4 px-3 py-1.5 text-sm font-medium text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {deletingUserId === clientUser.user.id ? 'Removing...' : 'Remove Access'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
