# CRM Dashboard - Quick Start Guide

## Accessing the Dashboard
1. Navigate to your admin panel at `/admin`
2. Click the **CRM** link in the navigation bar (blue highlight)
3. Or directly visit `/admin/crm`

## Understanding the Dashboard Layout

### Top Section: Stats Overview
Four key metrics displayed in cards:
```
┌─────────────┬─────────────┬─────────────┬─────────────┐
│ Total Leads │ Conversion  │   Total     │   Active    │
│     42      │    Rate     │   Revenue   │   Clients   │
│             │    28.5%    │   $15,240   │     12      │
└─────────────┴─────────────┴─────────────┴─────────────┘
```

### Search & Filter Bar
- **Search Box**: Type to filter by name, email, or business
- **Date Dropdown**: Choose "This Week", "This Month", or "All Time"
- **Filters Button**: Additional filtering (future feature)
- **Add Lead Button**: Create new lead manually

### Pipeline Kanban Board
```
┌──────────┬──────────┬──────────┬──────────┬──────────┬──────┬──────┬──────────┐
│   NEW    │CONTACTED │QUALIFIED │PROPOSAL  │NEGOTIAT- │ WON  │ LOST │NURTURING │
│    (5)   │   (8)    │   (12)   │   (6)    │   (4)    │ (5)  │ (2)  │   (3)    │
├──────────┼──────────┼──────────┼──────────┼──────────┼──────┼──────┼──────────┤
│ [Lead 1] │ [Lead 2] │ [Lead 3] │   ...    │   ...    │ ...  │ ...  │   ...    │
│ [Lead 4] │ [Lead 5] │ [Lead 6] │          │          │      │      │          │
└──────────┴──────────┴──────────┴──────────┴──────────┴──────┴──────┴──────────┘
```

### Activity Feed
Recent actions displayed chronologically:
- New lead submissions
- Status changes
- Payment receipts

## Common Tasks

### 1. Adding a New Lead Manually
```
1. Click "Add Lead" button (top right)
2. Fill in the form:
   - Full Name * (required)
   - Email * (required)
   - Phone
   - Business Name
   - Industry
   - Package Interest (dropdown)
   - Budget Range (dropdown)
   - Notes
3. Click "Create Lead"
```

### 2. Moving Leads Through Pipeline
```
Method 1: Drag and Drop
1. Click and hold on a lead card
2. Drag to the desired status column
3. Release to drop
4. Status updates automatically

Method 2: (Future) Click lead → Update status in detail view
```

### 3. Searching for a Lead
```
1. Type in search box at top
2. Results filter in real-time
3. Searches across:
   - Full name
   - Email address
   - Business name
```

### 4. Viewing Different Time Periods
```
1. Click date filter dropdown
2. Select:
   - This Week (last 7 days)
   - This Month (current month)
   - All Time (everything)
3. Stats and metrics update automatically
```

### 5. Monitoring Recent Activity
```
1. Scroll to "Recent Activity" section
2. View chronological feed of:
   - 👥 New leads (blue)
   - ✓ Status changes (green)
   - 💳 Payments (purple)
3. Click arrow icon to view details (future feature)
```

## Lead Card Information
Each lead card shows:
```
┌─────────────────────────────────┐
│ John Doe              Score: 85  │ ← Name & Lead Score
│ 🏢 Acme Corp                     │ ← Business Name
│ ✉️ john@acme.com                 │ ← Email
│ 📞 (555) 123-4567                │ ← Phone
│ ────────────────────────────────│
│ 🕐 Dec 4, 2025    $2,500         │ ← Date & Package
│ [View Details]                   │ ← Action Button
└─────────────────────────────────┘
```

## Pipeline Status Definitions

| Status | Meaning | Next Steps |
|--------|---------|------------|
| **NEW** | Just submitted, not yet contacted | Reach out within 24 hours |
| **CONTACTED** | Initial contact made | Qualify their needs |
| **QUALIFIED** | Good fit, interested | Send proposal |
| **PROPOSAL_SENT** | Quote/proposal delivered | Follow up in 2-3 days |
| **NEGOTIATING** | Discussing terms, pricing | Work toward close |
| **WON** | Converted to client | Create client project |
| **LOST** | Did not convert | Note reason, move to nurture |
| **NURTURING** | Not ready now, stay in touch | Check in quarterly |

## Best Practices

### Daily Routine
1. Check "Recent Activity" for new leads
2. Review "NEW" column and make initial contact
3. Move leads to "CONTACTED" after reaching out
4. Follow up on "PROPOSAL_SENT" leads (2-3 days old)
5. Update any status changes from conversations

### Weekly Review
1. Change date filter to "This Week"
2. Review conversion rate trend
3. Check for stale leads (no movement in 7+ days)
4. Move inactive leads to "NURTURING" or "LOST"
5. Celebrate "WON" conversions

### Monthly Analysis
1. Set date filter to "This Month"
2. Review total leads vs. last month
3. Analyze conversion rate
4. Check revenue against goals
5. Identify bottlenecks in pipeline

## Keyboard Shortcuts (Future Feature)
- `Cmd/Ctrl + K`: Focus search
- `N`: New lead
- `R`: Refresh data
- `/`: Focus filters

## Troubleshooting

**Q: I don't see any leads**
A: Check if you have the correct date filter selected. Try "All Time" to see everything.

**Q: Drag and drop isn't working**
A: Make sure you're clicking and holding on the card, not on buttons within the card.

**Q: Stats seem incorrect**
A: Refresh the page to fetch the latest data. Stats are calculated based on the selected date filter.

**Q: Can't submit new lead form**
A: Ensure both "Full Name" and "Email" fields are filled (required fields).

**Q: Lead disappeared after dragging**
A: If you don't see the lead in the new column, refresh the page. There may have been a connection issue.

## Support & Feedback
For issues or feature requests, contact the development team or submit a ticket.

---

## Quick Reference: API Endpoints

For developers integrating with the CRM:

```bash
# Get all leads
GET /api/leads

# Get single lead
GET /api/leads/[id]

# Create new lead
POST /api/leads
Body: { fullName, email, phone, businessName, ... }

# Update lead (including status)
PATCH /api/leads/[id]
Body: { status: "CONTACTED" }

# Delete lead
DELETE /api/leads/[id]

# Get all clients
GET /api/clients

# Get all orders
GET /api/orders
```

## Status Enum Values
When using the API, status must be one of:
- `NEW`
- `CONTACTED`
- `QUALIFIED`
- `PROPOSAL_SENT`
- `NEGOTIATING`
- `WON`
- `LOST`
- `NURTURING`
