import ExportButton  from './ExportButton'
import ThemeToggle   from './ThemeToggle'

export default function Header({ total, history }) {
  const now  = new Date()
  const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  const date = now.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })

  return (
    <header className="h-14 flex items-center justify-between px-4 md:px-6 flex-shrink-0
                       border-b backdrop-blur-xl"
            style={{ background: 'var(--header-bg)', borderColor: 'var(--border)' }}>

      <div className="flex items-center gap-2 md:gap-3 min-w-0">
        <h1 className="font-semibold tracking-tight text-sm md:text-base whitespace-nowrap"
            style={{ color: 'var(--text)' }}>
          Feedback <span style={{ color: 'var(--cyan)' }}>AI</span>
        </h1>
        <span className="hidden lg:block font-mono text-[10px] tracking-[2px] uppercase"
              style={{ color: 'var(--text-faint)' }}>
          / Multi-Agent Pipeline
        </span>
      </div>

      <div className="flex items-center gap-2 md:gap-3">
        <ThemeToggle />

        <ExportButton history={history} />

        {total > 0 && (
          <div className="hidden sm:flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full"
                 style={{ background: 'var(--green)', boxShadow: '0 0 6px var(--green)' }} />
            <span className="font-mono text-xs" style={{ color: 'var(--text-faint)' }}>
              {total} analyzed
            </span>
          </div>
        )}

        <div className="hidden md:block font-mono text-xs" style={{ color: 'var(--text-faint)' }}>
          {time} · {date}
        </div>

        <div className="hidden sm:flex items-center gap-1.5 rounded-lg px-2 md:px-3 py-1.5 border"
             style={{
               background:   'rgba(0,229,255,0.04)',
               borderColor:  'var(--border)',
             }}>
          <span className="w-1.5 h-1.5 rounded-full"
                style={{ background: 'var(--cyan)', boxShadow: '0 0 6px var(--cyan)' }} />
          <span className="font-mono text-[11px]" style={{ color: 'var(--cyan)' }}>GPT-4o-mini</span>
        </div>
      </div>
    </header>
  )
}
