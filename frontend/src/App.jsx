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

  // Mobile tab: 'form' | 'result' | 'history'
  const [mobileTab, setMobileTab]     = useState('form')

  const activeEntry = activeIndex !== null ? history[activeIndex] : null

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
      setMobileTab('result') // auto-switch to result on mobile after submit
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const ResultArea = () => (
    <>
      {error && (
        <div className="mb-4 rounded-xl px-4 py-3 font-mono text-sm border"
             style={{
               background:  'rgba(255,23,68,0.06)',
               borderColor: 'rgba(255,23,68,0.25)',
               color:       'var(--red)',
             }}>
          ⚠ {error}
        </div>
      )}

      {loading && (
        <div className="flex flex-col items-center justify-center h-full gap-6">
          <div className="w-16 h-16 rounded-full border-2 animate-spin-slow"
               style={{
                 borderColor:    'rgba(0,229,255,0.15)',
                 borderTopColor: 'var(--cyan)',
                 boxShadow:      '0 0 24px rgba(0,229,255,0.2)',
               }} />
          <div className="text-center">
            <p className="font-medium mb-1" style={{ color: 'var(--text)' }}>
              Running agents...
            </p>
            <p className="font-mono text-xs tracking-widest"
               style={{ color: 'var(--text-faint)' }}>
              SENTIMENT → TOPICS → URGENCY → INSIGHTS
            </p>
          </div>
        </div>
      )}

      {!loading && activeEntry && <ResultPanel data={activeEntry.result} />}
      {!loading && !activeEntry && !error && <EmptyState />}
    </>
  )

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden transition-colors duration-300"
         style={{ background: 'var(--bg)', color: 'var(--text)' }}>

      {/* Ambient blobs */}
      <div className="fixed pointer-events-none"
           style={{
             top: '-200px', left: '-200px', width: '600px', height: '600px',
             background: 'radial-gradient(circle, rgba(0,229,255,0.04) 0%, transparent 65%)',
           }} />
      <div className="fixed pointer-events-none"
           style={{
             bottom: '-150px', right: '-150px', width: '500px', height: '500px',
             background: 'radial-gradient(circle, rgba(213,0,249,0.03) 0%, transparent 65%)',
           }} />

      <Header total={history.length} history={history} />

      {/* ── Desktop layout (md+): sidebar + left panel + right panel ── */}
      <div className="hidden md:flex flex-1 min-h-0">

        <Sidebar active={navTab} onNav={setNavTab} />

        <div className="flex flex-1 min-w-0 min-h-0">

          {/* Left panel */}
          <div className="flex flex-col flex-shrink-0 transition-colors duration-300"
               style={{
                 width: '320px',
                 borderRight: '1px solid var(--border)',
               }}>
            <div className="flex-1 min-h-0 overflow-y-auto p-5">
              <FeedbackForm onSubmit={handleSubmit} loading={loading} />
            </div>
            <div className="px-5 py-4 overflow-y-auto max-h-64 flex-shrink-0 transition-colors duration-300"
                 style={{ borderTop: '1px solid var(--border)' }}>
              <HistoryPanel
                history={history}
                activeIndex={activeIndex}
                onSelect={setActiveIndex}
              />
            </div>
          </div>

          {/* Right panel */}
          <div className="flex-1 min-w-0 overflow-y-auto p-5">
            <ResultArea />
          </div>

        </div>
      </div>

      {/* ── Mobile layout (<md): tabbed single-column ── */}
      <div className="flex md:hidden flex-1 flex-col min-h-0">

        {/* Tab bar */}
        <div className="flex flex-shrink-0 border-b"
             style={{ borderColor: 'var(--border)', background: 'var(--bg2)' }}>
          {[
            { id: 'form',    label: 'Submit',  icon: '◈' },
            { id: 'result',  label: 'Results', icon: '⬡' },
            { id: 'history', label: 'History', icon: '◷' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setMobileTab(tab.id)}
              className="flex-1 flex items-center justify-center gap-1.5 py-3 font-mono text-xs
                         transition-all duration-200"
              style={{
                color:        mobileTab === tab.id ? 'var(--cyan)' : 'var(--text-faint)',
                borderBottom: mobileTab === tab.id ? '2px solid var(--cyan)' : '2px solid transparent',
                background:   mobileTab === tab.id ? 'rgba(0,229,255,0.04)' : 'transparent',
              }}
            >
              <span>{tab.icon}</span>
              <span className="tracking-wider">{tab.label.toUpperCase()}</span>
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="flex-1 min-h-0 overflow-y-auto">
          {mobileTab === 'form' && (
            <div className="p-4">
              <FeedbackForm onSubmit={handleSubmit} loading={loading} />
            </div>
          )}
          {mobileTab === 'result' && (
            <div className="p-4">
              <ResultArea />
            </div>
          )}
          {mobileTab === 'history' && (
            <div className="p-4">
              <HistoryPanel
                history={history}
                activeIndex={activeIndex}
                onSelect={(i) => { setActiveIndex(i); setMobileTab('result') }}
              />
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
