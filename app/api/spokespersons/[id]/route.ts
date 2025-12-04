import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET single spokesperson
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const spokesperson = await prisma.spokesperson.findUnique({
      where: { id: params.id }
    })

    if (!spokesperson) {
      return NextResponse.json({ error: 'Spokesperson not found' }, { status: 404 })
    }

    return NextResponse.json(spokesperson)
  } catch (error) {
    console.error('Error fetching spokesperson:', error)
    return NextResponse.json(
      { error: 'Failed to fetch spokesperson' },
      { status: 500 }
    )
  }
}

// PATCH update spokesperson
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json()

    const spokesperson = await prisma.spokesperson.update({
      where: { id: params.id },
      data
    })

    return NextResponse.json(spokesperson)
  } catch (error) {
    console.error('Error updating spokesperson:', error)
    return NextResponse.json(
      { error: 'Failed to update spokesperson' },
      { status: 500 }
    )
  }
}

// DELETE spokesperson
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.spokesperson.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting spokesperson:', error)
    return NextResponse.json(
      { error: 'Failed to delete spokesperson' },
      { status: 500 }
    )
  }
}
