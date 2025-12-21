'use client'

import { useState, useEffect, useRef } from 'react'
import { Video, Image, Wand2, Play, Download, Copy, Check, AlertCircle, Loader2, Clock, RefreshCw, Upload, Trash2, FolderOpen, X, Film } from 'lucide-react'

type GenerationMode = 'text-to-video' | 'image-to-video' | 'video-to-video'
type AspectRatio = '16:9' | '9:16' | '1:1' | '4:3' | '3:4'
type Resolution = '480p' | '720p' | '1080p'
type Duration = '5' | '10' | '15'

interface GenerationJob {
  id: string
  taskId: string
  mode: GenerationMode
  prompt: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  videoUrl?: string
  error?: string
  createdAt: Date
  aspectRatio: AspectRatio
  duration: Duration
}

interface MediaFile {
  id: string
  name: string
  type: 'image' | 'video'
  url: string
  size: number
  uploadedAt: Date
  mimeType: string
}

// File upload limits from Kie.ai
const UPLOAD_LIMITS = {
  image: {
    maxSize: 10 * 1024 * 1024, // 10MB
    formats: ['image/jpeg', 'image/png', 'image/webp'],
    extensions: ['jpg', 'jpeg', 'png', 'webp'],
  },
  video: {
    maxSize: 10 * 1024 * 1024, // 10MB
    formats: ['video/mp4', 'video/quicktime', 'video/x-matroska'],
    extensions: ['mp4', 'mov', 'mkv'],
    maxFiles: 3,
  },
}

export default function WanStudioPage() {
  const [mode, setMode] = useState<GenerationMode>('text-to-video')
  const [prompt, setPrompt] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [videoUrls, setVideoUrls] = useState<string[]>([])
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('9:16')
  const [resolution, setResolution] = useState<Resolution>('1080p')
  const [duration, setDuration] = useState<Duration>('10')
  const [isGenerating, setIsGenerating] = useState(false)
  const [jobs, setJobs] = useState<GenerationJob[]>([])
  const [copied, setCopied] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Media library state
  const [mediaLibrary, setMediaLibrary] = useState<MediaFile[]>([])
  const [showMediaLibrary, setShowMediaLibrary] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const imageInputRef = useRef<HTMLInputElement>(null)
  const videoInputRef = useRef<HTMLInputElement>(null)

  // Load media library from localStorage
  useEffect(() => {
    const savedMedia = localStorage.getItem('wan_media_library')
    if (savedMedia) {
      try {
        const parsed = JSON.parse(savedMedia)
        setMediaLibrary(parsed.map((m: MediaFile) => ({ ...m, uploadedAt: new Date(m.uploadedAt) })))
      } catch {
        // Invalid JSON, ignore
      }
    }
  }, [])

  // Save media library to localStorage
  const saveMediaLibrary = (media: MediaFile[]) => {
    localStorage.setItem('wan_media_library', JSON.stringify(media))
    setMediaLibrary(media)
  }

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  // Upload file to Kie.ai via our API route
  const uploadToKieAi = async (file: File, type: 'image' | 'video'): Promise<string> => {
    // Convert file to base64
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = async () => {
        const base64 = reader.result as string
        const base64Data = base64.split(',')[1]

        try {
          const response = await fetch('/api/kie', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              endpoint: '/files/upload',
              file: base64Data,
              filename: file.name,
              content_type: file.type,
            }),
          })

          const data = await response.json()

          if (!response.ok) {
            throw new Error(data.error || data.message || 'Upload failed')
          }

          resolve(data.url || data.file_url || data.result?.url)
        } catch (err) {
          reject(err)
        }
      }
      reader.onerror = () => reject(new Error('Failed to read file'))
      reader.readAsDataURL(file)
    })
  }

  // Handle file selection
  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'video') => {
    const files = event.target.files
    if (!files || files.length === 0) return

    const limits = UPLOAD_LIMITS[type]
    const validFiles: File[] = []

    for (let i = 0; i < files.length; i++) {
      const file = files[i]

      // Check file size
      if (file.size > limits.maxSize) {
        setError(`File "${file.name}" exceeds the ${formatFileSize(limits.maxSize)} size limit`)
        continue
      }

      // Check file type
      if (!limits.formats.includes(file.type)) {
        setError(`File "${file.name}" has unsupported format. Supported: ${limits.extensions.join(', ')}`)
        continue
      }

      validFiles.push(file)
    }

    if (validFiles.length === 0) return

    setIsUploading(true)
    setError(null)

    for (let i = 0; i < validFiles.length; i++) {
      const file = validFiles[i]
      setUploadProgress(Math.round(((i) / validFiles.length) * 100))

      try {
        const url = await uploadToKieAi(file, type)

        const newMedia: MediaFile = {
          id: crypto.randomUUID(),
          name: file.name,
          type,
          url,
          size: file.size,
          uploadedAt: new Date(),
          mimeType: file.type,
        }

        const updatedLibrary = [...mediaLibrary, newMedia]
        saveMediaLibrary(updatedLibrary)

        // Auto-select the uploaded file
        if (type === 'image' && mode === 'image-to-video') {
          setImageUrl(url)
        } else if (type === 'video' && mode === 'video-to-video') {
          setVideoUrls(prev => [...prev, url].slice(0, UPLOAD_LIMITS.video.maxFiles))
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Upload failed')
      }
    }

    setIsUploading(false)
    setUploadProgress(100)

    // Reset file input
    if (type === 'image' && imageInputRef.current) {
      imageInputRef.current.value = ''
    } else if (type === 'video' && videoInputRef.current) {
      videoInputRef.current.value = ''
    }
  }

  // Delete media from library
  const deleteMedia = (id: string) => {
    const updatedLibrary = mediaLibrary.filter(m => m.id !== id)
    saveMediaLibrary(updatedLibrary)
  }

  // Select media from library
  const selectMedia = (media: MediaFile) => {
    if (media.type === 'image') {
      setImageUrl(media.url)
      if (mode !== 'image-to-video') setMode('image-to-video')
    } else {
      if (videoUrls.length < UPLOAD_LIMITS.video.maxFiles) {
        setVideoUrls(prev => [...prev, media.url])
        if (mode !== 'video-to-video') setMode('video-to-video')
      } else {
        setError(`Maximum ${UPLOAD_LIMITS.video.maxFiles} videos allowed`)
      }
    }
    setShowMediaLibrary(false)
  }

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  // UGC-optimized prompt templates
  const promptTemplates = [
    {
      name: 'Fitness Hook',
      prompt: `A confident female fitness coach in her 30s, athletic build, wearing black sports bra and leggings. Modern gym setting with clean equipment.

Close-up shot of her face looking directly at camera. She says with energy: "Stop wasting time on exercises that don't work."

Style: Natural lighting, authentic handheld feel, 9:16 vertical format, TikTok-ready.`
    },
    {
      name: 'Product Showcase',
      prompt: `Cinematic close-up of a premium skincare bottle on a marble surface. Soft morning light streaming through windows. Product slowly rotates revealing label.

Camera pulls back to show elegant bathroom setting. Dewdrops on bottle surface catch the light.

Style: Luxury aesthetic, shallow depth of field, smooth motion, 9:16 vertical.`
    },
    {
      name: 'Lifestyle B-Roll',
      prompt: `Slow motion shot of hands pouring coffee from a sleek pour-over kettle. Steam rises beautifully. Clean minimalist kitchen background.

Cut to: Person taking first sip, closing eyes in satisfaction. Warm natural light.

Style: ASMR-quality, intimate framing, cozy aesthetic, vertical format.`
    },
    {
      name: 'Testimonial Style',
      prompt: `Woman in her 40s sitting in bright living room. She looks at camera naturally, speaking with genuine enthusiasm about a positive experience.

Medium shot, eye-level. She gestures naturally with hands while talking. Warm smile.

Style: Authentic UGC feel, natural lighting, 9:16 format, relatable.`
    },
  ]

  const handleGenerate = async () => {
    if (!prompt) {
      setError('Please enter a prompt')
      return
    }
    if (mode === 'image-to-video' && !imageUrl) {
      setError('Please enter an image URL for Image-to-Video mode')
      return
    }
    if (mode === 'video-to-video' && videoUrls.length === 0) {
      setError('Please add at least one video URL for Video-to-Video mode')
      return
    }

    setError(null)
    setIsGenerating(true)

    // Create a new job
    const newJob: GenerationJob = {
      id: crypto.randomUUID(),
      taskId: '',
      mode,
      prompt,
      status: 'pending',
      createdAt: new Date(),
      aspectRatio,
      duration,
    }

    setJobs(prev => [newJob, ...prev])

    try {
      // Call Kie.ai API via our server-side route
      let requestBody
      if (mode === 'text-to-video') {
        requestBody = {
          endpoint: '/jobs/createTask',
          model: 'wan2.6-t2v',
          input: {
            prompt,
            aspect_ratio: aspectRatio,
            resolution,
            duration: parseInt(duration),
          }
        }
      } else if (mode === 'image-to-video') {
        requestBody = {
          endpoint: '/jobs/createTask',
          model: 'wan2.6-i2v',
          input: {
            prompt,
            image_url: imageUrl,
            resolution,
            duration: parseInt(duration),
          }
        }
      } else {
        // video-to-video (R2V)
        requestBody = {
          endpoint: '/jobs/createTask',
          model: 'wan2.6-r2v',
          input: {
            prompt,
            video_urls: videoUrls,
            resolution,
            duration: parseInt(duration),
          }
        }
      }

      const response = await fetch('/api/kie', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || data.error || 'API request failed')
      }

      // Update job with task ID
      setJobs(prev => prev.map(job =>
        job.id === newJob.id
          ? { ...job, taskId: data.task_id || data.taskId || data.id, status: 'processing' }
          : job
      ))

      // Start polling for status
      pollJobStatus(newJob.id, data.task_id || data.taskId || data.id)

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Generation failed'
      setJobs(prev => prev.map(job =>
        job.id === newJob.id
          ? { ...job, status: 'failed', error: errorMessage }
          : job
      ))
      setError(errorMessage)
    } finally {
      setIsGenerating(false)
    }
  }

  const pollJobStatus = async (jobId: string, taskId: string) => {
    const maxAttempts = 60 // 5 minutes with 5s intervals
    let attempts = 0

    const poll = async () => {
      if (attempts >= maxAttempts) {
        setJobs(prev => prev.map(job =>
          job.id === jobId
            ? { ...job, status: 'failed', error: 'Generation timed out' }
            : job
        ))
        return
      }

      try {
        const response = await fetch(`/api/kie?taskId=${taskId}`)

        const data = await response.json()

        if (data.status === 'completed' || data.status === 'success') {
          setJobs(prev => prev.map(job =>
            job.id === jobId
              ? { ...job, status: 'completed', videoUrl: data.output?.video_url || data.videoUrl || data.result?.url }
              : job
          ))
          return
        }

        if (data.status === 'failed' || data.status === 'error') {
          setJobs(prev => prev.map(job =>
            job.id === jobId
              ? { ...job, status: 'failed', error: data.error || 'Generation failed' }
              : job
          ))
          return
        }

        // Still processing, poll again
        attempts++
        setTimeout(poll, 5000)
      } catch {
        attempts++
        setTimeout(poll, 5000)
      }
    }

    poll()
  }

  const refreshJobStatus = (jobId: string, taskId: string) => {
    pollJobStatus(jobId, taskId)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Wand2 className="w-6 h-6 text-purple-600" />
            Wan 2.6 Studio
          </h1>
          <p className="text-gray-600">Test Alibaba's latest AI video model for UGC content</p>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full font-medium">9:16 Supported</span>
          <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">1080p</span>
          <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full font-medium">15s Max</span>
        </div>
      </div>

      {/* Mode Selector */}
      <div className="flex gap-2 p-1 bg-gray-100 rounded-xl">
        <button
          onClick={() => setMode('text-to-video')}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${
            mode === 'text-to-video'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Video className="w-5 h-5" />
          Text to Video (T2V)
        </button>
        <button
          onClick={() => setMode('image-to-video')}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${
            mode === 'image-to-video'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Image className="w-5 h-5" />
          Image to Video (I2V)
        </button>
        <button
          onClick={() => setMode('video-to-video')}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${
            mode === 'video-to-video'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Film className="w-5 h-5" />
          Video to Video (R2V)
        </button>
      </div>

      {/* Media Library Button */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setShowMediaLibrary(true)}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <FolderOpen className="w-4 h-4" />
          Media Library ({mediaLibrary.length})
        </button>
        <div className="flex gap-2">
          <label className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors cursor-pointer">
            <Upload className="w-4 h-4" />
            Upload Image
            <input
              ref={imageInputRef}
              type="file"
              accept={UPLOAD_LIMITS.image.formats.join(',')}
              onChange={(e) => handleFileSelect(e, 'image')}
              className="hidden"
            />
          </label>
          <label className="flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-700 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors cursor-pointer">
            <Upload className="w-4 h-4" />
            Upload Video
            <input
              ref={videoInputRef}
              type="file"
              accept={UPLOAD_LIMITS.video.formats.join(',')}
              onChange={(e) => handleFileSelect(e, 'video')}
              multiple
              className="hidden"
            />
          </label>
        </div>
        {isUploading && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Loader2 className="w-4 h-4 animate-spin" />
            Uploading... {uploadProgress}%
          </div>
        )}
      </div>

      {/* Upload Limits Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm">
        <div className="flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5" />
          <div className="text-blue-800">
            <strong>Upload Limits:</strong> Images (JPEG, PNG, WebP) max 10MB | Videos (MP4, MOV, MKV) max 10MB, up to 3 files for R2V
          </div>
        </div>
      </div>

      {/* Media Library Modal */}
      {showMediaLibrary && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Media Library</h2>
              <button
                onClick={() => setShowMediaLibrary(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {mediaLibrary.length === 0 ? (
                <div className="text-center py-12">
                  <FolderOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No media uploaded yet</p>
                  <p className="text-sm text-gray-400 mt-1">Upload images or videos to see them here</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {mediaLibrary.map((media) => (
                    <div
                      key={media.id}
                      className="relative group bg-gray-100 rounded-lg overflow-hidden aspect-video"
                    >
                      {media.type === 'image' ? (
                        <img
                          src={media.url}
                          alt={media.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <video
                          src={media.url}
                          className="w-full h-full object-cover"
                        />
                      )}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                        <button
                          onClick={() => selectMedia(media)}
                          className="px-3 py-1.5 bg-white text-gray-900 rounded-lg text-sm font-medium hover:bg-gray-100"
                        >
                          Select
                        </button>
                        <button
                          onClick={() => deleteMedia(media.id)}
                          className="px-3 py-1.5 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                        <p className="text-white text-xs truncate">{media.name}</p>
                        <p className="text-white/70 text-xs">{formatFileSize(media.size)}</p>
                      </div>
                      <div className="absolute top-2 right-2">
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                          media.type === 'image' ? 'bg-blue-500 text-white' : 'bg-purple-500 text-white'
                        }`}>
                          {media.type === 'image' ? 'IMG' : 'VID'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
              <p className="text-xs text-gray-500">
                Note: Uploaded files are stored temporarily on Kie.ai servers and automatically deleted after 3 days.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Generation Form */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 space-y-4">
          {/* Prompt Templates */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Quick Templates</label>
            <div className="flex flex-wrap gap-2">
              {promptTemplates.map((template) => (
                <button
                  key={template.name}
                  onClick={() => setPrompt(template.prompt)}
                  className="px-3 py-1.5 bg-purple-50 text-purple-700 rounded-full text-sm hover:bg-purple-100 transition-colors"
                >
                  {template.name}
                </button>
              ))}
            </div>
          </div>

          {/* Prompt Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Prompt</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe your video scene in detail. Include subject, setting, action, camera movement, and style..."
              rows={6}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm resize-none"
            />
            <div className="flex justify-between mt-1">
              <p className="text-xs text-gray-500">Tip: Be specific about framing, lighting, and movement for best results</p>
              <p className="text-xs text-gray-500">{prompt.length} characters</p>
            </div>
          </div>

          {/* Image URL (for I2V mode) */}
          {mode === 'image-to-video' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/your-image.jpg"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                />
                <button
                  onClick={() => setShowMediaLibrary(true)}
                  className="px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
                >
                  <FolderOpen className="w-5 h-5" />
                </button>
              </div>
              {imageUrl && (
                <div className="mt-2 relative inline-block">
                  <img src={imageUrl} alt="Selected" className="h-20 rounded-lg border border-gray-200" />
                  <button
                    onClick={() => setImageUrl('')}
                    className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
              <p className="text-xs text-gray-500 mt-1">Supported: JPEG, PNG, WebP. Max 10MB.</p>
            </div>
          )}

          {/* Video URLs (for R2V mode) */}
          {mode === 'video-to-video' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reference Videos ({videoUrls.length}/{UPLOAD_LIMITS.video.maxFiles})
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  placeholder="https://example.com/your-video.mp4"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      const input = e.target as HTMLInputElement
                      if (input.value && videoUrls.length < UPLOAD_LIMITS.video.maxFiles) {
                        setVideoUrls(prev => [...prev, input.value])
                        input.value = ''
                      }
                    }
                  }}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                />
                <button
                  onClick={() => setShowMediaLibrary(true)}
                  className="px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
                >
                  <FolderOpen className="w-5 h-5" />
                </button>
              </div>
              {videoUrls.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {videoUrls.map((url, index) => (
                    <div key={index} className="relative inline-block">
                      <video src={url} className="h-20 rounded-lg border border-gray-200" />
                      <button
                        onClick={() => setVideoUrls(prev => prev.filter((_, i) => i !== index))}
                        className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                      <span className="absolute bottom-1 left-1 px-1.5 py-0.5 bg-black/70 text-white text-xs rounded">
                        {index + 1}
                      </span>
                    </div>
                  ))}
                </div>
              )}
              <p className="text-xs text-gray-500 mt-1">Supported: MP4, MOV, MKV. Max 10MB each. Up to 3 videos. Press Enter to add URL.</p>
            </div>
          )}

          {/* Settings Row */}
          <div className="grid grid-cols-3 gap-4">
            {/* Aspect Ratio */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Aspect Ratio</label>
              <select
                value={aspectRatio}
                onChange={(e) => setAspectRatio(e.target.value as AspectRatio)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
              >
                <option value="9:16">9:16 (TikTok/Reels)</option>
                <option value="16:9">16:9 (YouTube)</option>
                <option value="1:1">1:1 (Instagram)</option>
                <option value="4:3">4:3</option>
                <option value="3:4">3:4</option>
              </select>
            </div>

            {/* Resolution */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Resolution</label>
              <select
                value={resolution}
                onChange={(e) => setResolution(e.target.value as Resolution)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
              >
                <option value="1080p">1080p (Recommended)</option>
                <option value="720p">720p</option>
                {mode === 'image-to-video' && <option value="480p">480p</option>}
              </select>
            </div>

            {/* Duration */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
              <select
                value={duration}
                onChange={(e) => setDuration(e.target.value as Duration)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
              >
                <option value="5">5 seconds</option>
                <option value="10">10 seconds</option>
                {mode !== 'video-to-video' && <option value="15">15 seconds</option>}
              </select>
              {mode === 'video-to-video' && (
                <p className="text-xs text-gray-500 mt-1">R2V mode supports 5 or 10 seconds only</p>
              )}
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 rounded-lg">
              <AlertCircle className="w-5 h-5" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !prompt}
            className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Play className="w-5 h-5" />
                Generate Video
              </>
            )}
          </button>
        </div>
      </div>

      {/* Generation History */}
      {jobs.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h2 className="font-semibold text-gray-900">Generation History</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {jobs.map((job) => (
              <div key={job.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        job.status === 'completed' ? 'bg-green-100 text-green-700' :
                        job.status === 'processing' ? 'bg-blue-100 text-blue-700' :
                        job.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {job.status === 'processing' && <Loader2 className="w-3 h-3 animate-spin inline mr-1" />}
                        {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                      </span>
                      <span className="text-xs text-gray-500">{job.mode === 'text-to-video' ? 'T2V' : 'I2V'}</span>
                      <span className="text-xs text-gray-500">{job.aspectRatio}</span>
                      <span className="text-xs text-gray-500">{job.duration}s</span>
                      <span className="text-xs text-gray-500">
                        <Clock className="w-3 h-3 inline mr-1" />
                        {job.createdAt.toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 line-clamp-2">{job.prompt}</p>
                    {job.error && (
                      <p className="text-sm text-red-600 mt-2">{job.error}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    {job.status === 'processing' && job.taskId && (
                      <button
                        onClick={() => refreshJobStatus(job.id, job.taskId)}
                        className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Refresh status"
                      >
                        <RefreshCw className="w-4 h-4" />
                      </button>
                    )}
                    {job.videoUrl && (
                      <>
                        <a
                          href={job.videoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Download video"
                        >
                          <Download className="w-4 h-4" />
                        </a>
                        <button
                          onClick={() => copyToClipboard(job.videoUrl!, job.id)}
                          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Copy URL"
                        >
                          {copied === job.id ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </>
                    )}
                  </div>
                </div>
                {job.videoUrl && (
                  <div className="mt-4">
                    <video
                      src={job.videoUrl}
                      controls
                      className="w-full max-w-sm rounded-lg border border-gray-200"
                      style={{ aspectRatio: job.aspectRatio === '9:16' ? '9/16' : job.aspectRatio === '16:9' ? '16/9' : '1/1' }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* API Documentation Reference */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <h3 className="font-semibold text-gray-900 mb-3">Wan 2.6 Specifications</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
          <div>
            <p className="text-gray-600 font-medium">Aspect Ratios</p>
            <p className="text-gray-900">16:9, 9:16, 1:1, 4:3, 3:4</p>
          </div>
          <div>
            <p className="text-gray-600 font-medium">Resolutions</p>
            <p className="text-gray-900">720p, 1080p</p>
          </div>
          <div>
            <p className="text-gray-600 font-medium">Duration</p>
            <p className="text-gray-900">5, 10, 15 seconds</p>
          </div>
          <div>
            <p className="text-gray-600 font-medium">Multi-Shot</p>
            <p className="text-gray-900">Enabled by default</p>
          </div>
        </div>

        <h4 className="font-semibold text-gray-900 mb-2 mt-4">Upload Limits</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-gray-600 font-medium">Image Formats</p>
            <p className="text-gray-900">JPEG, PNG, WebP</p>
          </div>
          <div>
            <p className="text-gray-600 font-medium">Image Max Size</p>
            <p className="text-gray-900">10 MB</p>
          </div>
          <div>
            <p className="text-gray-600 font-medium">Video Formats</p>
            <p className="text-gray-900">MP4, MOV, MKV</p>
          </div>
          <div>
            <p className="text-gray-600 font-medium">Video Max</p>
            <p className="text-gray-900">10 MB, 3 files (R2V)</p>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-700 mb-3">
            Note: Uploaded files are stored temporarily and automatically deleted after 3 days.
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href="https://kie.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-purple-600 hover:text-purple-800 underline"
            >
              Kie.ai Dashboard
            </a>
            <span className="text-gray-400">|</span>
            <a
              href="https://kie.ai/wan-2-6"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-purple-600 hover:text-purple-800 underline"
            >
              Wan 2.6 API Docs
            </a>
            <span className="text-gray-400">|</span>
            <a
              href="https://docs.kie.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-purple-600 hover:text-purple-800 underline"
            >
              Full API Documentation
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
