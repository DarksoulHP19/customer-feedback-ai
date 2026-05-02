export default function Header({ total }) {
  const now = new Date()
  const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  const date = now.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })

  return (
    <header className="h-14 flex items-center justify-between px-6 flex-shrink-0
                       border-b border-white/[0.07] bg-[#070b12]/80 backdrop-blur-xl">
      <div className="flex items-center gap-3">
        <h1 className="font-semibold text-white tracking-tight">
          Customer Feedback <span className="text-[#00e5ff]">AI</span>
        </h1>
        <span className="font-mono text-[10px] tracking-[2px] text-[#4a5568] uppercase">
          / Multi-Agent Pipeline
        </span>
      </div>

      <div className="flex items-center gap-5">
        {total > 0 && (
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#00e676] shadow-[0_0_6px_rgba(0,230,118,0.8)]" />
            <span className="font-mono text-xs text-[#4a5568]">{total} analyzed</span>
          </div>
        )}
        <div className="font-mono text-xs text-[#4a5568]">{time} · {date}</div>
        <div className="flex items-center gap-1.5 border border-white/[0.07] rounded-lg px-3 py-1.5
                        bg-[rgba(0,229,255,0.04)]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00e5ff] shadow-[0_0_6px_rgba(0,229,255,0.8)]" />
          <span className="font-mono text-[11px] text-[#00e5ff]">GPT-4o-mini</span>
        </div>
      </div>
    </header>
  )
}
