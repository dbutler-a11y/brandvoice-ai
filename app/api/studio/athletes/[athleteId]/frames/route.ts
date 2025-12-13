import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

interface RouteParams {
  params: Promise<{ athleteId: string }>
}

// GET frames for an athlete
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { athleteId } = await params

    const frames = await prisma.studioFrame.findMany({
      where: { athleteId },
      orderBy: { order: 'asc' }
    })

    // Parse JSON fields
    const framesWithParsedJson = frames.map(frame => ({
      ...frame,
      externalLinks: frame.externalLinks ? JSON.parse(frame.externalLinks) : [],
      checkpoints: frame.checkpoints ? JSON.parse(frame.checkpoints) : [],
      revisions: frame.revisions ? JSON.parse(frame.revisions) : [],
      notes: frame.notes ? JSON.parse(frame.notes) : [],
    }))

    return NextResponse.json(framesWithParsedJson)
  } catch (error) {
    console.error('Error fetching frames:', error)
    return NextResponse.json({ error: 'Failed to fetch frames' }, { status: 500 })
  }
}

// POST create new frame
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { athleteId } = await params
    const body = await request.json()
    const { label, description, order, aiPrompt, priority, dueDate, assignedTo } = body

    if (!label || !description) {
      return NextResponse.json({ error: 'Label and description are required' }, { status: 400 })
    }

    // Verify athlete exists
    const athlete = await prisma.studioAthlete.findUnique({
      where: { id: athleteId }
    })

    if (!athlete) {
      return NextResponse.json({ error: 'Athlete not found' }, { status: 404 })
    }

    // Get the next order if not provided
    let frameOrder = order
    if (!frameOrder) {
      const lastFrame = await prisma.studioFrame.findFirst({
        where: { athleteId },
        orderBy: { order: 'desc' }
      })
      frameOrder = (lastFrame?.order ?? 0) + 1
    }

    const frame = await prisma.studioFrame.create({
      data: {
        athleteId,
        label,
        description,
        order: frameOrder,
        aiPrompt: aiPrompt || null,
        status: 'idea',
        priority: priority || 'normal',
        dueDate: dueDate ? new Date(dueDate) : null,
        assignedTo: assignedTo || null,
        externalLinks: '[]',
        checkpoints: '[]',
        revisions: '[]',
        notes: '[]',
      }
    })

    return NextResponse.json({
      ...frame,
      externalLinks: [],
      checkpoints: [],
      revisions: [],
      notes: [],
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating frame:', error)
    return NextResponse.json({ error: 'Failed to create frame' }, { status: 500 })
  }
}
