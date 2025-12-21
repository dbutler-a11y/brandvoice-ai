import { NextRequest, NextResponse } from 'next/server'

const KIE_API_KEY = process.env.KIE_API_KEY

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { endpoint, ...data } = body

    if (!KIE_API_KEY) {
      return NextResponse.json(
        { error: 'KIE_API_KEY not configured' },
        { status: 500 }
      )
    }

    // Determine the full URL
    const baseUrl = 'https://api.kie.ai/api/v1'
    const url = `${baseUrl}${endpoint}`

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${KIE_API_KEY}`,
      },
      body: JSON.stringify(data),
    })

    const result = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        { error: result.message || result.error || 'API request failed', details: result },
        { status: response.status }
      )
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('Kie API error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const taskId = searchParams.get('taskId')

    if (!taskId) {
      return NextResponse.json(
        { error: 'taskId is required' },
        { status: 400 }
      )
    }

    if (!KIE_API_KEY) {
      return NextResponse.json(
        { error: 'KIE_API_KEY not configured' },
        { status: 500 }
      )
    }

    const response = await fetch(
      `https://api.kie.ai/api/v1/jobs/queryTask?taskId=${taskId}`,
      {
        headers: {
          'Authorization': `Bearer ${KIE_API_KEY}`,
        },
      }
    )

    const result = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        { error: result.message || result.error || 'API request failed', details: result },
        { status: response.status }
      )
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('Kie API error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}
