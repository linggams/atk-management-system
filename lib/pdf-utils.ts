import jsPDF from "jspdf"
import html2canvas from "html2canvas-pro"

/**
 * Generate PDF from HTML element
 * @param elementId - ID of the HTML element to convert to PDF
 * @param filename - Name of the PDF file
 * @param options - Additional options for PDF generation
 */
export async function generatePDF(
  elementId: string,
  filename: string = "document.pdf",
  options: {
    format?: "a4" | "letter"
    orientation?: "portrait" | "landscape"
    margin?: number
  } = {}
) {
  const element = document.getElementById(elementId)
  if (!element) {
    throw new Error(`Element with id "${elementId}" not found`)
  }

  const {
    format = "a4",
    orientation = "portrait",
    margin = 10,
  } = options

  // Create canvas from HTML element (html2canvas-pro supports oklch/lab colors)
  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    logging: false,
    backgroundColor: "#ffffff",
  })

  const imgData = canvas.toDataURL("image/png")

  // Calculate PDF dimensions
  const pdfWidth = format === "a4" ? 210 : 216 // A4: 210mm, Letter: 216mm
  const pdfHeight = format === "a4" ? 297 : 279 // A4: 297mm, Letter: 279mm

  const imgWidth = orientation === "portrait" ? pdfWidth : pdfHeight
  const imgHeight = orientation === "portrait" ? pdfHeight : pdfWidth

  // Calculate image dimensions to fit PDF
  const ratio = canvas.width / canvas.height
  let finalWidth = imgWidth - margin * 2
  let finalHeight = finalWidth / ratio

  // If content is taller than page, adjust
  if (finalHeight > imgHeight - margin * 2) {
    finalHeight = imgHeight - margin * 2
    finalWidth = finalHeight * ratio
  }

  // Create PDF
  const pdf = new jsPDF({
    orientation,
    unit: "mm",
    format,
  })

  // Add image to PDF
  pdf.addImage(
    imgData,
    "PNG",
    margin,
    margin,
    finalWidth,
    finalHeight
  )

  // If content is taller than one page, add additional pages
  let heightLeft = finalHeight
  let position = margin

  while (heightLeft > 0) {
    position = heightLeft - (imgHeight - margin * 2)
    pdf.addPage()
    pdf.addImage(
      imgData,
      "PNG",
      margin,
      position,
      finalWidth,
      finalHeight
    )
    heightLeft -= imgHeight - margin * 2
  }

  // Save PDF
  pdf.save(filename)
}

/**
 * Generate PDF from multiple HTML elements (for multi-page documents)
 */
export async function generateMultiPagePDF(
  elements: { id: string; title?: string }[],
  filename: string = "document.pdf",
  options: {
    format?: "a4" | "letter"
    orientation?: "portrait" | "landscape"
    margin?: number
  } = {}
) {
  const {
    format = "a4",
    orientation = "portrait",
    margin = 10,
  } = options

  const pdfWidth = format === "a4" ? 210 : 216
  const pdfHeight = format === "a4" ? 297 : 279

  const imgWidth = orientation === "portrait" ? pdfWidth : pdfHeight
  const imgHeight = orientation === "portrait" ? pdfHeight : pdfWidth

  const pdf = new jsPDF({
    orientation,
    unit: "mm",
    format,
  })

  for (let i = 0; i < elements.length; i++) {
    const { id, title } = elements[i]
    const element = document.getElementById(id)
    
    if (!element) {
      console.warn(`Element with id "${id}" not found, skipping...`)
      continue
    }

    // Add title if provided
    if (title && i > 0) {
      pdf.addPage()
    }

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff",
    })

    const imgData = canvas.toDataURL("image/png")

    const ratio = canvas.width / canvas.height
    let finalWidth = imgWidth - margin * 2
    let finalHeight = finalWidth / ratio

    if (finalHeight > imgHeight - margin * 2) {
      finalHeight = imgHeight - margin * 2
      finalWidth = finalHeight * ratio
    }

    if (i === 0) {
      pdf.addImage(imgData, "PNG", margin, margin, finalWidth, finalHeight)
    } else {
      pdf.addImage(imgData, "PNG", margin, margin, finalWidth, finalHeight)
    }

    // Handle content taller than one page
    let heightLeft = finalHeight
    let position = margin

    while (heightLeft > 0) {
      position = heightLeft - (imgHeight - margin * 2)
      pdf.addPage()
      pdf.addImage(imgData, "PNG", margin, position, finalWidth, finalHeight)
      heightLeft -= imgHeight - margin * 2
    }
  }

  pdf.save(filename)
}
