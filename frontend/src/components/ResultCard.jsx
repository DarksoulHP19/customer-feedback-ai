import { useState } from 'react'

const SENTIMENT_CFG = {
  positive:  { color: '#00e676', label: 'POSITIVE',  icon: '↑' },
  negative:  { color: '#ff1744', label: 'NEGATIVE',  icon: '↓' },
  neutral:   { color: '#ffc400', label: 'NEUTRAL',   icon: '→' },
  uncertain: { color: '#7c8db0', label: 'UNCERTAIN', icon: '?' },
}
const URGENCY_CFG = {
  low:      { color: '#00e676', icon: '●', bg: 'rgba(0,230,118,0.08)'  },
  medium:   { color: '#ffc400', icon: '◆', bg: 'rgba(255,196,0,0.08)'  },
  high:     { color: '#ff6d00', icon: '▲', bg: 'rgba(255,109,0,0.08)'  },
  critical: { color: '#ff1744', icon: '⬟', bg: 'rgba(255,23,68,0.08)'  },
}

function ConfidenceBadge({ score }) {
  const pct = score * 100
  let label, color, bg

  if (pct >= 80) {
    label = 'HIGH CONFIDENCE'; color = '#00e676'; bg = 'rgba(0,230,118,0.1)'
  } else if (pct >= 50) {
    label = 'MED CONFIDENCE';  color = '#ffc400'; bg = 'rgba(255,196,0,0.1)'
  } else {
    label = 'LOW CONFIDENCE';  color = '#ff6d00'; bg = 'rgba(255,109,0,0.1)'
  }

  return (
    <span className="font-mono text-[9px] tracking-widest px-2 py-0.5 rounded-full border"
          style={{ color, background: bg, borderColor: color + '40' }}>
      {label}
    </span>
  )
}

function StatCard({ tag, children, accentColor, className = '', delay = 0 }) {
  return (
    <div
      className={`rounded-2xl p-5 border flex flex-col gap-3 transition-colors duration-300 ${className}`}
      style={{
        background:        'var(--surface)',
        borderColor:       'var(--border)',
        borderLeftColor:   accentColor,
        borderLeftWidth:   '2px',
        animationDelay:    `${delay}s`,
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
  const [copied, setCopied] = useState(false)
  const { sentiment, topics, urgency, insights, trace_id, cached } = data

  const sc  = SENTIMENT_CFG[sentiment.label] || SENTIMENT_CFG.neutral
  const uc  = URGENCY_CFG[urgency.level]     || URGENCY_CFG.low
  const pct = Math.round(sentiment.score * 100)

  const handleCopy = () => {
    navigator.clipboard.writeText(insights)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex flex-col gap-4 h-full">

      {/* Meta bar */}
      <div className="flex items-center gap-2">
        <span className="font-mono text-[10px]" style={{ color: 'var(--text-faint)' }}>trace</span>
        <span className="font-mono text-[10px] rounded px-2 py-0.5 border"
              style={{
                color:       'var(--cyan)',
                background:  'rgba(0,229,255,0.06)',
                borderColor: 'rgba(0,229,255,0.15)',
              }}>
          #{trace_id}
        </span>
        {cached && (
          <span className="font-mono text-[9px] rounded-full px-2 py-0.5 border"
                style={{
                  color:       '#ffc400',
                  background:  'rgba(255,196,0,0.06)',
                  borderColor: 'rgba(255,196,0,0.2)',
                }}>
            ⚡ CACHED
          </span>
        )}
      </div>

      {/* 2×2 grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">

        {/* Sentiment */}
        <StatCard tag="// 01 · Sentiment" accentColor={sc.color} delay={0}>
          <div className="flex items-start justify-between gap-2">
            <span className="text-2xl font-bold tracking-tight" style={{ color: sc.color }}>
              {sc.icon} {sc.label}
            </span>
            <span className="font-mono text-3xl font-light" style={{ color: sc.color }}>
              {pct}<span className="text-sm">%</span>
            </span>
          </div>
          <ConfidenceBadge score={sentiment.score} />
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
            <div className="h-full rounded-full"
                 style={{
                   width:      `${pct}%`,
                   background: sc.color,
                   boxShadow:  `0 0 8px ${sc.color}`,
                   transition: 'width 0.8s cubic-bezier(0.16,1,0.3,1)',
                 }} />
          </div>
          <p className="font-mono text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            {sentiment.explanation}
          </p>
        </StatCard>

        {/* Topics */}
        <StatCard tag="// 02 · Topics" accentColor="var(--cyan)" delay={0.08}>
          <div className="flex flex-col gap-3 flex-1">
            {topics.map((t, i) => (
              <div key={i} className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px]" style={{ color: 'var(--text-faint)' }}>
                    {String(i+1).padStart(2,'0')}
                  </span>
                  <span className="text-sm font-semibold" style={{ color: 'var(--text)' }}>
                    {t.topic}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5 pl-6">
                  {t.keywords.map((kw, j) => (
                    <span key={j} className="font-mono text-[10px] px-2 py-0.5 rounded-md border"
                          style={{
                            color:       'var(--cyan)',
                            borderColor: 'rgba(0,229,255,0.2)',
                            background:  'rgba(0,229,255,0.06)',
                          }}>
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </StatCard>

        {/* Urgency */}
        <StatCard tag="// 03 · Urgency" accentColor={uc.color} delay={0.16}>
          <div className="flex items-center gap-4 rounded-xl px-4 py-3"
               style={{ background: uc.bg }}>
            <span className="text-3xl" style={{ color: uc.color }}>{uc.icon}</span>
            <p className="text-2xl font-bold tracking-widest" style={{ color: uc.color }}>
              {urgency.level.toUpperCase()}
            </p>
          </div>
          <p className="font-mono text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            {urgency.reason}
          </p>
        </StatCard>

        {/* Insights */}
        <StatCard tag="// 04 · Insights" accentColor="#ffc400" delay={0.24}>
          <p className="text-sm leading-relaxed font-light flex-1"
             style={{ color: 'var(--text-muted)' }}>
            {insights}
          </p>
          <div className="flex items-center justify-between mt-auto">
            <div className="flex items-center gap-2 rounded-lg px-3 py-1.5 border"
                 style={{
                   background:  'rgba(255,196,0,0.05)',
                   borderColor: 'rgba(255,196,0,0.15)',
                 }}>
              <span style={{ color: '#ffc400', fontSize: '12px' }}>✦</span>
              <span className="font-mono text-[10px]" style={{ color: '#ffc400' }}>AI-generated</span>
            </div>
            <button
              onClick={handleCopy}
              className="font-mono text-[10px] px-3 py-1.5 rounded-lg border transition-all duration-200"
              style={{
                color:       copied ? '#00e676' : 'var(--text-faint)',
                borderColor: copied ? 'rgba(0,230,118,0.3)' : 'var(--border)',
                background:  copied ? 'rgba(0,230,118,0.05)' : 'transparent',
              }}
            >
              {copied ? '✓ COPIED' : '⎘ COPY'}
            </button>
          </div>
        </StatCard>

      </div>
    </div>
  )
}