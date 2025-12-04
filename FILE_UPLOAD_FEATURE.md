# File Upload Feature Documentation

## Overview

This document describes the file upload and asset management system added to the AI Spokesperson Studio admin panel.

## Files Created

### 1. `/components/admin/FileUpload.tsx`

A reusable file upload component with the following features:

- **Drag and Drop Zone**: Users can drag files directly onto the upload area
- **Click to Select**: Users can click to open a file browser dialog
- **File Type Validation**: Validates files based on the folder type:
  - Videos: mp4, quicktime, avi, webm
  - Images: jpeg, png, gif, webp, svg
  - Documents: PDF, Word documents
- **File Size Validation**: Maximum file size of 100MB
- **Upload Progress Indicator**: Shows a progress bar during upload
- **Image Preview**: Displays a preview for uploaded images before they're sent to storage
- **Error Handling**: Clear error messages for validation failures and upload errors

**Props:**
- `clientId: string` - The ID of the client
- `folder: 'videos' | 'images' | 'documents'` - The folder type for uploads
- `onUploadComplete: (url: string, path: string) => void` - Callback when upload completes

**Usage:**
```tsx
<FileUpload
  clientId={clientId}
  folder="videos"
  onUploadComplete={(url, path) => {
    console.log('File uploaded:', url)
  }}
/>
```

### 2. `/app/admin/clients/[clientId]/assets/page.tsx`

A dedicated client assets management page with:

- **Tabbed Interface**: Separate tabs for Videos, Images, and Documents
- **File Upload Section**: Integrated FileUpload component for each folder type
- **Asset Grid View**: Displays all uploaded assets in a responsive grid
- **Image Previews**: Shows thumbnails for image files
- **File Icons**: Displays appropriate icons for video and document files
- **Asset Information**: Shows file name, size, and upload date
- **Download Links**: Direct download buttons for each asset
- **Delete Functionality**: Allows admins to delete files with confirmation
- **Asset Counts**: Shows the number of assets in each category

**Features:**
- Automatically fetches and displays all client assets
- Real-time updates after upload or delete
- Responsive grid layout (1 column on mobile, 2 on tablet, 3 on desktop)
- Breadcrumb navigation showing Client > Assets
- Loading states and empty states

### 3. Updated `/app/admin/clients/[clientId]/page.tsx`

Added a "Manage Assets" button in the header that links to the assets page.

**Changes:**
- Added Link import from 'next/navigation'
- Added a button with folder icon that navigates to `/admin/clients/[clientId]/assets`
- Button is styled with indigo background to match the admin theme

## Integration with Supabase Storage

The file upload system uses the existing Supabase storage utility located at `/lib/supabase/storage.ts`:

- `uploadFile()` - Uploads files to the 'client-assets' bucket
- `deleteFile()` - Removes files from storage
- `listClientFiles()` - Lists all files for a client in a specific folder
- Files are organized by: `{clientId}/{folder}/{timestamp}-{filename}`

## Storage Structure

```
client-assets (bucket)
├── {clientId}/
│   ├── videos/
│   │   └── {timestamp}-{filename}.mp4
│   ├── images/
│   │   └── {timestamp}-{filename}.jpg
│   └── documents/
│       └── {timestamp}-{filename}.pdf
```

## UI/UX Features

1. **Consistent Styling**: Uses Tailwind CSS classes matching the existing admin panel design
2. **Responsive Design**: Works on mobile, tablet, and desktop
3. **Intuitive Icons**: Clear visual indicators for different file types
4. **Color Coding**: Purple for videos, blue for images, red for documents
5. **Loading States**: Shows spinner while fetching assets
6. **Empty States**: Helpful messages when no assets are uploaded yet
7. **Hover Effects**: Subtle animations on interactive elements
8. **Confirmation Dialogs**: Prevents accidental deletions

## Navigation Flow

1. Admin navigates to Client Detail page: `/admin/clients/[clientId]`
2. Clicks "Manage Assets" button in the header
3. Lands on Assets page: `/admin/clients/[clientId]/assets`
4. Selects a tab (Videos, Images, or Documents)
5. Uploads files via drag-and-drop or click-to-browse
6. Views/downloads/deletes existing assets

## Security Considerations

- File type validation on the client side
- File size limits (100MB max)
- Supabase storage handles server-side validation
- Delete operations require user confirmation
- All operations are tied to the authenticated client ID

## Future Enhancements

Potential improvements that could be added:

1. Bulk upload support (multiple files at once)
2. Bulk delete functionality
3. File renaming capability
4. Asset tagging/categorization
5. Search/filter functionality
6. Asset usage tracking (which assets are used in which scripts)
7. Video thumbnail generation
8. Image optimization/resizing
9. Direct video preview in the browser
10. Asset sharing/export functionality

## Testing Checklist

- [ ] Upload a video file
- [ ] Upload an image file (verify preview shows)
- [ ] Upload a PDF document
- [ ] Try uploading an invalid file type (verify error message)
- [ ] Try uploading a file >100MB (verify error message)
- [ ] Delete an asset (verify confirmation dialog)
- [ ] Download an asset
- [ ] Switch between tabs
- [ ] Test on mobile device
- [ ] Test drag-and-drop functionality
- [ ] Test click-to-browse functionality
- [ ] Verify upload progress indicator works
- [ ] Check that assets persist after page refresh

## Dependencies

- React hooks: useState, useEffect, useCallback, useRef
- Next.js: Link, useParams, useRouter
- Supabase client and storage utilities
- Tailwind CSS for styling
