import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

interface RouteParams {
  params: Promise<{ projectId: string }>
}

// GET single studio project
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { projectId } = await params

    const project = await prisma.studioProject.findUnique({
      where: { id: projectId },
      include: {
        client: { select: { id: true, businessName: true } },
        athletes: {
          include: {
            frames: { orderBy: { order: 'asc' } }
          },
          orderBy: { createdAt: 'asc' }
        }
      }
    })

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    return NextResponse.json(project)
  } catch (error) {
    console.error('Error fetching studio project:', error)
    return NextResponse.json({ error: 'Failed to fetch project' }, { status: 500 })
  }
}

// PATCH update studio project
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { projectId } = await params
    const body = await request.json()

    const project = await prisma.studioProject.update({
      where: { id: projectId },
      data: {
        ...(body.name && { name: body.name }),
        ...(body.description && { description: body.description }),
        ...(body.status && { status: body.status }),
        ...(body.projectType && { projectType: body.projectType }),
        ...(body.primaryChannel && { primaryChannel: body.primaryChannel }),
        ...(body.primaryGoal !== undefined && { primaryGoal: body.primaryGoal }),
        ...(body.brandName !== undefined && { brandName: body.brandName }),
        ...(body.clientId !== undefined && { clientId: body.clientId }),
      },
      include: {
        client: { select: { id: true, businessName: true } },
        athletes: true
      }
    })

    return NextResponse.json(project)
  } catch (error) {
    console.error('Error updating studio project:', error)
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 })
  }
}

// DELETE studio project
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { projectId } = await params

    await prisma.studioProject.delete({
      where: { id: projectId }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting studio project:', error)
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 })
  }
}
