'use client'

import { useState, useCallback, useRef } from 'react'
import { uploadFile } from '@/lib/supabase/storage'

interface FileUploadProps {
  clientId: string
  folder: 'videos' | 'images' | 'documents'
  onUploadComplete: (url: string, path: string) => void
}

const ACCEPTED_FILE_TYPES: Record<string, string[]> = {
  videos: ['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/webm'],
  images: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'],
  documents: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
}

const FOLDER_LABELS: Record<string, string> = {
  videos: 'Videos',
  images: 'Images',
  documents: 'Documents (PDF)'
}

export default function FileUpload({ clientId, folder, onUploadComplete }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<number>(0)
  const [error, setError] = useState<string | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const validateFile = (file: File): boolean => {
    const acceptedTypes = ACCEPTED_FILE_TYPES[folder]

    if (!acceptedTypes.includes(file.type)) {
      setError(`Invalid file type. Please upload ${FOLDER_LABELS[folder].toLowerCase()} only.`)
      return false
    }

    // Check file size (max 100MB)
    const maxSize = 100 * 1024 * 1024
    if (file.size > maxSize) {
      setError('File size must be less than 100MB')
      return false
    }

    return true
  }

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return

    setError(null)
    setPreviewUrl(null)

    const file = files[0]

    if (!validateFile(file)) {
      return
    }

    // Show preview for images
    if (folder === 'images' && file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string)
      }
      reader.readAsDataURL(file)
    }

    setUploading(true)
    setUploadProgress(0)

    try {
      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => Math.min(prev + 10, 90))
      }, 200)

      const result = await uploadFile(file, clientId, folder)

      clearInterval(progressInterval)
      setUploadProgress(100)

      if (result.success && result.url && result.path) {
        setTimeout(() => {
          onUploadComplete(result.url!, result.path!)
          setUploading(false)
          setUploadProgress(0)
          setPreviewUrl(null)
          if (fileInputRef.current) {
            fileInputRef.current.value = ''
          }
        }, 500)
      } else {
        throw new Error(result.error || 'Upload failed')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload file')
      setUploading(false)
      setUploadProgress(0)
    }
  }

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    handleFiles(e.dataTransfer.files)
  }, [folder, clientId])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files)
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="w-full">
      {/* Upload Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
        className={`relative border-2 border-dashed rounded-lg p-8 transition-all cursor-pointer ${
          isDragging
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400 bg-gray-50 hover:bg-gray-100'
        } ${uploading ? 'pointer-events-none opacity-60' : ''}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileSelect}
          accept={ACCEPTED_FILE_TYPES[folder].join(',')}
          className="hidden"
          disabled={uploading}
        />

        <div className="flex flex-col items-center justify-center text-center">
          {/* Icon */}
          <div className="mb-4">
            {folder === 'videos' && (
              <svg
                className="w-12 h-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
            )}
            {folder === 'images' && (
              <svg
                className="w-12 h-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            )}
            {folder === 'documents' && (
              <svg
                className="w-12 h-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
              </svg>
            )}
          </div>

          {/* Text */}
          <p className="text-lg font-medium text-gray-700 mb-1">
            {uploading ? 'Uploading...' : 'Drop file here or click to browse'}
          </p>
          <p className="text-sm text-gray-500">
            {FOLDER_LABELS[folder]} (max 100MB)
          </p>
        </div>

        {/* Progress Bar */}
        {uploading && (
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <p className="text-sm text-gray-600 text-center mt-2">{uploadProgress}%</p>
          </div>
        )}
      </div>

      {/* Preview */}
      {previewUrl && !uploading && (
        <div className="mt-4">
          <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
          <img
            src={previewUrl}
            alt="Preview"
            className="max-w-xs max-h-48 rounded-lg border border-gray-300"
          />
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error}
        </div>
      )}
    </div>
  )
}
