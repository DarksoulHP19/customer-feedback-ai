export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-6 select-none">

      {/* Animated rings */}
      <div className="relative w-28 h-28 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full animate-ping"
             style={{
               border: '1px solid rgba(0,229,255,0.08)',
               animationDuration: '3s',
             }} />
        <div className="absolute inset-3 rounded-full"
             style={{ border: '1px solid rgba(0,229,255,0.12)' }} />
        <div className="absolute inset-6 rounded-full"
             style={{ border: '1px solid rgba(0,229,255,0.2)' }} />
        <span className="text-3xl" style={{ color: 'rgba(0,229,255,0.4)' }}>◈</span>
      </div>

      <div className="text-center">
        <p className="font-medium mb-1" style={{ color: 'var(--text-muted)' }}>
          No analysis yet
        </p>
        <p className="font-mono text-xs" style={{ color: 'var(--text-faint)' }}>
          Submit feedback to run the 4-agent pipeline
        </p>
      </div>

      {/* Pipeline visual */}
      <div className="flex items-center gap-1.5 mt-2">
        {['Sentiment', 'Topics', 'Urgency', 'Insights'].map((step, i) => (
          <div key={step} className="flex items-center gap-1.5">
            <span className="font-mono text-[9px] tracking-wider px-2 py-1 rounded-lg border"
                  style={{
                    color:       'var(--cyan)',
                    opacity:     0.35,
                    borderColor: 'rgba(0,229,255,0.15)',
                    background:  'rgba(0,229,255,0.03)',
                  }}>
              {step.toUpperCase()}
            </span>
            {i < 3 && (
              <span className="text-xs" style={{ color: 'var(--text-faint)' }}>→</span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}