'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

interface Video {
  id: string
  fileName: string
  fileUrl: string
  uploadedAt: string
  fileSize: bigint
  clientId: string
}

export default function PortalVideosPage() {
  const router = useRouter()
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [downloadingId, setDownloadingId] = useState<string | null>(null)

  useEffect(() => {
    checkAuthAndLoadVideos()
  }, [])

  const checkAuthAndLoadVideos = async () => {
    try {
      const supabase = createClient()

      // Check if user is authenticated
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()

      if (sessionError || !session) {
        console.error('No active session:', sessionError)
        router.push('/portal/login')
        return
      }

      // Get the user's linked client IDs from ClientUser table
      const { data: clientUsers, error: clientUsersError } = await supabase
        .from('ClientUser')
        .select('clientId')
        .eq('userId', session.user.id)

      if (clientUsersError) {
        console.error('Error fetching client users:', clientUsersError)
        setError('Failed to load your account information.')
        setLoading(false)
        return
      }

      if (!clientUsers || clientUsers.length === 0) {
        // No clients linked to this user
        setVideos([])
        setLoading(false)
        return
      }

      // Extract client IDs
      const clientIds = clientUsers.map(cu => cu.clientId)

      // Query ClientAsset table for videos belonging to those clients
      const { data: videoAssets, error: videosError } = await supabase
        .from('ClientAsset')
        .select('id, clientId, fileName, fileUrl, fileType, fileSize, uploadedAt')
        .in('clientId', clientIds)
        .like('fileType', 'video/%')
        .order('uploadedAt', { ascending: false })

      if (videosError) {
        console.error('Error fetching videos:', videosError)
        setError('Failed to load your videos.')
        setLoading(false)
        return
      }

      setVideos(videoAssets || [])
    } catch (error) {
      console.error('Error loading videos:', error)
      setError('An unexpected error occurred.')
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = async (video: Video) => {
    setDownloadingId(video.id)

    try {
      // Create a temporary anchor element to trigger download
      const link = document.createElement('a')
      link.href = video.fileUrl
      link.download = video.fileName
      link.target = '_blank'
      link.rel = 'noopener noreferrer'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      // Show success feedback
      setTimeout(() => {
        setDownloadingId(null)
      }, 1000)
    } catch (error) {
      console.error('Error downloading video:', error)
      alert('Failed to download video. Please try again.')
      setDownloadingId(null)
    }
  }

  const formatFileSize = (bytes: bigint): string => {
    const bytesNum = Number(bytes)
    const units = ['B', 'KB', 'MB', 'GB']
    let size = bytesNum
    let unitIndex = 0

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024
      unitIndex++
    }

    return `${size.toFixed(unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="flex flex-col items-center space-y-3">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <div className="text-gray-500">Loading your videos...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Videos</h1>
          <p className="text-gray-600 mt-2">
            View and download your AI spokesperson videos
          </p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-red-900 mb-2">Error Loading Videos</h3>
          <p className="text-red-700 mb-4">{error}</p>
          <button
            onClick={() => {
              setError(null)
              setLoading(true)
              checkAuthAndLoadVideos()
            }}
            className="bg-red-600 text-white px-6 py-2 rounded-md font-medium hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
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

      {/* Videos Grid */}
      {videos.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-12 text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No videos yet</h3>
          <p className="text-gray-600 mb-4">
            Your videos will appear here once they are generated and ready for download.
          </p>
          <p className="text-sm text-gray-500">
            Need help? <a href="mailto:support@brandvoice.ai" className="text-blue-600 hover:text-blue-800">Contact Support</a>
          </p>
        </div>
      ) : (
        <>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <svg className="w-5 h-5 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm text-blue-800">
                <strong>{videos.length} video{videos.length !== 1 ? 's' : ''}</strong> available for download. Click any video card to preview or download.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video) => (
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
        </>
      )}
    </div>
  )
}
