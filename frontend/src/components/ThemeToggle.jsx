import { useTheme } from '../context/ThemeContext'

export default function ThemeToggle() {
  const { isDark, toggle } = useTheme()

  return (
    <button
      onClick={toggle}
      title={isDark ? 'Switch to Light mode' : 'Switch to Dark mode'}
      className="relative flex items-center gap-2 font-mono text-[11px] px-3 py-1.5 rounded-lg border
                 transition-all duration-300 overflow-hidden group"
      style={{
        color:       'var(--text-muted)',
        borderColor: 'var(--border)',
        background:  isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.04)',
      }}
    >
      <span
        className="text-sm transition-all duration-300"
        style={{
          display: 'inline-block',
          color: isDark ? '#ffc400' : '#0284c7',
        }}
      >
        {isDark ? '☀' : '☾'}
      </span>
      <span>{isDark ? 'LIGHT' : 'DARK'}</span>
      <span
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-lg"
        style={{
          background: isDark ? 'rgba(255,196,0,0.04)' : 'rgba(2,132,199,0.05)',
        }}
      />
    </button>
  )
}
