# Reminder System Documentation

## Overview

A comprehensive follow-up reminder system for managing leads and clients with automatic scheduling, priority management, and flexible filtering.

## Database Schema

### Reminder Model
```prisma
model Reminder {
  id          String   @id @default(cuid())
  createdAt   DateTime @default(now())
  dueAt       DateTime
  completedAt DateTime?

  type        String   // "follow_up", "payment_reminder", "check_in"
  title       String
  description String?  @db.Text
  priority    String   @default("normal") // low, normal, high, urgent

  leadId      String?
  clientId    String?

  status      String   @default("pending") // pending, completed, snoozed, cancelled

  @@index([dueAt])
  @@index([status])
}
```

## Files Created

### 1. Prisma Schema
- **File**: `/prisma/schema.prisma`
- **Added**: Reminder model with indexes

### 2. Helper Functions
- **File**: `/lib/reminders.ts`
- **Functions**:
  - `createFollowUpReminder()` - Create follow-up for leads
  - `createPaymentReminder()` - Create payment reminders for clients
  - `createCheckInReminder()` - Create check-in reminders
  - `scheduleNewLeadFollowUp()` - Auto-creates 24hr and 72hr follow-ups
  - `getUpcomingReminders()` - Get reminders due in next X days
  - `getOverdueReminders()` - Get overdue reminders
  - `getTodaysReminders()` - Get today's reminders
  - `completeReminder()` - Mark reminder as complete
  - `snoozeReminder()` - Push reminder forward by X days
  - `cancelReminder()` - Cancel a reminder
  - `getLeadReminders()` - Get all reminders for a lead
  - `getClientReminders()` - Get all reminders for a client

### 3. API Routes

#### GET /api/reminders
List reminders with filtering
- Query params:
  - `status` - Filter by status (pending, completed, snoozed, cancelled)
  - `type` - Filter by type (follow_up, payment_reminder, check_in)
  - `leadId` - Filter by lead ID
  - `clientId` - Filter by client ID
  - `dateFrom` - Filter by start date
  - `dateTo` - Filter by end date
  - `overdue=true` - Get overdue reminders
  - `today=true` - Get today's reminders

#### POST /api/reminders
Create a new reminder
```json
{
  "type": "follow_up",
  "title": "Follow up with lead",
  "description": "Discuss pricing options",
  "priority": "high",
  "dueAt": "2025-12-05T09:00:00Z",
  "leadId": "lead_123",
  "clientId": null
}
```

#### PATCH /api/reminders/[id]
Update or perform actions on a reminder

Actions:
```json
{ "action": "complete" }
{ "action": "snooze", "days": 1 }
{ "action": "cancel" }
```

Regular update:
```json
{
  "title": "Updated title",
  "description": "Updated description",
  "priority": "urgent",
  "dueAt": "2025-12-06T10:00:00Z"
}
```

#### DELETE /api/reminders/[id]
Delete a reminder

### 4. Components

#### RemindersWidget
- **File**: `/components/admin/RemindersWidget.tsx`
- **Usage**: Dashboard widget showing today's and overdue reminders
- **Features**:
  - Shows up to 6 reminders (3 overdue, 3 today)
  - Quick complete and snooze buttons
  - Links to leads/clients
  - Priority color coding
  - Link to full reminders page

#### Reminders Page
- **File**: `/app/admin/reminders/page.tsx`
- **URL**: `/admin/reminders`
- **Features**:
  - Full list view with filters
  - Statistics dashboard (total, overdue, today, upcoming)
  - Filter by status, type, and priority
  - List view with grouped by date
  - Calendar view placeholder (coming soon)
  - Create new reminder modal
  - Complete, snooze, and delete actions
  - Bulk actions support
  - Overdue highlighting

## Usage Examples

### 1. Auto-schedule follow-ups for new leads
```typescript
import { scheduleNewLeadFollowUp } from '@/lib/reminders'

// When a new lead is created
const lead = await prisma.lead.create({ data: leadData })
await scheduleNewLeadFollowUp(lead.id)
// Creates 24hr and 72hr follow-up reminders
```

### 2. Create payment reminder
```typescript
import { createPaymentReminder } from '@/lib/reminders'

// When payment is due
const dueDate = new Date('2025-12-10')
await createPaymentReminder(
  clientId,
  dueDate,
  'Monthly subscription payment due',
  'Content Engine Pro - $297/month'
)
```

### 3. Manual follow-up reminder
```typescript
import { createFollowUpReminder } from '@/lib/reminders'

// Follow up in 3 days
await createFollowUpReminder(
  leadId,
  3,
  'Follow up on proposal',
  'Check if they reviewed the pricing and package options'
)
```

### 4. Get lead's pending reminders
```typescript
import { getLeadReminders } from '@/lib/reminders'

const reminders = await getLeadReminders(leadId)
// Returns all pending/snoozed reminders for the lead
```

### 5. Check for overdue reminders
```typescript
import { getOverdueReminders } from '@/lib/reminders'

const overdueReminders = await getOverdueReminders()
// Use this in a cron job or background task
```

## Integration Points

### Lead Creation Hook
Add automatic follow-up scheduling when leads are created:

```typescript
// In your lead creation API route or service
const lead = await prisma.lead.create({
  data: leadData
})

// Schedule automatic follow-ups
await scheduleNewLeadFollowUp(lead.id)
```

### Client Subscription Management
Create payment reminders when subscriptions are created:

```typescript
// When client subscribes
const client = await prisma.client.update({
  where: { id: clientId },
  data: {
    isSubscription: true,
    subscriptionStartDate: new Date(),
  }
})

// Schedule monthly payment reminder
const nextPaymentDate = new Date()
nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1)
await createPaymentReminder(
  client.id,
  nextPaymentDate,
  'Monthly subscription payment',
  `${client.package} - Next payment due`
)
```

### Dashboard Integration
Add the RemindersWidget to your admin dashboard:

```tsx
import RemindersWidget from '@/components/admin/RemindersWidget'

export default function Dashboard() {
  return (
    <div className="dashboard">
      <RemindersWidget />
      {/* Other dashboard components */}
    </div>
  )
}
```

## API Response Examples

### GET /api/reminders?today=true
```json
{
  "success": true,
  "reminders": [
    {
      "id": "clx123abc",
      "type": "follow_up",
      "title": "Follow up with lead",
      "description": "Discuss pricing",
      "priority": "high",
      "dueAt": "2025-12-04T09:00:00Z",
      "status": "pending",
      "leadId": "lead_123",
      "clientId": null,
      "createdAt": "2025-12-03T10:00:00Z",
      "completedAt": null,
      "lead": {
        "id": "lead_123",
        "fullName": "John Doe",
        "email": "john@example.com",
        "businessName": "Acme Corp"
      },
      "client": null
    }
  ]
}
```

## Priority Levels

1. **Urgent** (Red) - Critical reminders requiring immediate attention
2. **High** (Orange) - Important reminders, typically payment-related
3. **Normal** (Blue) - Standard follow-ups and check-ins
4. **Low** (Gray) - Non-urgent reminders

## Reminder Types

1. **follow_up** - Lead follow-ups and touch points
2. **payment_reminder** - Payment due dates and subscription renewals
3. **check_in** - Client satisfaction checks and milestone reviews

## Status Flow

```
pending → completed
pending → snoozed → pending
pending → cancelled
```

## Database Migration

After adding the Reminder model, run:

```bash
npx prisma migrate dev --name add_reminder_model
npx prisma generate
```

## Best Practices

1. **Auto-schedule for new leads**: Always create follow-up reminders when leads enter the system
2. **Payment reminders**: Set 7 days before payment due date
3. **Check-ins**: Schedule 1 week after project delivery
4. **Priority usage**:
   - Urgent: Overdue items, critical follow-ups
   - High: Payment reminders, qualified lead follow-ups
   - Normal: Standard follow-ups
   - Low: Long-term nurture reminders

## Future Enhancements

- Email/SMS notifications for reminders
- Calendar view implementation
- Recurring reminders
- Reminder templates
- Team assignment
- Bulk operations UI
- Reminder analytics dashboard
- Integration with external calendar systems (Google Calendar, Outlook)
