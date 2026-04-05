import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, useNavigate, useLocation, useSearchParams } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import DisputePage from './pages/DisputePage'
import DashboardPage from './pages/DashboardPage'
import PrivacyPage from './pages/PrivacyPage'
import TermsPage from './pages/TermsPage'

const PREVIEW_SCREENS = [
  { key: 'home',    label: 'Home' },
  { key: 'form',    label: 'Form' },
  { key: 'payment', label: 'Payment Gate' },
  { key: 'result',  label: 'Result' },
]

function PreviewNav() {
  const navigate = useNavigate()
  const location = useLocation()

  const isDispute = location.pathname === '/dispute'
  const params = new URLSearchParams(location.search)
  const goto = params.get('goto')

  let current = 'home'
  if (isDispute) {
    current = goto || 'form'
  }

  const handleJump = key => {
    if (key === 'home') navigate('/')
    else navigate(`/dispute?preview=true&goto=${key}`)
  }

  return (
    <div style={{
      position: 'fixed', bottom: 20, left: '50%', transform: 'translateX(-50%)',
      background: '#111', borderRadius: 12, padding: '10px 16px',
      display: 'flex', alignItems: 'center', gap: 8, zIndex: 9999,
      boxShadow: '0 4px 24px rgba(0,0,0,0.35)',
    }}>
      <span style={{ color: '#666', fontSize: 10, fontFamily: 'monospace', letterSpacing: 1, marginRight: 4 }}>PREVIEW</span>
      {PREVIEW_SCREENS.map(s => (
        <button key={s.key} onClick={() => handleJump(s.key)} style={{
          background: current === s.key ? '#2563eb' : '#222',
          color: current === s.key ? '#fff' : '#888',
          border: 'none', borderRadius: 6, padding: '6px 12px',
          fontSize: 11, fontFamily: 'monospace', cursor: 'pointer',
          whiteSpace: 'nowrap', letterSpacing: 0.5,
        }}>
          {s.label}
        </button>
      ))}
    </div>
  )
}

function AppInner() {
  const [searchParams] = useSearchParams()
  const [previewMode, setPreviewMode] = useState(() => sessionStorage.getItem('preview') === 'true')

  useEffect(() => {
    if (searchParams.get('preview') === 'true') {
      sessionStorage.setItem('preview', 'true')
      setPreviewMode(true)
    }
  }, [searchParams])

  return (
    <>
      {previewMode && <PreviewNav />}
      <Routes>
        <Route path="/"          element={<LandingPage />} />
        <Route path="/dispute"   element={<DisputePage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/privacy"   element={<PrivacyPage />} />
        <Route path="/terms"     element={<TermsPage />} />
      </Routes>
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppInner />
    </BrowserRouter>
  )
}
