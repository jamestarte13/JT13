import { useState, useEffect, useRef } from 'react'
import { mono } from './tokens'
import { Lbl } from './UI'

const BLUE   = '#2563eb'
const WHITE  = '#ffffff'
const GRAY   = '#f5f5f7'
const TEXT   = '#1d1d1f'
const BORDER = '#e5e5e7'

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN

export default function AddressAutocomplete({ label, value, onChange }) {
  const [query, setQuery]       = useState(value || '')
  const [suggestions, setSugg]  = useState([])
  const [focused, setFocused]   = useState(false)
  const [showList, setShowList] = useState(false)
  const containerRef = useRef(null)
  const debounceRef  = useRef(null)

  useEffect(() => {
    const handler = e => {
      if (containerRef.current && !containerRef.current.contains(e.target))
        setShowList(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const fetchSuggestions = q => {
    if (!q || q.length < 2) { setSugg([]); return }
    if (!MAPBOX_TOKEN) { setSugg([]); return }

    const encoded = encodeURIComponent(q)
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encoded}.json` +
      `?access_token=${MAPBOX_TOKEN}` +
      `&bbox=-74.25909,40.477399,-73.700272,40.917577` +
      `&types=address` +
      `&limit=6` +
      `&country=US`

    fetch(url)
      .then(r => r.json())
      .then(data => {
        if (data.features) setSugg(data.features.map(f => f.place_name))
      })
      .catch(() => setSugg([]))
  }

  const handleChange = e => {
    const v = e.target.value
    setQuery(v)
    onChange(v)
    setShowList(true)
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => fetchSuggestions(v), 300)
  }

  const pick = v => {
    setQuery(v)
    onChange(v)
    setShowList(false)
  }

  const open = showList && (suggestions.length > 0 || query.length >= 2)

  return (
    <div style={{ marginBottom: 20, position: 'relative' }} ref={containerRef}>
      <Lbl>{label}</Lbl>
      <input
        type="text"
        value={query}
        onChange={handleChange}
        onFocus={() => { setFocused(true); if (query.length >= 2) setShowList(true) }}
        onBlur={() => setFocused(false)}
        placeholder="Start typing a street or intersection..."
        style={{
          width: '100%',
          background: WHITE,
          border: `1px solid ${focused ? BLUE : BORDER}`,
          borderRadius: open ? '8px 8px 0 0' : 8,
          padding: '14px 16px',
          color: TEXT,
          fontSize: 15,
          fontFamily: mono,
          outline: 'none',
          boxSizing: 'border-box',
          transition: 'border-color 0.2s',
        }}
      />
      {open && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            background: WHITE,
            border: `1px solid ${BLUE}`,
            borderTop: 'none',
            borderRadius: '0 0 8px 8px',
            zIndex: 100,
            overflow: 'hidden',
            boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
          }}
        >
          {suggestions.map((s, i) => (
            <div
              key={i}
              onMouseDown={() => pick(s)}
              style={{
                padding: '12px 16px',
                color: TEXT,
                fontSize: 14,
                fontFamily: mono,
                cursor: 'pointer',
                borderTop: i > 0 ? `1px solid ${BORDER}` : 'none',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = GRAY)}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              📍 {s}
            </div>
          ))}
          <div
            onMouseDown={() => pick(query)}
            style={{
              padding: '12px 16px',
              color: '#6e6e73',
              fontSize: 13,
              fontFamily: mono,
              cursor: 'pointer',
              borderTop: `1px solid ${BORDER}`,
              fontStyle: 'italic',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = GRAY)}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            ✏️ Use &ldquo;{query}&rdquo; as entered
          </div>
        </div>
      )}
    </div>
  )
}
