import { useState } from 'react'
import { useDashboardData } from '../hooks/useDashboardData'
import { formatReadableDate } from '../utils/date'
import {
  formatMonthLabel,
  getCalendarDays,
  getCycleDay,
  getNextPredictedPeriodStart,
  parseISODate,
} from '../utils/calendar'

const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function buildCalendarData(data) {
  if (!data?.lastPeriod) {
    return null
  }

  const normalizedCycles = Array.isArray(data.cycles)
    ? data.cycles.map((value) => Number(value)).filter((value) => Number.isFinite(value) && value > 0)
    : []

  const cycleLength = normalizedCycles.length
    ? Math.round(normalizedCycles.reduce((total, value) => total + value, 0) / normalizedCycles.length)
    : 28

  const painLogs = []
  const updatedAt = data.updatedAt || data.createdAt
  const painScore = Number(data.painScore)

  if (updatedAt && Number.isFinite(painScore)) {
    painLogs.push({
      date: new Date(updatedAt).toISOString().slice(0, 10),
      pain: Math.round(painScore),
    })
  }

  return {
    lastPeriodDate: new Date(data.lastPeriod).toISOString().slice(0, 10),
    cycleLength,
    painLogs,
  }
}

function formatPainScore(value) {
  const numericValue = Number(value)
  return Number.isFinite(numericValue) ? numericValue.toFixed(1) : '--'
}

function getInsight(data) {
  if ((data?.painScore ?? 0) >= 7) {
    return 'Prioritize warmth, hydration, and a slower pace today.'
  }

  switch (data?.phase?.toLowerCase()) {
    case 'follicular':
      return 'Energy is likely building. Lean into lighter routines and fresh meals.'
    case 'ovulatory':
      return 'Use the clearer energy in this phase for consistency and movement.'
    case 'luteal':
      return 'Keep the day softer with steadier meals and gentler expectations.'
    case 'menstrual':
      return 'Rest, warmth, and lower-pressure routines can help today feel easier.'
    default:
      return 'Keep logging regularly for clearer patterns and more personal guidance.'
  }
}

function getMealSuggestion(data) {
  switch (data?.phase?.toLowerCase()) {
    case 'menstrual':
      return 'Iron-rich bowl with lentils, greens, and citrus.'
    case 'follicular':
      return 'Fresh yogurt bowl or protein salad with herbs.'
    case 'ovulatory':
      return 'High-protein plate with eggs, paneer, or grilled fish.'
    case 'luteal':
      return 'Complex carbs with magnesium-rich foods like oats or seeds.'
    default:
      return 'Balanced meals with protein, fiber, and hydration.'
  }
}

function getPainSummary(data) {
  const painScore = Number(data?.painScore)

  if (!Number.isFinite(painScore)) {
    return 'No pain summary available yet.'
  }

  if (painScore >= 7) {
    return 'Higher pain today. Keep movement gentle and use warm, anti-inflammatory support.'
  }

  if (painScore >= 4) {
    return 'Moderate pain today. A balanced schedule and steady meals may help.'
  }

  return 'Pain is on the lower side today. A normal routine may feel manageable.'
}

function SmallStat({ label, value }) {
  return (
    <div className="flex items-center justify-between rounded-xl bg-white/80 px-4 py-3 shadow-sm shadow-rose-100/25">
      <p className="text-xs uppercase tracking-[0.16em] text-slate-400">{label}</p>
      <p className="text-sm font-medium text-slate-900">{value}</p>
    </div>
  )
}

function CompactCard({ label, value, description }) {
  return (
    <section className="rounded-xl bg-[linear-gradient(135deg,rgba(253,242,248,0.92),rgba(245,243,255,0.92))] p-4 shadow-sm shadow-rose-100/25">
      <p className="text-xs uppercase tracking-[0.16em] text-slate-400">{label}</p>
      <p className="mt-2 text-base font-medium text-slate-900">{value}</p>
      <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>
    </section>
  )
}

function Dashboard() {
  const { data, isLoading, error } = useDashboardData()
  const calendarData = buildCalendarData(data)
  const initialMonth = calendarData ? parseISODate(calendarData.lastPeriodDate) : new Date()
  const [activeMonth, setActiveMonth] = useState(
    new Date(initialMonth.getFullYear(), initialMonth.getMonth(), 1, 12),
  )

  if (isLoading) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-4">
        <div className="rounded-xl bg-white/70 p-4 shadow-sm shadow-rose-100/20">
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 35 }).map((_, index) => (
              <div key={index} className="h-20 animate-pulse rounded-xl bg-slate-100" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-4">
        <div className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700 shadow-sm shadow-rose-100/25">
          {error}
        </div>
      </div>
    )
  }

  if (!calendarData) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-4">
        <div className="rounded-xl bg-white/70 p-5 shadow-sm shadow-rose-100/25">
          <h1 className="text-xl font-semibold text-slate-900">Your Health Dashboard</h1>
          <p className="mt-2 text-sm text-slate-500">
            Save your first health entry to unlock your calendar and summaries.
          </p>
        </div>
      </div>
    )
  }

  const { days } = getCalendarDays(activeMonth, calendarData)
  const cycleStartDate = parseISODate(calendarData.lastPeriodDate)
  const cycleDay = getCycleDay(new Date(), cycleStartDate, calendarData.cycleLength)
  const nextPeriod = getNextPredictedPeriodStart(cycleStartDate, calendarData.cycleLength)

  return (
    <div className="mx-auto max-w-6xl px-6 py-4">
      <div className="space-y-4">
        <div className="rounded-xl bg-white/70 p-4 shadow-sm shadow-rose-100/25">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-xl font-semibold text-slate-900">Your Health Dashboard</h1>
              <p className="mt-1 text-sm text-slate-500">A compact view of your cycle, symptoms, and daily rhythm.</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveMonth((current) => new Date(current.getFullYear(), current.getMonth() - 1, 1, 12))}
                className="rounded-xl bg-white/80 px-3 py-2 text-sm text-slate-600 shadow-sm transition hover:scale-105"
              >
                Prev
              </button>
              <button
                type="button"
                onClick={() => setActiveMonth(new Date())}
                className="rounded-xl bg-white/80 px-3 py-2 text-sm text-slate-600 shadow-sm transition hover:scale-105"
              >
                Today
              </button>
              <button
                type="button"
                onClick={() => setActiveMonth((current) => new Date(current.getFullYear(), current.getMonth() + 1, 1, 12))}
                className="rounded-xl bg-white/80 px-3 py-2 text-sm text-slate-600 shadow-sm transition hover:scale-105"
              >
                Next
              </button>
            </div>
          </div>

          <div className="mb-3">
            <p className="text-xs text-slate-400">Calendar</p>
            <h2 className="mt-1 text-xl font-semibold text-slate-900">{formatMonthLabel(activeMonth)}</h2>
          </div>

          <div className="grid grid-cols-7 gap-2">
            {weekdays.map((day) => (
              <div key={day} className="px-2 py-1 text-center text-[11px] uppercase tracking-[0.16em] text-slate-400">
                {day}
              </div>
            ))}

            {days.map((day) => (
              <button
                key={day.isoDate}
                type="button"
                className={[
                  'h-20 rounded-xl p-2 text-left shadow-sm transition duration-200 hover:scale-105',
                  day.phase.key === 'menstrual' ? 'bg-rose-50' : '',
                  day.phase.key === 'follicular' ? 'bg-emerald-50' : '',
                  day.phase.key === 'ovulation' ? 'bg-amber-50' : '',
                  day.phase.key === 'luteal' ? 'bg-sky-50' : '',
                  day.inCurrentMonth ? 'text-slate-900' : 'text-slate-400 opacity-45',
                ].join(' ')}
              >
                <div className="flex items-start justify-between">
                  <span className="text-sm font-medium">{day.dayNumber}</span>
                  <span
                    className={[
                      'h-2 w-2 rounded-full',
                      day.phase.key === 'menstrual' ? 'bg-rose-300' : '',
                      day.phase.key === 'follicular' ? 'bg-emerald-300' : '',
                      day.phase.key === 'ovulation' ? 'bg-amber-300' : '',
                      day.phase.key === 'luteal' ? 'bg-sky-300' : '',
                    ].join(' ')}
                  />
                </div>
                <p className="mt-2 text-[11px] text-slate-500">{day.phase.label}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <SmallStat label="Current Phase" value={data?.phase || '--'} />
          <SmallStat label="Cycle Day" value={cycleDay ? `Day ${cycleDay}` : '--'} />
          <SmallStat label="Pain Score" value={formatPainScore(data?.painScore)} />
          <SmallStat label="Next Period" value={formatReadableDate(nextPeriod)} />
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <CompactCard
            label="Meal Suggestions"
            value={getMealSuggestion(data)}
            description="Simple food guidance based on your current phase and symptom pattern."
          />
          <CompactCard
            label="Insights"
            value={getInsight(data)}
            description="A small summary of what may help most in this phase."
          />
          <CompactCard
            label="Pain Summary"
            value={`Score ${formatPainScore(data?.painScore)}`}
            description={getPainSummary(data)}
          />
          <CompactCard
            label="Cycle Overview"
            value={`Last period ${formatReadableDate(data?.lastPeriod)}`}
            description="Your cycle timing and next predicted period stay visible without crowding the page."
          />
        </div>
      </div>
    </div>
  )
}

export default Dashboard
