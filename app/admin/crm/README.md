# CRM Dashboard

A comprehensive Customer Relationship Management (CRM) dashboard for managing leads, tracking the sales pipeline, and monitoring business metrics.

## Location
`/app/admin/crm/page.tsx`

## Access
Navigate to `/admin/crm` in your browser or click the "CRM" link in the admin navigation.

## Features

### 1. Stats Cards (Top Section)
Display key business metrics filtered by date range:
- **Total Leads**: Number of leads for the selected period
- **Conversion Rate**: Percentage of leads that became clients (WON status)
- **Total Revenue**: Sum of all orders for the period
- **Active Clients**: Number of clients currently in progress (paid but not delivered)

### 2. Pipeline View (Kanban Board)
Visual representation of leads organized by status:

- **NEW**: Fresh leads just added to the system
- **CONTACTED**: Leads that have been reached out to
- **QUALIFIED**: Leads verified as good fits
- **PROPOSAL_SENT**: Leads who received a proposal/quote
- **NEGOTIATING**: Active discussions about terms
- **WON**: Converted to paying clients
- **LOST**: Did not convert
- **NURTURING**: Staying in touch for future opportunities

#### Drag & Drop Functionality
- Drag lead cards between columns to update their status
- Status changes are automatically saved to the database
- Visual feedback during drag operations

### 3. Recent Activity Feed
Chronological feed showing:
- New lead submissions
- Lead status changes (especially conversions to WON)
- Payment receipts from orders

Each activity shows:
- Type-specific icon (Users, CheckCircle, CreditCard)
- Title and description
- Timestamp
- Quick action button to view details

### 4. Quick Actions Bar
Tools for managing and filtering data:
- **Search**: Real-time search across lead names, emails, and business names
- **Date Filter**: Toggle between "This Week", "This Month", and "All Time"
- **Filters**: Additional filtering options (placeholder for future enhancement)
- **Add Lead**: Opens modal to manually create a new lead

### 5. Add Lead Modal
Form to manually create leads with fields:
- Full Name (required)
- Email (required)
- Phone
- Business Name
- Business Type/Industry
- Package Interest (dropdown)
- Budget Range (dropdown)
- Notes

## Technical Details

### API Integration
The dashboard fetches data from three API endpoints:
- `GET /api/leads` - Retrieves all leads with filtering options
- `GET /api/clients` - Retrieves all clients
- `GET /api/orders` - Retrieves all orders

### Status Updates
- `PATCH /api/leads/[id]` - Updates lead information including status changes
- Automatically sets `qualifiedAt` timestamp when status changes to QUALIFIED
- Automatically sets `convertedAt` timestamp when status changes to WON

### Data Models
Uses Prisma models:
- **Lead**: Contact information, business details, status tracking
- **Client**: Converted customers with project information
- **Order**: Payment transactions and package purchases

### State Management
- React hooks for local state (`useState`, `useEffect`)
- `useMemo` for performance optimization of calculated data
- Real-time data refresh after updates

### Styling
- Tailwind CSS for all styling
- Responsive design (mobile, tablet, desktop)
- Modern card-based UI with shadows and borders
- Color-coded status badges
- Icons from `lucide-react`

## Performance Considerations

1. **Memoization**: Stats and pipeline data are memoized to prevent unnecessary recalculations
2. **Parallel API Calls**: All three endpoints are fetched simultaneously using `Promise.all`
3. **Optimistic Updates**: Drag-and-drop provides immediate visual feedback before server confirmation
4. **Efficient Filtering**: Client-side filtering for search and date ranges to minimize API calls

## Future Enhancements

Potential improvements:
1. Lead detail view with full conversation history
2. Bulk actions (export, delete, status change)
3. Advanced filters (by source, score, package interest)
4. Charts and graphs for trend analysis
5. Email/SMS integration for direct communication
6. Task and reminder system for follow-ups
7. Notes and activity timeline per lead
8. Custom pipeline stages per business needs
9. Lead scoring automation
10. Integration with calendar for scheduling calls

## Usage Tips

1. **Keep Pipeline Moving**: Regularly update lead statuses to maintain accurate pipeline visibility
2. **Monitor Conversion Rate**: Track this metric over time to identify trends and optimize sales process
3. **Use Search**: Quickly find specific leads by name, email, or business
4. **Review Activity**: Check the activity feed daily to stay on top of new leads and payments
5. **Add Context**: Use the notes field when manually adding leads to capture important details

## Troubleshooting

**Issue**: Leads not appearing in pipeline
- **Solution**: Check that leads have valid status values matching the LEAD_STATUSES enum

**Issue**: Drag and drop not working
- **Solution**: Ensure JavaScript is enabled and check browser console for errors

**Issue**: Stats showing incorrect numbers
- **Solution**: Verify date filter is set correctly; refresh the page to fetch latest data

**Issue**: Can't create new lead
- **Solution**: Ensure name and email fields are filled (required fields)

## Related Files

- `/app/admin/crm/page.tsx` - Main dashboard component
- `/app/api/leads/route.ts` - Leads API (GET, POST)
- `/app/api/leads/[id]/route.ts` - Individual lead API (GET, PATCH, DELETE)
- `/app/api/clients/route.ts` - Clients API
- `/app/api/orders/route.ts` - Orders API
- `/prisma/schema.prisma` - Database schema definitions
- `/app/admin/layout.tsx` - Admin navigation (includes CRM link)
