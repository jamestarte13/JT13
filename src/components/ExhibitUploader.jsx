import { useRef } from 'react'
import { mono } from './tokens'

const BLUE   = '#2563eb'
const BLUE_L = '#eff6ff'
const WHITE  = '#ffffff'
const GRAY   = '#f5f5f7'
const TEXT   = '#1d1d1f'
const MUTED  = '#6e6e73'
const BORDER = '#e5e5e7'

export default function ExhibitUploader({ exhibits, onChange }) {
  const fileRef = useRef(null)

  const handleFiles = e => {
    const files = Array.from(e.target.files)
    const newExhibits = files.map((file, i) => ({
      id: Date.now() + i,
      file,
      preview: URL.createObjectURL(file),
      label: file.name.replace(/\.[^/.]+$/, ''),
    }))
    onChange([...exhibits, ...newExhibits])
    e.target.value = ''
  }

  const updateLabel = (id, label) =>
    onChange(exhibits.map(ex => (ex.id === id ? { ...ex, label } : ex)))

  const remove = id => onChange(exhibits.filter(ex => ex.id !== id))

  const letter = i => String.fromCharCode(65 + i)

  return (
    <div style={{ marginBottom: 20 }}>
      <label
        style={{
          display: 'block',
          color: TEXT,
          fontSize: 11,
          letterSpacing: 2,
          textTransform: 'uppercase',
          fontFamily: mono,
          marginBottom: 8,
        }}
      >
        Supporting Evidence / Exhibits{' '}
        <span style={{ color: MUTED, textTransform: 'none', letterSpacing: 0 }}>(optional)</span>
      </label>

      {exhibits.length === 0 && (
        <div
          onClick={() => fileRef.current.click()}
          style={{
            border: `2px dashed ${BORDER}`,
            borderRadius: 10,
            padding: '28px 20px',
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s',
            background: GRAY,
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = BLUE
            e.currentTarget.style.background = BLUE_L
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = BORDER
            e.currentTarget.style.background = GRAY
          }}
        >
          <div style={{ fontSize: 28, marginBottom: 8 }}>📎</div>
          <div style={{ fontFamily: mono, fontSize: 12, color: TEXT, letterSpacing: 1 }}>
            CLICK TO UPLOAD PHOTOS OR DOCUMENTS
          </div>
          <div style={{ fontFamily: 'Georgia, serif', fontSize: 13, color: MUTED, marginTop: 6 }}>
            Signs, meter receipts, repair records, photos of your vehicle
          </div>
        </div>
      )}

      {exhibits.length > 0 && (
        <div style={{ marginBottom: 12 }}>
          {exhibits.map((ex, i) => (
            <div
              key={ex.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                marginBottom: 8,
                background: WHITE,
                border: `1px solid ${BORDER}`,
                borderRadius: 8,
                padding: '10px 12px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 6,
                  overflow: 'hidden',
                  flexShrink: 0,
                  background: GRAY,
                }}
              >
                {ex.file?.type?.startsWith('image/') ? (
                  <img
                    src={ex.preview}
                    alt=""
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 18,
                    }}
                  >
                    📄
                  </div>
                )}
              </div>
              <div style={{ fontFamily: mono, fontSize: 10, color: BLUE, letterSpacing: 2, flexShrink: 0, width: 22 }}>
                {letter(i)}
              </div>
              <input
                value={ex.label}
                onChange={e => updateLabel(ex.id, e.target.value)}
                style={{
                  flex: 1,
                  background: GRAY,
                  border: `1px solid ${BORDER}`,
                  borderRadius: 6,
                  padding: '8px 10px',
                  color: TEXT,
                  fontSize: 12,
                  fontFamily: mono,
                  outline: 'none',
                }}
                onFocus={e => (e.target.style.borderColor = BLUE)}
                onBlur={e => (e.target.style.borderColor = BORDER)}
                placeholder="Describe this exhibit..."
              />
              <button
                onClick={() => remove(ex.id)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: MUTED,
                  cursor: 'pointer',
                  fontSize: 18,
                  padding: '0 4px',
                  flexShrink: 0,
                  lineHeight: 1,
                }}
                onMouseEnter={e => (e.currentTarget.style.color = '#ef4444')}
                onMouseLeave={e => (e.currentTarget.style.color = MUTED)}
              >
                ×
              </button>
            </div>
          ))}
          <button
            onClick={() => fileRef.current.click()}
            style={{
              width: '100%',
              background: 'transparent',
              border: `1px dashed ${BORDER}`,
              borderRadius: 8,
              padding: '10px',
              fontFamily: mono,
              fontSize: 11,
              color: MUTED,
              letterSpacing: 1,
              textTransform: 'uppercase',
              cursor: 'pointer',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = BLUE
              e.currentTarget.style.color = BLUE
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = BORDER
              e.currentTarget.style.color = MUTED
            }}
          >
            + Add Another Exhibit
          </button>
        </div>
      )}

      <input
        ref={fileRef}
        type="file"
        multiple
        accept="image/*,.pdf"
        onChange={handleFiles}
        style={{ display: 'none' }}
      />

      {exhibits.length > 0 && (
        <div
          style={{
            padding: '10px 14px',
            background: BLUE_L,
            border: '1px solid #bfdbfe',
            borderRadius: 8,
            marginTop: 8,
          }}
        >
          <div style={{ fontFamily: mono, fontSize: 11, color: BLUE, letterSpacing: 1 }}>
            ✓ {exhibits.length} exhibit{exhibits.length > 1 ? 's' : ''} will be listed in your
            letter and appended to the PDF
          </div>
        </div>
      )}
    </div>
  )
}
