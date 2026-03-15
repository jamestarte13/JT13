import { loadStripe } from '@stripe/stripe-js'

const key = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
export const stripePromise = key ? loadStripe(key) : null

// Price IDs (set in env)
export const PRICES = {
  perLetter: import.meta.env.VITE_STRIPE_PERLETTER_PRICE_ID || 'price_per_letter',
  annual:    import.meta.env.VITE_STRIPE_ANNUAL_PRICE_ID    || 'price_annual',
}

// Launch Stripe Checkout via Vercel serverless function
export async function checkoutSession({ priceId, email, successUrl, cancelUrl }) {
  const res = await fetch('/api/create-checkout-session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ priceId, email, successUrl, cancelUrl }),
  })
  if (!res.ok) throw new Error('Failed to create checkout session')
  const { url } = await res.json()
  window.location.href = url
}
