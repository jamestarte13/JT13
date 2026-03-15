// Vercel serverless function — runs server-side only
// Never exposed to the browser; keeps STRIPE_SECRET_KEY safe.
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
})

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { priceId, email, successUrl, cancelUrl } = req.body

  if (!priceId || !successUrl || !cancelUrl) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: priceId.includes('annual') || priceId === process.env.STRIPE_ANNUAL_PRICE_ID
        ? 'subscription'
        : 'payment',
      line_items: [{ price: priceId, quantity: 1 }],
      customer_email: email || undefined,
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: { email: email || '' },
    })

    return res.status(200).json({ url: session.url })
  } catch (err) {
    console.error('Stripe error:', err)
    return res.status(500).json({ error: err.message })
  }
}
