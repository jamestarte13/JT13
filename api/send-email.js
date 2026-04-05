// Vercel serverless function — runs server-side only
// Keeps RESEND_API_KEY safe.
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { to, name, letterText, pdfBase64 } = req.body

  if (!to || !letterText) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  const govLink = 'https://www.nyc.gov/site/finance/vehicles/parking-violations-hearing-online.page'

  const whatNow = `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
WHAT NOW? SUBMIT YOUR LETTER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Download your attached letter and submit it directly to the NYC Department of Finance:

  → ${govLink}

You can also submit by mail:
  NYC Dept of Finance, Hearings By Mail Unit
  P.O. Box 29021, Cadman Plaza Station, Brooklyn, NY 11202-9021

Or in person at any NYC Finance Business Center, Mon–Fri 8:30am–4:30pm.

REMINDERS:
  • Submit within 30 days of your ticket date — don't wait.
  • Never pay the ticket before your dispute — it is treated as a guilty plea.
  • Include all evidence (photos, receipts) — copies only, never originals.

Good luck with your dispute!
— NYC Dispute Writer Team
nycdisputewriter.com
`

  try {
    const attachments = pdfBase64
      ? [{ filename: 'dispute-letter.pdf', content: pdfBase64 }]
      : []

    const { data, error } = await resend.emails.send({
      from: 'NYC Dispute Writer <onboarding@resend.dev>',
      to: [to],
      subject: 'Your NYC Parking Ticket Dispute Letter — NYC Dispute Writer',
      text: `Dear ${name || 'Driver'},\n\nThank you for using NYC Dispute Writer!\n\nYour completed parking ticket dispute letter is attached to this email as a PDF.\n\n${'='.repeat(60)}\n\n${letterText}\n\n${'='.repeat(60)}\n${whatNow}`,
      attachments,
    })

    if (error) throw error

    return res.status(200).json({ success: true, id: data?.id })
  } catch (err) {
    console.error('Resend error:', err)
    return res.status(500).json({ error: err.message })
  }
}
