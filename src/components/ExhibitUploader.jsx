import { useRef } from 'react'
import { Y, mono } from './tokens'

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
          color: '#ffffff',
          fontSize: 11,
          letterSpacing: 2,
          textTransform: 'uppercase',
          fontFamily: mono,
          marginBottom: 8,
        }}
      >
        Supporting Evidence / Exhibits{' '}
        <span style={{ color: '#ffffff', textTransform: 'none', letterSpacing: 0 }}>(optional)</span>
      </label>

      {exhibits.length === 0 && (
        <div
          onClick={() => fileRef.current.click()}
          style={{
            border: '2px dashed #2a2a2a',
            borderRadius: 10,
            padding: '28px 20px',
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = Y
            e.currentTarget.style.background = '#111'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = '#2a2a2a'
            e.currentTarget.style.background = 'transparent'
          }}
        >
          <div style={{ fontSize: 28, marginBottom: 8 }}>📎</div>
          <div style={{ fontFamily: mono, fontSize: 12, color: '#ffffff', letterSpacing: 1 }}>
            CLICK TO UPLOAD PHOTOS OR DOCUMENTS
          </div>
          <div style={{ fontFamily: 'Georgia, serif', fontSize: 13, color: '#ffffff', marginTop: 6 }}>
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
                background: '#161616',
                border: '1px solid #2a2a2a',
                borderRadius: 8,
                padding: '10px 12px',
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 6,
                  overflow: 'hidden',
                  flexShrink: 0,
                  background: '#222',
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
                      color: '#666',
                      fontSize: 18,
                    }}
                  >
                    📄
                  </div>
                )}
              </div>
              <div style={{ fontFamily: mono, fontSize: 10, color: Y, letterSpacing: 2, flexShrink: 0, width: 22 }}>
                {letter(i)}
              </div>
              <input
                value={ex.label}
                onChange={e => updateLabel(ex.id, e.target.value)}
                style={{
                  flex: 1,
                  background: '#1a1a1a',
                  border: '1px solid #333',
                  borderRadius: 6,
                  padding: '8px 10px',
                  color: '#ffffff',
                  fontSize: 12,
                  fontFamily: mono,
                  outline: 'none',
                }}
                onFocus={e => (e.target.style.borderColor = Y)}
                onBlur={e => (e.target.style.borderColor = '#333')}
                placeholder="Describe this exhibit..."
              />
              <button
                onClick={() => remove(ex.id)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#ffffff',
                  cursor: 'pointer',
                  fontSize: 16,
                  padding: '0 4px',
                  flexShrink: 0,
                }}
                onMouseEnter={e => (e.currentTarget.style.color = '#ef4444')}
                onMouseLeave={e => (e.currentTarget.style.color = '#ffffff')}
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
              border: '1px dashed #333',
              borderRadius: 8,
              padding: '10px',
              fontFamily: mono,
              fontSize: 11,
              color: '#ffffff',
              letterSpacing: 1,
              textTransform: 'uppercase',
              cursor: 'pointer',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = Y
              e.currentTarget.style.color = Y
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = '#333'
              e.currentTarget.style.color = '#ffffff'
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
            background: '#0f1a00',
            border: '1px solid #1a3a00',
            borderRadius: 8,
            marginTop: 8,
          }}
        >
          <div style={{ fontFamily: mono, fontSize: 11, color: '#a3e635', letterSpacing: 1 }}>
            ✓ {exhibits.length} exhibit{exhibits.length > 1 ? 's' : ''} will be listed in your
            letter and appended to the PDF
          </div>
        </div>
      )}
    </div>
  )
}
