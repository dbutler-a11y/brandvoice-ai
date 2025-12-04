import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const STRATEGY_FILE = path.join(process.cwd(), 'BUSINESS_STRATEGY.md')

export async function GET() {
  try {
    const content = fs.readFileSync(STRATEGY_FILE, 'utf-8')
    return NextResponse.json({ content })
  } catch (error) {
    console.error('Error reading strategy file:', error)
    return NextResponse.json(
      { error: 'Failed to read strategy file' },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const { content } = await request.json()
    fs.writeFileSync(STRATEGY_FILE, content, 'utf-8')
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error saving strategy file:', error)
    return NextResponse.json(
      { error: 'Failed to save strategy file' },
      { status: 500 }
    )
  }
}
