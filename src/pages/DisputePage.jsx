import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { mono, display, serif } from '../components/tokens'
import { Lbl, PBtn, TSel, TInput } from '../components/UI'
import CalendarPicker from '../components/CalendarPicker'
import AddressAutocomplete from '../components/AddressAutocomplete'
import ExhibitUploader from '../components/ExhibitUploader'
import {
  violationTypes,
  defenseReasons,
  violationTips,
  createLetter,
} from '../components/data'
import { downloadPDF, createPDFBase64 } from '../lib/pdf'
import { getSubscriber, upsertSubscriber, incrementLetterCount, saveSubmission } from '../lib/supabase'
import { checkoutSession, PRICES } from '../lib/stripe'
import { sendDisputeEmail } from '../lib/email'

// ── Light-mode tokens (local) ──────────────────────────────────────────────────
const NAVY   = '#1a2744'
const BLUE   = '#2563eb'
const BLUE_L = '#eff6ff'
const WHITE  = '#ffffff'
const GRAY   = '#f5f5f7'
const TEXT   = '#1d1d1f'
const MUTED  = '#6e6e73'
const BORDER = '#e5e5e7'
const SHADOW = '0 1px 3px rgba(0,0,0,0.06), 0 8px 32px rgba(0,0,0,0.08)'

// ── Step indicator ────────────────────────────────────────────────────────────
function StepBar({ current }) {
  const labels = ['Ticket Info', 'Defense']
  return (
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 36 }}>
      {labels.map((l, i) => (
        <div key={l} style={{ display: 'flex', alignItems: 'center' }}>
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: '50%',
              background: i <= current ? NAVY : 'transparent',
              border: i <= current ? 'none' : `2px solid ${BORDER}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: i <= current ? WHITE : MUTED,
              fontWeight: 700,
              fontSize: 12,
              fontFamily: mono,
              transition: 'all 0.3s',
            }}
          >
            {i < current ? '✓' : i + 1}
          </div>
          {i < labels.length - 1 && (
            <div style={{ width: 30, height: 2, background: i < current ? NAVY : BORDER }} />
          )}
        </div>
      ))}
      <div
        style={{
          marginLeft: 12,
          color: NAVY,
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

// ── Violation tips ─────────────────────────────────────────────────────────────
function ViolationTips({ violation }) {
  const tips = violationTips[violation] || violationTips['Other']
  return (
    <div
      style={{
        marginBottom: 20,
        padding: 16,
        background: BLUE_L,
        border: `1px solid #bfdbfe`,
        borderRadius: 10,
      }}
    >
      <div style={{ fontFamily: mono, fontSize: 10, color: BLUE, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 10 }}>
        📸 Strengthen Your Case
      </div>
      <div style={{ fontFamily: serif, fontSize: 13, color: TEXT, lineHeight: 1.7, marginBottom: 10 }}>
        Have pictures that support your case? Add them above and describe them in the box below.
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {tips.map((tip, i) => (
          <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <span style={{ color: BLUE, fontFamily: mono, fontSize: 11, minWidth: 18, paddingTop: 1 }}>{i + 1}.</span>
            <span style={{ fontFamily: serif, fontSize: 12, color: TEXT, lineHeight: 1.6 }}>{tip}</span>
          </div>
        ))}
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
        successUrl: `${window.location.origin}/dispute?paid=true`,
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
        successUrl: `${window.location.origin}/dispute?upgraded=true`,
        cancelUrl: `${window.location.href}`,
      })
    } catch {
      alert('Payment service unavailable. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div style={{ position: 'relative', userSelect: 'none', marginBottom: 24 }}>
      {/* Letter preview — blurred */}
      <div
        style={{
          height: 500,
          overflow: 'hidden',
          borderRadius: 12,
          boxShadow: SHADOW,
          background: WHITE,
          padding: '24px 28px',
          textAlign: 'left',
          border: `1px solid ${BORDER}`,
        }}
      >
        <div
          style={{
            fontFamily: 'Georgia, serif',
            fontSize: 13,
            color: TEXT,
            lineHeight: 1.9,
            whiteSpace: 'pre-wrap',
            filter: 'blur(3.5px)',
            userSelect: 'none',
          }}
        >
          {letter}
        </div>
      </div>

      {/* Top + bottom fades */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 60, borderRadius: '12px 12px 0 0', background: 'linear-gradient(to bottom, rgba(245,245,247,0.5) 0%, transparent 100%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 60, borderRadius: '0 0 12px 12px', background: 'linear-gradient(to top, rgba(245,245,247,0.5) 0%, transparent 100%)', pointerEvents: 'none' }} />

      {/* Pricing belt */}
      <div
        style={{
          position: 'absolute',
          top: 180,
          left: 0,
          right: 0,
          background: 'rgba(255,255,255,0.97)',
          borderTop: `1px solid ${BORDER}`,
          borderBottom: `1px solid ${BORDER}`,
          padding: '20px 16px',
          backdropFilter: 'blur(4px)',
        }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {/* Per-letter option */}
          <div
            style={{
              background: WHITE,
              border: `1px solid ${BORDER}`,
              borderRadius: 12,
              padding: 20,
              textAlign: 'left',
              boxShadow: SHADOW,
            }}
          >
            <div style={{ fontFamily: mono, fontSize: 10, color: MUTED, letterSpacing: 2, marginBottom: 8 }}>ONE LETTER</div>
            <div style={{ fontFamily: serif, fontSize: 36, color: NAVY, fontWeight: 700, marginBottom: 16 }}>$6.99</div>
            <button
              onClick={handlePay}
              disabled={loading}
              style={{
                width: '100%',
                background: loading ? GRAY : GRAY,
                color: TEXT,
                border: `1px solid ${BORDER}`,
                borderRadius: 8,
                padding: '11px',
                fontFamily: mono,
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: 1,
                textTransform: 'uppercase',
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
            >
              {loading ? 'Redirecting...' : 'Buy This Letter'}
            </button>
          </div>

          {/* Annual option */}
          <div
            style={{
              background: NAVY,
              border: `1px solid ${NAVY}`,
              borderRadius: 12,
              padding: 20,
              textAlign: 'left',
              position: 'relative',
              boxShadow: '0 8px 24px rgba(26,39,68,0.2)',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: -10,
                left: '50%',
                transform: 'translateX(-50%)',
                background: '#b08d57',
                color: WHITE,
                fontSize: 9,
                fontWeight: 700,
                letterSpacing: 2,
                padding: '3px 10px',
                borderRadius: 10,
                fontFamily: mono,
                whiteSpace: 'nowrap',
              }}
            >
              BEST VALUE
            </div>
            <div style={{ fontFamily: mono, fontSize: 10, color: 'rgba(255,255,255,0.55)', letterSpacing: 2, marginBottom: 8 }}>ANNUAL — UNLIMITED</div>
            <div style={{ fontFamily: serif, fontSize: 36, color: WHITE, fontWeight: 700, marginBottom: 16 }}>$36.99/yr</div>
            <button
              onClick={handleAnnual}
              disabled={loading}
              style={{
                width: '100%',
                background: WHITE,
                color: NAVY,
                border: 'none',
                borderRadius: 8,
                padding: '11px',
                fontFamily: mono,
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: 1,
                textTransform: 'uppercase',
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
            >
              {loading ? 'Redirecting...' : 'Go Unlimited →'}
            </button>
          </div>
        </div>
      </div>

    </div>
  )
}

// ── Result screen ─────────────────────────────────────────────────────────────
function ResultScreen({ letter, email, form, exhibits, onReset }) {
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
      {/* Success banner */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          marginBottom: 20,
          background: '#f0fdf4',
          border: '1px solid #bbf7d0',
          borderRadius: 10,
          padding: '12px 16px',
        }}
      >
        <div style={{ color: '#16a34a', fontSize: 16 }}>✓</div>
        <div style={{ color: '#16a34a', fontSize: 12, letterSpacing: 1, fontFamily: mono }}>
          DISPUTE LETTER CREATED — READY TO SUBMIT
        </div>
      </div>

      {/* What now? */}
      <div
        style={{
          marginBottom: 18,
          padding: '14px 16px',
          background: BLUE_L,
          border: '1px solid #bfdbfe',
          borderRadius: 10,
        }}
      >
        <div style={{ fontFamily: mono, fontSize: 10, color: BLUE, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6 }}>
          What Now?
        </div>
        <div style={{ fontFamily: serif, fontSize: 13, color: TEXT, lineHeight: 1.7, marginBottom: 8 }}>
          Download your letter and submit it directly to the NYC Department of Finance.
        </div>
        <a
          href="https://www.nyc.gov/site/finance/vehicles/parking-violations-hearing-online.page"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-block',
            fontFamily: mono,
            fontSize: 11,
            color: BLUE,
            letterSpacing: 1,
            textDecoration: 'underline',
          }}
        >
          → Submit your dispute at nyc.gov/finance
        </a>
      </div>

      {/* Letter body */}
      <div
        style={{
          background: WHITE,
          border: `1px solid ${BORDER}`,
          borderRadius: 12,
          padding: 28,
          marginBottom: 16,
          fontFamily: 'Georgia, serif',
          fontSize: 13,
          lineHeight: 1.9,
          color: TEXT,
          whiteSpace: 'pre-wrap',
          boxShadow: SHADOW,
        }}
      >
        {letter}
      </div>

      {/* Action buttons */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
        <button
          onClick={copy}
          style={{
            flex: 1,
            background: copied ? '#f0fdf4' : BLUE,
            color: copied ? '#16a34a' : WHITE,
            border: copied ? '1px solid #bbf7d0' : 'none',
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
            background: pdfLoading ? GRAY : GRAY,
            color: pdfLoading ? MUTED : TEXT,
            border: `1px solid ${BORDER}`,
            borderRadius: 8,
            padding: '14px',
            fontFamily: mono,
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: 2,
            textTransform: 'uppercase',
            cursor: pdfLoading ? 'not-allowed' : 'pointer',
          }}
          onMouseEnter={e => !pdfLoading && (e.currentTarget.style.borderColor = BLUE)}
          onMouseLeave={e => (e.currentTarget.style.borderColor = BORDER)}
        >
          {pdfLoading ? 'Creating...' : '↓ Download PDF'}
        </button>
      </div>

      {/* Email confirmation */}
      <div
        style={{
          background: GRAY,
          border: `1px solid ${BORDER}`,
          borderRadius: 8,
          padding: '10px 14px',
          marginBottom: 10,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <span style={{ fontSize: 14 }}>✉️</span>
        <div style={{ color: MUTED, fontSize: 11, fontFamily: mono }}>
          Copy sent to <span style={{ color: TEXT, fontWeight: 600 }}>{email}</span>
        </div>
      </div>

      {/* Start over */}
      <button
        onClick={onReset}
        style={{
          width: '100%',
          background: 'transparent',
          color: MUTED,
          border: `1px solid ${BORDER}`,
          borderRadius: 8,
          padding: '12px',
          fontFamily: mono,
          fontSize: 11,
          letterSpacing: 2,
          textTransform: 'uppercase',
          cursor: 'pointer',
          marginTop: 8,
        }}
        onMouseEnter={e => (e.currentTarget.style.color = NAVY)}
        onMouseLeave={e => (e.currentTarget.style.color = MUTED)}
      >
        Start New Dispute
      </button>
    </div>
  )
}


const PREVIEW_FORM = {
  ticketNumber: '7734829101',
  date: '2026-03-10',
  location: '350 5th Ave, New York, NY 10118',
  violation: 'Double Parking',
  plateNumber: 'NYC4821',
  amount: '165',
  defense: 'Signs were missing or obscured',
  otherDefense: '',
  extraDetails: 'The no parking sign on the block was covered by a tree branch and not visible from my vehicle.',
  name: 'James Tarte',
}
const PREVIEW_EMAIL = 'preview@nycdisputewriter.com'

// ── Main tool ─────────────────────────────────────────────────────────────────
export default function DisputePage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const isPreview = searchParams.get('preview') === 'true' || sessionStorage.getItem('preview') === 'true'
  if (isPreview) sessionStorage.setItem('preview', 'true')

  const goto = searchParams.get('goto')
  const initScreen = goto === 'payment' ? 'payment' : goto === 'result' ? 'result' : 'form'
  const initStep   = goto === 'step1' ? 1 : 0

  const [screen, setScreen] = useState(initScreen)
  const [step, setStep] = useState(initStep)
  const [email, setEmail] = useState(isPreview ? PREVIEW_EMAIL : '')
  const [form, setForm] = useState(isPreview ? PREVIEW_FORM : {
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
  const [letter, setLetter] = useState(() =>
    isPreview && (initScreen === 'payment' || initScreen === 'result')
      ? createLetter(PREVIEW_FORM, [])
      : ''
  )
  const [creating, setCreating] = useState(false)

  const set = k => v => setForm(f => ({ ...f, [k]: v }))

  const canNext0 = isPreview || (form.ticketNumber && form.date && form.location && form.violation && form.amount)
  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  const canNext1 = isPreview || (form.defense && form.name && (form.defense !== 'Other' || form.otherDefense.trim()) && validEmail)
  const canSubmit = canNext0 && canNext1

if (searchParams.get('paid') === 'true' || searchParams.get('upgraded') === 'true') {
    if (screen !== 'result' && letter) setScreen('result')
  }

  const handleCreateAttempt = async () => {
    setCreating(true)
    try {
      if (isPreview) {
        const l = createLetter(form, exhibits)
        setLetter(l)
        setScreen('result')
        return
      }
      const existing = await getSubscriber(email).catch(() => null)
      if (!existing) {
        await upsertSubscriber(email, { plan: 'free', letter_count: 0 }).catch(() => {})
      }
      const sub = await getSubscriber(email)
      const count = sub?.letter_count ?? 0
      const devEmail = import.meta.env.VITE_DEV_EMAIL
      const isDevBypass = devEmail && email.trim().toLowerCase() === devEmail.trim().toLowerCase()
      const isAnnual = sub?.plan === 'annual' || isDevBypass

      const createdLetter = createLetter(form, exhibits)
      setLetter(createdLetter)

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
        letter_text: createdLetter,
        plan: isAnnual ? 'annual' : count === 0 ? 'free' : 'paid',
        exhibit_count: exhibits.length,
        borough: deriveBorough(form.location),
      }).catch(() => {})

      if (isAnnual) {
        await incrementLetterCount(email).catch(() => {})
        createPDFBase64(createdLetter, form.name, exhibits)
          .then(pdfBase64 => sendDisputeEmail({ to: email, name: form.name, letterText: createdLetter, pdfBase64 }))
          .catch(() => sendDisputeEmail({ to: email, name: form.name, letterText: createdLetter }))
        setScreen('result')
      } else {
        setScreen('payment')
      }
    } catch (err) {
      console.error(err)
      const createdLetter = createLetter(form, exhibits)
      setLetter(createdLetter)
      setScreen('payment')
    } finally {
      setCreating(false)
    }
  }

  const resetForm = () => {
    setScreen('form')
    setStep(0)
    setLetter('')
    setExhibits([])
    setForm({ ticketNumber: '', date: '', location: '', violation: '', plateNumber: '', amount: '', defense: '', otherDefense: '', extraDetails: '', name: '' })
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: GRAY,
        color: TEXT,
        fontFamily: mono,
        padding: '32px 20px',
      }}
    >
      <div style={{ maxWidth: 560, margin: '0 auto' }}>

        {/* Top bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 36 }}>
          <button
            onClick={() => navigate('/')}
            style={{
              background: WHITE,
              border: `1px solid ${BORDER}`,
              borderRadius: 8,
              padding: '8px 14px',
              color: TEXT,
              fontFamily: mono,
              fontSize: 11,
              letterSpacing: 1,
              cursor: 'pointer',
              boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
            }}
          >
            ← Back
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div
              style={{
                background: NAVY,
                color: WHITE,
                fontSize: 9,
                fontWeight: 700,
                letterSpacing: 3,
                padding: '3px 8px',
                borderRadius: 4,
                fontFamily: mono,
              }}
            >
              NYC
            </div>
            <span style={{ fontFamily: display, fontSize: 20, letterSpacing: 2, color: NAVY }}>
              DISPUTEWRITER
            </span>
          </div>
        </div>

        {/* Form card */}
        <div
          style={{
            background: WHITE,
            borderRadius: 16,
            padding: 32,
            boxShadow: SHADOW,
            border: `1px solid ${BORDER}`,
            marginBottom: 20,
          }}
        >
          {screen === 'form' && (
            <div>
              <TInput label="Ticket Number" value={form.ticketNumber} onChange={set('ticketNumber')} placeholder="e.g. 1234567890" />
              <CalendarPicker label="Date of Violation" value={form.date} onChange={set('date')} />
              <AddressAutocomplete label="Location / Street" value={form.location} onChange={set('location')} />
              <TSel label="Violation Type" value={form.violation} onChange={set('violation')} options={violationTypes} />
              <TInput label="Fine Amount ($)" value={form.amount} onChange={set('amount')} placeholder="e.g. 115" type="number" />

              <div style={{ borderTop: `1px solid ${BORDER}`, margin: '24px 0' }} />

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
                      background: WHITE,
                      border: `1px solid ${BORDER}`,
                      borderRadius: 8,
                      padding: '14px 16px',
                      color: TEXT,
                      fontFamily: serif,
                      fontSize: 14,
                      lineHeight: 1.6,
                      resize: 'vertical',
                      boxSizing: 'border-box',
                      outline: 'none',
                    }}
                    onFocus={e => (e.target.style.borderColor = BLUE)}
                    onBlur={e => (e.target.style.borderColor = BORDER)}
                  />
                </div>
              )}
              <ViolationTips violation={form.violation} />
              <ExhibitUploader exhibits={exhibits} onChange={setExhibits} />
              <div style={{ marginBottom: 20 }}>
                <Lbl>
                  Additional Details{' '}
                  <span style={{ color: MUTED, textTransform: 'none', letterSpacing: 0 }}>(optional)</span>
                </Lbl>
                <textarea
                  value={form.extraDetails}
                  onChange={e => set('extraDetails')(e.target.value)}
                  placeholder="Any extra context..."
                  rows={4}
                  style={{
                    width: '100%',
                    background: WHITE,
                    border: `1px solid ${BORDER}`,
                    borderRadius: 8,
                    padding: '14px 16px',
                    color: TEXT,
                    fontSize: 14,
                    fontFamily: mono,
                    outline: 'none',
                    resize: 'vertical',
                    boxSizing: 'border-box',
                  }}
                  onFocus={e => (e.target.style.borderColor = BLUE)}
                  onBlur={e => (e.target.style.borderColor = BORDER)}
                />
              </div>
              <TInput label="Your Email" value={email} onChange={setEmail} placeholder="e.g. you@email.com" type="email" />
              <PBtn
                onClick={handleCreateAttempt}
                disabled={!canSubmit || creating}
                style={{ width: '100%' }}
              >
                {creating ? 'Creating...' : 'Create Dispute Letter →'}
              </PBtn>
            </div>
          )}

          {screen === 'payment' && (
            <PaymentGate email={email} letter={letter} onSuccess={() => setScreen('result')} />
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
        </div>

        <div
          style={{
            paddingTop: 16,
            color: MUTED,
            fontSize: 10,
            letterSpacing: 1,
            lineHeight: 1.8,
            textAlign: 'center',
          }}
        >
          NOT LEGAL ADVICE — FOR INFORMATIONAL PURPOSES ONLY.
          <br />
          ALWAYS REVIEW YOUR DISPUTE BEFORE SUBMITTING.
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
