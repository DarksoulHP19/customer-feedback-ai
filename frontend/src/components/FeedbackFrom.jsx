import { useState } from 'react'

const SOURCES = ['form', 'email', 'chat', 'twitter', 'review', 'support']

export default function FeedbackForm({ onSubmit, loading }) {
  const [feedback, setFeedback] = useState('')
  const [source, setSource]     = useState('form')

  const handleSubmit = () => {
    if (!feedback.trim() || loading) return
    onSubmit({ feedback, source })
  }

  const charCount = feedback.length

  return (
    <div className="flex flex-col gap-4 h-full">

      {/* Section label */}
      <div className="flex items-center justify-between">
        <div>
          <p className="font-mono text-[10px] tracking-[3px] text-[#00e5ff] uppercase mb-0.5">Input</p>
          <h2 className="text-base font-semibold text-white">Submit Feedback</h2>
        </div>
        <select
          value={source}
          onChange={e => setSource(e.target.value)}
          disabled={loading}
          className="bg-[#0c1119] border border-white/[0.07] rounded-lg text-[#94a3b8]
                     font-mono text-xs px-3 py-1.5 outline-none cursor-pointer
                     hover:border-white/20 transition-colors disabled:opacity-50"
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
          onChange={e => setFeedback(e.target.value)}
          disabled={loading}
          placeholder="Paste or type customer feedback here..."
          className="flex-1 w-full bg-[#0a0f1a] border border-white/[0.07] rounded-xl
                     text-[#e2e8f0] font-mono text-[13px] placeholder-[#2d3748]
                     p-4 resize-none outline-none leading-relaxed
                     focus:border-[rgba(0,229,255,0.3)] focus:shadow-[0_0_0_1px_rgba(0,229,255,0.1)]
                     transition-all duration-200 disabled:opacity-40"
          style={{ minHeight: '200px' }}
        />
        <div className="absolute bottom-3 right-3 font-mono text-[10px] text-[#2d3748]">
          {charCount} chars
        </div>
      </div>

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={loading || !feedback.trim()}
        className="w-full flex items-center justify-center gap-2.5 py-3 rounded-xl font-semibold text-sm
                   border border-[#00e5ff] text-[#00e5ff] bg-[rgba(0,229,255,0.06)]
                   hover:bg-[rgba(0,229,255,0.12)] hover:shadow-[0_0_24px_rgba(0,229,255,0.2)]
                   disabled:opacity-30 disabled:cursor-not-allowed
                   transition-all duration-200 animate-pulse-glow"
      >
        {loading ? (
          <>
            <span className="w-4 h-4 border-2 border-[rgba(0,229,255,0.2)] border-t-[#00e5ff]
                             rounded-full animate-spin-slow" />
            <span>Analyzing...</span>
          </>
        ) : (
          <>
            <span className="text-base">⚡</span>
            <span>Run Pipeline</span>
          </>
        )}
      </button>

      {/* Pipeline steps */}
      <div className="grid grid-cols-4 gap-1.5">
        {['Sentiment','Topics','Urgency','Insights'].map((step, i) => (
          <div key={step}
            className={`rounded-lg py-1.5 px-1 text-center font-mono text-[9px] tracking-wider
                        border transition-all duration-300
                        ${loading
                          ? 'border-[rgba(0,229,255,0.3)] text-[#00e5ff] bg-[rgba(0,229,255,0.05)]'
                          : 'border-white/[0.05] text-[#2d3748]'}`}
            style={{ animationDelay: loading ? `${i * 0.15}s` : '0s' }}
          >
            {step.toUpperCase()}
          </div>
        ))}
      </div>
    </div>
  )
}
