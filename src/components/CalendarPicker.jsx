import { useState } from 'react'
import { Y, mono } from './tokens'

const MONTHS   = ['January','February','March','April','May','June','July','August','September','October','November','December']
const DAY_HDRS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']

export default function CalendarPicker({ label, value, onChange }) {
  const today   = new Date()
  const minYear = today.getFullYear() - 2

  const parsed = value ? new Date(value) : null
  const [view, setView] = useState({
    month: parsed ? parsed.getMonth()    : today.getMonth(),
    year:  parsed ? parsed.getFullYear() : today.getFullYear(),
  })

  function prevMonth() {
    setView(v => v.month === 0 ? { month: 11, year: v.year - 1 } : { ...v, month: v.month - 1 })
  }
  function nextMonth() {
    setView(v => v.month === 11 ? { month: 0, year: v.year + 1 } : { ...v, month: v.month + 1 })
  }

  const canPrev = !(view.month === 0  && view.year <= minYear)
  const canNext = !(view.month === today.getMonth() && view.year >= today.getFullYear())

  function buildGrid() {
    const firstDow    = new Date(view.year, view.month, 1).getDay()
    const daysInMonth = new Date(view.year, view.month + 1, 0).getDate()
    const cells = Array(firstDow).fill(null)
    for (let d = 1; d <= daysInMonth; d++) cells.push(d)
    // pad to complete last row
    while (cells.length % 7 !== 0) cells.push(null)
    return cells
  }

  function isDisabled(d) {
    if (!d) return true
    return new Date(view.year, view.month, d) > today
  }

  function isSelected(d) {
    if (!d || !parsed) return false
    return parsed.getFullYear() === view.year &&
           parsed.getMonth()    === view.month &&
           parsed.getDate()     === d
  }

  function isToday(d) {
    return d === today.getDate() &&
           view.month === today.getMonth() &&
           view.year  === today.getFullYear()
  }

  function select(d) {
    if (isDisabled(d)) return
    const date = new Date(view.year, view.month, d)
    onChange(date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }))
  }

  const years = []
  for (let y = today.getFullYear(); y >= minYear; y--) years.push(y)

  const grid = buildGrid()

  return (
    <div style={{ marginBottom: 20 }}>
      {/* Label */}
      <label style={{ display: 'block', color: '#aaa', fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', fontFamily: mono, marginBottom: 10 }}>
        {label}
      </label>

      {/* Calendar card */}
      <div style={{ background: '#1f1f23', border: `1px solid #3f3f46`, borderRadius: 12, padding: '18px 16px' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <button
            type="button"
            onClick={prevMonth}
            disabled={!canPrev}
            style={{ background: 'none', border: 'none', color: canPrev ? '#ccc' : '#3f3f46', fontSize: 20, cursor: canPrev ? 'pointer' : 'default', lineHeight: 1, padding: '0 4px' }}
          >‹</button>

          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <span style={{ fontFamily: mono, fontSize: 13, fontWeight: 700, color: '#fff', letterSpacing: 1 }}>
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
                padding: '4px 8px',
                cursor: 'pointer',
                outline: 'none',
              }}
            >
              {years.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>

          <button
            type="button"
            onClick={nextMonth}
            disabled={!canNext}
            style={{ background: 'none', border: 'none', color: canNext ? '#ccc' : '#3f3f46', fontSize: 20, cursor: canNext ? 'pointer' : 'default', lineHeight: 1, padding: '0 4px' }}
          >›</button>
        </div>

        {/* Day-of-week headers */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', marginBottom: 6 }}>
          {DAY_HDRS.map(d => (
            <div key={d} style={{ textAlign: 'center', fontFamily: mono, fontSize: 10, color: '#555', letterSpacing: 1, paddingBottom: 6, borderBottom: '1px solid #2e2e32' }}>
              {d}
            </div>
          ))}
        </div>

        {/* Day cells */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px 2px', marginTop: 6 }}>
          {grid.map((d, i) => {
            const sel = isSelected(d)
            const dis = isDisabled(d)
            const tod = isToday(d)
            return (
              <button
                key={i}
                type="button"
                onClick={() => select(d)}
                disabled={!d || dis}
                style={{
                  background:  sel ? Y : 'transparent',
                  color:       !d  ? 'transparent'
                             : sel ? '#111'
                             : dis ? '#3a3a3e'
                             : tod ? Y
                             :       '#e0e0e0',
                  border:      tod && !sel ? `1px solid ${Y}` : '1px solid transparent',
                  borderRadius: 8,
                  padding:     '9px 0',
                  fontFamily:  mono,
                  fontSize:    13,
                  fontWeight:  sel || tod ? 700 : 400,
                  cursor:      d && !dis ? 'pointer' : 'default',
                  textAlign:   'center',
                  transition:  'background 0.12s, color 0.12s',
                }}
                onMouseEnter={e => { if (d && !dis && !sel) e.currentTarget.style.background = '#2c2c30' }}
                onMouseLeave={e => { if (!sel) e.currentTarget.style.background = 'transparent' }}
              >
                {d || ''}
              </button>
            )
          })}
        </div>

        {/* Selected date display */}
        {value && (
          <div style={{ marginTop: 14, paddingTop: 12, borderTop: '1px solid #2e2e32', fontFamily: mono, fontSize: 11, color: Y, letterSpacing: 1, textAlign: 'center' }}>
            {value}
          </div>
        )}
      </div>
    </div>
  )
}
