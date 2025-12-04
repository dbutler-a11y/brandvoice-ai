import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// PATCH /api/reminders/[id] - Update a reminder
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await req.json()

    // Check if reminder exists
    const existingReminder = await prisma.reminder.findUnique({
      where: { id },
    })

    if (!existingReminder) {
      return NextResponse.json(
        {
          success: false,
          error: 'Reminder not found',
        },
        { status: 404 }
      )
    }

    // Handle special actions
    if (body.action === 'complete') {
      const reminder = await prisma.reminder.update({
        where: { id },
        data: {
          status: 'completed',
          completedAt: new Date(),
        },
      })

      return NextResponse.json({
        success: true,
        reminder,
      })
    }

    if (body.action === 'snooze') {
      const days = body.days || 1
      const newDueDate = new Date(existingReminder.dueAt)
      newDueDate.setDate(newDueDate.getDate() + days)

      const reminder = await prisma.reminder.update({
        where: { id },
        data: {
          dueAt: newDueDate,
          status: 'pending',
        },
      })

      return NextResponse.json({
        success: true,
        reminder,
        message: `Reminder snoozed for ${days} day${days > 1 ? 's' : ''}`,
      })
    }

    if (body.action === 'cancel') {
      const reminder = await prisma.reminder.update({
        where: { id },
        data: {
          status: 'cancelled',
        },
      })

      return NextResponse.json({
        success: true,
        reminder,
      })
    }

    // Regular update
    const updateData: any = {}

    if (body.title !== undefined) updateData.title = body.title
    if (body.description !== undefined) updateData.description = body.description
    if (body.type !== undefined) updateData.type = body.type
    if (body.priority !== undefined) updateData.priority = body.priority
    if (body.dueAt !== undefined) updateData.dueAt = new Date(body.dueAt)
    if (body.status !== undefined) updateData.status = body.status
    if (body.leadId !== undefined) updateData.leadId = body.leadId
    if (body.clientId !== undefined) updateData.clientId = body.clientId

    // Validate type if provided
    if (body.type) {
      const validTypes = ['follow_up', 'payment_reminder', 'check_in']
      if (!validTypes.includes(body.type)) {
        return NextResponse.json(
          {
            success: false,
            error: `Invalid type. Must be one of: ${validTypes.join(', ')}`,
          },
          { status: 400 }
        )
      }
    }

    // Validate priority if provided
    if (body.priority) {
      const validPriorities = ['low', 'normal', 'high', 'urgent']
      if (!validPriorities.includes(body.priority)) {
        return NextResponse.json(
          {
            success: false,
            error: `Invalid priority. Must be one of: ${validPriorities.join(', ')}`,
          },
          { status: 400 }
        )
      }
    }

    // Validate status if provided
    if (body.status) {
      const validStatuses = ['pending', 'completed', 'snoozed', 'cancelled']
      if (!validStatuses.includes(body.status)) {
        return NextResponse.json(
          {
            success: false,
            error: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
          },
          { status: 400 }
        )
      }
    }

    const reminder = await prisma.reminder.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json({
      success: true,
      reminder,
    })
  } catch (error) {
    console.error('Error updating reminder:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update reminder',
      },
      { status: 500 }
    )
  }
}

// DELETE /api/reminders/[id] - Delete a reminder
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    // Check if reminder exists
    const existingReminder = await prisma.reminder.findUnique({
      where: { id },
    })

    if (!existingReminder) {
      return NextResponse.json(
        {
          success: false,
          error: 'Reminder not found',
        },
        { status: 404 }
      )
    }

    // Delete reminder
    await prisma.reminder.delete({
      where: { id },
    })

    return NextResponse.json({
      success: true,
      message: 'Reminder deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting reminder:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete reminder',
      },
      { status: 500 }
    )
  }
}
