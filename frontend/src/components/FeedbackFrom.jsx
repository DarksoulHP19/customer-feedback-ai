import { useState } from 'react'
import { useTheme } from '../context/ThemeContext'

const SOURCES   = ['form', 'email', 'chat', 'twitter', 'review', 'support']
const MIN_CHARS = 20
const MAX_CHARS = 2000

export default function FeedbackForm({ onSubmit, loading }) {
  const { isDark }              = useTheme()
  const [feedback, setFeedback] = useState('')
  const [source, setSource]     = useState('form')
  const [touched, setTouched]   = useState(false)

  const charCount  = feedback.length
  const isTooShort = charCount > 0 && charCount < MIN_CHARS
  const isTooLong  = charCount > MAX_CHARS
  const isValid    = charCount >= MIN_CHARS && charCount <= MAX_CHARS
  const remaining  = MAX_CHARS - charCount

  // Enhancement #10 — character limit status
  const getCharStatus = () => {
    if (charCount === 0)   return { msg: `Min ${MIN_CHARS} characters`,   color: 'var(--text-faint)' }
    if (isTooShort)        return { msg: `Too short — ${MIN_CHARS - charCount} more needed`, color: 'var(--amber)' }
    if (remaining <= 200)  return { msg: `${remaining} remaining`,        color: remaining <= 50 ? 'var(--red)' : 'var(--amber)' }
    if (isTooLong)         return { msg: `Too long — remove ${charCount - MAX_CHARS} chars`, color: 'var(--red)' }
    return { msg: `${charCount} / ${MAX_CHARS}`, color: 'var(--text-faint)' }
  }

  const charStatus = getCharStatus()

  const handleSubmit = () => {
    setTouched(true)
    if (!isValid || loading) return
    onSubmit({ feedback, source })
  }

  const getBorderColor = () => {
    if (!touched && charCount === 0) return 'var(--border)'
    if (isTooShort || isTooLong)     return 'var(--amber)'
    if (isValid)                     return 'rgba(0,229,255,0.3)'
    return 'var(--border)'
  }

  return (
    <div className="flex flex-col gap-4 h-full">

      <div className="flex items-center justify-between">
        <div>
          <p className="font-mono text-[10px] tracking-[3px] uppercase mb-0.5"
             style={{ color: 'var(--cyan)' }}>Input</p>
          <h2 className="text-base font-semibold" style={{ color: 'var(--text)' }}>
            Submit Feedback
          </h2>
        </div>
        <select
          value={source}
          onChange={e => setSource(e.target.value)}
          disabled={loading}
          className="rounded-lg font-mono text-xs px-3 py-1.5 outline-none cursor-pointer
                     disabled:opacity-50 transition-colors"
          style={{
            background:   'var(--bg2)',
            border:       '1px solid var(--border)',
            color:        'var(--text-muted)',
          }}
        >
          {SOURCES.map(s => (
            <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
          ))}
        </select>
      </div>

      {/* Textarea */}
      <div className="relative flex-1 flex flex-col">
        <textarea
          value={feedback}
          onChange={e => { setFeedback(e.target.value); setTouched(true) }}
          onBlur={() => setTouched(true)}
          disabled={loading}
          placeholder="Paste or type customer feedback here..."
          className="flex-1 w-full rounded-xl font-mono text-[13px]
                     p-4 resize-none outline-none leading-relaxed
                     disabled:opacity-40 transition-all duration-200"
          style={{
            background:   'var(--bg)',
            border:       `1px solid ${getBorderColor()}`,
            color:        'var(--text)',
            minHeight:    'clamp(120px, 30vh, 200px)',
          }}
        />

        {/* Enhancement #10 — char count + warning */}
        <div className="absolute bottom-3 right-3 font-mono text-[10px]"
             style={{ color: charStatus.color }}>
          {charStatus.msg}
        </div>
      </div>

      {/* Inline warning banners */}
      {touched && isTooShort && (
        <div className="rounded-lg px-3 py-2 font-mono text-[11px] flex items-center gap-2"
             style={{ background: 'rgba(255,196,0,0.06)', border: '1px solid rgba(255,196,0,0.2)', color: 'var(--amber)' }}>
          ⚠ Feedback too short — please provide more detail for accurate analysis.
        </div>
      )}

      {touched && isTooLong && (
        <div className="rounded-lg px-3 py-2 font-mono text-[11px] flex items-center gap-2"
             style={{ background: 'rgba(255,23,68,0.06)', border: '1px solid rgba(255,23,68,0.2)', color: 'var(--red)' }}>
          ✕ Feedback too long — please shorten to {MAX_CHARS} characters max.
        </div>
      )}

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={loading || !isValid}
        className="w-full flex items-center justify-center gap-2.5 py-3 rounded-xl
                   font-semibold text-sm border transition-all duration-200 animate-pulse-glow
                   disabled:opacity-30 disabled:cursor-not-allowed"
        style={{
          color:       'var(--cyan)',
          borderColor: 'var(--cyan)',
          background:  'rgba(0,229,255,0.06)',
        }}
      >
        {loading ? (
          <>
            <span className="w-4 h-4 border-2 rounded-full animate-spin-slow"
                  style={{ borderColor: 'rgba(0,229,255,0.2)', borderTopColor: 'var(--cyan)' }} />
            <span>Analyzing...</span>
          </>
        ) : (
          <><span>⚡</span><span>Run Pipeline</span></>
        )}
      </button>

      {/* Pipeline steps */}
      <div className="grid grid-cols-4 gap-1.5">
        {['Sentiment','Topics','Urgency','Insights'].map((step, i) => (
          <div key={step}
            className="rounded-lg py-1.5 px-1 text-center font-mono text-[9px]
                       tracking-wider border transition-all duration-300"
            style={{
              color:        loading ? 'var(--cyan)'  : 'var(--text-faint)',
              borderColor:  loading ? 'rgba(0,229,255,0.3)' : 'var(--border)',
              background:   loading ? 'rgba(0,229,255,0.05)' : 'transparent',
              animationDelay: `${i * 0.15}s`,
            }}
          >
            {step.toUpperCase()}
          </div>
        ))}
      </div>
    </div>
  )
}
