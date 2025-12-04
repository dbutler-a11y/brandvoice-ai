import jsPDF from 'jspdf'
import { ClientWithRelations } from './types'
import { estimateDuration, formatDuration, SCRIPT_TYPE_LABELS } from './utils'

interface PDFScript {
  type: string
  title: string
  scriptText: string
  durationSeconds: number | null
  status: string
}

interface PDFExportOptions {
  client: ClientWithRelations
}

export function generateScriptsPDF({ client }: PDFExportOptions): jsPDF {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  })

  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  const margin = 20
  const contentWidth = pageWidth - 2 * margin
  let currentY = margin

  // Helper function to add page numbers
  const addFooter = (pageNum: number) => {
    doc.setFontSize(9)
    doc.setTextColor(128, 128, 128)
    doc.text(
      `Page ${pageNum}`,
      pageWidth / 2,
      pageHeight - 10,
      { align: 'center' }
    )
  }

  // Helper function to check if we need a new page
  const checkNewPage = (spaceNeeded: number) => {
    if (currentY + spaceNeeded > pageHeight - margin - 15) {
      addFooter(pageNumber)
      doc.addPage()
      pageNumber++
      currentY = margin
      return true
    }
    return false
  }

  // Helper function to wrap text and return lines
  const wrapText = (text: string, maxWidth: number): string[] => {
    return doc.splitTextToSize(text, maxWidth)
  }

  let pageNumber = 1

  // COVER PAGE
  doc.setFontSize(28)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(30, 58, 138) // Blue color

  currentY = 60
  const titleLines = wrapText(client.businessName, contentWidth)
  titleLines.forEach((line) => {
    doc.text(line, pageWidth / 2, currentY, { align: 'center' })
    currentY += 12
  })

  currentY += 10
  doc.setFontSize(18)
  doc.setTextColor(71, 85, 105) // Slate color
  doc.text('30-Day Video Content Scripts', pageWidth / 2, currentY, { align: 'center' })

  currentY += 40
  doc.setFontSize(12)
  doc.setTextColor(100, 100, 100)
  doc.setFont('helvetica', 'normal')

  const today = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
  doc.text(`Generated: ${today}`, pageWidth / 2, currentY, { align: 'center' })

  currentY += 10
  doc.text(`Total Scripts: ${client.scripts.length}`, pageWidth / 2, currentY, { align: 'center' })

  // Calculate total duration
  const totalSeconds = client.scripts.reduce((sum, script) => {
    return sum + (script.durationSeconds || estimateDuration(script.scriptText))
  }, 0)
  const totalMinutes = Math.round(totalSeconds / 60)

  currentY += 10
  doc.text(`Total Duration: ~${totalMinutes} minutes`, pageWidth / 2, currentY, { align: 'center' })

  // Add decorative line
  currentY += 20
  doc.setDrawColor(219, 234, 254) // Light blue
  doc.setLineWidth(0.5)
  doc.line(margin + 30, currentY, pageWidth - margin - 30, currentY)

  // Client details section
  currentY += 20
  doc.setFontSize(10)
  doc.setTextColor(100, 100, 100)
  doc.text('Client Information:', margin, currentY)
  currentY += 8

  doc.setFontSize(9)
  doc.text(`Contact: ${client.contactName}`, margin, currentY)
  currentY += 6
  doc.text(`Email: ${client.email}`, margin, currentY)
  currentY += 6
  doc.text(`Niche: ${client.niche}`, margin, currentY)
  currentY += 6
  doc.text(`Tone: ${client.tone}`, margin, currentY)

  addFooter(pageNumber)

  // TABLE OF CONTENTS
  doc.addPage()
  pageNumber++
  currentY = margin

  doc.setFontSize(20)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(30, 58, 138)
  doc.text('Table of Contents', margin, currentY)

  currentY += 15
  doc.setFontSize(11)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(50, 50, 50)

  const scriptsByType: { [key: string]: PDFScript[] } = {
    FAQ: [],
    SERVICE: [],
    PROMO: [],
    TESTIMONIAL: [],
    TIP: [],
    BRAND: [],
  }

  client.scripts.forEach((script) => {
    if (scriptsByType[script.type]) {
      scriptsByType[script.type].push(script)
    }
  })

  Object.entries(scriptsByType).forEach(([type, scripts]) => {
    if (scripts.length > 0) {
      doc.setFont('helvetica', 'bold')
      doc.text(`${SCRIPT_TYPE_LABELS[type]} Scripts`, margin + 5, currentY)
      doc.setFont('helvetica', 'normal')
      doc.text(`(${scripts.length})`, margin + 60, currentY)
      currentY += 8
    }
  })

  addFooter(pageNumber)

  // SCRIPTS BY TYPE
  Object.entries(scriptsByType).forEach(([type, scripts]) => {
    if (scripts.length === 0) return

    doc.addPage()
    pageNumber++
    currentY = margin

    // Section header
    doc.setFontSize(18)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(30, 58, 138)
    doc.text(`${SCRIPT_TYPE_LABELS[type]} Scripts`, margin, currentY)

    currentY += 5
    doc.setDrawColor(219, 234, 254)
    doc.setLineWidth(0.5)
    doc.line(margin, currentY, pageWidth - margin, currentY)
    currentY += 10

    scripts.forEach((script, index) => {
      const duration = script.durationSeconds || estimateDuration(script.scriptText)
      const formattedDuration = formatDuration(duration)

      // Check if we need space for the script header (at least 40mm)
      checkNewPage(40)

      // Script number and title
      doc.setFontSize(12)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(30, 58, 138)

      const scriptHeader = `${index + 1}. ${script.title}`
      const headerLines = wrapText(scriptHeader, contentWidth)
      headerLines.forEach((line) => {
        checkNewPage(8)
        doc.text(line, margin, currentY)
        currentY += 7
      })

      currentY += 2

      // Status and duration badge
      doc.setFontSize(9)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(100, 100, 100)

      const statusText = `Status: ${script.status.charAt(0).toUpperCase() + script.status.slice(1)}`
      doc.text(statusText, margin, currentY)
      doc.text(`Duration: ${formattedDuration}`, margin + 40, currentY)
      currentY += 8

      // Script text
      doc.setFontSize(10)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(50, 50, 50)

      const scriptLines = wrapText(script.scriptText, contentWidth)
      scriptLines.forEach((line) => {
        checkNewPage(6)
        doc.text(line, margin, currentY)
        currentY += 5
      })

      // Add spacing after script
      currentY += 10

      // Add separator line between scripts (except for the last one)
      if (index < scripts.length - 1) {
        checkNewPage(5)
        doc.setDrawColor(229, 231, 235) // Light gray
        doc.setLineWidth(0.3)
        doc.line(margin, currentY, pageWidth - margin, currentY)
        currentY += 10
      }
    })

    addFooter(pageNumber)
  })

  return doc
}

export function downloadPDF(doc: jsPDF, filename: string): void {
  doc.save(filename)
}

export function generateAndDownloadScriptsPDF(client: ClientWithRelations): void {
  const doc = generateScriptsPDF({ client })
  const filename = `${client.businessName.replace(/\s+/g, '_')}_Scripts.pdf`
  downloadPDF(doc, filename)
}
