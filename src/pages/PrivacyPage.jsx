import { useNavigate } from 'react-router-dom'
import { Y, BG, mono, display, serif } from '../components/tokens'

export default function PrivacyPage() {
  const navigate = useNavigate()
  return (
    <div style={{ background: BG, minHeight: '100vh', color: '#fff', fontFamily: mono }}>
      {/* Nav */}
      <nav style={{ borderBottom: '1px solid #1e1e1e', padding: '0 32px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 60 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }} onClick={() => navigate('/')}>
            <div style={{ background: Y, color: '#111', fontSize: 10, fontWeight: 700, letterSpacing: 3, padding: '3px 8px', borderRadius: 3 }}>NYC</div>
            <span style={{ fontFamily: display, fontSize: 20, letterSpacing: 2 }}>APPEALWRITER</span>
          </div>
          <button onClick={() => navigate(-1)} style={{ background: 'transparent', border: '1px solid #333', borderRadius: 6, padding: '8px 14px', color: '#666', fontFamily: mono, fontSize: 11, letterSpacing: 1, cursor: 'pointer' }}>← Back</button>
        </div>
      </nav>

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '60px 32px' }}>
        <div style={{ fontFamily: mono, fontSize: 11, color: Y, letterSpacing: 4, marginBottom: 14 }}>LEGAL</div>
        <h1 style={{ fontFamily: display, fontSize: 56, color: '#fff', letterSpacing: 2, marginBottom: 16, lineHeight: 1 }}>PRIVACY POLICY</h1>
        <div style={{ fontFamily: mono, fontSize: 11, color: '#555', marginBottom: 48, letterSpacing: 1 }}>Effective Date: January 1, 2026</div>

        {[
          {
            title: 'Information We Collect',
            body: `We collect the following information when you use NYC Appeal Writer:\n\n• Email address (required to access the letter generator)\n• Parking ticket details you enter: ticket number, violation date, location, violation type, fine amount, plate number\n• Defense reason and any additional details you provide\n• Supporting exhibit files you upload\n\nWe do not collect your name unless you voluntarily enter it in the letter generator.`,
          },
          {
            title: 'How We Use Your Information',
            body: `We use your information to:\n\n• Generate your parking ticket appeal letter\n• Send you a copy of your completed letter via email\n• Track your letter count to apply the correct pricing tier\n• Process payments via Stripe (for paid letters)\n• Improve the service through aggregated, anonymized analytics`,
          },
          {
            title: 'Data Storage',
            body: `Your data is stored securely in Supabase, a cloud database provider. Your ticket information and generated letters are retained to allow you to access your submission history. You may request deletion of your data at any time by emailing us.`,
          },
          {
            title: 'Payments',
            body: `Payment processing is handled entirely by Stripe. We do not store your credit card information. Stripe's privacy policy governs how your payment data is handled.`,
          },
          {
            title: 'Data Sharing',
            body: `We do not sell, rent, or share your personal information with third parties for marketing purposes. We may share data with service providers (Supabase, Stripe, Resend) solely to operate the service.`,
          },
          {
            title: 'Email Communications',
            body: `By providing your email, you consent to receive a copy of your appeal letter and occasional product updates. You may unsubscribe at any time using the link in any email we send.`,
          },
          {
            title: 'Not Legal Advice',
            body: `NYC Appeal Writer provides informational tools only. Nothing on this site constitutes legal advice. We are not a law firm. You should review your appeal letter before submitting it.`,
          },
          {
            title: 'Contact',
            body: `For privacy requests or questions, email: privacy@nycappealwriter.com`,
          },
        ].map(s => (
          <div key={s.title} style={{ marginBottom: 40 }}>
            <h2 style={{ fontFamily: display, fontSize: 28, color: '#fff', letterSpacing: 1, marginBottom: 16 }}>{s.title}</h2>
            <p style={{ fontFamily: serif, fontSize: 17, color: '#777', lineHeight: 1.8, whiteSpace: 'pre-line' }}>{s.body}</p>
          </div>
        ))}
      </div>

      <footer style={{ borderTop: '1px solid #1a1a1a', padding: '24px 32px', textAlign: 'center' }}>
        <div style={{ fontFamily: mono, fontSize: 11, color: '#333', letterSpacing: 1 }}>
          © 2026 NYC Appeal Writer. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
