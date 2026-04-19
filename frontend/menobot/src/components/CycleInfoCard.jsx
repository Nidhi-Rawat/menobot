import { formatReadableDate, parseAppDate } from '../utils/date'

function CycleInfoCard({ lastPeriod, nextPeriod, cycles, phase }) {
  const normalizedCycles = Array.isArray(cycles)
    ? cycles
    : typeof cycles === 'string'
      ? cycles.split(',').map((cycle) => Number(cycle.trim())).filter(Boolean)
      : []

  const getLastPeriodDate = () => {
    const formattedDate = formatReadableDate(lastPeriod)
    return formattedDate === '--' ? 'No data' : formattedDate
  }

  const getNextPeriodDate = () => {
    const formattedDate = formatReadableDate(nextPeriod)
    return formattedDate === '--' ? 'No data' : formattedDate
  }

  const getDaysUntilNextPeriod = () => {
    const nextDate = parseAppDate(nextPeriod)
    if (!nextDate) return null

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const diffTime = nextDate - today
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays > 0 ? diffDays : 0
  }

  const getAverageCycleLength = () => {
    if (normalizedCycles.length === 0) return 'No data'
    const sum = normalizedCycles.reduce((acc, cycle) => acc + cycle, 0)
    return Math.round(sum / normalizedCycles.length)
  }

  const getCurrentCycleDay = () => {
    const lastDate = parseAppDate(lastPeriod)
    if (!lastDate) return null

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const diffTime = today - lastDate
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays >= 0 && diffDays < 200 ? diffDays + 1 : null
  }

  const currentDay = getCurrentCycleDay()
  const avgLength = getAverageCycleLength()
  const daysUntilNext = getDaysUntilNextPeriod()

  const progressWidth = avgLength > 0 && daysUntilNext !== null
    ? Math.max(0, Math.min(100, ((avgLength - daysUntilNext) / avgLength) * 100))
    : 0

  const items = [
    { label: 'Current cycle day', value: currentDay || 'No data' },
    { label: 'Average length', value: `${avgLength} days` },
    { label: 'Last period', value: getLastPeriodDate() },
    { label: 'Next period', value: getNextPeriodDate() },
  ]

  return (
    <section className="flex h-full flex-col rounded-[28px] border border-white/70 bg-white/90 p-6 shadow-lg shadow-rose-100/40">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">Cycle overview</p>
          <h3 className="mt-2 text-xl font-semibold text-slate-900">Your current timeline</h3>
        </div>
        <span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-rose-600">
          {phase || 'Unknown'}
        </span>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {items.map((item) => (
          <div key={item.label} className="rounded-2xl bg-slate-50 px-4 py-4">
            <p className="text-sm text-slate-500">{item.label}</p>
            <p className="mt-2 text-lg font-semibold text-slate-900">{item.value}</p>
          </div>
        ))}
      </div>

      {daysUntilNext !== null && (
        <div className="mt-auto pt-6">
          <div className="rounded-2xl bg-rose-50 px-4 py-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-medium text-slate-700">Progress to next period</p>
              <p className="text-sm font-semibold text-rose-600">{daysUntilNext} days left</p>
            </div>
            <div className="mt-3 h-3 rounded-full bg-white">
              <div
                className="h-3 rounded-full bg-[linear-gradient(90deg,#fb7185,#f43f5e)]"
                style={{ width: `${progressWidth}%` }}
              />
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default CycleInfoCard
