import { useState } from 'react'
import { exportAsJSON, exportAsCSV } from '../utils/export'

export default function ExportButton({ history }) {
  const [open, setOpen] = useState(false)

  if (history.length === 0) return null

  const handleJSON = () => { exportAsJSON(history); setOpen(false) }
  const handleCSV  = () => { exportAsCSV(history);  setOpen(false) }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-2 font-mono text-[11px] px-3 py-1.5 rounded-lg border
                   transition-all duration-200"
        style={{
          color: '#00e5ff',
          borderColor: 'rgba(0,229,255,0.25)',
          background: 'rgba(0,229,255,0.05)',
        }}
      >
        ↓ EXPORT ({history.length})
      </button>

      {open && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />

          {/* Dropdown */}
          <div
            className="absolute right-0 top-9 z-20 rounded-xl border overflow-hidden w-36"
            style={{ background: '#0c1119', borderColor: 'rgba(255,255,255,0.1)' }}
          >
            <button
              onClick={handleJSON}
              className="w-full text-left px-4 py-2.5 font-mono text-xs text-[#94a3b8]
                         hover:bg-white/5 hover:text-white transition-colors flex items-center gap-2"
            >
              <span className="text-[#00e5ff]">{ }</span> JSON
            </button>
            <div style={{ height: '1px', background: 'rgba(255,255,255,0.05)' }} />
            <button
              onClick={handleCSV}
              className="w-full text-left px-4 py-2.5 font-mono text-xs text-[#94a3b8]
                         hover:bg-white/5 hover:text-white transition-colors flex items-center gap-2"
            >
              <span className="text-[#00e676]">≡</span> CSV
            </button>
          </div>
        </>
      )}
    </div>
  )
}
