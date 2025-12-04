import { ClientWithRelations, IntakeData } from './types'

interface BuildPromptParams {
  client: ClientWithRelations
  intake: IntakeData
}

export function buildScriptPrompt({ client, intake }: BuildPromptParams): string {
  const systemPrompt = `You are an expert short-form video scriptwriter for TikTok, Instagram Reels, and YouTube Shorts.

I will give you details about a business and its services. Your job is to generate 30 short video scripts that this business can use with an AI video spokesperson.

Business info:
- Business name: ${client.businessName}
- Niche: ${client.niche}
- Tone of voice: ${client.tone}
- Main goals: ${client.goals}
- Brand voice notes: ${intake.brandVoiceNotes}
${client.website ? `- Website: ${client.website}` : ''}

Raw FAQs (from client):
${intake.rawFaqs || 'No FAQs provided'}

Raw offers/services (from client):
${intake.rawOffers || 'No offers provided'}

Raw testimonials (from client):
${intake.rawTestimonials || 'No testimonials provided'}

Raw promos or special offers:
${intake.rawPromos || 'No promos provided'}

Additional references:
${intake.references || 'No references provided'}

Task:
Generate exactly 30 short-form video scripts with this structure:
- 8 FAQ scripts (address common questions customers might have)
- 8 Service/Explainer scripts (highlight what the business offers and how it helps)
- 4 Promo scripts (promote offers, discounts, or limited-time deals)
- 4 Testimonial-style scripts (spoken by the AI spokesperson referencing real customer outcomes - use the testimonials provided as inspiration)
- 4 Tip/Educational scripts (provide value and position the business as an expert)
- 2 Brand/Credibility scripts (build trust, share credentials, highlight experience)

Rules:
- Each script should be roughly 15–45 seconds when spoken (approximately 40-120 words).
- Use a ${client.tone} tone that matches the ${client.niche} niche.
- Do not mention TikTok/Reels explicitly unless relevant; these should work on any social platform.
- Always write in the first person as the business or its spokesperson.
- Avoid jargon. Make it sound like someone talking naturally on camera.
- Include a clear hook in the first line to grab attention.
- End each script with a soft call-to-action when appropriate.
- Use a short, catchy title for each script.

Output format:
Return ONLY valid JSON with this exact structure (no markdown, no code blocks, just the JSON):
{
  "faqs": [
    { "title": "...", "script": "..." },
    { "title": "...", "script": "..." },
    { "title": "...", "script": "..." },
    { "title": "...", "script": "..." },
    { "title": "...", "script": "..." },
    { "title": "...", "script": "..." },
    { "title": "...", "script": "..." },
    { "title": "...", "script": "..." }
  ],
  "services": [
    { "title": "...", "script": "..." },
    { "title": "...", "script": "..." },
    { "title": "...", "script": "..." },
    { "title": "...", "script": "..." },
    { "title": "...", "script": "..." },
    { "title": "...", "script": "..." },
    { "title": "...", "script": "..." },
    { "title": "...", "script": "..." }
  ],
  "promos": [
    { "title": "...", "script": "..." },
    { "title": "...", "script": "..." },
    { "title": "...", "script": "..." },
    { "title": "...", "script": "..." }
  ],
  "testimonials": [
    { "title": "...", "script": "..." },
    { "title": "...", "script": "..." },
    { "title": "...", "script": "..." },
    { "title": "...", "script": "..." }
  ],
  "tips": [
    { "title": "...", "script": "..." },
    { "title": "...", "script": "..." },
    { "title": "...", "script": "..." },
    { "title": "...", "script": "..." }
  ],
  "brand": [
    { "title": "...", "script": "..." },
    { "title": "...", "script": "..." }
  ]
}`

  return systemPrompt
}

// Helper to validate the LLM response structure
export function validateScriptResponse(response: unknown): boolean {
  if (!response || typeof response !== 'object') return false

  const r = response as Record<string, unknown>

  const requiredKeys = ['faqs', 'services', 'promos', 'testimonials', 'tips', 'brand']
  const expectedCounts = {
    faqs: 8,
    services: 8,
    promos: 4,
    testimonials: 4,
    tips: 4,
    brand: 2,
  }

  for (const key of requiredKeys) {
    if (!Array.isArray(r[key])) return false
    const arr = r[key] as Array<unknown>
    if (arr.length !== expectedCounts[key as keyof typeof expectedCounts]) return false

    for (const item of arr) {
      if (!item || typeof item !== 'object') return false
      const script = item as Record<string, unknown>
      if (typeof script.title !== 'string' || typeof script.script !== 'string') return false
    }
  }

  return true
}
