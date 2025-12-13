import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

interface RouteParams {
  params: Promise<{ frameId: string }>
}

// GET single frame
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { frameId } = await params

    const frame = await prisma.studioFrame.findUnique({
      where: { id: frameId },
      include: {
        athlete: {
          include: {
            project: true
          }
        }
      }
    })

    if (!frame) {
      return NextResponse.json({ error: 'Frame not found' }, { status: 404 })
    }

    // Parse JSON fields
    return NextResponse.json({
      ...frame,
      externalLinks: frame.externalLinks ? JSON.parse(frame.externalLinks) : [],
      checkpoints: frame.checkpoints ? JSON.parse(frame.checkpoints) : [],
      revisions: frame.revisions ? JSON.parse(frame.revisions) : [],
      notes: frame.notes ? JSON.parse(frame.notes) : [],
    })
  } catch (error) {
    console.error('Error fetching frame:', error)
    return NextResponse.json({ error: 'Failed to fetch frame' }, { status: 500 })
  }
}

// PATCH update frame
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { frameId } = await params
    const body = await request.json()

    // Get current frame for revision tracking
    const currentFrame = await prisma.studioFrame.findUnique({
      where: { id: frameId }
    })

    if (!currentFrame) {
      return NextResponse.json({ error: 'Frame not found' }, { status: 404 })
    }

    // Track revisions for key fields
    const currentRevisions = currentFrame.revisions ? JSON.parse(currentFrame.revisions) : []
    const newRevisions = [...currentRevisions]

    const trackableFields = ['aiPrompt', 'status', 'description', 'imageUrl'] as const
    for (const field of trackableFields) {
      if (body[field] !== undefined && body[field] !== currentFrame[field]) {
        newRevisions.push({
          id: `rev-${Date.now()}`,
          timestamp: new Date().toISOString(),
          field,
          previousValue: String(currentFrame[field] || ''),
          newValue: String(body[field] || ''),
        })
      }
    }

    const frame = await prisma.studioFrame.update({
      where: { id: frameId },
      data: {
        ...(body.label && { label: body.label }),
        ...(body.description && { description: body.description }),
        ...(body.aiPrompt !== undefined && { aiPrompt: body.aiPrompt }),
        ...(body.status && { status: body.status }),
        ...(body.imageUrl !== undefined && { imageUrl: body.imageUrl }),
        ...(body.thumbnailUrl !== undefined && { thumbnailUrl: body.thumbnailUrl }),
        ...(body.priority && { priority: body.priority }),
        ...(body.dueDate !== undefined && { dueDate: body.dueDate ? new Date(body.dueDate) : null }),
        ...(body.assignedTo !== undefined && { assignedTo: body.assignedTo }),
        ...(body.order !== undefined && { order: body.order }),
        ...(body.externalLinks && { externalLinks: JSON.stringify(body.externalLinks) }),
        revisions: JSON.stringify(newRevisions),
      }
    })

    return NextResponse.json({
      ...frame,
      externalLinks: frame.externalLinks ? JSON.parse(frame.externalLinks) : [],
      checkpoints: frame.checkpoints ? JSON.parse(frame.checkpoints) : [],
      revisions: newRevisions,
      notes: frame.notes ? JSON.parse(frame.notes) : [],
    })
  } catch (error) {
    console.error('Error updating frame:', error)
    return NextResponse.json({ error: 'Failed to update frame' }, { status: 500 })
  }
}

// DELETE frame
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { frameId } = await params

    await prisma.studioFrame.delete({
      where: { id: frameId }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting frame:', error)
    return NextResponse.json({ error: 'Failed to delete frame' }, { status: 500 })
  }
}
