import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import type { FullIntakeFormData } from '@/lib/types'

// GET /api/clients - Get all clients
export async function GET() {
  try {
    const clients = await prisma.client.findMany({
      include: {
        _count: {
          select: { scripts: true }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(clients)
  } catch (error) {
    console.error('Error fetching clients:', error)
    return NextResponse.json(
      { error: 'Failed to fetch clients' },
      { status: 500 }
    )
  }
}

// POST /api/clients - Create new client with intake
export async function POST(request: NextRequest) {
  try {
    const data: FullIntakeFormData = await request.json()

    // Create client with intake in a transaction
    const client = await prisma.client.create({
      data: {
        businessName: data.businessName,
        contactName: data.contactName,
        email: data.email,
        phone: data.phone || null,
        website: data.website || null,
        niche: data.niche,
        tone: data.tone,
        goals: data.goals,
        notes: data.notes || null,
        intake: {
          create: {
            rawFaqs: data.rawFaqs,
            rawOffers: data.rawOffers,
            rawTestimonials: data.rawTestimonials,
            rawPromos: data.rawPromos,
            brandVoiceNotes: data.brandVoiceNotes,
            references: data.references,
            brandColors: data.brandColors || null,
            logoUrl: data.logoUrl || null,
          }
        }
      },
      include: {
        intake: true
      }
    })

    return NextResponse.json(client, { status: 201 })
  } catch (error) {
    console.error('Error creating client:', error)
    return NextResponse.json(
      { error: 'Failed to create client' },
      { status: 500 }
    )
  }
}
