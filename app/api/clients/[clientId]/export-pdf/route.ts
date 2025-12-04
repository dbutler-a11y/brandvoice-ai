import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateScriptsPDF } from '@/lib/pdfExport'

export async function GET(
  request: NextRequest,
  { params }: { params: { clientId: string } }
) {
  try {
    const client = await prisma.client.findUnique({
      where: { id: params.clientId },
      include: {
        intake: true,
        scripts: {
          orderBy: [
            { type: 'asc' },
            { createdAt: 'asc' }
          ]
        }
      }
    })

    if (!client) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 })
    }

    if (client.scripts.length === 0) {
      return NextResponse.json({ error: 'No scripts to export' }, { status: 400 })
    }

    // Generate the PDF
    const doc = generateScriptsPDF({ client })

    // Get PDF as array buffer
    const pdfBuffer = doc.output('arraybuffer')

    // Create filename
    const filename = `${client.businessName.replace(/\s+/g, '_')}_Scripts.pdf`

    // Return PDF as download
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    })
  } catch (error) {
    console.error('PDF export error:', error)
    return NextResponse.json(
      { error: 'Failed to generate PDF' },
      { status: 500 }
    )
  }
}
