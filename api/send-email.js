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

  const submissionTips = `
---
SUBMISSION TIPS:

1. DEADLINE: You have 30 days from the ticket date to appeal. Act now.
2. ONLINE: Visit nyc.gov/finance → "Dispute a Ticket" to upload your letter.
3. BY MAIL: NYC Dept of Finance, Hearings By Mail Unit, P.O. Box 29021, Cadman Plaza Station, Brooklyn, NY 11202-9021
4. IN PERSON: Any NYC Finance Business Center, Mon–Fri 8:30am–4:30pm.
5. Include all evidence (photos, receipts) with your submission — copies only, never originals.
6. Never pay the ticket before appealing — it's treated as a guilty plea.

Good luck with your appeal!
— NYC Appeal Writer Team
`

  try {
    const attachments = pdfBase64
      ? [{ filename: 'appeal-letter.pdf', content: pdfBase64 }]
      : []

    const { data, error } = await resend.emails.send({
      from: 'NYC Appeal Writer <onboarding@resend.dev>',
      to: [to],
      subject: 'Your NYC Parking Ticket Appeal Letter',
      text: `Dear ${name || 'Driver'},\n\nHere is your completed NYC parking ticket appeal letter. Review it carefully before submitting.\n\n${'='.repeat(60)}\n\n${letterText}\n\n${'='.repeat(60)}\n${submissionTips}`,
      attachments,
    })

    if (error) throw error

    return res.status(200).json({ success: true, id: data?.id })
  } catch (err) {
    console.error('Resend error:', err)
    return res.status(500).json({ error: err.message })
  }
}
