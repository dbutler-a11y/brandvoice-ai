import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const VALID_STATUSES = [
  'discovery',
  'onboarding',
  'avatar-creation',
  'scriptwriting',
  'video-production',
  'qa-review',
  'delivered',
  'ongoing',
]

// GET /api/clients/[clientId]/status - Get current project status
export async function GET(
  request: NextRequest,
  { params }: { params: { clientId: string } }
) {
  try {
    const client = await prisma.client.findUnique({
      where: { id: params.clientId },
      select: {
        id: true,
        projectStatus: true,
        projectStartDate: true,
        projectDeliveryDate: true,
      },
    })

    if (!client) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 })
    }

    return NextResponse.json({
      clientId: client.id,
      currentStatus: client.projectStatus,
      projectStartDate: client.projectStartDate,
      projectDeliveryDate: client.projectDeliveryDate,
    })
  } catch (error) {
    console.error('Error fetching project status:', error)
    return NextResponse.json(
      { error: 'Failed to fetch project status' },
      { status: 500 }
    )
  }
}

// PATCH /api/clients/[clientId]/status - Update project status to next step
export async function PATCH(
  request: NextRequest,
  { params }: { params: { clientId: string } }
) {
  try {
    const body = await request.json()
    const { status } = body

    // Validate status
    if (!status || !VALID_STATUSES.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status. Must be one of: ' + VALID_STATUSES.join(', ') },
        { status: 400 }
      )
    }

    // Get current client status
    const client = await prisma.client.findUnique({
      where: { id: params.clientId },
      select: {
        id: true,
        projectStatus: true,
        projectStartDate: true,
      },
    })

    if (!client) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 })
    }

    // Prepare update data
    const updateData: {
      projectStatus: string
      projectStartDate?: Date
      projectDeliveryDate?: Date
    } = {
      projectStatus: status,
    }

    // If moving from 'discovery' to 'onboarding', set project start date
    if (client.projectStatus === 'discovery' && status === 'onboarding' && !client.projectStartDate) {
      updateData.projectStartDate = new Date()
    }

    // If moving to 'delivered', set delivery date
    if (status === 'delivered') {
      updateData.projectDeliveryDate = new Date()
    }

    // Update the client
    const updatedClient = await prisma.client.update({
      where: { id: params.clientId },
      data: updateData,
      select: {
        id: true,
        projectStatus: true,
        projectStartDate: true,
        projectDeliveryDate: true,
        updatedAt: true,
      },
    })

    return NextResponse.json({
      success: true,
      message: `Project status updated to ${status}`,
      client: updatedClient,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Error updating project status:', error)
    return NextResponse.json(
      { error: 'Failed to update project status' },
      { status: 500 }
    )
  }
}
