const SENTIMENT_CFG = {
  positive: { color: '#00e676', label: 'POSITIVE', icon: '↑' },
  negative: { color: '#ff1744', label: 'NEGATIVE', icon: '↓' },
  neutral:  { color: '#ffc400', label: 'NEUTRAL',  icon: '→' },
}
const URGENCY_CFG = {
  low:      { color: '#00e676', icon: '●', bg: 'rgba(0,230,118,0.08)' },
  medium:   { color: '#ffc400', icon: '◆', bg: 'rgba(255,196,0,0.08)' },
  high:     { color: '#ff6d00', icon: '▲', bg: 'rgba(255,109,0,0.08)' },
  critical: { color: '#ff1744', icon: '⬟', bg: 'rgba(255,23,68,0.08)'  },
}

function StatCard({ tag, children, accentColor, className = '', delay = 0 }) {
  return (
    <div
      className={`rounded-2xl p-5 border card-hover animate-fade-up flex flex-col gap-3 ${className}`}
      style={{
        background: 'rgba(12,17,25,0.9)',
        borderColor: 'rgba(255,255,255,0.07)',
        borderLeftColor: accentColor,
        borderLeftWidth: '2px',
        animationDelay: `${delay}s`,
      }}
    >
      <p className="font-mono text-[9px] tracking-[3px] uppercase" style={{ color: accentColor }}>
        {tag}
      </p>
      {children}
    </div>
  )
}

export default function ResultPanel({ data }) {
  const { sentiment, topics, urgency, insights } = data
  const sc = SENTIMENT_CFG[sentiment.label] || SENTIMENT_CFG.neutral
  const uc = URGENCY_CFG[urgency.level]     || URGENCY_CFG.low
  const pct = Math.round(sentiment.score * 100)

  return (
    <div className="grid grid-cols-2 gap-4 h-full animate-fade-in">

      {/* ── Sentiment ─────────────────────── */}
      <StatCard tag="// 01 · Sentiment" accentColor={sc.color} delay={0}>
        <div className="flex items-end justify-between">
          <div>
            <span className="text-3xl font-bold tracking-tight" style={{ color: sc.color }}>
              {sc.icon} {sc.label}
            </span>
          </div>
          <span className="font-mono text-4xl font-light" style={{ color: sc.color }}>
            {pct}<span className="text-lg">%</span>
          </span>
        </div>

        {/* Progress bar */}
        <div className="h-1.5 rounded-full bg-white/[0.05] overflow-hidden">
          <div
            className="h-full rounded-full bar-fill"
            style={{ width: `${pct}%`, background: sc.color, boxShadow: `0 0 8px ${sc.color}` }}
          />
        </div>

        <p className="font-mono text-xs leading-relaxed text-[#64748b]">
          {sentiment.explanation}
        </p>
      </StatCard>

      {/* ── Topics ────────────────────────── */}
      <StatCard tag="// 02 · Topics" accentColor="#00e5ff" delay={0.08}>
        <div className="flex flex-col gap-3 flex-1">
          {topics.map((t, i) => (
            <div key={i} className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] text-[#4a5568]">{String(i+1).padStart(2,'0')}</span>
                <span className="text-sm font-semibold text-white">{t.topic}</span>
              </div>
              <div className="flex flex-wrap gap-1.5 pl-6">
                {t.keywords.map((kw, j) => (
                  <span
                    key={j}
                    className="font-mono text-[10px] px-2 py-0.5 rounded-md border"
                    style={{
                      color: '#00e5ff',
                      borderColor: 'rgba(0,229,255,0.2)',
                      background: 'rgba(0,229,255,0.06)',
                    }}
                  >
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </StatCard>

      {/* ── Urgency ───────────────────────── */}
      <StatCard tag="// 03 · Urgency" accentColor={uc.color} delay={0.16}>
        <div
          className="flex items-center gap-4 rounded-xl px-4 py-3"
          style={{ background: uc.bg }}
        >
          <span className="text-3xl" style={{ color: uc.color }}>{uc.icon}</span>
          <div>
            <p className="text-2xl font-bold tracking-widest" style={{ color: uc.color }}>
              {urgency.level.toUpperCase()}
            </p>
          </div>
        </div>
        <p className="font-mono text-xs leading-relaxed text-[#64748b]">{urgency.reason}</p>
      </StatCard>

      {/* ── Insights ──────────────────────── */}
      <StatCard tag="// 04 · Insights" accentColor="#ffc400" delay={0.24}>
        <div className="flex-1 flex flex-col justify-between gap-3">
          <p className="text-sm leading-relaxed text-[#94a3b8] font-light">{insights}</p>
          <div
            className="flex items-center gap-2 rounded-lg px-3 py-2 border mt-auto"
            style={{
              background: 'rgba(255,196,0,0.05)',
              borderColor: 'rgba(255,196,0,0.15)',
            }}
          >
            <span className="text-[#ffc400] text-xs">✦</span>
            <span className="font-mono text-[10px] text-[#ffc400]">AI-generated recommendation</span>
          </div>
        </div>
      </StatCard>

    </div>
  )
}
