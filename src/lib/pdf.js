import { jsPDF } from 'jspdf'

/**
 * Generate a PDF with the letter on page 1 and each exhibit on its own page.
 * Returns a Blob.
 */
export async function generatePDF(letterText, name, exhibits = []) {
  const doc = new jsPDF({ unit: 'pt', format: 'letter' })

  const margin = 72   // 1 inch
  const pageW  = doc.internal.pageSize.getWidth()
  const pageH  = doc.internal.pageSize.getHeight()
  const usableW = pageW - margin * 2

  // ── Page 1: Letter ──────────────────────────────────────────────────────────
  doc.setFont('Times', 'normal')
  doc.setFontSize(12)
  doc.setTextColor(30, 30, 30)

  const lines = doc.splitTextToSize(letterText, usableW)
  let y = margin
  const lineH = 18

  for (const line of lines) {
    if (y + lineH > pageH - margin) {
      doc.addPage()
      y = margin
    }
    doc.text(line, margin, y)
    y += lineH
  }

  // ── Exhibit pages ────────────────────────────────────────────────────────────
  for (let i = 0; i < exhibits.length; i++) {
    const ex = exhibits[i]
    doc.addPage()

    const label = String.fromCharCode(65 + i)

    // Header bar
    doc.setFillColor(232, 255, 0)
    doc.rect(margin, margin, usableW, 2, 'F')

    // "Exhibit X" tag
    doc.setFont('Courier', 'bold')
    doc.setFontSize(9)
    doc.setTextColor(100, 100, 100)
    doc.text(`EXHIBIT ${label}`, margin, margin + 20)

    // Caption
    doc.setFont('Times', 'normal')
    doc.setFontSize(14)
    doc.setTextColor(30, 30, 30)
    doc.text(ex.label, margin, margin + 44)

    // Image (if it's a real image file — pdfs are skipped)
    if (ex.preview && ex.file?.type?.startsWith('image/')) {
      try {
        const imgData = await fileToDataURL(ex.file)
        const imgProps = doc.getImageProperties(imgData)
        const maxW = usableW
        const maxH = pageH - margin * 2 - 80
        const ratio = Math.min(maxW / imgProps.width, maxH / imgProps.height)
        const w = imgProps.width * ratio
        const h = imgProps.height * ratio
        doc.addImage(imgData, imgProps.fileType.toUpperCase(), margin, margin + 60, w, h)
      } catch (err) {
        doc.setFontSize(11)
        doc.setTextColor(150, 150, 150)
        doc.text('[Image could not be embedded]', margin, margin + 80)
      }
    } else if (ex.file?.type === 'application/pdf') {
      doc.setFontSize(11)
      doc.setTextColor(150, 150, 150)
      doc.text('[PDF attachment — please include separately]', margin, margin + 80)
    }
  }

  return doc.output('blob')
}

export async function generatePDFBase64(letterText, name, exhibits = []) {
  const doc = new jsPDF({ unit: 'pt', format: 'letter' })
  const margin = 72
  const pageW  = doc.internal.pageSize.getWidth()
  const pageH  = doc.internal.pageSize.getHeight()
  const usableW = pageW - margin * 2

  doc.setFont('Times', 'normal')
  doc.setFontSize(12)
  doc.setTextColor(30, 30, 30)

  const lines = doc.splitTextToSize(letterText, usableW)
  let y = margin
  const lineH = 18
  for (const line of lines) {
    if (y + lineH > pageH - margin) { doc.addPage(); y = margin }
    doc.text(line, margin, y)
    y += lineH
  }

  for (let i = 0; i < exhibits.length; i++) {
    const ex = exhibits[i]
    doc.addPage()
    const label = String.fromCharCode(65 + i)
    doc.setFillColor(232, 255, 0)
    doc.rect(margin, margin, usableW, 2, 'F')
    doc.setFont('Courier', 'bold')
    doc.setFontSize(9)
    doc.setTextColor(100, 100, 100)
    doc.text(`EXHIBIT ${label}`, margin, margin + 20)
    doc.setFont('Times', 'normal')
    doc.setFontSize(14)
    doc.setTextColor(30, 30, 30)
    doc.text(ex.label, margin, margin + 44)
    if (ex.preview && ex.file?.type?.startsWith('image/')) {
      try {
        const imgData = await fileToDataURL(ex.file)
        const imgProps = doc.getImageProperties(imgData)
        const maxW = usableW
        const maxH = pageH - margin * 2 - 80
        const ratio = Math.min(maxW / imgProps.width, maxH / imgProps.height)
        doc.addImage(imgData, imgProps.fileType.toUpperCase(), margin, margin + 60, imgProps.width * ratio, imgProps.height * ratio)
      } catch { /* skip */ }
    }
  }

  // Return base64 string (without the data: prefix)
  return doc.output('datauristring').split(',')[1]
}

function fileToDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = e => resolve(e.target.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export async function downloadPDF(letterText, name, exhibits = []) {
  const blob = await generatePDF(letterText, name, exhibits)
  const url  = URL.createObjectURL(blob)
  const a    = document.createElement('a')
  a.href     = url
  a.download = `appeal-letter-${name.replace(/\s+/g, '-').toLowerCase()}.pdf`
  a.click()
  URL.revokeObjectURL(url)
}
