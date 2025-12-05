import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'

// GET /api/clients/[clientId] - Get single client with all relations
export async function GET(
  request: NextRequest,
  { params }: { params: { clientId: string } }
) {
  // Check authentication
  const authResult = await requireAdmin()
  if (authResult instanceof NextResponse) return authResult

  try {
    const client = await prisma.client.findUnique({
      where: { id: params.clientId },
      include: {
        intake: true,
        scripts: {
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    })

    if (!client) {
      return NextResponse.json(
        { error: 'Client not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(client)
  } catch (error) {
    console.error('Error fetching client:', error)
    return NextResponse.json(
      { error: 'Failed to fetch client' },
      { status: 500 }
    )
  }
}

// PATCH /api/clients/[clientId] - Update client info
export async function PATCH(
  request: NextRequest,
  { params }: { params: { clientId: string } }
) {
  // Check authentication
  const authResult = await requireAdmin()
  if (authResult instanceof NextResponse) return authResult

  try {
    const body = await request.json()

    // Build update data object
    const updateData: Record<string, unknown> = {}

    // Client fields that can be updated
    const allowedFields = [
      'businessName',
      'contactName',
      'email',
      'phone',
      'website',
      'niche',
      'tone',
      'goals',
      'notes',
      'paymentStatus',
      'paymentAmount',
      'paymentDate',
      'paymentMethod',
    ]

    for (const field of allowedFields) {
      if (field in body) {
        updateData[field] = body[field]
      }
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: 'No valid fields to update' },
        { status: 400 }
      )
    }

    const client = await prisma.client.update({
      where: { id: params.clientId },
      data: updateData,
      include: {
        intake: true,
        scripts: true,
      },
    })

    return NextResponse.json(client)
  } catch (error) {
    console.error('Error updating client:', error)
    return NextResponse.json(
      { error: 'Failed to update client' },
      { status: 500 }
    )
  }
}

// DELETE /api/clients/[clientId] - Delete client and all related data
export async function DELETE(
  request: NextRequest,
  { params }: { params: { clientId: string } }
) {
  // Check authentication
  const authResult = await requireAdmin()
  if (authResult instanceof NextResponse) return authResult

  try {
    // Check if client exists
    const client = await prisma.client.findUnique({
      where: { id: params.clientId },
      include: {
        _count: {
          select: {
            scripts: true,
          },
        },
      },
    })

    if (!client) {
      return NextResponse.json(
        { error: 'Client not found' },
        { status: 404 }
      )
    }

    // Delete client (cascade will handle intake and scripts)
    await prisma.client.delete({
      where: { id: params.clientId },
    })

    return NextResponse.json({
      message: 'Client deleted successfully',
      deletedScriptsCount: client._count.scripts,
    })
  } catch (error) {
    console.error('Error deleting client:', error)
    return NextResponse.json(
      { error: 'Failed to delete client' },
      { status: 500 }
    )
  }
}
