import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/clients/[clientId]/users - List all users linked to this client
export async function GET(
  request: NextRequest,
  { params }: { params: { clientId: string } }
) {
  try {
    const clientUsers = await prisma.clientUser.findMany({
      where: { clientId: params.clientId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
            createdAt: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(clientUsers)
  } catch (error) {
    console.error('Error fetching client users:', error)
    return NextResponse.json(
      { error: 'Failed to fetch client users' },
      { status: 500 }
    )
  }
}

// POST /api/clients/[clientId]/users - Link a user to this client
export async function POST(
  request: NextRequest,
  { params }: { params: { clientId: string } }
) {
  try {
    const { email, name } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Check if client exists
    const client = await prisma.client.findUnique({
      where: { id: params.clientId },
    })

    if (!client) {
      return NextResponse.json(
        { error: 'Client not found' },
        { status: 404 }
      )
    }

    // Find or create user
    let user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    })

    if (!user) {
      // Create new user with CLIENT role
      user = await prisma.user.create({
        data: {
          email: email.toLowerCase().trim(),
          name: name || null,
          role: 'CLIENT',
        },
      })
    }

    // Check if link already exists
    const existingLink = await prisma.clientUser.findUnique({
      where: {
        userId_clientId: {
          userId: user.id,
          clientId: params.clientId,
        },
      },
    })

    if (existingLink) {
      return NextResponse.json(
        { error: 'User is already linked to this client' },
        { status: 400 }
      )
    }

    // Create the link
    const clientUser = await prisma.clientUser.create({
      data: {
        userId: user.id,
        clientId: params.clientId,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
            createdAt: true,
          },
        },
      },
    })

    return NextResponse.json(clientUser, { status: 201 })
  } catch (error) {
    console.error('Error linking user to client:', error)
    return NextResponse.json(
      { error: 'Failed to link user to client' },
      { status: 500 }
    )
  }
}

// DELETE /api/clients/[clientId]/users - Unlink a user from this client
export async function DELETE(
  request: NextRequest,
  { params }: { params: { clientId: string } }
) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      )
    }

    // Check if link exists
    const clientUser = await prisma.clientUser.findUnique({
      where: {
        userId_clientId: {
          userId,
          clientId: params.clientId,
        },
      },
    })

    if (!clientUser) {
      return NextResponse.json(
        { error: 'User link not found' },
        { status: 404 }
      )
    }

    // Delete the link
    await prisma.clientUser.delete({
      where: {
        id: clientUser.id,
      },
    })

    return NextResponse.json({
      message: 'User unlinked successfully',
    })
  } catch (error) {
    console.error('Error unlinking user from client:', error)
    return NextResponse.json(
      { error: 'Failed to unlink user from client' },
      { status: 500 }
    )
  }
}
