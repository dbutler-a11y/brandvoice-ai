import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET all spokespersons
export async function GET() {
  try {
    const spokespersons = await prisma.spokesperson.findMany({
      orderBy: [
        { featured: 'desc' },
        { sortOrder: 'asc' },
        { createdAt: 'desc' }
      ]
    })

    return NextResponse.json(spokespersons)
  } catch (error) {
    console.error('Error fetching spokespersons:', error)
    return NextResponse.json(
      { error: 'Failed to fetch spokespersons' },
      { status: 500 }
    )
  }
}

// POST create new spokesperson
export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // Validate required fields
    if (!data.name || !data.displayName || !data.description) {
      return NextResponse.json(
        { error: 'Name, display name, and description are required' },
        { status: 400 }
      )
    }

    const spokesperson = await prisma.spokesperson.create({
      data: {
        name: data.name,
        displayName: data.displayName,
        description: data.description,
        primaryNiche: data.primaryNiche || 'Med Spa / Aesthetics',
        secondaryNiches: data.secondaryNiches || null,
        tone: data.tone || 'Professional',
        personality: data.personality || 'Friendly',
        ageRange: data.ageRange || '30-40',
        gender: data.gender || 'Female',
        avatarUrl: data.avatarUrl || null,
        thumbnailUrl: data.thumbnailUrl || null,
        demoVideoUrl: data.demoVideoUrl || null,
        demoVideoThumb: data.demoVideoThumb || null,
        hairOptions: data.hairOptions || null,
        clothingOptions: data.clothingOptions || null,
        backgroundOptions: data.backgroundOptions || null,
        voiceSample: data.voiceSample || null,
        voiceStyle: data.voiceStyle || null,
        accentOptions: data.accentOptions || null,
        tier: data.tier || 'standard',
        basePrice: data.basePrice || 99700,
        isAvailable: data.isAvailable !== false,
        isExclusive: data.isExclusive || false,
        exclusiveToId: data.exclusiveToId || null,
        vidbuzzActorId: data.vidbuzzActorId || null,
        vidbuzzVoiceId: data.vidbuzzVoiceId || null,
        sortOrder: data.sortOrder || 0,
        featured: data.featured || false,
      }
    })

    return NextResponse.json(spokesperson, { status: 201 })
  } catch (error) {
    console.error('Error creating spokesperson:', error)
    return NextResponse.json(
      { error: 'Failed to create spokesperson' },
      { status: 500 }
    )
  }
}
