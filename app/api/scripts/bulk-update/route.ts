import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// PATCH - Bulk update script statuses
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { scriptIds, status } = body

    // Validate required fields
    if (!scriptIds || !Array.isArray(scriptIds) || scriptIds.length === 0) {
      return NextResponse.json(
        { error: 'scriptIds must be a non-empty array' },
        { status: 400 }
      )
    }

    if (!status || typeof status !== 'string') {
      return NextResponse.json(
        { error: 'status is required and must be a string' },
        { status: 400 }
      )
    }

    // Validate status value
    const validStatuses = ['draft', 'approved', 'exported']
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status. Must be one of: draft, approved, exported' },
        { status: 400 }
      )
    }

    // Update all scripts with the given IDs
    const result = await prisma.script.updateMany({
      where: {
        id: {
          in: scriptIds,
        },
      },
      data: {
        status,
      },
    })

    return NextResponse.json({
      message: `Successfully updated ${result.count} script(s)`,
      count: result.count,
      status,
    })
  } catch (error) {
    console.error('Error bulk updating scripts:', error)
    return NextResponse.json(
      { error: 'Failed to bulk update scripts' },
      { status: 500 }
    )
  }
}
