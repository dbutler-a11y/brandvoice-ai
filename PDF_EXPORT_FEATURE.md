# PDF Export Feature Documentation

## Overview
The PDF Export feature allows users to export all client scripts as a professionally formatted PDF document. This feature provides a polished, client-ready deliverable for the 30-day script packages.

## Files Created/Modified

### 1. **lib/pdfExport.ts** (NEW)
- Core PDF generation utility using jsPDF
- Generates professional multi-page PDF documents with:
  - Cover page with client name, date, script count, and total duration
  - Table of contents organized by script type
  - Individual script sections with proper formatting
  - Page numbers in footer
  - Professional typography and spacing

**Key Functions:**
- `generateScriptsPDF(options)`: Creates PDF document from client data
- `downloadPDF(doc, filename)`: Triggers browser download
- `generateAndDownloadScriptsPDF(client)`: Convenience function combining both

### 2. **app/api/clients/[id]/export-pdf/route.ts** (NEW)
- API endpoint for PDF generation
- GET endpoint at `/api/clients/[id]/export-pdf`
- Fetches client and all scripts from database
- Generates PDF server-side
- Returns PDF as downloadable file with proper headers

### 3. **app/admin/clients/[clientId]/page.tsx** (MODIFIED)
- Added `handleDownloadPDF()` function to fetch PDF from API
- Added "Download as PDF" button with document icon
- Button styled in red to stand out from other export options
- Includes error handling with user-friendly messages

### 4. **package.json** (MODIFIED)
- Added dependency: `jspdf@^3.0.4`

## PDF Structure

### Cover Page
- Client business name (large, bold, blue header)
- "30-Day Video Content Scripts" subtitle
- Generated date
- Total script count
- Total duration in minutes
- Client information section (contact, email, niche, tone)

### Table of Contents
- Lists all script types with counts
- Organized by:
  - FAQ Scripts
  - Service/Explainer Scripts
  - Promo Scripts
  - Testimonial Scripts
  - Tip/Educational Scripts
  - Brand/Credibility Scripts

### Script Sections
Each script type section includes:
- Section header with script type name
- Individual scripts with:
  - Numbered title
  - Status badge (Draft/Approved/Exported)
  - Duration estimate
  - Full script text with proper line wrapping
  - Separator lines between scripts

### Footer
- Page numbers on every page (centered)

## Design Features

### Typography
- **Headers:** Helvetica Bold, 18-28pt
- **Body:** Helvetica Regular, 9-12pt
- **Colors:**
  - Primary: Blue (#1E3A8A)
  - Secondary: Slate (#47556D)
  - Body: Dark Gray (#323232)

### Layout
- A4 page format (portrait)
- 20mm margins
- Automatic page breaks
- Text wrapping for long content
- Professional spacing between sections

### Professional Elements
- Decorative divider lines
- Color-coded sections
- Consistent formatting throughout
- Clean, readable design

## Usage

### For Users
1. Navigate to client detail page
2. Ensure scripts are generated
3. Click "Download as PDF" button in Export Scripts section
4. PDF will download automatically with filename: `{ClientName}_scripts.pdf`

### For Developers
```typescript
// API Usage
GET /api/clients/[id]/export-pdf

// Response
Content-Type: application/pdf
Content-Disposition: attachment; filename="ClientName_Scripts.pdf"
```

```typescript
// Programmatic Usage
import { generateAndDownloadScriptsPDF } from '@/lib/pdfExport'

// Client data with scripts
const client: ClientWithRelations = { ... }

// Generate and download
generateAndDownloadScriptsPDF(client)
```

## Error Handling

### Client-Side
- Validates client data exists
- Shows alert on API errors
- Logs errors to console for debugging

### Server-Side
- Returns 404 if client not found
- Returns 400 if no scripts available
- Returns 500 for generation errors
- Includes error messages in response

## Technical Details

### Dependencies
- **jsPDF**: PDF generation library
  - Version: ^3.0.4
  - License: MIT
  - Features: Text wrapping, page management, font styling

### Browser Compatibility
- Modern browsers with Blob API support
- Chrome, Firefox, Safari, Edge (latest versions)
- Mobile browsers supported

### Performance
- Generates PDFs client-side for speed
- Typical generation time: < 1 second for 30 scripts
- File size: 50-200KB depending on script content

## Future Enhancements

Potential improvements:
1. Add client logo to cover page
2. Custom color schemes matching brand colors
3. Optional script filtering (export specific types)
4. Include intake data as appendix
5. Add QR codes linking to video content
6. Email PDF directly to client
7. Batch export for multiple clients

## Testing

To test the feature:
1. Create a client with scripts
2. Navigate to client detail page
3. Click "Download as PDF"
4. Verify PDF contains:
   - Cover page with correct client info
   - Table of contents
   - All scripts organized by type
   - Page numbers
   - Professional formatting

## Maintenance

### Updating PDF Layout
- Modify `lib/pdfExport.ts`
- Adjust margins, fonts, colors in configuration
- Test with various script counts

### Updating API
- Modify `app/api/clients/[id]/export-pdf/route.ts`
- Ensure database queries include all needed relations
- Update error handling as needed

## Support

For issues or questions:
- Check TypeScript compilation: `npx tsc --noEmit`
- Review browser console for errors
- Verify jsPDF is installed: `npm list jspdf`
- Test with sample data first
