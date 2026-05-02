export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-6 select-none">

      {/* Animated rings */}
      <div className="relative w-28 h-28 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full border border-[rgba(0,229,255,0.08)] animate-ping"
             style={{ animationDuration: '3s' }} />
        <div className="absolute inset-3 rounded-full border border-[rgba(0,229,255,0.12)]" />
        <div className="absolute inset-6 rounded-full border border-[rgba(0,229,255,0.2)]" />
        <span className="text-3xl" style={{ color: 'rgba(0,229,255,0.4)' }}>◈</span>
      </div>

      <div className="text-center">
        <p className="text-[#4a5568] font-medium mb-1">No analysis yet</p>
        <p className="font-mono text-xs text-[#2d3748]">
          Submit feedback to run the 4-agent pipeline
        </p>
      </div>

      {/* Pipeline visual */}
      <div className="flex items-center gap-1.5 mt-2">
        {['Sentiment', 'Topics', 'Urgency', 'Insights'].map((step, i) => (
          <div key={step} className="flex items-center gap-1.5">
            <span
              className="font-mono text-[9px] tracking-wider px-2 py-1 rounded-lg border"
              style={{
                color: 'rgba(0,229,255,0.3)',
                borderColor: 'rgba(0,229,255,0.1)',
                background: 'rgba(0,229,255,0.03)',
              }}
            >
              {step.toUpperCase()}
            </span>
            {i < 3 && <span className="text-[#2d3748] text-xs">→</span>}
          </div>
        ))}
      </div>
    </div>
  )
}