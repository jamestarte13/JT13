import { useState, useEffect, useRef } from 'react'
import { Y, mono, display } from './tokens'

// ── Intersection observer fade-in ─────────────────────────────────────────────
function useInView(threshold = 0.1) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold }
    )
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])
  return [ref, visible]
}

export function FadeIn({ children, delay = 0 }) {
  const [ref, v] = useInView()
  return (
    <div
      ref={ref}
      style={{
        opacity: v ? 1 : 0,
        transform: v ? 'none' : 'translateY(20px)',
        transition: `opacity 0.6s ${delay}s, transform 0.6s ${delay}s`,
      }}
    >
      {children}
    </div>
  )
}

// ── Buttons ───────────────────────────────────────────────────────────────────
export function YBtn({ children, onClick, large, dark, style = {} }) {
  const [h, setH] = useState(false)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        background: dark ? (h ? '#000' : '#111') : (h ? '#fff' : Y),
        color: dark ? Y : '#111',
        border: 'none',
        borderRadius: 6,
        padding: large ? '18px 40px' : '14px 28px',
        fontFamily: mono,
        fontSize: large ? 14 : 12,
        fontWeight: 700,
        letterSpacing: 2,
        textTransform: 'uppercase',
        cursor: 'pointer',
        transition: 'all 0.2s',
        ...style,
      }}
    >
      {children}
    </button>
  )
}

export function PBtn({ onClick, disabled, children, style = {} }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        background: disabled ? '#222' : Y,
        color: disabled ? '#444' : '#111',
        border: 'none',
        borderRadius: 8,
        padding: '16px',
        fontFamily: mono,
        fontSize: 13,
        fontWeight: 700,
        letterSpacing: 2,
        textTransform: 'uppercase',
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'all 0.2s',
        ...style,
      }}
    >
      {children}
    </button>
  )
}

// ── Form primitives ───────────────────────────────────────────────────────────
export function Lbl({ children }) {
  return (
    <label
      style={{
        display: 'block',
        color: '#aaa',
        fontSize: 11,
        letterSpacing: 2,
        textTransform: 'uppercase',
        fontFamily: mono,
        marginBottom: 8,
      }}
    >
      {children}
    </label>
  )
}

export function TInput({ label, value, onChange, placeholder, type = 'text' }) {
  const [f, setF] = useState(false)
  return (
    <div style={{ marginBottom: 20 }}>
      <Lbl>{label}</Lbl>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        onFocus={() => setF(true)}
        onBlur={() => setF(false)}
        style={{
          width: '100%',
          background: '#1a1a1a',
          border: `1px solid ${f ? Y : '#333'}`,
          borderRadius: 8,
          padding: '14px 16px',
          color: '#fff',
          fontSize: 15,
          fontFamily: mono,
          outline: 'none',
          boxSizing: 'border-box',
          transition: 'border-color 0.2s',
        }}
      />
    </div>
  )
}

export function TSel({ label, value, onChange, options, placeholder = 'Select one...' }) {
  const [f, setF] = useState(false)
  return (
    <div style={{ marginBottom: 20 }}>
      <Lbl>{label}</Lbl>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setF(true)}
        onBlur={() => setF(false)}
        style={{
          width: '100%',
          background: '#1a1a1a',
          border: `1px solid ${f ? Y : '#333'}`,
          borderRadius: 8,
          padding: '14px 16px',
          color: value ? '#fff' : '#555',
          fontSize: 15,
          fontFamily: mono,
          outline: 'none',
          boxSizing: 'border-box',
          appearance: 'none',
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23666' stroke-width='1.5' fill='none'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 16px center',
          cursor: 'pointer',
          transition: 'border-color 0.2s',
        }}
      >
        <option value="">{placeholder}</option>
        {options.map(o => {
          const v = typeof o === 'string' ? o : o.value
          const l = typeof o === 'string' ? o : o.label
          return <option key={v} value={v}>{l}</option>
        })}
      </select>
    </div>
  )
}

// ── Nav Logo ──────────────────────────────────────────────────────────────────
export function Logo({ size = 22 }) {
  return (
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
      <span style={{ fontFamily: display, fontSize: size, letterSpacing: 2, color: '#fff' }}>
        APPEALWRITER
      </span>
    </div>
  )
}
