import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import AppealPage from './pages/AppealPage'
import DashboardPage from './pages/DashboardPage'
import PrivacyPage from './pages/PrivacyPage'
import TermsPage from './pages/TermsPage'

export default function App() {
  return (
    <BrowserRouter>
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
