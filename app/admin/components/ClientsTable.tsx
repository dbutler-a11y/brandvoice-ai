'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'

type Client = {
  id: string
  businessName: string
  contactName: string
  email: string
  niche: string
  paymentStatus: string
  createdAt: Date
  _count: {
    scripts: number
  }
}

type ClientsTableProps = {
  clients: Client[]
}

export default function ClientsTable({ clients }: ClientsTableProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [nicheFilter, setNicheFilter] = useState('all')
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('all')
  const [scriptStatusFilter, setScriptStatusFilter] = useState('all')

  // Get unique niches from clients
  const uniqueNiches = useMemo(() => {
    const niches = new Set(clients.map(client => client.niche))
    return Array.from(niches).sort()
  }, [clients])

  // Filter clients based on search and filters
  const filteredClients = useMemo(() => {
    return clients.filter(client => {
      // Search filter (case-insensitive, partial match)
      const searchLower = searchQuery.toLowerCase()
      const matchesSearch = searchQuery === '' ||
        client.businessName.toLowerCase().includes(searchLower) ||
        client.contactName.toLowerCase().includes(searchLower) ||
        client.email.toLowerCase().includes(searchLower)

      // Niche filter
      const matchesNiche = nicheFilter === 'all' || client.niche === nicheFilter

      // Payment status filter
      const matchesPaymentStatus =
        paymentStatusFilter === 'all' || client.paymentStatus === paymentStatusFilter

      // Script status filter
      const matchesScriptStatus =
        scriptStatusFilter === 'all' ||
        (scriptStatusFilter === 'has-scripts' && client._count.scripts > 0) ||
        (scriptStatusFilter === 'no-scripts' && client._count.scripts === 0)

      return matchesSearch && matchesNiche && matchesPaymentStatus && matchesScriptStatus
    })
  }, [clients, searchQuery, nicheFilter, paymentStatusFilter, scriptStatusFilter])

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery('')
    setNicheFilter('all')
    setPaymentStatusFilter('all')
    setScriptStatusFilter('all')
  }

  // Check if any filters are active
  const hasActiveFilters = searchQuery !== '' || nicheFilter !== 'all' || paymentStatusFilter !== 'all' || scriptStatusFilter !== 'all'

  return (
    <div>
      {/* Filters Section */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* Search Input */}
          <div className="md:col-span-2">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <div className="relative">
              <input
                id="search"
                type="text"
                placeholder="Search by business name, contact, or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-900"
              />
              <svg
                className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          {/* Niche Filter */}
          <div>
            <label htmlFor="niche-filter" className="block text-sm font-medium text-gray-700 mb-1">
              Niche
            </label>
            <select
              id="niche-filter"
              value={nicheFilter}
              onChange={(e) => setNicheFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-900"
            >
              <option value="all">All Niches</option>
              {uniqueNiches.map(niche => (
                <option key={niche} value={niche}>{niche}</option>
              ))}
            </select>
          </div>

          {/* Payment Status Filter */}
          <div>
            <label htmlFor="payment-filter" className="block text-sm font-medium text-gray-700 mb-1">
              Payment Status
            </label>
            <select
              id="payment-filter"
              value={paymentStatusFilter}
              onChange={(e) => setPaymentStatusFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-900"
            >
              <option value="all">All</option>
              <option value="paid">Paid</option>
              <option value="unpaid">Unpaid</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>

          {/* Script Status Filter */}
          <div>
            <label htmlFor="script-filter" className="block text-sm font-medium text-gray-700 mb-1">
              Script Status
            </label>
            <select
              id="script-filter"
              value={scriptStatusFilter}
              onChange={(e) => setScriptStatusFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-900"
            >
              <option value="all">All Clients</option>
              <option value="has-scripts">Has Scripts</option>
              <option value="no-scripts">No Scripts</option>
            </select>
          </div>
        </div>

        {/* Results Count and Clear Filters */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            <span className="font-semibold text-gray-900">{filteredClients.length}</span>
            {' '}
            {filteredClients.length === 1 ? 'result' : 'results'}
            {hasActiveFilters && (
              <span className="text-gray-500">
                {' '}(filtered from {clients.length} total)
              </span>
            )}
          </p>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      {filteredClients.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <p className="text-gray-500 text-lg mb-2">No clients found</p>
          {hasActiveFilters ? (
            <button
              onClick={clearFilters}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Clear filters to see all clients
            </button>
          ) : (
            <Link
              href="/admin/clients/new"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Create your first client
            </Link>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {/* Mobile: Card Layout */}
          <div className="block md:hidden">
            <div className="divide-y divide-gray-200">
              {filteredClients.map((client) => (
                <div key={client.id} className="p-4 hover:bg-gray-50">
                  <div className="flex items-start justify-between mb-2">
                    <Link
                      href={`/admin/clients/${client.id}`}
                      className="text-blue-600 hover:text-blue-800 font-medium text-lg"
                    >
                      {client.businessName}
                    </Link>
                    {client.paymentStatus === 'paid' ? (
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                        Paid
                      </span>
                    ) : client.paymentStatus === 'refunded' ? (
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                        Refunded
                      </span>
                    ) : (
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                        Unpaid
                      </span>
                    )}
                  </div>
                  <div className="space-y-1 text-sm">
                    <p className="text-gray-900">
                      <span className="font-medium">Contact:</span> {client.contactName}
                    </p>
                    <p className="text-gray-600">{client.email}</p>
                    <p className="text-gray-900">
                      <span className="font-medium">Niche:</span> {client.niche}
                    </p>
                    <div className="flex items-center justify-between pt-2 mt-2 border-t border-gray-100">
                      <span className="text-gray-500 text-xs">{formatDate(client.createdAt)}</span>
                      {client._count.scripts === 0 ? (
                        <span className="text-gray-400 text-xs">0 scripts</span>
                      ) : (
                        <span className="text-gray-900 font-medium text-xs">
                          {client._count.scripts} script{client._count.scripts !== 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Desktop: Table Layout with horizontal scroll */}
          <div className="hidden md:block overflow-x-auto -webkit-overflow-scrolling-touch">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Business Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Niche
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Scripts
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredClients.map((client) => (
                  <tr key={client.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link
                        href={`/admin/clients/${client.id}`}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        {client.businessName}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {client.niche}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {client.contactName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {client.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {client.paymentStatus === 'paid' ? (
                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                          Paid
                        </span>
                      ) : client.paymentStatus === 'refunded' ? (
                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                          Refunded
                        </span>
                      ) : (
                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                          Unpaid
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(client.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {client._count.scripts === 0 ? (
                        <span className="text-gray-400">0 scripts</span>
                      ) : (
                        <span className="text-gray-900 font-medium">
                          {client._count.scripts} script{client._count.scripts !== 1 ? 's' : ''}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
