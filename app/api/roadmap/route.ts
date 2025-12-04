import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

const ROADMAP_PATH = path.join(process.cwd(), 'ROADMAP.md')

// GET - Read the roadmap file
export async function GET() {
  try {
    const content = await fs.readFile(ROADMAP_PATH, 'utf-8')
    return NextResponse.json({ content })
  } catch (error) {
    console.error('Error reading roadmap:', error)
    return NextResponse.json(
      { error: 'Failed to read roadmap' },
      { status: 500 }
    )
  }
}

// PUT - Update the roadmap file
export async function PUT(request: NextRequest) {
  try {
    const { content } = await request.json()

    if (typeof content !== 'string') {
      return NextResponse.json(
        { error: 'Content must be a string' },
        { status: 400 }
      )
    }

    // Update the "Last Updated" date
    const updatedContent = content.replace(
      /> Last Updated: .*/,
      `> Last Updated: ${new Date().toISOString().split('T')[0]}`
    )

    await fs.writeFile(ROADMAP_PATH, updatedContent, 'utf-8')

    return NextResponse.json({
      success: true,
      message: 'Roadmap updated successfully'
    })
  } catch (error) {
    console.error('Error updating roadmap:', error)
    return NextResponse.json(
      { error: 'Failed to update roadmap' },
      { status: 500 }
    )
  }
}
