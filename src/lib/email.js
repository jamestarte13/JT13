// Email is sent server-side via Vercel API route to keep RESEND_API_KEY secret.
export async function sendAppealEmail({ to, name, letterText, pdfBase64 }) {
  try {
    const res = await fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ to, name, letterText, pdfBase64 }),
    })
    if (!res.ok) throw new Error('Email send failed')
    return true
  } catch (err) {
    console.error('sendAppealEmail:', err)
    return false
  }
}
