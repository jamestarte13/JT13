import { useState, useEffect, useRef } from 'react'
import { Y, mono } from './tokens'
import { Lbl } from './UI'

const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_PLACES_API_KEY

// Fallback suggestions when Google API is not configured
const NYC_FALLBACK = [
  '42nd St & 5th Ave, Manhattan, NY',
  'Broadway & Canal St, Manhattan, NY',
  '5th Ave & 34th St, Manhattan, NY',
  'Flatbush Ave & Atlantic Ave, Brooklyn, NY',
  'Jamaica Ave & Sutphin Blvd, Queens, NY',
  'Grand Concourse & 161st St, Bronx, NY',
  'Hylan Blvd & Victory Blvd, Staten Island, NY',
  'Park Ave & 86th St, Manhattan, NY',
  'Lexington Ave & 59th St, Manhattan, NY',
  '8th Ave & 14th St, Manhattan, NY',
]

function loadGoogleMaps() {
  if (window.google?.maps?.places) return Promise.resolve()
  if (!GOOGLE_API_KEY) return Promise.reject(new Error('No API key'))
  return new Promise((resolve, reject) => {
    const existing = document.getElementById('google-maps-script')
    if (existing) { existing.addEventListener('load', resolve); return }
    const script = document.createElement('script')
    script.id = 'google-maps-script'
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_API_KEY}&libraries=places`
    script.async = true
    script.defer = true
    script.onload = resolve
    script.onerror = reject
    document.head.appendChild(script)
  })
}

export default function AddressAutocomplete({ label, value, onChange }) {
  const [query, setQuery]       = useState(value || '')
  const [suggestions, setSugg]  = useState([])
  const [focused, setFocused]   = useState(false)
  const [showList, setShowList] = useState(false)
  const [useGoogle, setUseGoogle] = useState(false)
  const containerRef = useRef(null)
  const sessionToken = useRef(null)

  useEffect(() => {
    loadGoogleMaps()
      .then(() => {
        setUseGoogle(true)
        sessionToken.current = new window.google.maps.places.AutocompleteSessionToken()
      })
      .catch(() => setUseGoogle(false))
  }, [])

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

    if (useGoogle && window.google?.maps?.places) {
      const service = new window.google.maps.places.AutocompleteService()
      service.getPlacePredictions(
        {
          input: q,
          sessionToken: sessionToken.current,
          componentRestrictions: { country: 'us' },
          // Restrict to NYC boroughs
          bounds: new window.google.maps.LatLngBounds(
            { lat: 40.477399, lng: -74.25909 },
            { lat: 40.917577, lng: -73.700272 }
          ),
          types: ['address', 'route', 'intersection'],
        },
        (predictions, status) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
            setSugg(predictions.map(p => p.description))
          } else {
            setSugg([])
          }
        }
      )
    } else {
      // Fallback: filter from static list
      setSugg(
        NYC_FALLBACK.filter(s => s.toLowerCase().includes(q.toLowerCase())).slice(0, 6)
      )
    }
  }

  const handleChange = e => {
    const v = e.target.value
    setQuery(v)
    onChange(v)
    fetchSuggestions(v)
    setShowList(true)
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
              style={{ padding: '12px 16px', color: '#ccc', fontSize: 14, fontFamily: mono, cursor: 'pointer', borderTop: i > 0 ? '1px solid #222' : 'none' }}
              onMouseEnter={e => (e.currentTarget.style.background = '#252525')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              📍 {s}
            </div>
          ))}
          <div
            onMouseDown={() => pick(query)}
            style={{ padding: '12px 16px', color: '#666', fontSize: 13, fontFamily: mono, cursor: 'pointer', borderTop: '1px solid #222', fontStyle: 'italic' }}
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
