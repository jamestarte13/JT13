import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FadeIn, YBtn } from '../components/UI'
import { Y, BG, mono, display, serif } from '../components/tokens'
import { teaserTips, testimonials, faqs } from '../components/data'

// ── Nav helpers ───────────────────────────────────────────────────────────────
function scrollTo(id) {
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function NavLink({ children, id }) {
  const [h, setH] = useState(false)
  return (
    <span
      onClick={() => scrollTo(id)}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        color: h ? Y : '#888',
        fontSize: 12,
        fontFamily: mono,
        cursor: 'pointer',
        letterSpacing: 1,
        transition: 'color 0.2s',
        userSelect: 'none',
      }}
    >
      {children}
    </span>
  )
}

function Nav({ onCTA }) {
  return (
    <nav
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 200,
        background: 'rgba(14,14,14,0.96)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid #1e1e1e',
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
          height: 60,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              background: Y,
              color: '#111',
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: 3,
              padding: '3px 8px',
              borderRadius: 3,
              fontFamily: mono,
            }}
          >
            NYC
          </div>
          <span style={{ fontFamily: display, fontSize: 22, letterSpacing: 2, color: '#fff' }}>
            APPEALWRITER
          </span>
        </div>
        <div className="nav-links" style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <NavLink id="how-it-works">How It Works</NavLink>
          <NavLink id="pricing">Pricing</NavLink>
          <NavLink id="faq">FAQ</NavLink>
          <YBtn onClick={onCTA}>Fight My Ticket</YBtn>
        </div>
      </div>
    </nav>
  )
}

// ── Sections ──────────────────────────────────────────────────────────────────
function Hero({ onCTA }) {
  return (
    <section
      style={{
        background: BG,
        padding: '90px 32px 80px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(232,255,0,0.04) 0%, transparent 60%)',
          pointerEvents: 'none',
        }}
      />
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
        <div>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: '#1a1a00',
              border: '1px solid #3a3a00',
              borderRadius: 20,
              padding: '6px 14px',
              marginBottom: 28,
            }}
          >
            <div
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: Y,
                animation: 'pulse 2s infinite',
              }}
            />
            <span style={{ color: Y, fontSize: 11, fontFamily: mono, letterSpacing: 2 }}>
              2,400+ APPEALS GENERATED
            </span>
          </div>
          <h1
            style={{
              fontFamily: display,
              fontSize: 56,
              lineHeight: 0.9,
              letterSpacing: 2,
              margin: '0 0 24px',
              color: '#fff',
            }}
          >
            Hit with a NYC Parking Ticket?
            <br />
            <span style={{ color: Y, fontSize: 36 }}>Win your case in 2 easy steps</span>
            <br />
            <span style={{ fontSize: 36 }}>— no lawyer, no court, no hassle.</span>
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
            <YBtn onClick={onCTA} large>
              Generate My Free Letter →
            </YBtn>
          </div>
          <div style={{ display: 'flex', gap: 32, marginTop: 44 }}>
            {[
              ['30 sec', 'avg. time'],
              ['Free', 'first letter'],
              ['Real', 'NYC law'],
            ].map(([v, l]) => (
              <div key={l}>
                <div style={{ fontFamily: display, fontSize: 30, color: Y, letterSpacing: 2 }}>
                  {v}
                </div>
                <div
                  style={{
                    fontFamily: mono,
                    fontSize: 10,
                    color: '#555',
                    letterSpacing: 1,
                    textTransform: 'uppercase',
                  }}
                >
                  {l}
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Ticket preview card */}
        <div>
          <div
            style={{
              background: '#141414',
              border: '1px solid #2a2a2a',
              borderRadius: 16,
              padding: 32,
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: 4,
                background: `linear-gradient(90deg, ${Y}, #fff)`,
              }}
            />
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: 20,
              }}
            >
              <div>
                <div
                  style={{ fontFamily: mono, fontSize: 10, color: '#555', letterSpacing: 2, marginBottom: 4 }}
                >
                  NYC PARKING SUMMONS
                </div>
                <div style={{ fontFamily: display, fontSize: 26, color: '#fff', letterSpacing: 2 }}>
                  VIOLATION NOTICE
                </div>
              </div>
              <div
                style={{
                  background: '#2a0000',
                  border: '1px solid #5a0000',
                  borderRadius: 6,
                  padding: '5px 10px',
                }}
              >
                <div style={{ fontFamily: mono, fontSize: 10, color: '#ff6b6b', letterSpacing: 1 }}>
                  UNPAID
                </div>
              </div>
            </div>
            {[
              ['Violation', 'Alternate Side Parking'],
              ['Fine Amount', '$65.00'],
              ['Date Issued', 'March 8, 2026'],
              ['Location', '5th Ave & 42nd St'],
            ].map(([k, v]) => (
              <div
                key={k}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '10px 0',
                  borderBottom: '1px solid #1e1e1e',
                }}
              >
                <span style={{ fontFamily: mono, fontSize: 11, color: '#555' }}>{k}</span>
                <span style={{ fontFamily: mono, fontSize: 12, color: '#ccc' }}>{v}</span>
              </div>
            ))}
            <div
              style={{
                marginTop: 20,
                padding: 14,
                background: '#0f1a00',
                border: '1px solid #1a3a00',
                borderRadius: 8,
                display: 'flex',
                alignItems: 'center',
                gap: 10,
              }}
            >
              <div style={{ color: '#a3e635' }}>✓</div>
              <div style={{ fontFamily: mono, fontSize: 11, color: '#a3e635', letterSpacing: 1 }}>
                APPEAL LETTER READY TO SUBMIT
              </div>
            </div>
          </div>
        </div>
      </div>
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}`}</style>
    </section>
  )
}

function HowItWorks() {
  const steps = [
    { n: '01', icon: '📋', title: 'Share Your Ticket Details', body: 'Enter your ticket info and pick your defense. Takes about a minute.' },
    { n: '02', icon: '📄', title: 'Submit Your Letter', body: <>We generate a professionally written appeal citing real NYC Traffic Rules — then submit it directly via the <a href="https://www.nyc.gov/site/finance/vehicles/dispute-web.page" target="_blank" rel="noopener noreferrer" style={{ color: Y }}>NYC dispute portal</a>, by mail, or in person.</> },
  ]
  return (
    <section id="how-it-works" style={{ background: '#0a0a0a', padding: '90px 32px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <FadeIn>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div style={{ fontFamily: mono, fontSize: 11, color: Y, letterSpacing: 4, marginBottom: 14 }}>
              HOW IT WORKS
            </div>
            <h2 style={{ fontFamily: display, fontSize: 60, color: '#fff', margin: 0, letterSpacing: 2 }}>
              2 STEPS. 1 MINUTE.
            </h2>
          </div>
        </FadeIn>
        <div
          className="three-col"
          style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 2, maxWidth: 800, margin: '0 auto' }}
        >
          {steps.map((s, i) => (
            <FadeIn key={s.n} delay={i * 0.1}>
              <div
                style={{
                  background: '#111',
                  border: '1px solid #1e1e1e',
                  padding: 36,
                  position: 'relative',
                  overflow: 'hidden',
                  height: '100%',
                }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = '#333')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = '#1e1e1e')}
              >
                <div
                  style={{
                    fontFamily: display,
                    fontSize: 72,
                    color: '#1a1a1a',
                    position: 'absolute',
                    top: 12,
                    right: 20,
                    lineHeight: 1,
                  }}
                >
                  {s.n}
                </div>
                <div style={{ fontSize: 32, marginBottom: 16 }}>{s.icon}</div>
                <h3
                  style={{
                    fontFamily: display,
                    fontSize: 26,
                    color: '#fff',
                    margin: '0 0 10px',
                    letterSpacing: 1,
                  }}
                >
                  {s.title}
                </h3>
                <p style={{ fontFamily: serif, fontSize: 16, color: '#666', lineHeight: 1.6, margin: 0 }}>
                  {s.body}
                </p>
                <div style={{ width: 36, height: 3, background: Y, marginTop: 20 }} />
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}

function TeaserGuide({ onCTA }) {
  return (
    <section style={{ background: BG, padding: '90px 32px', borderTop: '1px solid #1a1a1a' }}>
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
              <div style={{ fontFamily: mono, fontSize: 11, color: Y, letterSpacing: 4, marginBottom: 14 }}>
                WHAT TO KNOW
              </div>
              <h2
                style={{
                  fontFamily: display,
                  fontSize: 60,
                  color: '#fff',
                  margin: 0,
                  letterSpacing: 2,
                  lineHeight: 0.95,
                }}
              >
                HOW TO WIN
                <br />
                <span style={{ color: Y }}>A DISPUTE.</span>
              </h2>
            </div>
            <p
              style={{
                fontFamily: serif,
                fontSize: 18,
                color: '#666',
                maxWidth: 340,
                lineHeight: 1.6,
                margin: 0,
              }}
            >
              Most people lose their appeal not because they were wrong — but because they
              didn&apos;t know the rules.
            </p>
          </div>
        </FadeIn>
        <div
          style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 2, marginBottom: 56 }}
          className="two-col"
        >
          {teaserTips.map((t, i) => (
            <FadeIn key={t.number} delay={i * 0.1}>
              <div
                style={{
                  background: '#111',
                  border: '1px solid #1e1e1e',
                  padding: 36,
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = Y
                  e.currentTarget.style.background = '#131300'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = '#1e1e1e'
                  e.currentTarget.style.background = '#111'
                }}
              >
                <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 14 }}>
                  <span style={{ fontFamily: mono, fontSize: 11, color: Y, letterSpacing: 2 }}>
                    {t.number}
                  </span>
                  <span style={{ fontSize: 18 }}>{t.icon}</span>
                </div>
                <h3
                  style={{
                    fontFamily: display,
                    fontSize: 24,
                    color: '#fff',
                    margin: '0 0 10px',
                    letterSpacing: 1,
                  }}
                >
                  {t.title}
                </h3>
                <p style={{ fontFamily: serif, fontSize: 15, color: '#666', lineHeight: 1.7, margin: 0 }}>
                  {t.body}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
        <FadeIn>
          <div
            style={{
              background: '#111',
              border: '1px solid #2a2a00',
              borderRadius: 12,
              padding: '28px 36px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 20,
            }}
          >
            <div>
              <div
                style={{ fontFamily: display, fontSize: 26, color: '#fff', letterSpacing: 1, marginBottom: 4 }}
              >
                GET THE FULL 8-STEP SUBMISSION GUIDE
              </div>
              <div style={{ fontFamily: serif, fontSize: 15, color: '#666' }}>
                From evidence gathering to what to do if your first appeal is denied.
              </div>
            </div>
            <YBtn onClick={onCTA}>Generate My Letter + Full Guide →</YBtn>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}

function Testimonials() {
  return (
    <section style={{ background: '#080808', padding: '90px 32px', borderTop: '1px solid #1a1a1a' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <FadeIn>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div style={{ fontFamily: mono, fontSize: 11, color: Y, letterSpacing: 4, marginBottom: 14 }}>
              REAL NEW YORKERS
            </div>
            <h2 style={{ fontFamily: display, fontSize: 60, color: '#fff', margin: 0, letterSpacing: 2 }}>
              THEY FOUGHT BACK.
              <br />
              <span style={{ color: Y }}>THEY WON.</span>
            </h2>
          </div>
        </FadeIn>
        <div
          className="two-col"
          style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 2 }}
        >
          {testimonials.map((t, i) => (
            <FadeIn key={i} delay={i * 0.1}>
              <div
                style={{ background: '#0f0f0f', border: '1px solid #1e1e1e', padding: 36 }}
              >
                <div
                  style={{
                    fontFamily: display,
                    fontSize: 56,
                    color: Y,
                    lineHeight: 0.8,
                    marginBottom: 14,
                    opacity: 0.3,
                  }}
                >
                  &ldquo;
                </div>
                <p
                  style={{
                    fontFamily: serif,
                    fontSize: 19,
                    color: '#ccc',
                    lineHeight: 1.6,
                    margin: '0 0 20px',
                    fontStyle: 'italic',
                  }}
                >
                  {t.quote}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: '50%',
                      background: '#1e1e1e',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontFamily: display,
                      fontSize: 16,
                      color: Y,
                    }}
                  >
                    {t.name[0]}
                  </div>
                  <div>
                    <div style={{ fontFamily: mono, fontSize: 12, color: '#fff' }}>{t.name}</div>
                    <div style={{ fontFamily: mono, fontSize: 11, color: '#555' }}>{t.location}</div>
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

function Pricing({ onCTA }) {
  const plans = [
    {
      name: 'First Letter',
      price: 'Free',
      desc: 'Your first appeal on us. No card needed.',
      features: ['1 appeal letter', 'Full 8-step submission guide', 'PDF download', 'Copy to clipboard', 'Email delivery'],
      cta: 'Get Started Free',
      hi: false,
      badge: null,
    },
    {
      name: 'Pay Per Letter',
      price: '$9.99',
      desc: 'Per letter. No commitment.',
      features: ['1 appeal letter', 'Full 8-step submission guide', 'PDF download', 'Email delivery', 'Denial follow-up template'],
      cta: 'Buy a Letter',
      hi: false,
      badge: null,
    },
    {
      name: 'Annual Plan',
      price: '$39.99',
      desc: 'Per year. Unlimited letters.',
      features: ['Unlimited appeal letters', 'Full 8-step submission guide', 'PDF download', 'Email delivery', 'Denial follow-up template', 'Hearing prep guide', 'Priority support'],
      cta: 'Get Annual Access',
      hi: true,
      badge: 'BEST VALUE',
    },
  ]
  return (
    <section id="pricing" style={{ background: BG, padding: '90px 32px', borderTop: '1px solid #1a1a1a' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <FadeIn>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div style={{ fontFamily: mono, fontSize: 11, color: Y, letterSpacing: 4, marginBottom: 14 }}>
              PRICING
            </div>
            <h2 style={{ fontFamily: display, fontSize: 60, color: '#fff', margin: '0 0 14px', letterSpacing: 2 }}>
              SIMPLE. FAIR. OBVIOUS.
            </h2>
            <p style={{ fontFamily: serif, fontSize: 19, color: '#666' }}>
              Spending $10 to fight a $115 fine is the easiest decision you&apos;ll make today.
            </p>
          </div>
        </FadeIn>
        <div
          className="three-plans"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3,1fr)',
            gap: 2,
            maxWidth: 960,
            margin: '0 auto',
          }}
        >
          {plans.map((p, i) => (
            <FadeIn key={p.name} delay={i * 0.1}>
              <div
                style={{
                  background: p.hi ? '#111' : '#0a0a0a',
                  border: `1px solid ${p.hi ? Y : '#222'}`,
                  padding: 36,
                  position: 'relative',
                  height: '100%',
                }}
              >
                {p.hi && (
                  <div
                    style={{
                      position: 'absolute',
                      top: -1,
                      left: 0,
                      right: 0,
                      height: 3,
                      background: Y,
                    }}
                  />
                )}
                {p.badge && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 16,
                      right: 16,
                      background: Y,
                      color: '#111',
                      fontSize: 9,
                      fontWeight: 700,
                      letterSpacing: 2,
                      padding: '3px 8px',
                      borderRadius: 3,
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
                    color: p.hi ? Y : '#555',
                    letterSpacing: 3,
                    textTransform: 'uppercase',
                    marginBottom: 14,
                  }}
                >
                  {p.name}
                </div>
                <div
                  style={{
                    fontFamily: display,
                    fontSize: 48,
                    color: '#fff',
                    letterSpacing: 2,
                    lineHeight: 1,
                    marginBottom: 4,
                  }}
                >
                  {p.price}
                </div>
                <div style={{ fontFamily: serif, fontSize: 14, color: '#666', marginBottom: 28 }}>
                  {p.desc}
                </div>
                {p.features.map(f => (
                  <div
                    key={f}
                    style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 10 }}
                  >
                    <div style={{ color: Y, fontSize: 11, marginTop: 2, flexShrink: 0 }}>✓</div>
                    <span style={{ fontFamily: mono, fontSize: 11, color: '#888', lineHeight: 1.5 }}>
                      {f}
                    </span>
                  </div>
                ))}
                <div style={{ marginTop: 28 }}>
                  <button
                    onClick={onCTA}
                    style={{
                      width: '100%',
                      background: Y,
                      color: '#111',
                      border: 'none',
                      borderRadius: 8,
                      padding: '16px',
                      fontFamily: mono,
                      fontSize: 13,
                      fontWeight: 700,
                      letterSpacing: 2,
                      textTransform: 'uppercase',
                      cursor: 'pointer',
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
              marginTop: 32,
              fontFamily: mono,
              fontSize: 11,
              color: '#444',
              letterSpacing: 1,
            }}
          >
            Annual plan works out to just <span style={{ color: Y }}>$3.33/month</span>. NYC
            drivers average 2–3 tickets per year.
          </div>
        </FadeIn>
      </div>
    </section>
  )
}

function FAQ() {
  const [open, setOpen] = useState(null)
  return (
    <section id="faq" style={{ background: '#080808', padding: '90px 32px', borderTop: '1px solid #1a1a1a' }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <FadeIn>
          <div style={{ marginBottom: 56 }}>
            <div style={{ fontFamily: mono, fontSize: 11, color: Y, letterSpacing: 4, marginBottom: 14 }}>
              FAQ
            </div>
            <h2 style={{ fontFamily: display, fontSize: 60, color: '#fff', margin: 0, letterSpacing: 2 }}>
              QUESTIONS?
              <br />
              <span style={{ color: Y }}>ANSWERED.</span>
            </h2>
          </div>
        </FadeIn>
        {faqs.map((f, i) => (
          <FadeIn key={i} delay={i * 0.05}>
            <div style={{ borderBottom: '1px solid #1e1e1e' }}>
              <div
                onClick={() => setOpen(open === i ? null : i)}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '22px 0',
                  cursor: 'pointer',
                  gap: 16,
                }}
              >
                <span style={{ fontFamily: display, fontSize: 20, color: '#fff', letterSpacing: 1 }}>
                  {f.q}
                </span>
                <span
                  style={{
                    color: open === i ? Y : '#444',
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
                <div style={{ paddingBottom: 22 }}>
                  <p style={{ fontFamily: serif, fontSize: 16, color: '#777', lineHeight: 1.7, margin: 0 }}>
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

function FinalCTA({ onCTA }) {
  return (
    <section style={{ background: Y, padding: '90px 32px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', textAlign: 'center' }}>
        <FadeIn>
          <div style={{ fontFamily: mono, fontSize: 11, color: '#666', letterSpacing: 4, marginBottom: 20 }}>
            DON&apos;T JUST PAY IT
          </div>
          <h2
            style={{
              fontFamily: display,
              fontSize: 92,
              color: '#111',
              margin: '0 0 20px',
              letterSpacing: 2,
              lineHeight: 0.9,
            }}
          >
            FIGHT YOUR
            <br />
            TICKET.
          </h2>
          <p
            style={{
              fontFamily: serif,
              fontSize: 21,
              color: '#555',
              margin: '0 auto 36px',
              maxWidth: 500,
            }}
          >
            Professionally written appeal letters that cite real NYC Traffic Rules — built to maximize your chances of dismissal.
          </p>
          <YBtn onClick={onCTA} large dark>
            Generate My Free Letter →
          </YBtn>
        </FadeIn>
      </div>
    </section>
  )
}

function Footer() {
  const navigate = useNavigate()
  return (
    <footer style={{ background: '#060606', borderTop: '1px solid #1a1a1a', padding: '36px 32px' }}>
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
              background: Y,
              color: '#111',
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: 3,
              padding: '3px 8px',
              borderRadius: 3,
              fontFamily: mono,
            }}
          >
            NYC
          </div>
          <span style={{ fontFamily: display, fontSize: 18, letterSpacing: 2, color: '#444' }}>
            APPEALWRITER
          </span>
        </div>
        <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
          <span
            onClick={() => navigate('/privacy')}
            style={{ fontFamily: mono, fontSize: 11, color: '#444', cursor: 'pointer', letterSpacing: 1 }}
            onMouseEnter={e => (e.currentTarget.style.color = '#888')}
            onMouseLeave={e => (e.currentTarget.style.color = '#444')}
          >
            Privacy
          </span>
          <span
            onClick={() => navigate('/terms')}
            style={{ fontFamily: mono, fontSize: 11, color: '#444', cursor: 'pointer', letterSpacing: 1 }}
            onMouseEnter={e => (e.currentTarget.style.color = '#888')}
            onMouseLeave={e => (e.currentTarget.style.color = '#444')}
          >
            Terms
          </span>
          <span style={{ fontFamily: mono, fontSize: 11, color: '#333', letterSpacing: 1, lineHeight: 1.8, textAlign: 'right' }}>
            NOT LEGAL ADVICE — FOR INFORMATIONAL PURPOSES ONLY
            <br />© 2026 NYC Appeal Writer. All rights reserved.
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
    <div style={{ background: BG, minHeight: '100vh' }}>
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
