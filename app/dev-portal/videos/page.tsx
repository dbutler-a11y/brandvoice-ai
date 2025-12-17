'use client'

import { useState } from 'react'

interface Video {
  id: string
  fileName: string
  fileUrl: string
  uploadedAt: string
  fileSize: number
}

// Mock videos for development
const mockVideos: Video[] = [
  {
    id: '1',
    fileName: 'Product_Demo_Introduction.mp4',
    fileUrl: '#',
    uploadedAt: '2024-12-10T10:30:00Z',
    fileSize: 45000000 // 45MB
  },
  {
    id: '2',
    fileName: 'Welcome_Message_v2.mp4',
    fileUrl: '#',
    uploadedAt: '2024-12-08T14:20:00Z',
    fileSize: 32000000 // 32MB
  },
  {
    id: '3',
    fileName: 'FAQ_Returns_Policy.mp4',
    fileUrl: '#',
    uploadedAt: '2024-12-05T09:15:00Z',
    fileSize: 18000000 // 18MB
  },
  {
    id: '4',
    fileName: 'Service_Explainer_Premium.mp4',
    fileUrl: '#',
    uploadedAt: '2024-12-01T16:45:00Z',
    fileSize: 52000000 // 52MB
  },
  {
    id: '5',
    fileName: 'Holiday_Promo_2024.mp4',
    fileUrl: '#',
    uploadedAt: '2024-11-28T11:00:00Z',
    fileSize: 28000000 // 28MB
  }
]

export default function DevPortalVideosPage() {
  const [downloadingId, setDownloadingId] = useState<string | null>(null)

  const handleDownload = async (video: Video) => {
    setDownloadingId(video.id)
    // Simulate download
    setTimeout(() => {
      alert(`DEV MODE: Would download ${video.fileName}`)
      setDownloadingId(null)
    }, 1000)
  }

  const formatFileSize = (bytes: number): string => {
    const units = ['B', 'KB', 'MB', 'GB']
    let size = bytes
    let unitIndex = 0

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024
      unitIndex++
    }

    return `${size.toFixed(unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Videos</h1>
        <p className="text-gray-600 mt-2">
          View and download your AI spokesperson videos
        </p>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center space-x-3">
          <svg className="w-5 h-5 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-sm text-blue-800">
            <strong>{mockVideos.length} video{mockVideos.length !== 1 ? 's' : ''}</strong> available for download. Click any video card to preview or download.
          </p>
        </div>
      </div>

      {/* Videos Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockVideos.map((video) => (
          <div
            key={video.id}
            className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow"
          >
            {/* Video Preview */}
            <div className="relative aspect-video bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
              <div className="text-center">
                <svg className="w-20 h-20 text-blue-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-xs text-gray-500 font-medium">Video File</p>
              </div>
              <div className="absolute top-2 right-2 bg-white bg-opacity-90 text-gray-700 text-xs px-2 py-1 rounded shadow-sm">
                {formatFileSize(video.fileSize)}
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 break-all">
                {video.fileName}
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Uploaded {new Date(video.uploadedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })}
              </p>

              {/* Actions */}
              <div className="flex space-x-2">
                <button
                  onClick={() => handleDownload(video)}
                  disabled={downloadingId === video.id}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-md font-medium hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm flex items-center justify-center space-x-2"
                >
                  {downloadingId === video.id ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Downloading...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      <span>Download</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
