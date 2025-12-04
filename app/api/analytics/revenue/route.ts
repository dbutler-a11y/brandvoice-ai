import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Helper to get date range
function getDateRange(days: number): Date {
  const date = new Date()
  date.setDate(date.getDate() - days)
  date.setHours(0, 0, 0, 0)
  return date
}

// Helper to format date as YYYY-MM-DD
function formatDate(date: Date): string {
  return date.toISOString().split('T')[0]
}

// Helper to get month key (YYYY-MM)
function getMonthKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
}

// GET /api/analytics/revenue - Get revenue analytics data
export async function GET() {
  try {
    // Fetch all orders (paid status)
    const orders = await prisma.order.findMany({
      where: {
        status: {
          in: ['paid', 'processing', 'fulfilled']
        }
      },
      orderBy: {
        createdAt: 'asc'
      }
    })

    // Fetch all clients with subscription info
    const subscriptionClients = await prisma.client.findMany({
      where: {
        isSubscription: true,
        subscriptionStartDate: {
          not: null
        },
        // Active subscriptions (not ended or end date is in the future)
        OR: [
          { subscriptionEndDate: null },
          { subscriptionEndDate: { gte: new Date() } }
        ]
      },
      select: {
        packagePrice: true,
        subscriptionStartDate: true
      }
    })

    // Calculate total revenue
    const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0)

    // Calculate MRR (Monthly Recurring Revenue)
    const mrr = subscriptionClients.reduce((sum, client) => {
      return sum + (client.packagePrice || 0)
    }, 0)

    // Calculate Average Order Value
    const aov = orders.length > 0 ? Math.round(totalRevenue / orders.length) : 0

    // Daily revenue for last 30 days
    const thirtyDaysAgo = getDateRange(30)
    const dailyRevenue: { date: string; revenue: number }[] = []
    const dailyMap = new Map<string, number>()

    orders.forEach(order => {
      if (order.createdAt >= thirtyDaysAgo) {
        const dateKey = formatDate(order.createdAt)
        const current = dailyMap.get(dateKey) || 0
        dailyMap.set(dateKey, current + order.totalAmount)
      }
    })

    // Fill in all dates for last 30 days (including zero revenue days)
    for (let i = 29; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dateKey = formatDate(date)
      dailyRevenue.push({
        date: dateKey,
        revenue: dailyMap.get(dateKey) || 0
      })
    }

    // Monthly revenue for last 12 months
    const twelveMonthsAgo = new Date()
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12)
    twelveMonthsAgo.setDate(1)
    twelveMonthsAgo.setHours(0, 0, 0, 0)

    const monthlyRevenue: { month: string; revenue: number }[] = []
    const monthlyMap = new Map<string, number>()

    orders.forEach(order => {
      if (order.createdAt >= twelveMonthsAgo) {
        const monthKey = getMonthKey(order.createdAt)
        const current = monthlyMap.get(monthKey) || 0
        monthlyMap.set(monthKey, current + order.totalAmount)
      }
    })

    // Fill in all months for last 12 months
    for (let i = 11; i >= 0; i--) {
      const date = new Date()
      date.setMonth(date.getMonth() - i)
      const monthKey = getMonthKey(date)
      const monthLabel = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
      monthlyRevenue.push({
        month: monthLabel,
        revenue: monthlyMap.get(monthKey) || 0
      })
    }

    // Package breakdown
    const packageBreakdown: { name: string; count: number; revenue: number }[] = []
    const packageMap = new Map<string, { count: number; revenue: number }>()

    orders.forEach(order => {
      const current = packageMap.get(order.packageId) || { count: 0, revenue: 0 }
      packageMap.set(order.packageId, {
        count: current.count + 1,
        revenue: current.revenue + order.totalAmount
      })
    })

    // Convert package IDs to readable names and sort by revenue
    const packageNames: Record<string, string> = {
      'launch-kit': 'Launch Kit',
      'content-engine': 'Content Engine',
      'content-engine-pro': 'Content Engine Pro',
      'authority-engine': 'Authority Engine'
    }

    packageMap.forEach((data, packageId) => {
      packageBreakdown.push({
        name: packageNames[packageId] || packageId,
        count: data.count,
        revenue: data.revenue
      })
    })

    packageBreakdown.sort((a, b) => b.revenue - a.revenue)

    // Add-on statistics
    let ordersWithAddOns = 0
    const addOnCounts = new Map<string, number>()
    const addOnRevenue = new Map<string, number>()

    orders.forEach(order => {
      if (order.addOns) {
        try {
          const addOns = JSON.parse(order.addOns)
          if (Array.isArray(addOns) && addOns.length > 0) {
            ordersWithAddOns++
            addOns.forEach((addon: any) => {
              const name = addon.name || addon.id
              addOnCounts.set(name, (addOnCounts.get(name) || 0) + 1)
              addOnRevenue.set(name, (addOnRevenue.get(name) || 0) + (addon.price * addon.quantity * 100))
            })
          }
        } catch (e) {
          // Skip invalid JSON
        }
      }
    })

    const addOnAttachmentRate = orders.length > 0
      ? Math.round((ordersWithAddOns / orders.length) * 100)
      : 0

    // Most popular add-ons
    const popularAddOns: { name: string; count: number; revenue: number }[] = []
    addOnCounts.forEach((count, name) => {
      popularAddOns.push({
        name,
        count,
        revenue: addOnRevenue.get(name) || 0
      })
    })
    popularAddOns.sort((a, b) => b.count - a.count)

    // Revenue by package type (for pie chart)
    const revenueByPackage = packageBreakdown.map(pkg => ({
      name: pkg.name,
      value: pkg.revenue,
      percentage: totalRevenue > 0 ? Math.round((pkg.revenue / totalRevenue) * 100) : 0
    }))

    return NextResponse.json({
      totalRevenue,
      mrr,
      aov,
      totalOrders: orders.length,
      activeSubscriptions: subscriptionClients.length,
      dailyRevenue,
      monthlyRevenue,
      packageBreakdown,
      revenueByPackage,
      addOnAttachmentRate,
      popularAddOns: popularAddOns.slice(0, 5) // Top 5
    })
  } catch (error) {
    console.error('Error fetching revenue analytics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch revenue analytics' },
      { status: 500 }
    )
  }
}
