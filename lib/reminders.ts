import { prisma } from './prisma'

export type ReminderType = 'follow_up' | 'payment_reminder' | 'check_in'
export type ReminderPriority = 'low' | 'normal' | 'high' | 'urgent'
export type ReminderStatus = 'pending' | 'completed' | 'snoozed' | 'cancelled'

export interface CreateReminderInput {
  type: ReminderType
  title: string
  description?: string
  priority?: ReminderPriority
  dueAt: Date
  leadId?: string
  clientId?: string
}

/**
 * Create a follow-up reminder for a lead
 */
export async function createFollowUpReminder(
  leadId: string,
  daysFromNow: number,
  title?: string,
  description?: string
) {
  const dueAt = new Date()
  dueAt.setDate(dueAt.getDate() + daysFromNow)
  dueAt.setHours(9, 0, 0, 0) // Set to 9 AM

  return prisma.reminder.create({
    data: {
      type: 'follow_up',
      title: title || `Follow up with lead (${daysFromNow} day${daysFromNow > 1 ? 's' : ''})`,
      description,
      priority: 'normal',
      dueAt,
      leadId,
      status: 'pending',
    },
  })
}

/**
 * Create a payment reminder for a client
 */
export async function createPaymentReminder(
  clientId: string,
  dueDate: Date,
  title?: string,
  description?: string
) {
  return prisma.reminder.create({
    data: {
      type: 'payment_reminder',
      title: title || 'Payment reminder',
      description,
      priority: 'high',
      dueAt: dueDate,
      clientId,
      status: 'pending',
    },
  })
}

/**
 * Schedule automatic follow-ups for a new lead
 * Creates 24hr and 72hr follow-up reminders
 */
export async function scheduleNewLeadFollowUp(leadId: string) {
  const reminders = await Promise.all([
    // 24-hour follow-up
    createFollowUpReminder(
      leadId,
      1,
      'Initial follow-up (24hr)',
      'Reach out to new lead within 24 hours of first contact'
    ),
    // 72-hour follow-up
    createFollowUpReminder(
      leadId,
      3,
      'Secondary follow-up (72hr)',
      'Second touch point if no response from initial follow-up'
    ),
  ])

  return reminders
}

/**
 * Create a check-in reminder for a client
 */
export async function createCheckInReminder(
  clientId: string,
  daysFromNow: number,
  title?: string,
  description?: string
) {
  const dueAt = new Date()
  dueAt.setDate(dueAt.getDate() + daysFromNow)
  dueAt.setHours(10, 0, 0, 0) // Set to 10 AM

  return prisma.reminder.create({
    data: {
      type: 'check_in',
      title: title || `Check in with client`,
      description,
      priority: 'normal',
      dueAt,
      clientId,
      status: 'pending',
    },
  })
}

/**
 * Get upcoming reminders (due within next X days)
 */
export async function getUpcomingReminders(days: number = 7) {
  const now = new Date()
  const futureDate = new Date()
  futureDate.setDate(futureDate.getDate() + days)

  return prisma.reminder.findMany({
    where: {
      status: 'pending',
      dueAt: {
        gte: now,
        lte: futureDate,
      },
    },
    orderBy: {
      dueAt: 'asc',
    },
  })
}

/**
 * Get overdue reminders
 */
export async function getOverdueReminders() {
  const now = new Date()

  return prisma.reminder.findMany({
    where: {
      status: 'pending',
      dueAt: {
        lt: now,
      },
    },
    orderBy: {
      dueAt: 'asc',
    },
  })
}

/**
 * Get today's reminders
 */
export async function getTodaysReminders() {
  const startOfDay = new Date()
  startOfDay.setHours(0, 0, 0, 0)

  const endOfDay = new Date()
  endOfDay.setHours(23, 59, 59, 999)

  return prisma.reminder.findMany({
    where: {
      status: 'pending',
      dueAt: {
        gte: startOfDay,
        lte: endOfDay,
      },
    },
    orderBy: {
      dueAt: 'asc',
    },
  })
}

/**
 * Complete a reminder
 */
export async function completeReminder(reminderId: string) {
  return prisma.reminder.update({
    where: { id: reminderId },
    data: {
      status: 'completed',
      completedAt: new Date(),
    },
  })
}

/**
 * Snooze a reminder (push it forward by X days)
 */
export async function snoozeReminder(reminderId: string, days: number = 1) {
  const reminder = await prisma.reminder.findUnique({
    where: { id: reminderId },
  })

  if (!reminder) {
    throw new Error('Reminder not found')
  }

  const newDueDate = new Date(reminder.dueAt)
  newDueDate.setDate(newDueDate.getDate() + days)

  return prisma.reminder.update({
    where: { id: reminderId },
    data: {
      dueAt: newDueDate,
      status: 'pending', // Reset to pending if it was snoozed
    },
  })
}

/**
 * Cancel a reminder
 */
export async function cancelReminder(reminderId: string) {
  return prisma.reminder.update({
    where: { id: reminderId },
    data: {
      status: 'cancelled',
    },
  })
}

/**
 * Get reminders for a specific lead
 */
export async function getLeadReminders(leadId: string) {
  return prisma.reminder.findMany({
    where: {
      leadId,
      status: {
        in: ['pending', 'snoozed'],
      },
    },
    orderBy: {
      dueAt: 'asc',
    },
  })
}

/**
 * Get reminders for a specific client
 */
export async function getClientReminders(clientId: string) {
  return prisma.reminder.findMany({
    where: {
      clientId,
      status: {
        in: ['pending', 'snoozed'],
      },
    },
    orderBy: {
      dueAt: 'asc',
    },
  })
}
