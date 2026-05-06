const NAV = [
  { icon: '⬡', label: 'Dashboard', id: 'dashboard' },
  { icon: '◈', label: 'Analyze',   id: 'analyze'   },
  { icon: '◷', label: 'History',   id: 'history'   },
]

export default function Sidebar({ active, onNav }) {
  return (
    <aside className="w-[64px] flex flex-col items-center py-6 gap-2 flex-shrink-0
                      transition-colors duration-300"
           style={{
             background:  'var(--bg)',
             borderRight: '1px solid var(--border)',
           }}>

      {/* Logo */}
      <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-6"
           style={{
             background: 'var(--cyan)',
             boxShadow:  '0 0 20px rgba(0,229,255,0.4)',
           }}>
        <span className="font-bold text-base leading-none"
              style={{ color: 'var(--bg)' }}>F</span>
      </div>

      {/* Nav icons */}
      {NAV.map(item => (
        <button
          key={item.id}
          onClick={() => onNav(item.id)}
          title={item.label}
          className="w-10 h-10 rounded-xl flex items-center justify-center text-base
                     transition-all duration-200 group relative"
          style={{
            background: active === item.id ? 'rgba(0,229,255,0.1)' : 'transparent',
            color:      active === item.id ? 'var(--cyan)' : 'var(--text-faint)',
            boxShadow:  active === item.id ? '0 0 12px rgba(0,229,255,0.15)' : 'none',
          }}
        >
          {item.icon}
          {/* Tooltip */}
          <span className="absolute left-14 font-mono text-xs px-2 py-1 rounded-lg
                           opacity-0 group-hover:opacity-100 pointer-events-none
                           transition-opacity whitespace-nowrap z-50"
                style={{
                  background:  'var(--bg2)',
                  border:      '1px solid var(--border)',
                  color:       'var(--text)',
                }}>
            {item.label}
          </span>
        </button>
      ))}

      {/* Bottom status dot */}
      <div className="mt-auto flex flex-col items-center gap-2">
        <div className="w-2 h-2 rounded-full"
             style={{ background: 'var(--green)', boxShadow: '0 0 8px var(--green)' }} />
        <span className="font-mono text-[9px] tracking-widest"
              style={{ color: 'var(--text-faint)', writingMode: 'vertical-rl' }}>
          LIVE
        </span>
      </div>
    </aside>
  )
}
