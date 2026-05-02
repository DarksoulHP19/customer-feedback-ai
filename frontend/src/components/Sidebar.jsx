const NAV = [
  { icon: '⬡', label: 'Dashboard', id: 'dashboard' },
  { icon: '◈', label: 'Analyze',   id: 'analyze'   },
  { icon: '◷', label: 'History',   id: 'history'   },
]

export default function Sidebar({ active, onNav }) {
  return (
    <aside className="w-[64px] flex flex-col items-center py-6 gap-2 border-r border-white/[0.07] bg-[#070b12] flex-shrink-0">

      {/* Logo */}
      <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-6
                      bg-[#00e5ff] shadow-[0_0_20px_rgba(0,229,255,0.5)]">
        <span className="text-[#070b12] font-bold text-base leading-none">F</span>
      </div>

      {/* Nav icons */}
      {NAV.map(item => (
        <button
          key={item.id}
          onClick={() => onNav(item.id)}
          title={item.label}
          className={`w-10 h-10 rounded-xl flex items-center justify-center text-base
                      transition-all duration-200 group relative
                      ${active === item.id
                        ? 'bg-[rgba(0,229,255,0.12)] text-[#00e5ff] shadow-[0_0_12px_rgba(0,229,255,0.2)]'
                        : 'text-[#4a5568] hover:text-white hover:bg-white/5'}`}
        >
          {item.icon}
          {/* Tooltip */}
          <span className="absolute left-14 bg-[#0c1119] border border-white/10 text-white
                           font-mono text-xs px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100
                           pointer-events-none transition-opacity whitespace-nowrap z-50">
            {item.label}
          </span>
        </button>
      ))}

      {/* Bottom: status dot */}
      <div className="mt-auto flex flex-col items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-[#00e676] shadow-[0_0_8px_rgba(0,230,118,0.8)]" />
        <span className="font-mono text-[9px] text-[#4a5568] tracking-widest"
              style={{ writingMode: 'vertical-rl' }}>LIVE</span>
      </div>
    </aside>
  )
}
