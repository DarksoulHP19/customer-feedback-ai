/**
 * Enhancement #6 — Export analysis history as JSON or CSV
 */

export function exportAsJSON(history) {
  const data = history.map((item, i) => ({
    index: i + 1,
    time: item.time,
    source: item.source,
    feedback: item.feedback,
    trace_id: item.result.trace_id,
    cached: item.result.cached,
    sentiment_label: item.result.sentiment.label,
    sentiment_score: item.result.sentiment.score,
    sentiment_explanation: item.result.sentiment.explanation,
    topics: item.result.topics.map(t => t.topic).join(' | '),
    keywords: item.result.topics.flatMap(t => t.keywords).join(', '),
    urgency_level: item.result.urgency.level,
    urgency_reason: item.result.urgency.reason,
    insights: item.result.insights,
  }))

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  downloadBlob(blob, `feedback-analysis-${timestamp()}.json`)
}

export function exportAsCSV(history) {
  const headers = [
    'index', 'time', 'source', 'feedback', 'trace_id', 'cached',
    'sentiment_label', 'sentiment_score', 'topics', 'keywords',
    'urgency_level', 'insights',
  ]

  const rows = history.map((item, i) => [
    i + 1,
    item.time,
    item.source,
    `"${item.feedback.replace(/"/g, '""')}"`,
    item.result.trace_id,
    item.result.cached,
    item.result.sentiment.label,
    item.result.sentiment.score,
    `"${item.result.topics.map(t => t.topic).join(' | ')}"`,
    `"${item.result.topics.flatMap(t => t.keywords).join(', ')}"`,
    item.result.urgency.level,
    `"${item.result.insights.replace(/"/g, '""')}"`,
  ])

  const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  downloadBlob(blob, `feedback-analysis-${timestamp()}.csv`)
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob)
  const a   = document.createElement('a')
  a.href     = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

function timestamp() {
  return new Date().toISOString().slice(0, 16).replace('T', '_').replace(':', '-')
}
