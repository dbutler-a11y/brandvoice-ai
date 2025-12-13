import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'

interface RouteParams {
  params: Promise<{ scriptId: string }>
}

// GET - Get single script details
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { scriptId } = await params

    // Get authenticated user from Supabase
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get client IDs linked to this user
    const clientUsers = await prisma.clientUser.findMany({
      where: { userId: user.id },
      select: { clientId: true },
    })

    const clientIds = clientUsers.map(cu => cu.clientId)

    // Fetch script ensuring it belongs to user's client
    const script = await prisma.script.findFirst({
      where: {
        id: scriptId,
        clientId: { in: clientIds }
      },
      include: {
        client: {
          select: {
            businessName: true,
            voiceId: true
          }
        }
      }
    })

    if (!script) {
      return NextResponse.json(
        { error: 'Script not found' },
        { status: 404 }
      )
    }

    const trimmed = script.scriptText?.trim() || ''
    return NextResponse.json({
      ...script,
      wordCount: trimmed ? trimmed.split(/\s+/).length : 0
    })
  } catch (error) {
    console.error('Error fetching script:', error)
    return NextResponse.json(
      { error: 'Failed to fetch script' },
      { status: 500 }
    )
  }
}

// PATCH - Update script status (approve or request revision)
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { scriptId } = await params

    // Get authenticated user from Supabase
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { action, notes } = body

    if (!action || !['approve', 'request_revision'].includes(action)) {
      return NextResponse.json(
        { error: 'Invalid action. Must be "approve" or "request_revision"' },
        { status: 400 }
      )
    }

    // Get client IDs linked to this user
    const clientUsers = await prisma.clientUser.findMany({
      where: { userId: user.id },
      select: { clientId: true },
    })

    const clientIds = clientUsers.map(cu => cu.clientId)

    // Verify script belongs to user's client
    const existingScript = await prisma.script.findFirst({
      where: {
        id: scriptId,
        clientId: { in: clientIds }
      }
    })

    if (!existingScript) {
      return NextResponse.json(
        { error: 'Script not found' },
        { status: 404 }
      )
    }

    // Update script status
    const newStatus = action === 'approve' ? 'approved' : 'revision_requested'
    const newNotes = action === 'request_revision' && notes
      ? `[Revision Requested - ${new Date().toLocaleDateString()}]: ${notes}\n\n${existingScript.notes || ''}`
      : existingScript.notes

    const updatedScript = await prisma.script.update({
      where: { id: scriptId },
      data: {
        status: newStatus,
        notes: newNotes
      }
    })

    const updatedTrimmed = updatedScript.scriptText?.trim() || ''
    return NextResponse.json({
      success: true,
      script: {
        ...updatedScript,
        wordCount: updatedTrimmed ? updatedTrimmed.split(/\s+/).length : 0
      },
      message: action === 'approve'
        ? 'Script approved successfully!'
        : 'Revision request submitted. Our team will update the script soon.'
    })
  } catch (error) {
    console.error('Error updating script:', error)
    return NextResponse.json(
      { error: 'Failed to update script' },
      { status: 500 }
    )
  }
}
