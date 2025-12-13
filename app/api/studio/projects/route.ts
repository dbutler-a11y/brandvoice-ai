import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET all studio projects
export async function GET() {
  try {
    const projects = await prisma.studioProject.findMany({
      include: {
        client: {
          select: { id: true, businessName: true }
        },
        athletes: {
          include: {
            _count: { select: { frames: true } }
          }
        }
      },
      orderBy: { updatedAt: 'desc' }
    })
    return NextResponse.json(projects)
  } catch (error) {
    console.error('Error fetching studio projects:', error)
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 })
  }
}

// POST create new studio project
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, description, projectType, primaryChannel, primaryGoal, brandName, clientId } = body

    if (!name || !description) {
      return NextResponse.json({ error: 'Name and description are required' }, { status: 400 })
    }

    const project = await prisma.studioProject.create({
      data: {
        name,
        description,
        projectType: projectType || 'brand_campaign',
        primaryChannel: primaryChannel || 'instagram',
        primaryGoal: primaryGoal || null,
        brandName: brandName || null,
        clientId: clientId || null,
        status: 'active',
      },
      include: {
        client: { select: { id: true, businessName: true } },
        athletes: true
      }
    })

    return NextResponse.json(project, { status: 201 })
  } catch (error) {
    console.error('Error creating studio project:', error)
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 })
  }
}
