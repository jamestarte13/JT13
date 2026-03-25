import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import AppealPage from './pages/AppealPage'
import DashboardPage from './pages/DashboardPage'
import PrivacyPage from './pages/PrivacyPage'
import TermsPage from './pages/TermsPage'

function PreviewBadge() {
  return (
    <div style={{
      position: 'fixed',
      bottom: 16,
      right: 16,
      background: '#111',
      color: '#fff',
      fontSize: 11,
      fontFamily: 'monospace',
      padding: '5px 10px',
      borderRadius: 6,
      zIndex: 9999,
      opacity: 0.75,
      letterSpacing: 0.8,
      pointerEvents: 'none',
      userSelect: 'none',
    }}>
      PREVIEW MODE
    </div>
  )
}

export default function App() {
  const [previewMode, setPreviewMode] = useState(() => sessionStorage.getItem('preview') === 'true')

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('preview') === 'true') {
      sessionStorage.setItem('preview', 'true')
      setPreviewMode(true)
    }
  }, [])

  return (
    <BrowserRouter>
      {previewMode && <PreviewBadge />}
      <Routes>
        <Route path="/"          element={<LandingPage />} />
        <Route path="/appeal"    element={<AppealPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/privacy"   element={<PrivacyPage />} />
        <Route path="/terms"     element={<TermsPage />} />
      </Routes>
    </BrowserRouter>
  )
}
