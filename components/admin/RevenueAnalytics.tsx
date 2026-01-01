'use client'

import { useEffect, useState } from 'react'
import { TrendingUp, DollarSign, ShoppingCart, Repeat, Package } from 'lucide-react'

type RevenueData = {
  totalRevenue: number
  mrr: number
  aov: number
  totalOrders: number
  activeSubscriptions: number
  dailyRevenue: { date: string; revenue: number }[]
  monthlyRevenue: { month: string; revenue: number }[]
  packageBreakdown: { name: string; count: number; revenue: number }[]
  revenueByPackage: { name: string; value: number; percentage: number }[]
  addOnAttachmentRate: number
  popularAddOns: { name: string; count: number; revenue: number }[]
}

type ChartView = 'daily' | 'monthly'

export default function RevenueAnalytics() {
  const [data, setData] = useState<RevenueData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [chartView, setChartView] = useState<ChartView>('daily')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch('/api/analytics/revenue')
      if (!response.ok) throw new Error('Failed to fetch analytics')
      const result = await response.json()
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (cents: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(cents / 100)
  }

  const formatShortDate = (dateStr: string): string => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-8">
        <div className="flex justify-center items-center">
          <div className="text-gray-500">Loading analytics...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-8">
        <div className="text-red-600">Error: {error}</div>
      </div>
    )
  }

  if (!data) return null

  const chartData = chartView === 'daily' ? data.dailyRevenue : data.monthlyRevenue
  const maxRevenue = Math.max(...chartData.map(d => d.revenue), 1)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Revenue Analytics</h2>
            <p className="text-sm text-gray-500 mt-1">Track sales performance and revenue metrics</p>
          </div>
          <button
            onClick={fetchData}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
          >
            Refresh Data
          </button>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {formatCurrency(data.totalRevenue)}
              </p>
              <p className="text-xs text-gray-500 mt-1">{data.totalOrders} orders</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        {/* Monthly Recurring Revenue */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Monthly Recurring Revenue</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {formatCurrency(data.mrr)}
              </p>
              <p className="text-xs text-gray-500 mt-1">{data.activeSubscriptions} active subscriptions</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Repeat className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Average Order Value */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Average Order Value</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {formatCurrency(data.aov)}
              </p>
              <p className="text-xs text-gray-500 mt-1">per transaction</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <ShoppingCart className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Add-on Attachment Rate */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Add-on Attachment Rate</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {data.addOnAttachmentRate}%
              </p>
              <p className="text-xs text-gray-500 mt-1">orders with add-ons</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">Revenue Over Time</h3>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setChartView('daily')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                chartView === 'daily'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Last 30 Days
            </button>
            <button
              onClick={() => setChartView('monthly')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                chartView === 'monthly'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Last 12 Months
            </button>
          </div>
        </div>

        {/* Bar Chart */}
        <div className="space-y-2">
          {chartData.map((item, index) => {
            const label = 'date' in item
              ? formatShortDate(item.date)
              : item.month
            const revenue = item.revenue
            const heightPercent = maxRevenue > 0 ? (revenue / maxRevenue) * 100 : 0

            return (
              <div key={index} className="flex items-center space-x-3">
                <div className="w-20 text-xs text-gray-600 text-right">
                  {label}
                </div>
                <div className="flex-grow bg-gray-100 rounded h-8 relative overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded transition-all duration-300 flex items-center justify-end pr-2"
                    style={{ width: `${heightPercent}%` }}
                  >
                    {revenue > 0 && (
                      <span className="text-xs font-medium text-white">
                        {formatCurrency(revenue)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Package Breakdown and Add-ons */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Package Popularity */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Package Popularity</h3>

          {/* Pie Chart Visual */}
          <div className="mb-6">
            <div className="flex h-8 rounded-lg overflow-hidden">
              {data.revenueByPackage.map((pkg, index) => {
                const colors = [
                  'bg-blue-500',
                  'bg-green-500',
                  'bg-purple-500',
                  'bg-orange-500'
                ]
                return (
                  <div
                    key={index}
                    className={`${colors[index % colors.length]} flex items-center justify-center text-white text-xs font-medium`}
                    style={{ width: `${pkg.percentage}%` }}
                    title={`${pkg.name}: ${pkg.percentage}%`}
                  >
                    {pkg.percentage > 10 && `${pkg.percentage}%`}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Package List */}
          <div className="space-y-3">
            {data.packageBreakdown.map((pkg, index) => {
              const colors = [
                { bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-500' },
                { bg: 'bg-green-50', text: 'text-green-700', dot: 'bg-green-500' },
                { bg: 'bg-purple-50', text: 'text-purple-700', dot: 'bg-purple-500' },
                { bg: 'bg-orange-50', text: 'text-orange-700', dot: 'bg-orange-500' }
              ]
              const color = colors[index % colors.length]

              return (
                <div key={index} className={`${color.bg} rounded-lg p-4`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${color.dot}`} />
                      <div>
                        <p className={`font-medium ${color.text}`}>{pkg.name}</p>
                        <p className="text-xs text-gray-600">{pkg.count} sales</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold ${color.text}`}>
                        {formatCurrency(pkg.revenue)}
                      </p>
                      <p className="text-xs text-gray-600">
                        {data.totalRevenue > 0
                          ? Math.round((pkg.revenue / data.totalRevenue) * 100)
                          : 0}% of total
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {data.packageBreakdown.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p>No package data available</p>
            </div>
          )}
        </div>

        {/* Popular Add-ons */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Most Popular Add-ons</h3>

          {/* Add-on Attachment Rate Banner */}
          <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-900">Attachment Rate</p>
                <p className="text-xs text-orange-700 mt-0.5">
                  {data.addOnAttachmentRate}% of orders include add-ons
                </p>
              </div>
              <div className="text-3xl font-bold text-orange-600">
                {data.addOnAttachmentRate}%
              </div>
            </div>
          </div>

          {/* Add-on List */}
          <div className="space-y-3">
            {data.popularAddOns.map((addon, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium text-gray-900">{addon.name}</p>
                  <span className="px-2 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-700">
                    #{index + 1}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">{addon.count} sales</span>
                  <span className="font-semibold text-gray-900">
                    {formatCurrency(addon.revenue)}
                  </span>
                </div>
                {/* Progress bar */}
                <div className="mt-2 bg-gray-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-orange-500 h-full rounded-full transition-all"
                    style={{
                      width: `${data.popularAddOns.length > 0
                        ? (addon.count / data.popularAddOns[0].count) * 100
                        : 0}%`
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          {data.popularAddOns.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Package className="w-12 h-12 mx-auto mb-3 text-gray-400" />
              <p>No add-on data available</p>
              <p className="text-sm mt-1">Add-ons will appear here once orders are placed</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
