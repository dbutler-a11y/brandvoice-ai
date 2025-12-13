// Portal TypeScript definitions

export interface PortalScript {
  id: string
  title: string
  scriptText: string
  type: 'FAQ' | 'SERVICE' | 'PROMO' | 'TESTIMONIAL' | 'TIP' | 'BRAND'
  status: 'draft' | 'approved' | 'exported' | 'revision_requested'
  createdAt: string
  updatedAt?: string
  durationSeconds?: number
  wordCount: number
  notes?: string
  clientId?: string
}

export interface PortalClient {
  id: string
  businessName: string
  contactName: string
  email: string
  niche: string
  tone: string
  projectStatus: ProjectStatus
  voiceId?: string
  avatarId?: string
  package?: string
  addOns?: string[]
  paymentStatus: string
  projectStartDate?: string
  projectDeliveryDate?: string
}

export type ProjectStatus =
  | 'discovery'
  | 'onboarding'
  | 'avatar-creation'
  | 'scriptwriting'
  | 'video-production'
  | 'qa-review'
  | 'delivered'
  | 'ongoing'
  | 'paused'
  | 'disputed'

export const PROJECT_STATUS_CONFIG: Record<ProjectStatus, {
  label: string
  description: string
  color: string
  bgColor: string
  order: number
}> = {
  'discovery': {
    label: 'Discovery',
    description: 'Initial consultation and planning',
    color: 'text-gray-600',
    bgColor: 'bg-gray-100',
    order: 1
  },
  'onboarding': {
    label: 'Onboarding',
    description: 'Collecting your brand information',
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    order: 2
  },
  'avatar-creation': {
    label: 'Avatar Creation',
    description: 'Setting up your AI spokesperson',
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
    order: 3
  },
  'scriptwriting': {
    label: 'Scriptwriting',
    description: 'Generating your custom scripts',
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-100',
    order: 4
  },
  'video-production': {
    label: 'Video Production',
    description: 'Creating your AI videos',
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
    order: 5
  },
  'qa-review': {
    label: 'QA Review',
    description: 'Quality assurance and final checks',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100',
    order: 6
  },
  'delivered': {
    label: 'Delivered',
    description: 'Your videos are ready!',
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    order: 7
  },
  'ongoing': {
    label: 'Ongoing',
    description: 'Active subscription',
    color: 'text-teal-600',
    bgColor: 'bg-teal-100',
    order: 8
  },
  'paused': {
    label: 'Paused',
    description: 'Project temporarily on hold',
    color: 'text-gray-500',
    bgColor: 'bg-gray-50',
    order: 9
  },
  'disputed': {
    label: 'Disputed',
    description: 'Requires attention',
    color: 'text-red-600',
    bgColor: 'bg-red-100',
    order: 10
  }
}

export interface PortalActivity {
  id: string
  type: 'video_uploaded' | 'script_generated' | 'script_approved' | 'status_changed' | 'payment_received' | 'account_created'
  title: string
  description: string
  timestamp: string
  metadata?: Record<string, unknown>
}

export interface PortalVideo {
  id: string
  fileName: string
  fileUrl: string
  fileType: string
  fileSize: number
  uploadedAt: string
  description?: string
  thumbnailUrl?: string
}

export interface VoicePreviewResponse {
  audio: string // base64
  voice: {
    id: string
    name: string
  }
}

export interface PortalStats {
  totalVideos: number
  totalScripts: number
  scriptsApproved: number
  scriptsPending: number
  lastUpload: string | null
  projectProgress: number // 0-100
}

export interface ScriptUpdateRequest {
  scriptId: string
  action: 'approve' | 'request_revision'
  notes?: string
}

export interface ScriptUpdateResponse {
  success: boolean
  script?: PortalScript
  error?: string
}
