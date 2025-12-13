import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import OpenAI from 'openai'

// Initialize OpenAI client
const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null

// POST generate AI prompt for a frame
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { athleteId, frameId } = body

    if (!athleteId || !frameId) {
      return NextResponse.json({ error: 'athleteId and frameId are required' }, { status: 400 })
    }

    // Fetch the frame with athlete and project context
    const frame = await prisma.studioFrame.findUnique({
      where: { id: frameId },
      include: {
        athlete: {
          include: {
            project: {
              include: {
                client: {
                  select: { businessName: true, niche: true, tone: true }
                }
              }
            }
          }
        }
      }
    })

    if (!frame) {
      return NextResponse.json({ error: 'Frame not found' }, { status: 404 })
    }

    const athlete = frame.athlete
    const project = athlete.project
    const client = project.client

    // Build context for the prompt
    const context = {
      athleteName: athlete.name,
      sport: athlete.sport,
      athleteNotes: athlete.notes,
      projectName: project.name,
      projectDescription: project.description,
      projectType: project.projectType,
      primaryChannel: project.primaryChannel,
      primaryGoal: project.primaryGoal,
      brandName: project.brandName || client?.businessName || 'the brand',
      clientNiche: client?.niche,
      clientTone: client?.tone,
      frameLabel: frame.label,
      frameDescription: frame.description,
      frameOrder: frame.order,
    }

    let generatedPrompt: string

    if (openai) {
      // Use OpenAI GPT-4 to generate the prompt
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o',
        max_tokens: 1024,
        messages: [
          {
            role: 'system',
            content: 'You are an expert AI video generation prompt engineer specializing in athlete advertising content. Generate detailed, cinematic prompts for AI video generation tools like Higgsfield.'
          },
          {
            role: 'user',
            content: `Generate a detailed, cinematic prompt for an AI video generation tool based on this context:

**Athlete:** ${context.athleteName} (${context.sport})
${context.athleteNotes ? `**Notes:** ${context.athleteNotes}` : ''}

**Project:** ${context.projectName}
**Description:** ${context.projectDescription}
**Type:** ${context.projectType}
**Channel:** ${context.primaryChannel}
${context.primaryGoal ? `**Goal:** ${context.primaryGoal}` : ''}

**Brand:** ${context.brandName}
${context.clientNiche ? `**Industry:** ${context.clientNiche}` : ''}
${context.clientTone ? `**Brand Tone:** ${context.clientTone}` : ''}

**Frame #${context.frameOrder}: ${context.frameLabel}**
**Scene Description:** ${context.frameDescription}

Generate a detailed, production-ready prompt that includes:
1. Camera angle and movement (e.g., "slow dolly in", "tracking shot")
2. Lighting and atmosphere
3. Athlete positioning and action
4. Visual style and color grading suggestions
5. Mood and energy level
6. Any relevant props or environment details

The prompt should be optimized for AI video generation and result in a professional, broadcast-quality athlete advertisement. Keep the prompt concise but detailed (2-4 sentences).`
          }
        ]
      })

      generatedPrompt = completion.choices[0]?.message?.content || 'Failed to generate prompt'
    } else {
      // Fallback mock prompt when OpenAI is not configured
      generatedPrompt = `Cinematic shot of ${context.athleteName}, a professional ${context.sport} athlete, ${context.frameDescription.toLowerCase()}. Shot on ARRI Alexa with anamorphic lens, dramatic golden hour lighting, slow-motion 120fps. The scene captures the intensity and dedication of the athlete, with ${context.brandName} branding subtly integrated. Camera slowly dollies around the subject, creating an immersive, inspiring atmosphere.`
    }

    // Update the frame with the generated prompt
    const updatedFrame = await prisma.studioFrame.update({
      where: { id: frameId },
      data: {
        aiPrompt: generatedPrompt,
        status: 'prompt_ready',
      }
    })

    return NextResponse.json({
      frameId: updatedFrame.id,
      prompt: generatedPrompt,
      openaiUsed: !!openai,
      frame: {
        ...updatedFrame,
        externalLinks: updatedFrame.externalLinks ? JSON.parse(updatedFrame.externalLinks) : [],
        checkpoints: updatedFrame.checkpoints ? JSON.parse(updatedFrame.checkpoints) : [],
        revisions: updatedFrame.revisions ? JSON.parse(updatedFrame.revisions) : [],
        notes: updatedFrame.notes ? JSON.parse(updatedFrame.notes) : [],
      }
    })
  } catch (error) {
    console.error('Error generating prompt:', error)
    return NextResponse.json({ error: 'Failed to generate prompt' }, { status: 500 })
  }
}
