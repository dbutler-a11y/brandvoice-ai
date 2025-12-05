import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { buildScriptPrompt } from '@/lib/scriptTemplates'
import { generateScriptsWithLLM } from '@/lib/llm'
import { estimateDuration } from '@/lib/utils'
import { ClientWithRelations, IntakeData } from '@/lib/types'
import { requireAdmin } from '@/lib/auth'

// POST /api/clients/[clientId]/generate-scripts - Generate 30 scripts for a client using LLM
export async function POST(
  request: NextRequest,
  { params }: { params: { clientId: string } }
) {
  // Check authentication
  const authResult = await requireAdmin()
  if (authResult instanceof NextResponse) return authResult

  try {
    // Step 1: Fetch client + intake
    const client = await prisma.client.findUnique({
      where: { id: params.clientId },
      include: {
        intake: true,
        scripts: true,
      },
    })

    if (!client) {
      return NextResponse.json(
        { error: 'Client not found' },
        { status: 404 }
      )
    }

    if (!client.intake) {
      return NextResponse.json(
        { error: 'Client has no intake data. Please complete intake first.' },
        { status: 400 }
      )
    }

    // Step 2: Build prompt using buildScriptPrompt
    const prompt = buildScriptPrompt({
      client: client as ClientWithRelations,
      intake: client.intake as IntakeData,
    })

    // Step 3: Call generateScriptsWithLLM
    const llmResponse = await generateScriptsWithLLM(prompt)

    // Step 4: Create 30 Script records in DB with proper types
    const scriptsToCreate = []

    // Map LLM response categories to script types
    // FAQs -> type "FAQ"
    for (const script of llmResponse.faqs) {
      scriptsToCreate.push({
        clientId: params.clientId,
        type: 'FAQ',
        title: script.title,
        scriptText: script.script,
        durationSeconds: estimateDuration(script.script),
        status: 'draft',
      })
    }

    // Services -> type "SERVICE"
    for (const script of llmResponse.services) {
      scriptsToCreate.push({
        clientId: params.clientId,
        type: 'SERVICE',
        title: script.title,
        scriptText: script.script,
        durationSeconds: estimateDuration(script.script),
        status: 'draft',
      })
    }

    // Promos -> type "PROMO"
    for (const script of llmResponse.promos) {
      scriptsToCreate.push({
        clientId: params.clientId,
        type: 'PROMO',
        title: script.title,
        scriptText: script.script,
        durationSeconds: estimateDuration(script.script),
        status: 'draft',
      })
    }

    // Testimonials -> type "TESTIMONIAL"
    for (const script of llmResponse.testimonials) {
      scriptsToCreate.push({
        clientId: params.clientId,
        type: 'TESTIMONIAL',
        title: script.title,
        scriptText: script.script,
        durationSeconds: estimateDuration(script.script),
        status: 'draft',
      })
    }

    // Tips -> type "TIP"
    for (const script of llmResponse.tips) {
      scriptsToCreate.push({
        clientId: params.clientId,
        type: 'TIP',
        title: script.title,
        scriptText: script.script,
        durationSeconds: estimateDuration(script.script),
        status: 'draft',
      })
    }

    // Brand -> type "BRAND"
    for (const script of llmResponse.brand) {
      scriptsToCreate.push({
        clientId: params.clientId,
        type: 'BRAND',
        title: script.title,
        scriptText: script.script,
        durationSeconds: estimateDuration(script.script),
        status: 'draft',
      })
    }

    // Create all scripts in the database
    const createdScripts = await prisma.script.createMany({
      data: scriptsToCreate,
    })

    // Step 5: Return summary of created scripts
    const summary = {
      totalScriptsCreated: createdScripts.count,
      breakdown: {
        FAQ: llmResponse.faqs.length,
        SERVICE: llmResponse.services.length,
        PROMO: llmResponse.promos.length,
        TESTIMONIAL: llmResponse.testimonials.length,
        TIP: llmResponse.tips.length,
        BRAND: llmResponse.brand.length,
      },
      clientId: params.clientId,
      clientName: client.businessName,
    }

    return NextResponse.json(summary, { status: 201 })
  } catch (error) {
    console.error('Error generating scripts:', error)
    return NextResponse.json(
      {
        error: 'Failed to generate scripts',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
