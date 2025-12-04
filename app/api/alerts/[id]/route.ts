import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/alerts/[id] - Get a single alert
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const alert = await prisma.alert.findUnique({
      where: { id },
    });

    if (!alert) {
      return NextResponse.json(
        { error: 'Alert not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(alert);
  } catch (error) {
    console.error('Error fetching alert:', error);
    return NextResponse.json(
      { error: 'Failed to fetch alert' },
      { status: 500 }
    );
  }
}

// PATCH /api/alerts/[id] - Update an alert (mark read/resolved)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await request.json();

    const updateData: Record<string, unknown> = {};

    if (data.isRead !== undefined) {
      updateData.isRead = data.isRead;
      if (data.isRead) {
        updateData.readAt = new Date();
      }
    }

    if (data.isResolved !== undefined) {
      updateData.isResolved = data.isResolved;
      if (data.isResolved) {
        updateData.resolvedAt = new Date();
        updateData.resolution = data.resolution || 'Resolved';
      }
    }

    if (data.readBy) {
      updateData.readBy = data.readBy;
    }

    if (data.resolvedBy) {
      updateData.resolvedBy = data.resolvedBy;
    }

    const alert = await prisma.alert.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(alert);
  } catch (error) {
    console.error('Error updating alert:', error);
    return NextResponse.json(
      { error: 'Failed to update alert' },
      { status: 500 }
    );
  }
}

// DELETE /api/alerts/[id] - Delete an alert
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.alert.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting alert:', error);
    return NextResponse.json(
      { error: 'Failed to delete alert' },
      { status: 500 }
    );
  }
}
