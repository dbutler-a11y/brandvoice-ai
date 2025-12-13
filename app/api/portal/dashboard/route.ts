import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'

// GET - Get comprehensive dashboard data for authenticated portal user
export async function GET() {
  try {
    // Get authenticated user from Supabase
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get all client IDs linked to this user
    const clientUsers = await prisma.clientUser.findMany({
      where: { userId: user.id },
      select: { clientId: true },
    })

    if (clientUsers.length === 0) {
      return NextResponse.json({
        hasClients: false,
        clients: [],
        stats: {
          totalVideos: 0,
          totalScripts: 0,
          scriptsApproved: 0,
          scriptsPending: 0,
          lastUpload: null,
          projectProgress: 0
        },
        activity: []
      })
    }

    const clientIds = clientUsers.map(cu => cu.clientId)

    // Fetch client details with their data
    const clients = await prisma.client.findMany({
      where: { id: { in: clientIds } },
      select: {
        id: true,
        businessName: true,
        contactName: true,
        email: true,
        niche: true,
        tone: true,
        projectStatus: true,
        voiceId: true,
        avatarId: true,
        package: true,
        addOns: true,
        paymentStatus: true,
        projectStartDate: true,
        projectDeliveryDate: true,
      }
    })

    // Fetch scripts with counts by status
    const scripts = await prisma.script.findMany({
      where: { clientId: { in: clientIds } },
      select: {
        id: true,
        status: true,
        createdAt: true,
        title: true,
        type: true
      },
      orderBy: { createdAt: 'desc' }
    })

    const scriptsApproved = scripts.filter(s => s.status === 'approved').length
    const scriptsPending = scripts.filter(s => s.status === 'draft').length

    // Fetch video assets
    const videos = await prisma.clientAsset.findMany({
      where: {
        clientId: { in: clientIds },
        fileType: { startsWith: 'video' }
      },
      select: {
        id: true,
        fileName: true,
        uploadedAt: true
      },
      orderBy: { uploadedAt: 'desc' }
    })

    // Calculate project progress based on status
    const statusProgress: Record<string, number> = {
      'discovery': 5,
      'onboarding': 15,
      'avatar-creation': 30,
      'scriptwriting': 45,
      'video-production': 65,
      'qa-review': 85,
      'delivered': 100,
      'ongoing': 100,
      'paused': 0,
      'disputed': 0
    }

    const primaryClient = clients[0]
    const projectProgress = primaryClient
      ? statusProgress[primaryClient.projectStatus] || 0
      : 0

    // Build recent activity from real data
    const activity = []

    // Add recent videos
    for (const video of videos.slice(0, 3)) {
      activity.push({
        id: `video-${video.id}`,
        type: 'video_uploaded',
        title: 'New video uploaded',
        description: `${video.fileName} was added to your library`,
        timestamp: video.uploadedAt.toISOString()
      })
    }

    // Add recent scripts
    for (const script of scripts.slice(0, 3)) {
      if (script.status === 'approved') {
        activity.push({
          id: `script-approved-${script.id}`,
          type: 'script_approved',
          title: 'Script approved',
          description: `"${script.title}" is ready for video production`,
          timestamp: script.createdAt.toISOString()
        })
      } else {
        activity.push({
          id: `script-${script.id}`,
          type: 'script_generated',
          title: 'Script generated',
          description: `${script.type} script "${script.title}" needs your review`,
          timestamp: script.createdAt.toISOString()
        })
      }
    }

    // Sort activity by timestamp
    activity.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

    // Safely parse addOns JSON
    const parseAddOns = (addOns: string | null): string[] => {
      if (!addOns) return []
      try {
        const parsed = JSON.parse(addOns)
        return Array.isArray(parsed) ? parsed : []
      } catch {
        return []
      }
    }

    return NextResponse.json({
      hasClients: true,
      clients: clients.map(c => ({
        ...c,
        addOns: parseAddOns(c.addOns)
      })),
      stats: {
        totalVideos: videos.length,
        totalScripts: scripts.length,
        scriptsApproved,
        scriptsPending,
        lastUpload: videos[0]?.uploadedAt?.toISOString() || null,
        projectProgress
      },
      activity: activity.slice(0, 10)
    })
  } catch (error) {
    console.error('Error fetching portal dashboard:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    )
  }
}
