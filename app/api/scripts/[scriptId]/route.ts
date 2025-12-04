import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Get single script
export async function GET(
  request: NextRequest,
  { params }: { params: { scriptId: string } }
) {
  try {
    const script = await prisma.script.findUnique({
      where: { id: params.scriptId },
      include: {
        client: {
          select: {
            id: true,
            businessName: true,
            contactName: true,
          },
        },
      },
    })

    if (!script) {
      return NextResponse.json(
        { error: 'Script not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(script)
  } catch (error) {
    console.error('Error fetching script:', error)
    return NextResponse.json(
      { error: 'Failed to fetch script' },
      { status: 500 }
    )
  }
}

// PATCH - Update script (title, scriptText, status, notes)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { scriptId: string } }
) {
  try {
    const body = await request.json()

    // Build update data object
    const updateData: Record<string, unknown> = {}

    // Allowed fields for update
    const allowedFields = ['title', 'scriptText', 'status', 'notes']

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

    // Validate status if provided
    if (updateData.status) {
      const validStatuses = ['draft', 'approved', 'exported']
      if (!validStatuses.includes(updateData.status as string)) {
        return NextResponse.json(
          { error: 'Invalid status. Must be one of: draft, approved, exported' },
          { status: 400 }
        )
      }
    }

    const script = await prisma.script.update({
      where: { id: params.scriptId },
      data: updateData,
    })

    return NextResponse.json(script)
  } catch (error) {
    console.error('Error updating script:', error)
    return NextResponse.json(
      { error: 'Failed to update script' },
      { status: 500 }
    )
  }
}

// DELETE - Delete script
export async function DELETE(
  request: NextRequest,
  { params }: { params: { scriptId: string } }
) {
  try {
    // Check if script exists
    const script = await prisma.script.findUnique({
      where: { id: params.scriptId },
    })

    if (!script) {
      return NextResponse.json(
        { error: 'Script not found' },
        { status: 404 }
      )
    }

    // Delete script
    await prisma.script.delete({
      where: { id: params.scriptId },
    })

    return NextResponse.json({
      message: 'Script deleted successfully',
      deletedScriptId: params.scriptId,
    })
  } catch (error) {
    console.error('Error deleting script:', error)
    return NextResponse.json(
      { error: 'Failed to delete script' },
      { status: 500 }
    )
  }
}
