const URGENCY_COLOR  = { low: '#00e676', medium: '#ffc400', high: '#ff6d00', critical: '#ff1744' }
const SENTIMENT_ICON  = { positive: '↑', negative: '↓', neutral: '→', uncertain: '?' }
const SENTIMENT_COLOR = { positive: '#00e676', negative: '#ff1744', neutral: '#ffc400', uncertain: '#7c8db0' }

export default function HistoryPanel({ history, activeIndex, onSelect }) {
  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-40 gap-2 opacity-30">
        <span className="text-2xl" style={{ color: 'var(--text-faint)' }}>◷</span>
        <p className="font-mono text-xs" style={{ color: 'var(--text-faint)' }}>No history yet</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      <p className="font-mono text-[9px] tracking-[3px] uppercase mb-1"
         style={{ color: 'var(--text-faint)' }}>
        Recent · {history.length} runs
      </p>

      {history.map((item, i) => {
        const sc       = SENTIMENT_COLOR[item.result.sentiment.label] || '#7c8db0'
        const uc       = URGENCY_COLOR[item.result.urgency.level]
        const si       = SENTIMENT_ICON[item.result.sentiment.label] || '?'
        const isActive = activeIndex === i

        return (
          <button
            key={i}
            onClick={() => onSelect(i)}
            className="w-full text-left rounded-xl px-3 py-2.5 border transition-all duration-200"
            style={{
              background:  isActive ? 'rgba(0,229,255,0.05)' : 'var(--surface)',
              borderColor: isActive ? 'rgba(0,229,255,0.25)' : 'var(--border)',
            }}
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-xs font-bold" style={{ color: sc }}>{si}</span>
              <span className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{ background: uc, boxShadow: `0 0 4px ${uc}` }} />
              <span className="font-mono text-[10px] px-1.5 py-0.5 rounded-md"
                    style={{
                      color:       'var(--cyan)',
                      background:  'rgba(0,229,255,0.07)',
                      border:      '1px solid rgba(0,229,255,0.15)',
                    }}>
                {item.source}
              </span>
              <span className="font-mono text-[10px] ml-auto"
                    style={{ color: 'var(--text-faint)' }}>
                {item.time}
              </span>
            </div>
            <p className="font-mono text-[11px] truncate" style={{ color: 'var(--text-faint)' }}>
              {item.feedback}
            </p>
          </button>
        )
      })}
    </div>
  )
}
