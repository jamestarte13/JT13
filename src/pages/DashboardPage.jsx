import { useState, useEffect } from 'react'
import { Y, mono, display, serif } from '../components/tokens'
import { getDashboardStats, getSubmissions } from '../lib/supabase'

// ── Auth gate ─────────────────────────────────────────────────────────────────
const ADMIN_PW = import.meta.env.VITE_ADMIN_PASSWORD || 'admin'

function AuthGate({ onAuth }) {
  const [pw, setPw] = useState('')
  const [err, setErr] = useState(false)
  const [focused, setFocused] = useState(false)

  const attempt = () => {
    if (pw === ADMIN_PW) { onAuth(); return }
    setErr(true)
    setTimeout(() => setErr(false), 2000)
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#0a0a0a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: mono,
      }}
    >
      <div
        style={{
          width: 360,
          background: '#111',
          border: '1px solid #222',
          borderRadius: 12,
          padding: 40,
          textAlign: 'center',
        }}
      >
        <div style={{ fontFamily: display, fontSize: 28, color: '#fff', letterSpacing: 2, marginBottom: 8 }}>
          ADMIN ACCESS
        </div>
        <div style={{ fontFamily: mono, fontSize: 11, color: '#555', letterSpacing: 2, marginBottom: 32 }}>
          NYC APPEALWRITER DASHBOARD
        </div>
        <input
          type="password"
          value={pw}
          onChange={e => setPw(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && attempt()}
          placeholder="Enter password"
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            width: '100%',
            background: '#1a1a1a',
            border: `1px solid ${err ? '#ef4444' : focused ? Y : '#333'}`,
            borderRadius: 8,
            padding: '14px 16px',
            color: '#fff',
            fontSize: 15,
            fontFamily: mono,
            outline: 'none',
            boxSizing: 'border-box',
            marginBottom: 12,
            textAlign: 'center',
            letterSpacing: 4,
          }}
        />
        {err && (
          <div style={{ color: '#ef4444', fontSize: 12, marginBottom: 12, fontFamily: mono }}>
            Incorrect password
          </div>
        )}
        <button
          onClick={attempt}
          style={{
            width: '100%',
            background: Y,
            color: '#111',
            border: 'none',
            borderRadius: 8,
            padding: '14px',
            fontFamily: mono,
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: 2,
            textTransform: 'uppercase',
            cursor: 'pointer',
          }}
        >
          Enter →
        </button>
      </div>
    </div>
  )
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function fmt(n)      { return (n ?? 0).toLocaleString() }
function fmtMoney(n) { return '$' + (n ?? 0).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',') }
function planColor(p){ return p === 'annual' ? Y : p === 'paid' ? '#60a5fa' : '#555' }
function planBg(p)   { return p === 'annual' ? '#1a1a00' : p === 'paid' ? '#0a1a2a' : '#1a1a1a' }

function StatCard({ label, value, sub, accent }) {
  return (
    <div
      style={{
        background: '#111',
        border: `1px solid ${accent ? Y + '44' : '#1e1e1e'}`,
        borderRadius: 8,
        padding: '20px 24px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {accent && (
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: Y }} />
      )}
      <div style={{ fontFamily: mono, fontSize: 10, color: '#555', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 10 }}>
        {label}
      </div>
      <div style={{ fontFamily: display, fontSize: 36, color: accent ? Y : '#fff', letterSpacing: 2, lineHeight: 1, marginBottom: sub ? 8 : 0 }}>
        {value}
      </div>
      {sub && <div style={{ fontFamily: mono, fontSize: 11, color: '#555' }}>{sub}</div>}
    </div>
  )
}

function SectionHeader({ title, sub }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ fontFamily: mono, fontSize: 10, color: Y, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 4 }}>
        {title}
      </div>
      {sub && <div style={{ fontFamily: serif, fontSize: 14, color: '#555' }}>{sub}</div>}
    </div>
  )
}

function HorizBar({ name, count, pct, color = Y }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
        <span style={{ fontFamily: mono, fontSize: 11, color: '#aaa' }}>{name}</span>
        <span style={{ fontFamily: mono, fontSize: 11, color: '#555' }}>
          {fmt(count)} <span style={{ color: '#333' }}>({pct}%)</span>
        </span>
      </div>
      <div style={{ height: 4, background: '#1a1a1a', borderRadius: 2, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 2, transition: 'width 0.5s ease' }} />
      </div>
    </div>
  )
}

function PlanBadge({ plan }) {
  return (
    <span
      style={{
        fontFamily: mono,
        fontSize: 9,
        letterSpacing: 1,
        padding: '3px 7px',
        borderRadius: 3,
        background: planBg(plan),
        color: planColor(plan),
        border: `1px solid ${planColor(plan)}33`,
        textTransform: 'uppercase',
      }}
    >
      {plan}
    </span>
  )
}

function BarChart({ data, valueKey, maxValue }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 120, padding: '0 4px' }}>
      {data.map((d, i) => {
        const h = Math.round((d[valueKey] / maxValue) * 100)
        return (
          <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
            <div style={{ fontFamily: mono, fontSize: 9, color: '#555' }}>{d[valueKey]}</div>
            <div style={{ width: '100%', height: `${h}%`, background: Y, borderRadius: '3px 3px 0 0', opacity: 0.8, minHeight: 4 }} />
            <div style={{ fontFamily: mono, fontSize: 9, color: '#555', letterSpacing: 1 }}>{d.day}</div>
          </div>
        )
      })}
    </div>
  )
}

// ── Tab views ─────────────────────────────────────────────────────────────────
function Overview({ stats }) {
  const weeklyData = [
    { day: 'Mon', letters: 28, revenue: 89 },
    { day: 'Tue', letters: 34, revenue: 134 },
    { day: 'Wed', letters: 41, revenue: 178 },
    { day: 'Thu', letters: 38, revenue: 156 },
    { day: 'Fri', letters: 52, revenue: 234 },
    { day: 'Sat', letters: 61, revenue: 289 },
    { day: 'Sun', letters: 34, revenue: 112 },
  ]
  const maxL = Math.max(...weeklyData.map(d => d.letters))
  const maxR = Math.max(...weeklyData.map(d => d.revenue))

  const boroughData = deriveBoroughBreakdown(stats.submissions)

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
        <StatCard label="Total Letters" value={fmt(stats.totalLetters)} sub={`${fmt(stats.emailsCaptured)} emails captured`} accent />
        <StatCard label="Total Revenue" value={fmtMoney(stats.totalRevenue)} sub="All time" />
        <StatCard label="Annual Subscribers" value={fmt(stats.annualSubscribers)} sub={fmtMoney(stats.arr) + '/yr ARR'} />
        <StatCard label="Conversion Rate" value={stats.conversionRate + '%'} sub="Free → Paid" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
        <StatCard label="MRR" value={fmtMoney(stats.mrr)} sub="Monthly recurring" accent />
        <StatCard label="ARR" value={fmtMoney(stats.arr)} sub="Annual run rate" />
        <StatCard label="Pay Per Letter" value={fmt(stats.paidPerLetter)} sub="One-time buyers" />
        <StatCard label="Free Users" value={fmt(stats.freeUsers)} sub="Potential upsell" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
        <div style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: 8, padding: 24 }}>
          <SectionHeader title="Letters This Week" sub="Daily volume" />
          <BarChart data={weeklyData} valueKey="letters" maxValue={maxL} />
        </div>
        <div style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: 8, padding: 24 }}>
          <SectionHeader title="Revenue This Week" sub="Daily revenue ($)" />
          <BarChart data={weeklyData} valueKey="revenue" maxValue={maxR} />
        </div>
      </div>

      {boroughData.length > 0 && (
        <div style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: 8, padding: 24, marginBottom: 24 }}>
          <SectionHeader title="By Borough" sub="Where tickets are being fought" />
          {boroughData.map(b => (
            <HorizBar key={b.name} name={b.name} count={b.count} pct={b.pct} color={b.color} />
          ))}
        </div>
      )}
    </div>
  )
}

function Submissions({ submissions }) {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('All')

  const filtered = submissions.filter(s => {
    const matchSearch =
      (s.name || '').toLowerCase().includes(search.toLowerCase()) ||
      (s.email || '').toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'All' || s.plan === filter.toLowerCase()
    return matchSearch && matchFilter
  })

  return (
    <div>
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, alignItems: 'center' }}>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name or email..."
          style={{ flex: 1, background: '#111', border: '1px solid #1e1e1e', borderRadius: 8, padding: '10px 14px', color: '#fff', fontFamily: mono, fontSize: 12, outline: 'none' }}
          onFocus={e => (e.target.style.borderColor = Y)}
          onBlur={e => (e.target.style.borderColor = '#1e1e1e')}
        />
        {['All', 'Free', 'Paid', 'Annual'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              background: filter === f ? Y : 'transparent',
              color: filter === f ? '#111' : '#555',
              border: `1px solid ${filter === f ? Y : '#333'}`,
              borderRadius: 6,
              padding: '8px 16px',
              fontFamily: mono,
              fontSize: 11,
              letterSpacing: 1,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            {f}
          </button>
        ))}
      </div>

      <div style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: 8, overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr 1.5fr 1fr 1fr 80px 80px', padding: '12px 20px', borderBottom: '1px solid #1e1e1e', background: '#0d0d0d' }}>
          {['ID', 'Name / Email', 'Violation', 'Defense', 'Borough', 'Amount', 'Plan'].map(h => (
            <div key={h} style={{ fontFamily: mono, fontSize: 9, color: '#444', letterSpacing: 2, textTransform: 'uppercase' }}>{h}</div>
          ))}
        </div>
        {filtered.length === 0 && (
          <div style={{ padding: '40px 20px', textAlign: 'center', color: '#444', fontFamily: mono, fontSize: 12 }}>
            No submissions yet. They will appear here once users generate letters.
          </div>
        )}
        {filtered.map((s, i) => (
          <div
            key={s.id}
            style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr 1.5fr 1fr 1fr 80px 80px', padding: '14px 20px', borderBottom: i < filtered.length - 1 ? '1px solid #161616' : 'none', transition: 'background 0.15s' }}
            onMouseEnter={e => (e.currentTarget.style.background = '#141414')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            <div style={{ fontFamily: mono, fontSize: 11, color: '#555' }}>#{(s.id || '').slice(0, 8)}</div>
            <div>
              <div style={{ fontFamily: mono, fontSize: 12, color: '#ccc', marginBottom: 2 }}>{s.name || '—'}</div>
              <div style={{ fontFamily: mono, fontSize: 10, color: '#444' }}>{s.email}</div>
            </div>
            <div style={{ fontFamily: mono, fontSize: 11, color: '#888' }}>{s.violation_type || '—'}</div>
            <div style={{ fontFamily: mono, fontSize: 10, color: '#666', lineHeight: 1.4 }}>
              {(s.defense_reason || '—').split('—')[0].trim()}
            </div>
            <div style={{ fontFamily: mono, fontSize: 11, color: '#777' }}>{s.borough || '—'}</div>
            <div style={{ fontFamily: mono, fontSize: 12, color: '#fff' }}>${s.fine_amount || 0}</div>
            <div><PlanBadge plan={s.plan || 'free'} /></div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 12, fontFamily: mono, fontSize: 11, color: '#444', textAlign: 'right' }}>
        Showing {filtered.length} of {submissions.length} submissions
      </div>
    </div>
  )
}

function Analytics({ stats }) {
  const violationData = deriveViolationBreakdown(stats.submissions)
  const defenseData   = deriveDefenseBreakdown(stats.submissions)
  const total = stats.totalLetters || 1

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <div style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: 8, padding: 24 }}>
          <SectionHeader title="Top Violations" sub="Most common ticket types" />
          {violationData.length === 0
            ? <div style={{ color: '#444', fontFamily: mono, fontSize: 12 }}>No data yet</div>
            : violationData.map(v => <HorizBar key={v.name} name={v.name} count={v.count} pct={v.pct} />)}
        </div>
        <div style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: 8, padding: 24 }}>
          <SectionHeader title="Top Defenses" sub="Most selected defense reasons" />
          {defenseData.length === 0
            ? <div style={{ color: '#444', fontFamily: mono, fontSize: 12 }}>No data yet</div>
            : defenseData.map(d => <HorizBar key={d.name} name={d.name} count={d.count} pct={d.pct} color="#60a5fa" />)}
        </div>
      </div>

      <div style={{ marginTop: 24, background: '#111', border: '1px solid #1e1e1e', borderRadius: 8, padding: 24 }}>
        <SectionHeader title="Funnel Performance" sub="Where users drop off" />
        {[
          { stage: 'Email Gate Completed',   count: stats.emailsCaptured, color: '#888' },
          { stage: 'Letter Generated',       count: stats.totalLetters,   color: Y },
          { stage: 'Upgraded to Paid',       count: stats.annualSubscribers + stats.paidPerLetter, color: '#4ade80' },
        ].map((s, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 14 }}>
            <div style={{ fontFamily: mono, fontSize: 11, color: '#555', width: 200, flexShrink: 0 }}>{s.stage}</div>
            <div style={{ flex: 1, height: 6, background: '#1a1a1a', borderRadius: 3, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${Math.min(100, (s.count / (stats.emailsCaptured || 1)) * 100)}%`, background: s.color, borderRadius: 3 }} />
            </div>
            <div style={{ fontFamily: mono, fontSize: 11, color: s.color, width: 60, textAlign: 'right' }}>{fmt(s.count)}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function Emails({ stats }) {
  const [search, setSearch] = useState('')
  const subscribers = (stats.subscribers || []).filter(s =>
    (s.email || '').toLowerCase().includes(search.toLowerCase())
  )

  const exportCSV = () => {
    const rows = ['Email,Plan,Letter Count,Joined']
    stats.subscribers.forEach(s => {
      rows.push(`${s.email},${s.plan},${s.letter_count},${s.created_at?.slice(0, 10) || ''}`)
    })
    const blob = new Blob([rows.join('\n')], { type: 'text/csv' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href = url
    a.download = 'appealwriter-emails.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
        <StatCard label="Total Emails"        value={fmt(stats.emailsCaptured)}     accent />
        <StatCard label="Annual Subscribers"  value={fmt(stats.annualSubscribers)}  sub={fmtMoney(stats.arr) + '/yr'} />
        <StatCard label="Pay Per Letter"       value={fmt(stats.paidPerLetter)}      sub="One-time buyers" />
        <StatCard label="Free Only"            value={fmt(stats.freeUsers)}          sub="Potential upsell" />
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search emails..."
          style={{ flex: 1, background: '#111', border: '1px solid #1e1e1e', borderRadius: 8, padding: '10px 14px', color: '#fff', fontFamily: mono, fontSize: 12, outline: 'none' }}
          onFocus={e => (e.target.style.borderColor = Y)}
          onBlur={e => (e.target.style.borderColor = '#1e1e1e')}
        />
        <button
          onClick={exportCSV}
          style={{ background: Y, color: '#111', border: 'none', borderRadius: 8, padding: '10px 20px', fontFamily: mono, fontSize: 11, fontWeight: 700, letterSpacing: 1, cursor: 'pointer' }}
        >
          ↓ Export CSV
        </button>
      </div>

      <div style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: 8, overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 80px 1fr 60px', padding: '12px 20px', borderBottom: '1px solid #1e1e1e', background: '#0d0d0d' }}>
          {['Email', 'Plan', 'Joined', 'Letters'].map(h => (
            <div key={h} style={{ fontFamily: mono, fontSize: 9, color: '#444', letterSpacing: 2, textTransform: 'uppercase' }}>{h}</div>
          ))}
        </div>
        {subscribers.length === 0 && (
          <div style={{ padding: '40px 20px', textAlign: 'center', color: '#444', fontFamily: mono, fontSize: 12 }}>
            No subscribers yet.
          </div>
        )}
        {subscribers.map((s, i) => (
          <div
            key={i}
            style={{ display: 'grid', gridTemplateColumns: '2fr 80px 1fr 60px', padding: '13px 20px', borderBottom: i < subscribers.length - 1 ? '1px solid #161616' : 'none', transition: 'background 0.15s' }}
            onMouseEnter={e => (e.currentTarget.style.background = '#141414')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            <div style={{ fontFamily: mono, fontSize: 12, color: '#ccc' }}>{s.email}</div>
            <div><PlanBadge plan={s.plan || 'free'} /></div>
            <div style={{ fontFamily: mono, fontSize: 11, color: '#555' }}>{s.created_at?.slice(0, 10) || '—'}</div>
            <div style={{ fontFamily: mono, fontSize: 12, color: '#888', textAlign: 'center' }}>{s.letter_count || 0}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Main Dashboard ────────────────────────────────────────────────────────────
const tabs = [
  { id: 'overview',    label: 'Overview',    icon: '◈' },
  { id: 'submissions', label: 'Submissions', icon: '◉' },
  { id: 'analytics',   label: 'Analytics',   icon: '◈' },
  { id: 'emails',      label: 'Emails',      icon: '◎' },
]

function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  const [stats, setStats]         = useState(null)
  const [submissions, setSubmissions] = useState([])
  const [loading, setLoading]     = useState(true)

  useEffect(() => {
    Promise.all([getDashboardStats(), getSubmissions({ limit: 100 })])
      .then(([s, subs]) => {
        setStats(s)
        setSubmissions(subs)
      })
      .catch(() => {
        // Demo mode fallback
        setStats({
          totalLetters: 0, emailsCaptured: 0, annualSubscribers: 0,
          paidPerLetter: 0, freeUsers: 0, totalRevenue: 0,
          mrr: 0, arr: 0, conversionRate: 0, submissions: [], subscribers: [],
        })
      })
      .finally(() => setLoading(false))
  }, [])

  const nowStr = new Date().toLocaleString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric',
    hour: 'numeric', minute: '2-digit', timeZoneName: 'short',
  })

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#fff', fontFamily: mono }}>
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.3}}`}</style>

      {/* Sidebar */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: 220,
          height: '100vh',
          background: '#0d0d0d',
          borderRight: '1px solid #1a1a1a',
          padding: '24px 0',
          zIndex: 100,
        }}
      >
        <div style={{ padding: '0 20px 24px', borderBottom: '1px solid #1a1a1a', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <div style={{ background: Y, color: '#111', fontSize: 9, fontWeight: 700, letterSpacing: 3, padding: '2px 6px', borderRadius: 2 }}>
              NYC
            </div>
            <span style={{ fontFamily: display, fontSize: 16, letterSpacing: 2, color: '#fff' }}>
              APPEALWRITER
            </span>
          </div>
          <div style={{ fontFamily: mono, fontSize: 9, color: '#444', letterSpacing: 2 }}>
            ADMIN DASHBOARD
          </div>
        </div>

        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '12px 20px',
              background: activeTab === t.id ? '#141414' : 'transparent',
              border: 'none',
              borderLeft: `2px solid ${activeTab === t.id ? Y : 'transparent'}`,
              color: activeTab === t.id ? '#fff' : '#444',
              fontFamily: mono,
              fontSize: 12,
              letterSpacing: 1,
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => { if (activeTab !== t.id) e.currentTarget.style.color = '#888' }}
            onMouseLeave={e => { if (activeTab !== t.id) e.currentTarget.style.color = '#444' }}
          >
            <span style={{ color: activeTab === t.id ? Y : '#333', fontSize: 14 }}>{t.icon}</span>
            {t.label}
          </button>
        ))}

        <div style={{ position: 'absolute', bottom: 24, left: 20, right: 20 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 14px',
              background: '#111',
              border: '1px solid #1e1e1e',
              borderRadius: 6,
            }}
          >
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ade80', animation: 'pulse 2s infinite' }} />
            <span style={{ fontFamily: mono, fontSize: 10, color: '#555', letterSpacing: 1 }}>LIVE DATA</span>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div style={{ marginLeft: 220, padding: '32px' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
          <div>
            <div style={{ fontFamily: display, fontSize: 36, color: '#fff', letterSpacing: 2, lineHeight: 1 }}>
              {tabs.find(t => t.id === activeTab)?.label.toUpperCase()}
            </div>
            <div style={{ fontFamily: mono, fontSize: 11, color: '#444', marginTop: 6 }}>
              {loading ? 'Loading data...' : `Last updated: ${nowStr}`}
            </div>
          </div>
          <button
            onClick={() => window.location.reload()}
            style={{ background: 'transparent', border: '1px solid #333', borderRadius: 6, padding: '7px 14px', fontFamily: mono, fontSize: 11, color: '#555', letterSpacing: 1, cursor: 'pointer' }}
          >
            ↺ Refresh
          </button>
        </div>

        {loading && (
          <div style={{ textAlign: 'center', padding: '80px 0', color: '#444', fontFamily: mono, fontSize: 14, letterSpacing: 2 }}>
            LOADING...
          </div>
        )}

        {!loading && stats && (
          <>
            {activeTab === 'overview'    && <Overview stats={stats} />}
            {activeTab === 'submissions' && <Submissions submissions={submissions} />}
            {activeTab === 'analytics'   && <Analytics stats={stats} />}
            {activeTab === 'emails'      && <Emails stats={stats} />}
          </>
        )}
      </div>
    </div>
  )
}

// ── Page with auth gate ───────────────────────────────────────────────────────
export default function DashboardPage() {
  const [authed, setAuthed] = useState(false)
  return authed ? <Dashboard /> : <AuthGate onAuth={() => setAuthed(true)} />
}

// ── Data derivation helpers ───────────────────────────────────────────────────
function deriveViolationBreakdown(submissions = []) {
  const counts = {}
  submissions.forEach(s => { if (s.violation_type) counts[s.violation_type] = (counts[s.violation_type] || 0) + 1 })
  const total = submissions.length || 1
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([name, count]) => ({ name, count, pct: Math.round((count / total) * 100) }))
}

function deriveDefenseBreakdown(submissions = []) {
  const counts = {}
  submissions.forEach(s => { if (s.defense_reason) counts[s.defense_reason] = (counts[s.defense_reason] || 0) + 1 })
  const total = submissions.length || 1
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([name, count]) => ({ name, count, pct: Math.round((count / total) * 100) }))
}

function deriveBoroughBreakdown(submissions = []) {
  const COLORS = { Manhattan: Y, Brooklyn: '#4ade80', Queens: '#60a5fa', Bronx: '#f472b6', 'Staten Island': '#fb923c', Unknown: '#555' }
  const counts = {}
  submissions.forEach(s => { if (s.borough) counts[s.borough] = (counts[s.borough] || 0) + 1 })
  const total = submissions.length || 1
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .map(([name, count]) => ({ name, count, pct: Math.round((count / total) * 100), color: COLORS[name] || '#888' }))
}
