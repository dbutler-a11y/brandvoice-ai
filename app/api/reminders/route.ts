import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/reminders - List reminders with filters
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status')
    const type = searchParams.get('type')
    const leadId = searchParams.get('leadId')
    const clientId = searchParams.get('clientId')
    const dateFrom = searchParams.get('dateFrom')
    const dateTo = searchParams.get('dateTo')
    const overdue = searchParams.get('overdue') === 'true'
    const today = searchParams.get('today') === 'true'

    // Build where clause
    const where: any = {}

    if (status) {
      where.status = status
    }

    if (type) {
      where.type = type
    }

    if (leadId) {
      where.leadId = leadId
    }

    if (clientId) {
      where.clientId = clientId
    }

    // Date range filtering
    if (dateFrom || dateTo) {
      where.dueAt = {}
      if (dateFrom) {
        where.dueAt.gte = new Date(dateFrom)
      }
      if (dateTo) {
        where.dueAt.lte = new Date(dateTo)
      }
    }

    // Overdue filter
    if (overdue) {
      where.status = 'pending'
      where.dueAt = {
        lt: new Date(),
      }
    }

    // Today filter
    if (today) {
      const startOfDay = new Date()
      startOfDay.setHours(0, 0, 0, 0)
      const endOfDay = new Date()
      endOfDay.setHours(23, 59, 59, 999)

      where.status = 'pending'
      where.dueAt = {
        gte: startOfDay,
        lte: endOfDay,
      }
    }

    const reminders = await prisma.reminder.findMany({
      where,
      orderBy: [{ dueAt: 'asc' }, { priority: 'desc' }],
      take: 100, // Limit to 100 results
    })

    // Fetch related lead/client data
    const remindersWithRelations = await Promise.all(
      reminders.map(async (reminder) => {
        let lead = null
        let client = null

        if (reminder.leadId) {
          lead = await prisma.lead.findUnique({
            where: { id: reminder.leadId },
            select: {
              id: true,
              fullName: true,
              email: true,
              phone: true,
              businessName: true,
              status: true,
            },
          })
        }

        if (reminder.clientId) {
          client = await prisma.client.findUnique({
            where: { id: reminder.clientId },
            select: {
              id: true,
              businessName: true,
              contactName: true,
              email: true,
              phone: true,
              projectStatus: true,
            },
          })
        }

        return {
          ...reminder,
          lead,
          client,
        }
      })
    )

    return NextResponse.json({
      success: true,
      reminders: remindersWithRelations,
    })
  } catch (error) {
    console.error('Error fetching reminders:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch reminders',
      },
      { status: 500 }
    )
  }
}

// POST /api/reminders - Create a new reminder
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { type, title, description, priority, dueAt, leadId, clientId } = body

    // Validation
    if (!type || !title || !dueAt) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: type, title, dueAt',
        },
        { status: 400 }
      )
    }

    // Validate type
    const validTypes = ['follow_up', 'payment_reminder', 'check_in']
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        {
          success: false,
          error: `Invalid type. Must be one of: ${validTypes.join(', ')}`,
        },
        { status: 400 }
      )
    }

    // Validate priority
    const validPriorities = ['low', 'normal', 'high', 'urgent']
    if (priority && !validPriorities.includes(priority)) {
      return NextResponse.json(
        {
          success: false,
          error: `Invalid priority. Must be one of: ${validPriorities.join(', ')}`,
        },
        { status: 400 }
      )
    }

    // Create reminder
    const reminder = await prisma.reminder.create({
      data: {
        type,
        title,
        description,
        priority: priority || 'normal',
        dueAt: new Date(dueAt),
        leadId: leadId || null,
        clientId: clientId || null,
        status: 'pending',
      },
    })

    return NextResponse.json({
      success: true,
      reminder,
    })
  } catch (error) {
    console.error('Error creating reminder:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create reminder',
      },
      { status: 500 }
    )
  }
}
