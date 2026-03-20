import { useState } from 'react'
import { Y, mono } from './tokens'

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']
const DAYS   = ['Su','Mo','Tu','We','Th','Fr','Sa']

export default function CalendarPicker({ label, value, onChange }) {
  const today = new Date()
  const minYear = today.getFullYear() - 2

  // parse current value back to a date so calendar opens on the right month
  const parsed = value ? new Date(value) : null
  const [view, setView] = useState({
    month: parsed ? parsed.getMonth() : today.getMonth(),
    year:  parsed ? parsed.getFullYear() : today.getFullYear(),
  })
  const [open, setOpen] = useState(false)

  function prevMonth() {
    setView(v => {
      if (v.month === 0) return { month: 11, year: v.year - 1 }
      return { ...v, month: v.month - 1 }
    })
  }

  function nextMonth() {
    setView(v => {
      if (v.month === 11) return { month: 0, year: v.year + 1 }
      return { ...v, month: v.month + 1 }
    })
  }

  function canGoPrev() {
    return !(view.month === 0 && view.year <= minYear)
  }

  function canGoNext() {
    return !(view.month === today.getMonth() && view.year >= today.getFullYear())
  }

  function buildGrid() {
    const first = new Date(view.year, view.month, 1).getDay()
    const daysInMonth = new Date(view.year, view.month + 1, 0).getDate()
    const cells = []
    for (let i = 0; i < first; i++) cells.push(null)
    for (let d = 1; d <= daysInMonth; d++) cells.push(d)
    return cells
  }

  function isDisabled(d) {
    if (!d) return true
    const cell = new Date(view.year, view.month, d)
    return cell > today
  }

  function isSelected(d) {
    if (!d || !parsed) return false
    return (
      parsed.getFullYear() === view.year &&
      parsed.getMonth()    === view.month &&
      parsed.getDate()     === d
    )
  }

  function isToday(d) {
    return d === today.getDate() && view.month === today.getMonth() && view.year === today.getFullYear()
  }

  function select(d) {
    if (isDisabled(d)) return
    const date = new Date(view.year, view.month, d)
    const label = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    onChange(label)
    setOpen(false)
  }

  // year options
  const years = []
  for (let y = today.getFullYear(); y >= minYear; y--) years.push(y)

  const grid = buildGrid()

  return (
    <div style={{ marginBottom: 20, position: 'relative' }}>
      {/* Label */}
      <label style={{ display: 'block', color: '#aaa', fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', fontFamily: mono, marginBottom: 8 }}>
        {label}
      </label>

      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%',
          background: '#2c2c30',
          border: `1px solid ${open ? Y : '#3f3f46'}`,
          borderRadius: 8,
          padding: '14px 16px',
          color: value ? '#fff' : '#555',
          fontSize: 15,
          fontFamily: mono,
          textAlign: 'left',
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          transition: 'border-color 0.2s',
        }}
      >
        <span>{value || 'Select date…'}</span>
        <span style={{ color: '#555', fontSize: 12 }}>{open ? '▲' : '▼'}</span>
      </button>

      {/* Calendar dropdown */}
      {open && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 6px)',
          left: 0,
          right: 0,
          background: '#1f1f23',
          border: `1px solid ${Y}`,
          borderRadius: 10,
          padding: '16px',
          zIndex: 100,
          boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
        }}>
          {/* Header: prev / month+year / next */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <button
              type="button"
              onClick={prevMonth}
              disabled={!canGoPrev()}
              style={{ background: 'none', border: 'none', color: canGoPrev() ? '#fff' : '#333', fontSize: 18, cursor: canGoPrev() ? 'pointer' : 'default', padding: '0 6px', lineHeight: 1 }}
            >‹</button>

            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <span style={{ fontFamily: mono, fontSize: 12, fontWeight: 700, color: '#fff', letterSpacing: 1 }}>
                {MONTHS[view.month]}
              </span>
              <select
                value={view.year}
                onChange={e => setView(v => ({ ...v, year: +e.target.value }))}
                style={{
                  background: '#2c2c30',
                  border: '1px solid #3f3f46',
                  borderRadius: 6,
                  color: '#fff',
                  fontFamily: mono,
                  fontSize: 12,
                  padding: '3px 6px',
                  cursor: 'pointer',
                }}
              >
                {years.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>

            <button
              type="button"
              onClick={nextMonth}
              disabled={!canGoNext()}
              style={{ background: 'none', border: 'none', color: canGoNext() ? '#fff' : '#333', fontSize: 18, cursor: canGoNext() ? 'pointer' : 'default', padding: '0 6px', lineHeight: 1 }}
            >›</button>
          </div>

          {/* Day-of-week headers */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2, marginBottom: 4 }}>
            {DAYS.map(d => (
              <div key={d} style={{ textAlign: 'center', fontFamily: mono, fontSize: 9, color: '#555', letterSpacing: 1, padding: '4px 0' }}>
                {d}
              </div>
            ))}
          </div>

          {/* Day cells */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2 }}>
            {grid.map((d, i) => {
              const sel = isSelected(d)
              const dis = isDisabled(d)
              const tod = isToday(d)
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => select(d)}
                  disabled={dis}
                  style={{
                    background: sel ? Y : 'transparent',
                    color: !d ? 'transparent' : sel ? '#111' : dis ? '#333' : tod ? Y : '#ddd',
                    border: tod && !sel ? `1px solid ${Y}` : '1px solid transparent',
                    borderRadius: 6,
                    padding: '7px 0',
                    fontFamily: mono,
                    fontSize: 12,
                    cursor: d && !dis ? 'pointer' : 'default',
                    textAlign: 'center',
                    transition: 'background 0.15s',
                    fontWeight: sel ? 700 : 400,
                  }}
                  onMouseEnter={e => { if (d && !dis && !sel) e.currentTarget.style.background = '#2c2c30' }}
                  onMouseLeave={e => { if (!sel) e.currentTarget.style.background = 'transparent' }}
                >
                  {d || ''}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
