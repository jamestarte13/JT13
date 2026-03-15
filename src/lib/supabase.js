import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase env vars not set — running in demo mode.')
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder'
)

// ── Subscribers ──────────────────────────────────────────────────────────────

export async function getSubscriber(email) {
  const { data, error } = await supabase
    .from('subscribers')
    .select('*')
    .eq('email', email)
    .maybeSingle()
  if (error) console.error('getSubscriber:', error)
  return data
}

export async function upsertSubscriber(email, fields = {}) {
  const { data, error } = await supabase
    .from('subscribers')
    .upsert({ email, ...fields }, { onConflict: 'email' })
    .select()
    .single()
  if (error) console.error('upsertSubscriber:', error)
  return data
}

export async function incrementLetterCount(email) {
  // Use RPC if available; fallback to read-then-write
  const sub = await getSubscriber(email)
  const count = (sub?.letter_count ?? 0) + 1
  return upsertSubscriber(email, {
    letter_count: count,
    last_letter_at: new Date().toISOString(),
  })
}

// ── Submissions ───────────────────────────────────────────────────────────────

export async function saveSubmission(payload) {
  const { data, error } = await supabase
    .from('submissions')
    .insert(payload)
    .select()
    .single()
  if (error) console.error('saveSubmission:', error)
  return data
}

export async function getSubmissions({ limit = 50, offset = 0 } = {}) {
  const { data, error } = await supabase
    .from('submissions')
    .select('*')
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)
  if (error) console.error('getSubmissions:', error)
  return data ?? []
}

export async function getDashboardStats() {
  // Fetch aggregate counts for admin dashboard
  const [subRes, letterRes] = await Promise.all([
    supabase.from('subscribers').select('plan, letter_count, created_at'),
    supabase.from('submissions').select('plan, fine_amount, borough, violation_type, defense_reason, created_at, pdf_downloaded'),
  ])

  const subscribers = subRes.data ?? []
  const submissions = letterRes.data ?? []

  const annualSubs = subscribers.filter(s => s.plan === 'annual')
  const paidSubs   = subscribers.filter(s => s.plan === 'paid')
  const freeSubs   = subscribers.filter(s => s.plan === 'free')

  const totalRevenue =
    annualSubs.length * 39.99 +
    submissions.filter(s => s.plan === 'paid').length * 9.99

  return {
    totalLetters: submissions.length,
    emailsCaptured: subscribers.length,
    annualSubscribers: annualSubs.length,
    paidPerLetter: paidSubs.length,
    freeUsers: freeSubs.length,
    totalRevenue,
    mrr: annualSubs.length * (39.99 / 12),
    arr: annualSubs.length * 39.99,
    conversionRate: subscribers.length
      ? Math.round(((annualSubs.length + paidSubs.length) / subscribers.length) * 1000) / 10
      : 0,
    submissions,
    subscribers,
  }
}
