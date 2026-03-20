import { useState, useEffect, useRef } from 'react'
import { Y, mono } from './tokens'
import { Lbl } from './UI'

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN

export default function AddressAutocomplete({ label, value, onChange }) {
  const [query, setQuery]       = useState(value || '')
  const [suggestions, setSugg]  = useState([])
  const [focused, setFocused]   = useState(false)
  const [showList, setShowList] = useState(false)
  const containerRef = useRef(null)
  const debounceRef  = useRef(null)

  // Close on outside click
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
        if (data.features) {
          setSugg(data.features.map(f => f.place_name))
        }
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
          background: '#1a1a1a',
          border: `1px solid ${focused ? Y : '#333'}`,
          borderRadius: open ? '8px 8px 0 0' : 8,
          padding: '14px 16px',
          color: '#fff',
          fontSize: 15,
          fontFamily: mono,
          outline: 'none',
          boxSizing: 'border-box',
        }}
      />
      {open && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            background: '#1a1a1a',
            border: `1px solid ${Y}`,
            borderTop: 'none',
            borderRadius: '0 0 8px 8px',
            zIndex: 100,
            overflow: 'hidden',
          }}
        >
          {suggestions.map((s, i) => (
            <div
              key={i}
              onMouseDown={() => pick(s)}
              style={{ padding: '12px 16px', color: '#ffffff', fontSize: 14, fontFamily: mono, cursor: 'pointer', borderTop: i > 0 ? '1px solid #222' : 'none' }}
              onMouseEnter={e => (e.currentTarget.style.background = '#252525')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              📍 {s}
            </div>
          ))}
          <div
            onMouseDown={() => pick(query)}
            style={{ padding: '12px 16px', color: '#ffffff', fontSize: 13, fontFamily: mono, cursor: 'pointer', borderTop: '1px solid #222', fontStyle: 'italic' }}
            onMouseEnter={e => (e.currentTarget.style.background = '#252525')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            ✏️ Use &ldquo;{query}&rdquo; as entered
          </div>
        </div>
      )}
    </div>
  )
}
