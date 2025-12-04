import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'

// GET - Get all scripts for authenticated user's clients
export async function GET() {
  try {
    // Get authenticated user from Supabase
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get all client IDs linked to this user
    const clientUsers = await prisma.clientUser.findMany({
      where: { userId: user.id },
      select: { clientId: true },
    })

    if (clientUsers.length === 0) {
      // User has no linked clients - return empty array
      return NextResponse.json([])
    }

    const clientIds = clientUsers.map(cu => cu.clientId)

    // Get all scripts for these clients
    const scripts = await prisma.script.findMany({
      where: {
        clientId: {
          in: clientIds,
        },
      },
      select: {
        id: true,
        title: true,
        scriptText: true,
        type: true,
        status: true,
        createdAt: true,
        durationSeconds: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    // Calculate word count for each script
    const scriptsWithWordCount = scripts.map(script => ({
      ...script,
      wordCount: script.scriptText.trim().split(/\s+/).length,
    }))

    return NextResponse.json(scriptsWithWordCount)
  } catch (error) {
    console.error('Error fetching portal scripts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch scripts' },
      { status: 500 }
    )
  }
}
