import { LLMScriptResponse } from './types'
import { validateScriptResponse } from './scriptTemplates'

interface OpenAIMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

interface OpenAIResponse {
  choices: Array<{
    message: {
      content: string
    }
  }>
}

export async function generateScriptsWithLLM(prompt: string): Promise<LLMScriptResponse> {
  const apiKey = process.env.OPENAI_API_KEY

  if (!apiKey || apiKey === 'sk-your-openai-api-key-here') {
    // Return mock data for development/testing
    console.log('No valid OpenAI API key found. Returning mock data.')
    return getMockScriptResponse()
  }

  try {
    const messages: OpenAIMessage[] = [
      {
        role: 'system',
        content: 'You are an expert video scriptwriter. Always respond with valid JSON only, no markdown formatting.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ]

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages,
        temperature: 0.7,
        max_tokens: 4096,
        response_format: { type: 'json_object' },
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`OpenAI API error: ${response.status} - ${error}`)
    }

    const data: OpenAIResponse = await response.json()
    const content = data.choices[0]?.message?.content

    if (!content) {
      throw new Error('No content in OpenAI response')
    }

    // Parse the JSON response
    const parsed = parseScriptResponse(content)

    if (!validateScriptResponse(parsed)) {
      throw new Error('Invalid script response structure from LLM')
    }

    return parsed as LLMScriptResponse
  } catch (error) {
    console.error('LLM generation error:', error)
    throw error
  }
}

function parseScriptResponse(content: string): unknown {
  // Try to extract JSON from the response
  let jsonString = content.trim()

  // Remove markdown code blocks if present
  if (jsonString.startsWith('```json')) {
    jsonString = jsonString.slice(7)
  } else if (jsonString.startsWith('```')) {
    jsonString = jsonString.slice(3)
  }

  if (jsonString.endsWith('```')) {
    jsonString = jsonString.slice(0, -3)
  }

  jsonString = jsonString.trim()

  try {
    return JSON.parse(jsonString)
  } catch {
    // Try to find JSON object in the string
    const jsonMatch = content.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }
    throw new Error('Failed to parse JSON from LLM response')
  }
}

// Mock response for development without API key
function getMockScriptResponse(): LLMScriptResponse {
  return {
    faqs: Array(8).fill(null).map((_, i) => ({
      title: `FAQ Script ${i + 1}`,
      script: `Hey there! One question I get asked all the time is about [topic ${i + 1}]. Here's the deal... [explanation]. If you have more questions, drop them in the comments or reach out directly!`,
    })),
    services: Array(8).fill(null).map((_, i) => ({
      title: `Service Explainer ${i + 1}`,
      script: `Let me tell you about one of our most popular services... [Service ${i + 1}]. What makes it special is [benefit]. Our clients love it because [result]. Want to learn more? Link in bio!`,
    })),
    promos: Array(4).fill(null).map((_, i) => ({
      title: `Special Offer ${i + 1}`,
      script: `I've got some exciting news! For a limited time, we're offering [promo ${i + 1}]. This is perfect if you've been thinking about [benefit]. Don't wait - this offer won't last forever!`,
    })),
    testimonials: Array(4).fill(null).map((_, i) => ({
      title: `Success Story ${i + 1}`,
      script: `I wanted to share an amazing result from one of our clients. They came to us with [problem] and within [timeframe], they achieved [result ${i + 1}]. Stories like this are why I love what I do!`,
    })),
    tips: Array(4).fill(null).map((_, i) => ({
      title: `Pro Tip ${i + 1}`,
      script: `Here's a quick tip that most people don't know... [Tip ${i + 1}]. This simple change can make a huge difference in [area]. Try it and let me know how it works for you!`,
    })),
    brand: Array(2).fill(null).map((_, i) => ({
      title: `About Us ${i + 1}`,
      script: `I've been in this industry for [years] and there's one thing I've learned... [insight ${i + 1}]. That's why I built this business - to help people like you achieve [goal]. Let's connect!`,
    })),
  }
}
