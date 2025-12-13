import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

interface RouteParams {
  params: Promise<{ projectId: string }>
}

// GET athletes for a project
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { projectId } = await params

    const athletes = await prisma.studioAthlete.findMany({
      where: { projectId },
      include: {
        frames: { orderBy: { order: 'asc' } }
      },
      orderBy: { createdAt: 'asc' }
    })

    return NextResponse.json(athletes)
  } catch (error) {
    console.error('Error fetching athletes:', error)
    return NextResponse.json({ error: 'Failed to fetch athletes' }, { status: 500 })
  }
}

// POST create new athlete
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { projectId } = await params
    const body = await request.json()
    const { name, sport, notes } = body

    if (!name || !sport) {
      return NextResponse.json({ error: 'Name and sport are required' }, { status: 400 })
    }

    // Verify project exists
    const project = await prisma.studioProject.findUnique({
      where: { id: projectId }
    })

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    const athlete = await prisma.studioAthlete.create({
      data: {
        projectId,
        name,
        sport,
        notes: notes || null,
      },
      include: {
        frames: true
      }
    })

    return NextResponse.json(athlete, { status: 201 })
  } catch (error) {
    console.error('Error creating athlete:', error)
    return NextResponse.json({ error: 'Failed to create athlete' }, { status: 500 })
  }
}
