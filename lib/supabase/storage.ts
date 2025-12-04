import { createClient } from './client'

const BUCKET_NAME = 'client-assets'

export interface UploadResult {
  success: boolean
  url?: string
  error?: string
  path?: string
}

// Upload a file to Supabase Storage
export async function uploadFile(
  file: File,
  clientId: string,
  folder: 'videos' | 'images' | 'documents' = 'videos'
): Promise<UploadResult> {
  const supabase = createClient()
  
  // Generate unique filename
  const timestamp = Date.now()
  const fileName = `${clientId}/${folder}/${timestamp}-${file.name}`

  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false
    })

  if (error) {
    console.error('Upload error:', error)
    return { success: false, error: error.message }
  }

  // Get public URL
  const { data: urlData } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(data.path)

  return {
    success: true,
    url: urlData.publicUrl,
    path: data.path
  }
}

// Delete a file from storage
export async function deleteFile(path: string): Promise<boolean> {
  const supabase = createClient()
  
  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .remove([path])

  if (error) {
    console.error('Delete error:', error)
    return false
  }

  return true
}

// List files for a client
export async function listClientFiles(clientId: string, folder?: string) {
  const supabase = createClient()
  
  const path = folder ? `${clientId}/${folder}` : clientId

  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .list(path)

  if (error) {
    console.error('List error:', error)
    return []
  }

  return data
}

// Get signed URL for private files (if bucket is private)
export async function getSignedUrl(path: string, expiresIn: number = 3600) {
  const supabase = createClient()
  
  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .createSignedUrl(path, expiresIn)

  if (error) {
    console.error('Signed URL error:', error)
    return null
  }

  return data.signedUrl
}
