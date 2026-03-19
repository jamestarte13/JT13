import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Y, mono, display, serif } from '../components/tokens'
import { Lbl, PBtn, TSel, TInput } from '../components/UI'
import AddressAutocomplete from '../components/AddressAutocomplete'
import ExhibitUploader from '../components/ExhibitUploader'
import {
  violationTypes,
  defenseReasons,
  successLikelihood,
  guideSteps,
  buildDateOptions,
  generateLetter,
} from '../components/data'
import { downloadPDF, generatePDFBase64 } from '../lib/pdf'
import { getSubscriber, upsertSubscriber, incrementLetterCount, saveSubmission } from '../lib/supabase'
import { checkoutSession, PRICES } from '../lib/stripe'
import { sendAppealEmail } from '../lib/email'

const dateOptions = buildDateOptions()

// ── Step indicator ────────────────────────────────────────────────────────────
function StepBar({ current }) {
  const labels = ['Your Info', 'Ticket Info', 'Defense', 'Appeal Letter']
  return (
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 36 }}>
      {labels.map((l, i) => (
        <div key={l} style={{ display: 'flex', alignItems: 'center' }}>
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: '50%',
              background: i <= current ? Y : 'transparent',
              border: i <= current ? 'none' : '2px solid #444',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: i <= current ? '#111' : '#666',
              fontWeight: 700,
              fontSize: 12,
              fontFamily: mono,
              transition: 'all 0.3s',
            }}
          >
            {i < current ? '✓' : i + 1}
          </div>
          {i < labels.length - 1 && (
            <div style={{ width: 30, height: 2, background: i < current ? Y : '#333' }} />
          )}
        </div>
      ))}
      <div
        style={{
          marginLeft: 12,
          color: '#888',
          fontSize: 11,
          fontFamily: mono,
          letterSpacing: 2,
          textTransform: 'uppercase',
        }}
      >
        {labels[current]}
      </div>
    </div>
  )
}

// ── Email gate ────────────────────────────────────────────────────────────────
function EmailGate({ onSubmit }) {
  const [email, setEmail] = useState('')
  const [focused, setFocused] = useState(false)
  const [err, setErr] = useState('')
  const [loading, setLoading] = useState(false)
  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  const go = async () => {
    if (!valid) { setErr('Please enter a valid email address.'); return }
    setErr('')
    setLoading(true)
    // Only create subscriber if they don't exist — never overwrite letter_count
    const existing = await getSubscriber(email).catch(() => null)
    if (!existing) {
      await upsertSubscriber(email, { plan: 'free', letter_count: 0 }).catch(() => {})
    }
    setLoading(false)
    onSubmit(email)
  }

  return (
    <div>
      <div
        style={{
          marginBottom: 28,
          padding: 24,
          background: '#161616',
          border: '1px solid #2a2a2a',
          borderRadius: 12,
        }}
      >
        <div style={{ fontSize: 28, marginBottom: 10 }}>✉️</div>
        <div style={{ color: '#fff', fontSize: 16, fontWeight: 600, fontFamily: mono, marginBottom: 6 }}>
          Get your free appeal letter
        </div>
        <div style={{ color: '#666', fontSize: 13, lineHeight: 1.7 }}>
          Enter your email to access the generator. We&apos;ll also send you a copy of your
          completed letter.
        </div>
      </div>
      <div style={{ marginBottom: 20 }}>
        <Lbl>Email Address</Lbl>
        <input
          type="email"
          value={email}
          onChange={e => { setEmail(e.target.value); setErr('') }}
          placeholder="you@example.com"
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onKeyDown={e => e.key === 'Enter' && go()}
          style={{
            width: '100%',
            background: '#1a1a1a',
            border: `1px solid ${err ? '#ef4444' : focused ? Y : '#333'}`,
            borderRadius: 8,
            padding: '14px 16px',
            color: '#fff',
            fontSize: 15,
            fontFamily: mono,
            outline: 'none',
            boxSizing: 'border-box',
          }}
        />
        {err && (
          <div style={{ color: '#ef4444', fontSize: 12, marginTop: 6, fontFamily: mono }}>{err}</div>
        )}
      </div>
      <PBtn onClick={go} disabled={!email || loading} style={{ width: '100%' }}>
        {loading ? 'Loading...' : 'Get Started →'}
      </PBtn>
      <div
        style={{
          marginTop: 14,
          color: '#444',
          fontSize: 11,
          textAlign: 'center',
          fontFamily: mono,
          letterSpacing: 1,
        }}
      >
        No spam. Unsubscribe anytime.
      </div>
    </div>
  )
}

// ── Success meter ─────────────────────────────────────────────────────────────
function SuccessMeter({ defense }) {
  if (!defense) {
    return (
      <div
        style={{
          marginBottom: 20,
          padding: 16,
          background: '#161616',
          border: '1px solid #222',
          borderRadius: 10,
        }}
      >
        <div style={{ fontFamily: mono, fontSize: 11, color: '#555', letterSpacing: 1 }}>
          SELECT A DEFENSE REASON TO SEE YOUR SUCCESS LIKELIHOOD
        </div>
      </div>
    )
  }
  const data = successLikelihood[defense] || successLikelihood['Other']
  return (
    <div
      style={{
        marginBottom: 20,
        padding: 18,
        background: '#161616',
        border: `1px solid ${data.color}33`,
        borderRadius: 10,
        transition: 'all 0.3s',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 10,
        }}
      >
        <div style={{ fontFamily: mono, fontSize: 10, color: '#666', letterSpacing: 2, textTransform: 'uppercase' }}>
          Appeal Success Likelihood
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontFamily: mono, fontSize: 11, color: data.color, letterSpacing: 1 }}>
            {data.label}
          </span>
          <span style={{ fontFamily: display, fontSize: 22, color: data.color, letterSpacing: 1 }}>
            {data.pct}%
          </span>
        </div>
      </div>
      <div style={{ height: 6, background: '#222', borderRadius: 3, marginBottom: 12, overflow: 'hidden' }}>
        <div
          style={{
            height: '100%',
            width: `${data.pct}%`,
            background: data.color,
            borderRadius: 3,
            transition: 'width 0.6s ease',
          }}
        />
      </div>
      <div style={{ fontFamily: 'Georgia, serif', fontSize: 12, color: '#777', lineHeight: 1.6 }}>
        💡 {data.tip}
      </div>
    </div>
  )
}

// Returns the letter header + first 3 body lines for the blurred teaser preview
function getLetterPreview(letter) {
  const lines = letter.split('\n')
  const dearIdx = lines.findIndex(l => l.startsWith('Dear Hearing Officer'))
  if (dearIdx === -1) return lines.slice(0, 18).join('\n')
  const bodyStart = dearIdx + 2 // skip blank line after salutation
  return lines.slice(0, bodyStart + 2).join('\n')
}

// ── Upsell screen ─────────────────────────────────────────────────────────────
function UpsellScreen({ email, letter, onContinueFree, onUpgrade }) {
  const [loading, setLoading] = useState(false)

  const handleUpgrade = async () => {
    setLoading(true)
    try {
      await checkoutSession({
        priceId: PRICES.annual,
        email,
        successUrl: `${window.location.origin}/appeal?upgraded=true`,
        cancelUrl: `${window.location.href}`,
      })
    } catch {
      alert('Payment service unavailable. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div style={{ textAlign: 'center' }}>
      {/* Letter paper with belt overlay */}
      {/* Fixed-height window: letter fills behind, belt flexed to true center */}
      <div style={{ position: 'relative', userSelect: 'none', marginBottom: 24, height: 520, overflow: 'hidden', borderRadius: 8, boxShadow: '0 2px 24px rgba(0,0,0,0.5)' }}>

        {/* Letter paper pinned to top, tall enough to fill window */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, background: '#fff', padding: '24px 28px', textAlign: 'left' }}>
          <div style={{ fontFamily: 'Georgia, serif', fontSize: 13, color: '#1a1a1a', lineHeight: 1.9, whiteSpace: 'pre-wrap', filter: 'blur(3.5px)', userSelect: 'none' }}>
            {letter}
          </div>
        </div>

        {/* Top + bottom fades */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 60, background: 'linear-gradient(to bottom, rgba(14,14,14,0.5) 0%, transparent 100%)', pointerEvents: 'none', zIndex: 2 }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 60, background: 'linear-gradient(to top, rgba(14,14,14,0.5) 0%, transparent 100%)', pointerEvents: 'none', zIndex: 2 }} />

        {/* Flex layer: stretches full height and centers the belt vertically */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', zIndex: 3 }}>
          <div style={{ width: '100%', background: 'rgba(12,12,12,0.93)', borderTop: '1px solid #2a2a2a', borderBottom: '1px solid #2a2a2a', backdropFilter: 'blur(10px)', padding: '20px 16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {/* Free option */}
              <div style={{ background: '#141414', border: '1px solid #222', borderRadius: 10, padding: 20, textAlign: 'left' }}>
                <div style={{ fontFamily: mono, fontSize: 10, color: '#555', letterSpacing: 2, marginBottom: 8 }}>THIS LETTER ONLY</div>
                <div style={{ fontFamily: display, fontSize: 36, color: '#fff', letterSpacing: 2, marginBottom: 4 }}>FREE</div>
                <div style={{ fontFamily: mono, fontSize: 11, color: '#555', marginBottom: 16 }}>First letter only</div>
                {['This appeal letter', 'Submission guide', 'PDF download'].map(f => (
                  <div key={f} style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
                    <span style={{ color: '#4ade80', fontSize: 11 }}>✓</span>
                    <span style={{ fontFamily: mono, fontSize: 11, color: '#777' }}>{f}</span>
                  </div>
                ))}
                <button onClick={onContinueFree} style={{ width: '100%', marginTop: 16, background: 'transparent', color: '#666', border: '1px solid #333', borderRadius: 8, padding: '11px', fontFamily: mono, fontSize: 11, letterSpacing: 1, textTransform: 'uppercase', cursor: 'pointer' }}>
                  Continue Free
                </button>
              </div>

              {/* Annual option */}
              <div style={{ background: '#111', border: `1px solid ${Y}`, borderRadius: 10, padding: 20, textAlign: 'left', position: 'relative' }}>
                <div style={{ position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%)', background: Y, color: '#111', fontSize: 9, fontWeight: 700, letterSpacing: 2, padding: '3px 10px', borderRadius: 10, fontFamily: mono, whiteSpace: 'nowrap' }}>BEST VALUE</div>
                <div style={{ fontFamily: mono, fontSize: 10, color: Y, letterSpacing: 2, marginBottom: 8 }}>ANNUAL PLAN</div>
                <div style={{ fontFamily: display, fontSize: 36, color: '#fff', letterSpacing: 2, marginBottom: 4 }}>$39.99</div>
                <div style={{ fontFamily: mono, fontSize: 11, color: '#666', marginBottom: 16 }}>Per year · unlimited letters</div>
                {['Unlimited appeal letters', 'Submission guide', 'PDF download', 'Denial follow-up template', 'Hearing prep guide'].map(f => (
                  <div key={f} style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
                    <span style={{ color: Y, fontSize: 11 }}>✓</span>
                    <span style={{ fontFamily: mono, fontSize: 11, color: '#aaa' }}>{f}</span>
                  </div>
                ))}
                <button onClick={handleUpgrade} disabled={loading} style={{ width: '100%', marginTop: 16, background: loading ? '#999' : Y, color: '#111', border: 'none', borderRadius: 8, padding: '11px', fontFamily: mono, fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', cursor: loading ? 'not-allowed' : 'pointer' }}>
                  {loading ? 'Redirecting...' : 'Upgrade to Annual →'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ fontFamily: mono, fontSize: 10, color: '#444', letterSpacing: 1 }}>
        $39.99/year = $3.33/month · Cancel anytime
      </div>
    </div>
  )
}

// ── Per-letter payment gate ───────────────────────────────────────────────────
function PaymentGate({ email, letter, onSuccess }) {
  const [loading, setLoading] = useState(false)

  const handlePay = async () => {
    setLoading(true)
    try {
      await checkoutSession({
        priceId: PRICES.perLetter,
        email,
        successUrl: `${window.location.origin}/appeal?paid=true`,
        cancelUrl: `${window.location.href}`,
      })
    } catch {
      alert('Payment service unavailable. Please try again.')
      setLoading(false)
    }
  }

  const handleAnnual = async () => {
    setLoading(true)
    try {
      await checkoutSession({
        priceId: PRICES.annual,
        email,
        successUrl: `${window.location.origin}/appeal?upgraded=true`,
        cancelUrl: `${window.location.href}`,
      })
    } catch {
      alert('Payment service unavailable. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div style={{ textAlign: 'center' }}>
      {/* Letter paper with belt overlay */}
      {/* Fixed-height window: letter fills behind, belt flexed to true center */}
      <div style={{ position: 'relative', userSelect: 'none', marginBottom: 24, height: 400, overflow: 'hidden', borderRadius: 8, boxShadow: '0 2px 24px rgba(0,0,0,0.5)' }}>

        {/* Letter paper pinned to top */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, background: '#fff', padding: '24px 28px', textAlign: 'left' }}>
          <div style={{ fontFamily: 'Georgia, serif', fontSize: 13, color: '#1a1a1a', lineHeight: 1.9, whiteSpace: 'pre-wrap', filter: 'blur(3.5px)', userSelect: 'none' }}>
            {letter}
          </div>
        </div>

        {/* Top + bottom fades */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 60, background: 'linear-gradient(to bottom, rgba(14,14,14,0.5) 0%, transparent 100%)', pointerEvents: 'none', zIndex: 2 }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 60, background: 'linear-gradient(to top, rgba(14,14,14,0.5) 0%, transparent 100%)', pointerEvents: 'none', zIndex: 2 }} />

        {/* Flex layer: fills full height, centers belt vertically */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', zIndex: 3 }}>
          <div style={{ width: '100%', background: 'rgba(12,12,12,0.93)', borderTop: '1px solid #2a2a2a', borderBottom: '1px solid #2a2a2a', backdropFilter: 'blur(10px)', padding: '20px 16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div style={{ background: '#141414', border: '1px solid #222', borderRadius: 10, padding: 20, textAlign: 'left' }}>
                <div style={{ fontFamily: mono, fontSize: 10, color: '#555', letterSpacing: 2, marginBottom: 8 }}>ONE LETTER</div>
                <div style={{ fontFamily: display, fontSize: 36, color: '#fff', letterSpacing: 2, marginBottom: 16 }}>$9.99</div>
                <button onClick={handlePay} disabled={loading}
                  style={{ width: '100%', background: '#333', color: '#fff', border: 'none', borderRadius: 8, padding: '11px', fontFamily: mono, fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', cursor: loading ? 'not-allowed' : 'pointer' }}>
                  {loading ? 'Redirecting...' : 'Buy This Letter'}
                </button>
              </div>
              <div style={{ background: '#111', border: `1px solid ${Y}`, borderRadius: 10, padding: 20, textAlign: 'left', position: 'relative' }}>
                <div style={{ position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%)', background: Y, color: '#111', fontSize: 9, fontWeight: 700, letterSpacing: 2, padding: '3px 10px', borderRadius: 10, fontFamily: mono, whiteSpace: 'nowrap' }}>BEST VALUE</div>
                <div style={{ fontFamily: mono, fontSize: 10, color: Y, letterSpacing: 2, marginBottom: 8 }}>ANNUAL — UNLIMITED</div>
                <div style={{ fontFamily: display, fontSize: 36, color: '#fff', letterSpacing: 2, marginBottom: 16 }}>$39.99/yr</div>
                <button onClick={handleAnnual} disabled={loading}
                  style={{ width: '100%', background: Y, color: '#111', border: 'none', borderRadius: 8, padding: '11px', fontFamily: mono, fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', cursor: loading ? 'not-allowed' : 'pointer' }}>
                  {loading ? 'Redirecting...' : 'Go Unlimited →'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Guide tab ─────────────────────────────────────────────────────────────────
function GuideTab() {
  const [open, setOpen] = useState(0)
  return (
    <div>
      <div
        style={{
          marginBottom: 16,
          padding: '12px 14px',
          background: '#0f1a00',
          border: '1px solid #2a4000',
          borderRadius: 8,
        }}
      >
        <div style={{ color: '#a3e635', fontSize: 12, fontFamily: mono }}>
          💡 NYC parking appeals have a <strong>high dismissal rate</strong> when submitted
          correctly.
        </div>
      </div>
      {guideSteps.map((s, i) => (
        <div
          key={i}
          style={{
            marginBottom: 6,
            border: `1px solid ${open === i ? '#333' : '#222'}`,
            borderRadius: 8,
            overflow: 'hidden',
          }}
        >
          <div
            onClick={() => setOpen(open === i ? -1 : i)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '14px 18px',
              cursor: 'pointer',
              background: open === i ? '#1a1a1a' : '#141414',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = '#1a1a1a')}
            onMouseLeave={e => (e.currentTarget.style.background = open === i ? '#1a1a1a' : '#141414')}
          >
            <span style={{ fontSize: 18 }}>{s.icon}</span>
            <span style={{ flex: 1, color: '#ddd', fontSize: 13, fontFamily: mono }}>{s.title}</span>
            <span
              style={{
                color: '#555',
                fontSize: 16,
                transform: open === i ? 'rotate(180deg)' : 'none',
                transition: 'transform 0.2s',
              }}
            >
              ›
            </span>
          </div>
          {open === i && (
            <div
              style={{
                padding: '0 18px 18px 50px',
                background: '#1a1a1a',
                color: '#999',
                fontSize: 13,
                lineHeight: 1.8,
                fontFamily: 'Georgia, serif',
              }}
            >
              {s.content}
            </div>
          )}
        </div>
      ))}
      <div
        style={{
          marginTop: 16,
          padding: '12px 14px',
          background: '#161616',
          border: '1px solid #222',
          borderRadius: 8,
        }}
      >
        <div style={{ color: '#555', fontSize: 11, fontFamily: mono, lineHeight: 1.8 }}>
          📞 Questions? Call 311 (NYC) · 🌐 nyc.gov/finance
        </div>
      </div>
    </div>
  )
}

// ── Result screen ─────────────────────────────────────────────────────────────
function ResultScreen({ letter, email, form, exhibits, onReset }) {
  const [tab, setTab] = useState('letter')
  const [copied, setCopied] = useState(false)
  const [pdfLoading, setPdfLoading] = useState(false)

  const copy = () => {
    navigator.clipboard.writeText(letter)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  const handleDownloadPDF = async () => {
    setPdfLoading(true)
    await downloadPDF(letter, form.name, exhibits)
    setPdfLoading(false)
  }

  return (
    <div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          marginBottom: 20,
          background: '#0f2010',
          border: '1px solid #1a4020',
          borderRadius: 8,
          padding: '12px 14px',
        }}
      >
        <div style={{ color: '#4ade80', fontSize: 16 }}>✓</div>
        <div style={{ color: '#4ade80', fontSize: 12, letterSpacing: 1, fontFamily: mono }}>
          APPEAL LETTER GENERATED — READY TO SUBMIT
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          gap: 3,
          marginBottom: 18,
          background: '#161616',
          padding: 3,
          borderRadius: 8,
          border: '1px solid #222',
        }}
      >
        {[
          { id: 'letter', label: '📄 Your Appeal Letter' },
          { id: 'guide', label: '📋 How To Use This Letter' },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              flex: 1,
              padding: '11px 6px',
              background: tab === t.id ? Y : 'transparent',
              color: tab === t.id ? '#111' : '#666',
              border: 'none',
              borderRadius: 6,
              fontFamily: mono,
              fontSize: 10,
              fontWeight: tab === t.id ? 700 : 400,
              letterSpacing: 1,
              cursor: 'pointer',
              transition: 'all 0.2s',
              textTransform: 'uppercase',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'letter' && (
        <div>
          <div
            style={{
              background: '#fafaf7',
              border: '1px solid #e0e0d0',
              borderRadius: 10,
              padding: 28,
              marginBottom: 16,
              fontFamily: 'Georgia, serif',
              fontSize: 13,
              lineHeight: 1.9,
              color: '#222',
              whiteSpace: 'pre-wrap',
              boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
            }}
          >
            {letter}
          </div>
          <div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
            <button
              onClick={copy}
              style={{
                flex: 1,
                background: copied ? '#1a3a1a' : Y,
                color: copied ? '#4ade80' : '#111',
                border: copied ? '1px solid #4ade80' : 'none',
                borderRadius: 8,
                padding: '14px',
                fontFamily: mono,
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: 2,
                textTransform: 'uppercase',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {copied ? '✓ Copied!' : 'Copy Letter'}
            </button>
            <button
              onClick={handleDownloadPDF}
              disabled={pdfLoading}
              style={{
                flex: 1,
                background: '#1a1a1a',
                color: pdfLoading ? '#666' : '#fff',
                border: '1px solid #444',
                borderRadius: 8,
                padding: '14px',
                fontFamily: mono,
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: 2,
                textTransform: 'uppercase',
                cursor: pdfLoading ? 'not-allowed' : 'pointer',
              }}
              onMouseEnter={e => !pdfLoading && (e.currentTarget.style.borderColor = Y)}
              onMouseLeave={e => (e.currentTarget.style.borderColor = '#444')}
            >
              {pdfLoading ? 'Generating...' : '↓ Download PDF'}
            </button>
          </div>
          <div
            style={{
              background: '#161616',
              border: '1px solid #2a2a2a',
              borderRadius: 8,
              padding: '10px 14px',
              marginBottom: 10,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <span style={{ fontSize: 14 }}>✉️</span>
            <div style={{ color: '#666', fontSize: 11, fontFamily: mono }}>
              Copy sent to <span style={{ color: '#aaa' }}>{email}</span>
            </div>
          </div>
        </div>
      )}

      {tab === 'guide' && <GuideTab />}

      <button
        onClick={onReset}
        style={{
          width: '100%',
          background: 'transparent',
          color: '#444',
          border: '1px solid #222',
          borderRadius: 8,
          padding: '12px',
          fontFamily: mono,
          fontSize: 11,
          letterSpacing: 2,
          textTransform: 'uppercase',
          cursor: 'pointer',
          marginTop: 8,
        }}
      >
        Start New Appeal
      </button>
    </div>
  )
}

// ── Main tool ─────────────────────────────────────────────────────────────────
export default function AppealPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const [screen, setScreen] = useState('gate')   // gate | form | payment | upsell | result
  const [step, setStep] = useState(0)             // 0 = ticket info, 1 = defense
  const [email, setEmail] = useState('')
  const [form, setForm] = useState({
    ticketNumber: '',
    date: '',
    location: '',
    violation: '',
    plateNumber: '',
    amount: '',
    defense: '',
    otherDefense: '',
    extraDetails: '',
    name: '',
  })
  const [exhibits, setExhibits] = useState([])
  const [letter, setLetter] = useState('')
  const [generating, setGenerating] = useState(false)

  const set = k => v => setForm(f => ({ ...f, [k]: v }))

  const canNext0 = form.ticketNumber && form.date && form.location && form.violation && form.amount
  const canNext1 = form.defense && form.name && (form.defense !== 'Other' || form.otherDefense.trim())

  const stepNum = screen === 'gate' ? 0 : screen === 'form' ? (step === 0 ? 1 : 2) : 3

  // Handle return from Stripe
  if (searchParams.get('paid') === 'true' || searchParams.get('upgraded') === 'true') {
    if (screen !== 'result' && letter) setScreen('result')
  }

  const handleEmailSubmit = async emailVal => {
    setEmail(emailVal)
    setScreen('form')
  }

  const handleGenerateAttempt = async () => {
    setGenerating(true)
    try {
      const sub = await getSubscriber(email)
      const count = sub?.letter_count ?? 0
      const isAnnual = sub?.plan === 'annual'

      const generatedLetter = generateLetter(form, exhibits)
      setLetter(generatedLetter)

      // Save submission to Supabase
      await saveSubmission({
        email,
        name: form.name,
        plate_number: form.plateNumber,
        ticket_number: form.ticketNumber,
        violation_date: form.date,
        location: form.location,
        violation_type: form.violation,
        fine_amount: parseFloat(form.amount) || 0,
        defense_reason: form.defense,
        extra_details: form.extraDetails,
        letter_text: generatedLetter,
        plan: isAnnual ? 'annual' : count === 0 ? 'free' : 'paid',
        exhibit_count: exhibits.length,
        borough: deriveBorough(form.location),
      }).catch(() => {})

      if (count === 0 || isAnnual) {
        // Free first letter or annual subscriber
        await incrementLetterCount(email).catch(() => {})
        // Generate PDF and send email with attachment
        generatePDFBase64(generatedLetter, form.name, exhibits)
          .then(pdfBase64 => sendAppealEmail({ to: email, name: form.name, letterText: generatedLetter, pdfBase64 }))
          .catch(() => sendAppealEmail({ to: email, name: form.name, letterText: generatedLetter }))

        if (count === 0 && !isAnnual) {
          setScreen('upsell')
        } else {
          setScreen('result')
        }
      } else {
        // Needs to pay
        setScreen('payment')
      }
    } catch (err) {
      console.error(err)
      // Fallback: still generate the letter locally
      const generatedLetter = generateLetter(form, exhibits)
      setLetter(generatedLetter)
      setScreen('upsell')
    } finally {
      setGenerating(false)
    }
  }

  const resetForm = () => {
    setScreen('form')
    setStep(0)
    setLetter('')
    setExhibits([])
    setForm({ ticketNumber: '', date: '', location: '', violation: '', plateNumber: '', amount: '', defense: '', extraDetails: '', name: '' })
  }

  return (
    <div style={{ minHeight: '100vh', background: '#111', color: '#fff', fontFamily: mono, padding: '32px 20px' }}>
      <div style={{ maxWidth: 560, margin: '0 auto' }}>

        {/* Top bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 36 }}>
          <button
            onClick={() => navigate('/')}
            style={{
              background: 'transparent',
              border: '1px solid #333',
              borderRadius: 6,
              padding: '8px 14px',
              color: '#666',
              fontFamily: mono,
              fontSize: 11,
              letterSpacing: 1,
              cursor: 'pointer',
            }}
          >
            ← Back
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ background: Y, color: '#111', fontSize: 10, fontWeight: 700, letterSpacing: 3, padding: '3px 8px', borderRadius: 3, fontFamily: mono }}>
              NYC
            </div>
            <span style={{ fontFamily: display, fontSize: 20, letterSpacing: 2, color: '#fff' }}>
              APPEALWRITER
            </span>
          </div>
        </div>

        <StepBar current={stepNum} />

        {/* Screens */}
        {screen === 'gate' && (
          <EmailGate onSubmit={handleEmailSubmit} />
        )}

        {screen === 'form' && (
          <div>
            {step === 0 && (
              <div>
                <TInput label="Ticket Number" value={form.ticketNumber} onChange={set('ticketNumber')} placeholder="e.g. 1234567890" />
                <TSel label="Date of Violation" value={form.date} onChange={set('date')} options={dateOptions} placeholder="Select date..." />
                <AddressAutocomplete label="Location / Street" value={form.location} onChange={set('location')} />
                <TSel label="Violation Type" value={form.violation} onChange={set('violation')} options={violationTypes} />
                <TInput label="Fine Amount ($)" value={form.amount} onChange={set('amount')} placeholder="e.g. 115" type="number" />
                <PBtn onClick={() => setStep(1)} disabled={!canNext0} style={{ width: '100%', marginTop: 8 }}>
                  Next → Your Defense
                </PBtn>
              </div>
            )}

            {step === 1 && (
              <div>
                <TInput label="Your Full Name" value={form.name} onChange={set('name')} placeholder="e.g. Jane Smith" />
                <TInput label="Vehicle Plate Number" value={form.plateNumber} onChange={set('plateNumber')} placeholder="e.g. ABC1234" />
                <TSel label="Primary Defense Reason" value={form.defense} onChange={set('defense')} options={defenseReasons} />
                {form.defense === 'Other' && (
                  <div style={{ marginBottom: 20 }}>
                    <Lbl>Describe Your Defense</Lbl>
                    <textarea
                      value={form.otherDefense}
                      onChange={e => set('otherDefense')(e.target.value)}
                      placeholder="Explain why this ticket should be dismissed..."
                      rows={4}
                      style={{
                        width: '100%',
                        background: '#1a1a1a',
                        border: '1px solid #333',
                        borderRadius: 8,
                        padding: '14px 16px',
                        color: '#fff',
                        fontFamily: 'Georgia, serif',
                        fontSize: 14,
                        lineHeight: 1.6,
                        resize: 'vertical',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>
                )}
                <SuccessMeter defense={form.defense} />
                <ExhibitUploader exhibits={exhibits} onChange={setExhibits} />
                <div style={{ marginBottom: 20 }}>
                  <Lbl>
                    Additional Details{' '}
                    <span style={{ color: '#555', textTransform: 'none', letterSpacing: 0 }}>(optional)</span>
                  </Lbl>
                  <textarea
                    value={form.extraDetails}
                    onChange={e => set('extraDetails')(e.target.value)}
                    placeholder="Any extra context..."
                    rows={4}
                    style={{
                      width: '100%',
                      background: '#1a1a1a',
                      border: '1px solid #333',
                      borderRadius: 8,
                      padding: '14px 16px',
                      color: '#fff',
                      fontSize: 14,
                      fontFamily: mono,
                      outline: 'none',
                      resize: 'vertical',
                      boxSizing: 'border-box',
                    }}
                    onFocus={e => (e.target.style.borderColor = Y)}
                    onBlur={e => (e.target.style.borderColor = '#333')}
                  />
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button
                    onClick={() => setStep(0)}
                    style={{
                      flex: 1,
                      background: 'transparent',
                      color: '#666',
                      border: '1px solid #333',
                      borderRadius: 8,
                      padding: '14px',
                      fontFamily: mono,
                      fontSize: 12,
                      letterSpacing: 2,
                      textTransform: 'uppercase',
                      cursor: 'pointer',
                    }}
                  >
                    ← Back
                  </button>
                  <PBtn
                    onClick={handleGenerateAttempt}
                    disabled={!canNext1 || generating}
                    style={{ flex: 2 }}
                  >
                    {generating ? 'Generating...' : 'Generate Appeal →'}
                  </PBtn>
                </div>
              </div>
            )}
          </div>
        )}

        {screen === 'payment' && (
          <PaymentGate email={email} letter={letter} onSuccess={() => setScreen('result')} />
        )}

        {screen === 'upsell' && (
          <UpsellScreen
            email={email}
            letter={letter}
            onContinueFree={() => setScreen('result')}
            onUpgrade={() => {}}
          />
        )}

        {screen === 'result' && (
          <ResultScreen
            letter={letter}
            email={email}
            form={form}
            exhibits={exhibits}
            onReset={resetForm}
          />
        )}

        <div style={{ marginTop: 40, paddingTop: 20, borderTop: '1px solid #1e1e1e', color: '#444', fontSize: 10, letterSpacing: 1, lineHeight: 1.8 }}>
          NOT LEGAL ADVICE — FOR INFORMATIONAL PURPOSES ONLY.
          <br />
          ALWAYS REVIEW YOUR APPEAL BEFORE SUBMITTING.
        </div>
      </div>
    </div>
  )
}

function deriveBorough(location = '') {
  const l = location.toLowerCase()
  if (l.includes('manhattan') || l.includes('new york, ny')) return 'Manhattan'
  if (l.includes('brooklyn'))    return 'Brooklyn'
  if (l.includes('queens'))      return 'Queens'
  if (l.includes('bronx'))       return 'Bronx'
  if (l.includes('staten'))      return 'Staten Island'
  return 'Unknown'
}
