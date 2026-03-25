import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FadeIn } from '../components/UI'
import { mono, display, serif } from '../components/tokens'
import { teaserTips, testimonials, faqs } from '../components/data'

// ── Light-mode design tokens ───────────────────────────────────────────────────
const NAVY   = '#1a2744'
const BLUE   = '#2563eb'
const BLUE_L = '#eff6ff'
const GOLD   = '#b08d57'
const WHITE  = '#ffffff'
const GRAY   = '#f5f5f7'
const TEXT   = '#1d1d1f'
const MUTED  = '#6e6e73'
const BORDER = '#e5e5e7'
const SHADOW = '0 1px 3px rgba(0,0,0,0.06), 0 8px 32px rgba(0,0,0,0.08)'

// ── Nav ───────────────────────────────────────────────────────────────────────
function NavLink({ children, id }) {
  const [h, setH] = useState(false)
  return (
    <span
      onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        color: h ? BLUE : MUTED,
        fontSize: 13,
        fontFamily: mono,
        cursor: 'pointer',
        letterSpacing: 0.5,
        transition: 'color 0.2s',
        userSelect: 'none',
      }}
    >
      {children}
    </span>
  )
}

function NavCTA({ onClick }) {
  const [h, setH] = useState(false)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        background: h ? NAVY : BLUE,
        color: WHITE,
        border: 'none',
        borderRadius: 8,
        padding: '10px 22px',
        fontFamily: mono,
        fontSize: 12,
        fontWeight: 700,
        letterSpacing: 1,
        cursor: 'pointer',
        transition: 'background 0.2s',
      }}
    >
      Fight My Ticket
    </button>
  )
}

function Nav({ onCTA }) {
  return (
    <nav
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 200,
        background: 'rgba(255,255,255,0.96)',
        backdropFilter: 'blur(12px)',
        borderBottom: `1px solid ${BORDER}`,
        padding: '0 32px',
      }}
    >
      <div
        style={{
          maxWidth: 1100,
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: 64,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
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
          <span style={{ fontFamily: display, fontSize: 22, letterSpacing: 2, color: NAVY }}>
            APPEALWRITER
          </span>
        </div>
        <div className="nav-links" style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
          <NavLink id="how-it-works">How It Works</NavLink>
          <NavLink id="pricing">Pricing</NavLink>
          <NavLink id="faq">FAQ</NavLink>
          <NavCTA onClick={onCTA} />
        </div>
      </div>
    </nav>
  )
}

// ── CTA Button ────────────────────────────────────────────────────────────────
function CTABtn({ onClick, large, outline, children }) {
  const [h, setH] = useState(false)
  if (outline) {
    return (
      <button
        onClick={onClick}
        onMouseEnter={() => setH(true)}
        onMouseLeave={() => setH(false)}
        style={{
          background: 'transparent',
          color: h ? BLUE : NAVY,
          border: `2px solid ${h ? BLUE : NAVY}`,
          borderRadius: 10,
          padding: large ? '18px 44px' : '14px 32px',
          fontFamily: mono,
          fontSize: large ? 14 : 13,
          fontWeight: 700,
          letterSpacing: 1,
          cursor: 'pointer',
          transition: 'all 0.2s',
        }}
      >
        {children}
      </button>
    )
  }
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        background: h ? NAVY : BLUE,
        color: WHITE,
        border: 'none',
        borderRadius: 10,
        padding: large ? '18px 44px' : '14px 32px',
        fontFamily: mono,
        fontSize: large ? 14 : 13,
        fontWeight: 700,
        letterSpacing: 1,
        cursor: 'pointer',
        transition: 'background 0.2s',
        boxShadow: '0 2px 12px rgba(37,99,235,0.3)',
      }}
    >
      {children}
    </button>
  )
}

// ── Hero ──────────────────────────────────────────────────────────────────────
function Hero({ onCTA }) {
  return (
    <section
      style={{
        background: `linear-gradient(160deg, ${WHITE} 60%, ${BLUE_L} 100%)`,
        padding: '100px 32px 90px',
      }}
    >
      {/* Editorial lede */}
      <div style={{ maxWidth: 1100, margin: '0 auto 56px' }}>
        <p style={{ fontFamily: serif, fontSize: 17, color: MUTED, lineHeight: 1.7, margin: '0 0 2px' }}>
          Every year NYC issues 10 million parking tickets.
        </p>
        <p style={{ fontFamily: serif, fontSize: 17, color: MUTED, lineHeight: 1.7, margin: '0 0 12px' }}>
          Most people pay without question.
        </p>
        <p style={{ fontFamily: serif, fontSize: 21, color: NAVY, fontWeight: 700, lineHeight: 1.5, margin: '0 0 12px' }}>
          The ones who fight back win nearly 30% of the time —&nbsp;paying absolutely nothing.
        </p>
        <p style={{ fontFamily: mono, fontSize: 13, color: BLUE, letterSpacing: 0.5, margin: 0 }}>
          It takes 2 minutes. We write the letter. You win the case.
        </p>
      </div>

      <div
        className="hero-grid"
        style={{
          maxWidth: 1100,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 80,
          alignItems: 'center',
        }}
      >
        {/* Left: copy */}
        <div>
          <h1
            style={{
              fontFamily: serif,
              fontSize: 58,
              lineHeight: 1.08,
              margin: '0 0 20px',
              color: NAVY,
              fontWeight: 700,
            }}
          >
            Hit with a NYC Parking Ticket?
            <br />
            <span style={{ color: BLUE, fontStyle: 'italic' }}>Fight it in 2 steps.</span>
          </h1>

          <p
            style={{
              fontFamily: serif,
              fontSize: 20,
              color: MUTED,
              lineHeight: 1.65,
              margin: '0 0 36px',
              maxWidth: 420,
            }}
          >
            Professionally written appeals that cite real NYC Traffic Rules — built to maximize your
            chances of dismissal.
          </p>

          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'center' }}>
            <CTABtn onClick={onCTA} large>
              Generate My Appeal Letter →
            </CTABtn>
          </div>
        </div>

        {/* Right: outcome card styled like an official document */}
        <div>
          <div
            style={{
              background: WHITE,
              borderRadius: 16,
              boxShadow: '0 4px 6px rgba(0,0,0,0.04), 0 24px 64px rgba(26,39,68,0.12)',
              overflow: 'hidden',
            }}
          >
            {/* Document header bar */}
            <div
              style={{
                background: NAVY,
                padding: '20px 28px',
              }}
            >
              <div style={{ fontFamily: mono, fontSize: 10, color: 'rgba(255,255,255,0.5)', letterSpacing: 3, marginBottom: 4 }}>
                NYC PARKING VIOLATIONS BUREAU
              </div>
              <div style={{ fontFamily: display, fontSize: 20, color: WHITE, letterSpacing: 2 }}>
                NOTICE OF DETERMINATION
              </div>
            </div>

            {/* Document body */}
            <div style={{ padding: '28px 28px 20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
                <div>
                  <div style={{ fontFamily: mono, fontSize: 10, color: MUTED, letterSpacing: 1, marginBottom: 6 }}>
                    DECISION
                  </div>
                  <div
                    style={{
                      display: 'inline-block',
                      fontFamily: display,
                      fontSize: 26,
                      color: '#16a34a',
                      letterSpacing: 3,
                      border: '2.5px solid #16a34a',
                      padding: '5px 14px',
                      transform: 'rotate(-2deg)',
                      transformOrigin: 'left center',
                    }}
                  >
                    DISMISSED
                  </div>
                </div>
                <div
                  style={{
                    background: '#f0fdf4',
                    border: '1px solid #bbf7d0',
                    borderRadius: 6,
                    padding: '5px 12px',
                  }}
                >
                  <div style={{ fontFamily: mono, fontSize: 10, color: '#16a34a', letterSpacing: 1 }}>
                    APPROVED
                  </div>
                </div>
              </div>

              {[
                ['Violation', 'Double Parking'],
                ['Fine Amount', '$165.00 waived'],
                ['Decision', 'Signage obstruction — appeal granted'],
                ['Time to Decision', '11 days after submission'],
              ].map(([k, v]) => (
                <div
                  key={k}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '11px 0',
                    borderBottom: `1px solid ${BORDER}`,
                  }}
                >
                  <span style={{ fontFamily: mono, fontSize: 11, color: MUTED }}>{k}</span>
                  <span style={{ fontFamily: mono, fontSize: 12, color: TEXT, fontWeight: 600 }}>{v}</span>
                </div>
              ))}

              <div
                style={{
                  marginTop: 20,
                  padding: '12px 16px',
                  background: BLUE_L,
                  borderRadius: 8,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                }}
              >
                <div style={{ color: BLUE, fontSize: 16, fontWeight: 700 }}>✓</div>
                <div style={{ fontFamily: mono, fontSize: 11, color: BLUE, letterSpacing: 0.5 }}>
                  YOU OWE NOTHING. CASE CLOSED.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}`}</style>
    </section>
  )
}

// ── How It Works ──────────────────────────────────────────────────────────────
function HowItWorks() {
  const steps = [
    {
      n: '01',
      icon: '📋',
      title: 'Share Your Ticket Details',
      body: 'Enter your ticket info and pick your defense. Takes about a minute.',
    },
    {
      n: '02',
      icon: '📄',
      title: 'Submit Your Letter',
      body: (
        <>
          We generate a professionally written appeal citing real NYC Traffic Rules — then submit it
          directly via the{' '}
          <a
            href="https://www.nyc.gov/site/finance/vehicles/dispute-web.page"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: BLUE, textDecoration: 'none' }}
          >
            NYC dispute portal
          </a>
          , by mail, or in person.
        </>
      ),
    },
  ]

  return (
    <section id="how-it-works" style={{ background: GRAY, padding: '100px 32px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <FadeIn>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <div
              style={{
                display: 'inline-block',
                fontFamily: mono,
                fontSize: 11,
                color: BLUE,
                letterSpacing: 3,
                marginBottom: 16,
                background: BLUE_L,
                padding: '4px 12px',
                borderRadius: 20,
              }}
            >
              HOW IT WORKS
            </div>
            <h2
              style={{
                fontFamily: serif,
                fontSize: 52,
                color: NAVY,
                margin: '0 0 16px',
                fontWeight: 700,
              }}
            >
              Two steps. One minute.
            </h2>
            <p style={{ fontFamily: serif, fontSize: 19, color: MUTED, margin: 0 }}>
              No legal knowledge required.
            </p>
          </div>
        </FadeIn>

        <div
          className="three-col"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2,1fr)',
            gap: 24,
            maxWidth: 800,
            margin: '0 auto',
          }}
        >
          {steps.map((s, i) => (
            <FadeIn key={s.n} delay={i * 0.1}>
              <div
                style={{
                  background: WHITE,
                  borderRadius: 16,
                  padding: 40,
                  boxShadow: SHADOW,
                  border: `1px solid ${BORDER}`,
                  height: '100%',
                  boxSizing: 'border-box',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    fontFamily: display,
                    fontSize: 88,
                    color: BLUE_L,
                    position: 'absolute',
                    top: 8,
                    right: 16,
                    lineHeight: 1,
                    userSelect: 'none',
                  }}
                >
                  {s.n}
                </div>
                <div style={{ fontSize: 34, marginBottom: 18 }}>{s.icon}</div>
                <h3
                  style={{
                    fontFamily: serif,
                    fontSize: 24,
                    color: NAVY,
                    margin: '0 0 12px',
                    fontWeight: 700,
                  }}
                >
                  {s.title}
                </h3>
                <p style={{ fontFamily: serif, fontSize: 16, color: MUTED, lineHeight: 1.7, margin: 0 }}>
                  {s.body}
                </p>
                <div style={{ width: 36, height: 3, background: BLUE, marginTop: 24, borderRadius: 2 }} />
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Teaser Guide ──────────────────────────────────────────────────────────────
function TeaserGuide({ onCTA }) {
  return (
    <section style={{ background: WHITE, padding: '100px 32px', borderTop: `1px solid ${BORDER}` }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <FadeIn>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              marginBottom: 56,
              flexWrap: 'wrap',
              gap: 20,
            }}
          >
            <div>
              <div
                style={{
                  display: 'inline-block',
                  fontFamily: mono,
                  fontSize: 11,
                  color: GOLD,
                  letterSpacing: 3,
                  marginBottom: 16,
                  background: '#faf7f0',
                  padding: '4px 12px',
                  borderRadius: 20,
                  border: '1px solid #e8d9b8',
                }}
              >
                WHAT TO KNOW
              </div>
              <h2
                style={{
                  fontFamily: serif,
                  fontSize: 52,
                  color: NAVY,
                  margin: 0,
                  fontWeight: 700,
                  lineHeight: 1.1,
                }}
              >
                How to win
                <br />
                <span style={{ color: GOLD, fontStyle: 'italic' }}>a dispute.</span>
              </h2>
            </div>
            <p
              style={{
                fontFamily: serif,
                fontSize: 19,
                color: MUTED,
                maxWidth: 360,
                lineHeight: 1.65,
                margin: 0,
              }}
            >
              Most people lose their appeal not because they were wrong — but because they
              didn&apos;t know the rules.
            </p>
          </div>
        </FadeIn>

        <div
          style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 20, marginBottom: 48 }}
          className="two-col"
        >
          {teaserTips.map((t, i) => (
            <FadeIn key={t.number} delay={i * 0.08}>
              <div
                style={{
                  background: WHITE,
                  border: `1px solid ${BORDER}`,
                  borderRadius: 14,
                  padding: 36,
                  boxShadow: SHADOW,
                  transition: 'box-shadow 0.2s, border-color 0.2s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.06), 0 20px 48px rgba(37,99,235,0.12)'
                  e.currentTarget.style.borderColor = '#bfdbfe'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.boxShadow = SHADOW
                  e.currentTarget.style.borderColor = BORDER
                }}
              >
                <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 16 }}>
                  <span
                    style={{
                      fontFamily: mono,
                      fontSize: 11,
                      color: BLUE,
                      letterSpacing: 2,
                      background: BLUE_L,
                      padding: '3px 8px',
                      borderRadius: 4,
                    }}
                  >
                    {t.number}
                  </span>
                  <span style={{ fontSize: 18 }}>{t.icon}</span>
                </div>
                <h3
                  style={{
                    fontFamily: serif,
                    fontSize: 22,
                    color: NAVY,
                    margin: '0 0 10px',
                    fontWeight: 700,
                  }}
                >
                  {t.title}
                </h3>
                <p style={{ fontFamily: serif, fontSize: 15, color: MUTED, lineHeight: 1.7, margin: 0 }}>
                  {t.body}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>

        <FadeIn>
          <div
            style={{
              background: NAVY,
              borderRadius: 16,
              padding: '32px 40px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 20,
            }}
          >
            <div>
              <div
                style={{ fontFamily: serif, fontSize: 26, color: WHITE, fontWeight: 700, marginBottom: 6 }}
              >
                Ready to fight your ticket?
              </div>
              <div style={{ fontFamily: serif, fontSize: 15, color: 'rgba(255,255,255,0.55)' }}>
                Submit directly to the NYC Department of Finance at nyc.gov/finance.
              </div>
            </div>
            <CTABtn onClick={onCTA}>Generate My Letter →</CTABtn>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}

// ── Testimonials ──────────────────────────────────────────────────────────────
function Testimonials() {
  return (
    <section style={{ background: GRAY, padding: '100px 32px', borderTop: `1px solid ${BORDER}` }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <FadeIn>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <div
              style={{
                display: 'inline-block',
                fontFamily: mono,
                fontSize: 11,
                color: BLUE,
                letterSpacing: 3,
                marginBottom: 16,
                background: BLUE_L,
                padding: '4px 12px',
                borderRadius: 20,
              }}
            >
              REAL NEW YORKERS
            </div>
            <h2 style={{ fontFamily: serif, fontSize: 52, color: NAVY, margin: 0, fontWeight: 700 }}>
              They fought back.{' '}
              <span style={{ color: GOLD, fontStyle: 'italic' }}>They won.</span>
            </h2>
          </div>
        </FadeIn>

        <div
          className="two-col"
          style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 20 }}
        >
          {testimonials.map((t, i) => (
            <FadeIn key={i} delay={i * 0.08}>
              <div
                style={{
                  background: WHITE,
                  border: `1px solid ${BORDER}`,
                  borderRadius: 16,
                  padding: 36,
                  boxShadow: SHADOW,
                }}
              >
                <div
                  style={{
                    fontFamily: serif,
                    fontSize: 72,
                    color: BLUE,
                    lineHeight: 0.75,
                    marginBottom: 16,
                    opacity: 0.18,
                  }}
                >
                  &ldquo;
                </div>
                <p
                  style={{
                    fontFamily: serif,
                    fontSize: 19,
                    color: TEXT,
                    lineHeight: 1.65,
                    margin: '0 0 24px',
                    fontStyle: 'italic',
                  }}
                >
                  {t.quote}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: '50%',
                      background: NAVY,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontFamily: display,
                      fontSize: 16,
                      color: WHITE,
                    }}
                  >
                    {t.name[0]}
                  </div>
                  <div>
                    <div style={{ fontFamily: mono, fontSize: 12, color: TEXT, fontWeight: 600 }}>{t.name}</div>
                    <div style={{ fontFamily: mono, fontSize: 11, color: MUTED }}>{t.location}</div>
                  </div>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Pricing ───────────────────────────────────────────────────────────────────
function Pricing({ onCTA }) {
  const plans = [
    {
      name: 'Pay Per Letter',
      price: '$6.99',
      desc: 'Per letter. No commitment.',
      features: [
        '1 appeal letter',
        'Direct submission to nyc.gov/finance',
        'PDF download',
        'Email delivery',
      ],
      cta: 'Get Started',
      hi: false,
      badge: null,
    },
    {
      name: 'Annual Plan',
      price: '$36.99',
      desc: 'Per year. Unlimited letters.',
      features: [
        'Unlimited appeal letters',
        'Direct submission to nyc.gov/finance',
        'PDF download',
        'Email delivery',
        'Denial follow-up template',
        'NYC drivers average 2–3 tickets per year',
      ],
      cta: 'Get Annual Access',
      hi: true,
      badge: 'BEST VALUE',
    },
  ]

  return (
    <section id="pricing" style={{ background: WHITE, padding: '100px 32px', borderTop: `1px solid ${BORDER}` }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <FadeIn>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <div
              style={{
                display: 'inline-block',
                fontFamily: mono,
                fontSize: 11,
                color: BLUE,
                letterSpacing: 3,
                marginBottom: 16,
                background: BLUE_L,
                padding: '4px 12px',
                borderRadius: 20,
              }}
            >
              PRICING
            </div>
            <h2 style={{ fontFamily: serif, fontSize: 52, color: NAVY, margin: '0 0 16px', fontWeight: 700 }}>
              Simple. Fair. Obvious.
            </h2>
            <p style={{ fontFamily: serif, fontSize: 19, color: MUTED }}>
              Spending $6.99 to fight a $115 fine is the easiest decision you&apos;ll make today.
            </p>
          </div>
        </FadeIn>

        <div
          className="three-plans"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2,1fr)',
            gap: 24,
            maxWidth: 680,
            margin: '0 auto',
          }}
        >
          {plans.map((p, i) => (
            <FadeIn key={p.name} delay={i * 0.1}>
              <div
                style={{
                  background: p.hi ? NAVY : WHITE,
                  border: `1px solid ${p.hi ? NAVY : BORDER}`,
                  borderRadius: 18,
                  padding: 36,
                  position: 'relative',
                  height: '100%',
                  boxSizing: 'border-box',
                  boxShadow: p.hi
                    ? '0 8px 16px rgba(26,39,68,0.2), 0 32px 64px rgba(26,39,68,0.15)'
                    : SHADOW,
                }}
              >
                {p.badge && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 20,
                      right: 20,
                      background: GOLD,
                      color: WHITE,
                      fontSize: 9,
                      fontWeight: 700,
                      letterSpacing: 2,
                      padding: '3px 10px',
                      borderRadius: 20,
                      fontFamily: mono,
                    }}
                  >
                    {p.badge}
                  </div>
                )}
                <div
                  style={{
                    fontFamily: mono,
                    fontSize: 11,
                    color: p.hi ? 'rgba(255,255,255,0.6)' : MUTED,
                    letterSpacing: 2,
                    textTransform: 'uppercase',
                    marginBottom: 16,
                  }}
                >
                  {p.name}
                </div>
                <div
                  style={{
                    fontFamily: serif,
                    fontSize: 52,
                    color: p.hi ? WHITE : NAVY,
                    fontWeight: 700,
                    lineHeight: 1,
                    marginBottom: 6,
                  }}
                >
                  {p.price}
                </div>
                <div
                  style={{
                    fontFamily: mono,
                    fontSize: 12,
                    color: p.hi ? 'rgba(255,255,255,0.5)' : MUTED,
                    marginBottom: 30,
                  }}
                >
                  {p.desc}
                </div>

                {p.features.map(f => (
                  <div
                    key={f}
                    style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 12 }}
                  >
                    <div
                      style={{
                        color: p.hi ? '#86efac' : BLUE,
                        fontSize: 13,
                        marginTop: 1,
                        flexShrink: 0,
                        fontWeight: 700,
                      }}
                    >
                      ✓
                    </div>
                    <span
                      style={{
                        fontFamily: mono,
                        fontSize: 12,
                        color: p.hi ? 'rgba(255,255,255,0.75)' : MUTED,
                        lineHeight: 1.5,
                      }}
                    >
                      {f}
                    </span>
                  </div>
                ))}

                <div style={{ marginTop: 30 }}>
                  <button
                    onClick={onCTA}
                    style={{
                      width: '100%',
                      background: p.hi ? WHITE : BLUE,
                      color: p.hi ? NAVY : WHITE,
                      border: 'none',
                      borderRadius: 10,
                      padding: '16px',
                      fontFamily: mono,
                      fontSize: 13,
                      fontWeight: 700,
                      letterSpacing: 1,
                      cursor: 'pointer',
                      boxShadow: p.hi ? 'none' : '0 2px 8px rgba(37,99,235,0.25)',
                    }}
                  >
                    {p.cta}
                  </button>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>

        <FadeIn>
          <div
            style={{
              textAlign: 'center',
              marginTop: 28,
              fontFamily: mono,
              fontSize: 12,
              color: MUTED,
              letterSpacing: 0.5,
            }}
          >
            Annual plan works out to just{' '}
            <span style={{ color: NAVY, fontWeight: 600 }}>$3.08/month</span>. NYC drivers average
            2–3 tickets per year.
          </div>
        </FadeIn>
      </div>
    </section>
  )
}

// ── FAQ ───────────────────────────────────────────────────────────────────────
function FAQ() {
  const [open, setOpen] = useState(null)
  return (
    <section id="faq" style={{ background: GRAY, padding: '100px 32px', borderTop: `1px solid ${BORDER}` }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <FadeIn>
          <div style={{ marginBottom: 56 }}>
            <div
              style={{
                display: 'inline-block',
                fontFamily: mono,
                fontSize: 11,
                color: BLUE,
                letterSpacing: 3,
                marginBottom: 16,
                background: BLUE_L,
                padding: '4px 12px',
                borderRadius: 20,
              }}
            >
              FAQ
            </div>
            <h2 style={{ fontFamily: serif, fontSize: 52, color: NAVY, margin: 0, fontWeight: 700 }}>
              Questions?{' '}
              <span style={{ color: GOLD, fontStyle: 'italic' }}>Answered.</span>
            </h2>
          </div>
        </FadeIn>

        {faqs.map((f, i) => (
          <FadeIn key={i} delay={i * 0.04}>
            <div
              style={{
                background: WHITE,
                borderRadius: 12,
                marginBottom: 8,
                border: `1px solid ${BORDER}`,
                boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                overflow: 'hidden',
              }}
            >
              <div
                onClick={() => setOpen(open === i ? null : i)}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '22px 28px',
                  cursor: 'pointer',
                  gap: 16,
                }}
              >
                <span style={{ fontFamily: serif, fontSize: 18, color: NAVY, fontWeight: 600 }}>
                  {f.q}
                </span>
                <span
                  style={{
                    color: open === i ? BLUE : MUTED,
                    fontSize: 22,
                    transform: open === i ? 'rotate(45deg)' : 'none',
                    transition: 'all 0.2s',
                    flexShrink: 0,
                  }}
                >
                  +
                </span>
              </div>
              {open === i && (
                <div style={{ padding: '0 28px 22px' }}>
                  <p style={{ fontFamily: serif, fontSize: 16, color: MUTED, lineHeight: 1.7, margin: 0 }}>
                    {f.a}
                  </p>
                </div>
              )}
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  )
}

// ── Final CTA ─────────────────────────────────────────────────────────────────
function FinalCTA({ onCTA }) {
  return (
    <section style={{ background: NAVY, padding: '110px 32px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', textAlign: 'center' }}>
        <FadeIn>
          <div
            style={{
              display: 'inline-block',
              fontFamily: mono,
              fontSize: 11,
              color: 'rgba(255,255,255,0.45)',
              letterSpacing: 3,
              marginBottom: 24,
            }}
          >
            DON&apos;T JUST PAY IT
          </div>
          <h2
            style={{
              fontFamily: serif,
              fontSize: 76,
              color: WHITE,
              margin: '0 0 20px',
              fontWeight: 700,
              lineHeight: 1.05,
            }}
          >
            Fight your ticket.
            <br />
            <span style={{ color: GOLD, fontStyle: 'italic' }}>Win your case.</span>
          </h2>
          <p
            style={{
              fontFamily: serif,
              fontSize: 21,
              color: 'rgba(255,255,255,0.6)',
              margin: '0 auto 40px',
              maxWidth: 520,
              lineHeight: 1.65,
            }}
          >
            Professionally written appeal letters that cite real NYC Traffic Rules — built to
            maximize your chances of dismissal.
          </p>
          <CTABtn onClick={onCTA} large>
            Generate My Free Letter →
          </CTABtn>
        </FadeIn>
      </div>
    </section>
  )
}

// ── Footer ────────────────────────────────────────────────────────────────────
function Footer() {
  const navigate = useNavigate()
  return (
    <footer style={{ background: GRAY, borderTop: `1px solid ${BORDER}`, padding: '36px 32px' }}>
      <div
        style={{
          maxWidth: 1100,
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 16,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
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
          <span style={{ fontFamily: display, fontSize: 18, letterSpacing: 2, color: NAVY }}>
            APPEALWRITER
          </span>
        </div>
        <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
          <span
            onClick={() => navigate('/privacy')}
            style={{ fontFamily: mono, fontSize: 12, color: MUTED, cursor: 'pointer', letterSpacing: 0.5 }}
            onMouseEnter={e => (e.currentTarget.style.color = NAVY)}
            onMouseLeave={e => (e.currentTarget.style.color = MUTED)}
          >
            Privacy
          </span>
          <span
            onClick={() => navigate('/terms')}
            style={{ fontFamily: mono, fontSize: 12, color: MUTED, cursor: 'pointer', letterSpacing: 0.5 }}
            onMouseEnter={e => (e.currentTarget.style.color = NAVY)}
            onMouseLeave={e => (e.currentTarget.style.color = MUTED)}
          >
            Terms
          </span>
          <span
            style={{
              fontFamily: mono,
              fontSize: 11,
              color: MUTED,
              letterSpacing: 0.5,
              lineHeight: 1.8,
              textAlign: 'right',
            }}
          >
            NOT LEGAL ADVICE — FOR INFORMATIONAL PURPOSES ONLY
            <br />© 2026 Dismiss It. All rights reserved.
          </span>
        </div>
      </div>
    </footer>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function LandingPage() {
  const navigate = useNavigate()
  const goTool = () => navigate('/appeal')

  return (
    <div style={{ background: WHITE, minHeight: '100vh' }}>
      <Nav onCTA={goTool} />
      <Hero onCTA={goTool} />
      <HowItWorks />
      <TeaserGuide onCTA={goTool} />
      <Testimonials />
      <Pricing onCTA={goTool} />
      <FAQ />
      <FinalCTA onCTA={goTool} />
      <Footer />
    </div>
  )
}
