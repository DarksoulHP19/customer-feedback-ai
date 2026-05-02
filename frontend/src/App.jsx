import { useState } from 'react'
import { analyzeFeedback } from './api/feedback'
import Sidebar      from './components/Sidebar'
import Header       from './components/Header'
import FeedbackForm from './components/FeedbackFrom'
import ResultPanel  from './components/ResultCard'
import HistoryPanel from './components/HistoryPanel'
import EmptyState   from './components/EmptyState'

export default function App() {
  const [loading, setLoading]         = useState(false)
  const [error, setError]             = useState(null)
  const [history, setHistory]         = useState([])
  const [activeIndex, setActiveIndex] = useState(null)
  const [navTab, setNavTab]           = useState('analyze')

  const activeEntry  = activeIndex !== null ? history[activeIndex] : null

  const handleSubmit = async ({ feedback, source }) => {
    setLoading(true)
    setError(null)
    try {
      const result = await analyzeFeedback({ feedback, source })
      const entry  = {
        feedback, source, result,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }
      setHistory(prev => {
        const next = [entry, ...prev]
        setActiveIndex(0)
        return next
      })
      setNavTab('analyze')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#070b12]">

      {/* Ambient blobs */}
      <div className="fixed pointer-events-none"
           style={{
             top: '-200px', left: '-200px',
             width: '600px', height: '600px',
             background: 'radial-gradient(circle, rgba(0,229,255,0.04) 0%, transparent 65%)',
           }} />
      <div className="fixed pointer-events-none"
           style={{
             bottom: '-150px', right: '-150px',
             width: '500px', height: '500px',
             background: 'radial-gradient(circle, rgba(213,0,249,0.03) 0%, transparent 65%)',
           }} />

      {/* ── Sidebar ───────────────────────── */}
      <Sidebar active={navTab} onNav={setNavTab} />

      {/* ── Main area ─────────────────────── */}
      <div className="flex flex-col flex-1 min-w-0">

        <Header total={history.length} />

        <div className="flex flex-1 min-h-0">

          {/* ── Left panel (input + history) ── */}
          <div
            className="flex flex-col border-r border-white/[0.07] flex-shrink-0"
            style={{ width: '320px' }}
          >
            {/* Input form */}
            <div className="flex-1 min-h-0 overflow-y-auto p-5">
              <FeedbackForm onSubmit={handleSubmit} loading={loading} />
            </div>

            {/* Divider */}
            <div className="border-t border-white/[0.07] px-5 py-4 overflow-y-auto max-h-64 flex-shrink-0">
              <HistoryPanel
                history={history}
                activeIndex={activeIndex}
                onSelect={setActiveIndex}
              />
            </div>
          </div>

          {/* ── Right panel (results) ─────── */}
          <div className="flex-1 min-w-0 overflow-y-auto p-5">

            {/* Error banner */}
            {error && (
              <div
                className="mb-4 rounded-xl px-4 py-3 font-mono text-sm border"
                style={{
                  background: 'rgba(255,23,68,0.06)',
                  borderColor: 'rgba(255,23,68,0.25)',
                  color: '#ff1744',
                }}
              >
                ⚠ {error}
              </div>
            )}

            {/* Loading */}
            {loading && (
              <div className="flex flex-col items-center justify-center h-full gap-6">
                <div
                  className="w-16 h-16 rounded-full border-2 animate-spin-slow"
                  style={{
                    borderColor: 'rgba(0,229,255,0.15)',
                    borderTopColor: '#00e5ff',
                    boxShadow: '0 0 24px rgba(0,229,255,0.3)',
                  }}
                />
                <div className="text-center">
                  <p className="text-white font-medium mb-1">Running agents...</p>
                  <p className="font-mono text-xs text-[#4a5568] tracking-widest">
                    SENTIMENT → TOPICS → URGENCY → INSIGHTS
                  </p>
                </div>
              </div>
            )}

            {/* Result */}
            {!loading && activeEntry && (
              <ResultPanel data={activeEntry.result} />
            )}

            {/* Empty */}
            {!loading && !activeEntry && !error && <EmptyState />}

          </div>
        </div>
      </div>
    </div>
  )
}
