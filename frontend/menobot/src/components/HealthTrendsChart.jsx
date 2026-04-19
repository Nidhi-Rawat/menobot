function formatShortDate(value) {
  if (!value) return '--'

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '--'

  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  })
}

function buildLinePoints(values, width, height, maxValue) {
  if (!values.length) return ''

  return values
    .map((value, index) => {
      const x = values.length === 1 ? width / 2 : (index / (values.length - 1)) * width
      const y = height - (value / maxValue) * height
      return `${x},${y}`
    })
    .join(' ')
}

function HealthTrendsChart({ history = [] }) {
  const chartData = history.map((entry) => ({
    label: formatShortDate(entry.createdAt),
    painScore: Number(entry.painScore || 0),
    mood: Number(entry.mood || 0),
  }))

  const chartWidth = 640
  const chartHeight = 220
  const maxValue = 10
  const painPoints = buildLinePoints(
    chartData.map((entry) => entry.painScore),
    chartWidth,
    chartHeight,
    maxValue,
  )
  const moodPoints = buildLinePoints(
    chartData.map((entry) => entry.mood),
    chartWidth,
    chartHeight,
    maxValue,
  )

  return (
    <section className="rounded-xl border border-white/70 bg-white/90 p-4 shadow-md shadow-rose-100/30 transition hover:-translate-y-0.5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-500">Trend view</p>
          <h3 className="mt-1 text-lg font-semibold text-slate-900">Pain and mood over time</h3>
        </div>
        <span className="rounded-lg border border-sky-100 bg-sky-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-sky-700">
          Trends
        </span>
      </div>

      {chartData.length === 0 ? (
        <div className="mt-4 rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-sm text-slate-500">
          Add a few entries to see your pain and mood trends over time.
        </div>
      ) : (
        <div className="mt-4 overflow-hidden rounded-xl border border-slate-100 bg-[linear-gradient(180deg,#fffafc_0%,#f8fafc_100%)] p-4">
          <div className="mb-3 flex flex-wrap gap-3 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
            <span className="inline-flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-rose-500" />
              Pain score
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-sky-500" />
              Mood
            </span>
          </div>

          <svg viewBox={`0 0 ${chartWidth} ${chartHeight + 24}`} className="h-[260px] w-full">
            {[0, 1, 2, 3, 4].map((step) => {
              const y = (chartHeight / 4) * step
              return (
                <line
                  key={step}
                  x1="0"
                  y1={y}
                  x2={chartWidth}
                  y2={y}
                  stroke="#eadfe7"
                  strokeDasharray="4 6"
                />
              )
            })}

            {painPoints ? (
              <polyline
                fill="none"
                stroke="#d14d72"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={painPoints}
              />
            ) : null}

            {moodPoints ? (
              <polyline
                fill="none"
                stroke="#4f8dd8"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={moodPoints}
              />
            ) : null}

            {chartData.map((entry, index) => {
              const x = chartData.length === 1 ? chartWidth / 2 : (index / (chartData.length - 1)) * chartWidth
              const painY = chartHeight - (entry.painScore / maxValue) * chartHeight
              const moodY = chartHeight - (entry.mood / maxValue) * chartHeight

              return (
                <g key={`${entry.label}-${index}`}>
                  <circle cx={x} cy={painY} r="5" fill="#d14d72" />
                  <circle cx={x} cy={moodY} r="5" fill="#4f8dd8" />
                  <text x={x} y={chartHeight + 18} textAnchor="middle" fontSize="11" fill="#64748b">
                    {entry.label}
                  </text>
                </g>
              )
            })}
          </svg>
        </div>
      )}
    </section>
  )
}

export default HealthTrendsChart
