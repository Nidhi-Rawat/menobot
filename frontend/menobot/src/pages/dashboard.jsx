import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import EmptyStateCard from '../components/EmptyStateCard'
import ProfileMenu from '../components/ProfileMenu'
import { useDashboardData } from '../hooks/useDashboardData'
import {
  formatMonthLabel,
  getCalendarDays,
  getCycleDay,
  getNextPredictedPeriodStart,
  parseISODate,
} from '../utils/calendar'
import { formatReadableDate } from '../utils/date'

const weekdays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']

function buildCalendarData(data) {
  if (!data?.lastPeriod) return null

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

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning,'
  if (hour < 17) return 'Good afternoon,'
  return 'Good evening,'
}

function formatPainScore(value) {
  const numericValue = Number(value)
  return Number.isFinite(numericValue) ? numericValue.toFixed(1) : '--'
}

function phaseTone(phaseKey) {
  switch (phaseKey) {
    case 'menstrual':
      return {
        badge: 'border border-rose-100 bg-rose-50 text-rose-500',
        cell: 'bg-rose-50/95 text-rose-500',
        dot: 'bg-rose-400',
      }
    case 'follicular':
      return {
        badge: 'border border-emerald-100 bg-emerald-50 text-emerald-500',
        cell: 'bg-emerald-50/95 text-emerald-500',
        dot: 'bg-emerald-400',
      }
    case 'ovulation':
      return {
        badge: 'border border-amber-100 bg-amber-50 text-amber-500',
        cell: 'bg-amber-50/95 text-amber-500',
        dot: 'bg-amber-400',
      }
    default:
      return {
        badge: 'border border-sky-100 bg-sky-50 text-sky-500',
        cell: 'bg-sky-50/95 text-sky-500',
        dot: 'bg-sky-400',
      }
  }
}

function getPhaseMessage(phase) {
  switch (phase?.toLowerCase()) {
    case 'follicular':
      return "You're in your follicular phase-focus on momentum and fresh routines."
    case 'ovulation':
      return "You're in your ovulation phase-focus on clarity and steady energy."
    case 'menstrual':
      return "You're in your menstrual phase-focus on rest and warmth."
    default:
      return "You're in your luteal phase-focus on self-care and preparation."
  }
}

function ChevronLeftIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
  )
}

function ChevronRightIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  )
}

function CalendarIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <rect x="3" y="5" width="18" height="16" rx="3" />
      <path d="M16 3v4" />
      <path d="M8 3v4" />
      <path d="M3 10h18" />
    </svg>
  )
}

function PhaseIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-6 w-6"
      aria-hidden="true"
    >
      <path d="M12 3a9 9 0 1 0 0 18c-3.2-2.2-4.8-5.2-4.8-9S8.8 5.2 12 3Z" />
    </svg>
  )
}

function Dashboard() {
  const { data, isLoading, error } = useDashboardData()
  const calendarData = useMemo(() => buildCalendarData(data), [data])
  const initialMonth = calendarData ? parseISODate(calendarData.lastPeriodDate) : new Date()
  const [activeMonth, setActiveMonth] = useState(
    new Date(initialMonth.getFullYear(), initialMonth.getMonth(), 1, 12),
  )
  const [selectedDate, setSelectedDate] = useState(new Date())

  if (isLoading) {
    return (
      <div className="mx-auto max-w-[1280px]">
        <div className="grid gap-4 xl:grid-cols-[1.58fr_0.96fr]">
          <div className="rounded-[32px] bg-white/70 p-5 shadow-[0_18px_55px_rgba(112,88,107,0.14)]">
            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: 35 }).map((_, index) => (
                <div key={index} className="h-[92px] animate-pulse rounded-2xl bg-slate-100" />
              ))}
            </div>
          </div>
          <div className="h-[420px] animate-pulse rounded-[32px] bg-white/75 shadow-[0_18px_55px_rgba(112,88,107,0.14)]" />
        </div>
      </div>
    )
  }

  if (error || !calendarData) {
    return (
      <div className="mx-auto max-w-[1280px]">
        {error ? (
          <div className="rounded-[32px] bg-white/82 p-6 shadow-[0_18px_55px_rgba(112,88,107,0.14)]">
            <h1 className="text-2xl font-semibold text-slate-900">Cycle Dashboard</h1>
            <p className="mt-2 text-sm text-slate-500">{error}</p>
          </div>
        ) : (
          <EmptyStateCard />
        )}
      </div>
    )
  }

  const { days } = getCalendarDays(activeMonth, calendarData)
  const cycleStartDate = parseISODate(calendarData.lastPeriodDate)
  const cycleDay = getCycleDay(new Date(), cycleStartDate, calendarData.cycleLength)
  const nextPeriod = getNextPredictedPeriodStart(cycleStartDate, calendarData.cycleLength)

  const badges = [
    { key: 'menstrual', label: 'Menstrual', range: 'Day 1-5' },
    { key: 'follicular', label: 'Follicular', range: 'Day 6-13' },
    { key: 'ovulation', label: 'Ovulation', range: 'Day 14' },
    { key: 'luteal', label: 'Luteal', range: 'Day 15-28' },
  ]

  return (
    <div className="mx-auto max-w-[1280px]">
      <div className="rounded-[20px] bg-[linear-gradient(180deg,rgba(255,250,252,0.98),rgba(249,241,247,0.98))] p-4 shadow-[0_24px_60px_rgba(116,88,106,0.16)]">
        <div className="mb-3 flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between">
          <div className="space-y-3">
            <h1 className="text-[2rem] font-semibold tracking-[-0.05em] text-slate-900">Cycle Dashboard</h1>
            <div className="flex flex-wrap gap-2">
              {badges.map((badge) => {
                const tone = phaseTone(badge.key)
                return (
                  <span
                    key={badge.key}
                    className={`inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] ${tone.badge}`}
                  >
                    <span className={`h-2.5 w-2.5 rounded-full ${tone.dot}`} />
                    <span>{badge.label}</span>
                    <span className="text-slate-400">{badge.range}</span>
                  </span>
                )
              })}
            </div>
          </div>

          <ProfileMenu compactHeader />
        </div>

        <div className="grid gap-3 xl:grid-cols-[1.6fr_1fr]">
          <section className="rounded-lg border border-white/70 bg-white/55 p-4 shadow-[0_18px_55px_rgba(118,91,107,0.1)] backdrop-blur-sm transition hover:-translate-y-0.5">
            <div className="mb-3 flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 rounded-lg bg-white/90 px-2 py-1 shadow-[0_8px_24px_rgba(98,78,90,0.08)]">
                  <button
                    type="button"
                    onClick={() =>
                      setActiveMonth((current) => new Date(current.getFullYear(), current.getMonth() - 1, 1, 12))
                    }
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-50"
                  >
                    <ChevronLeftIcon />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setActiveMonth((current) => new Date(current.getFullYear(), current.getMonth() + 1, 1, 12))
                    }
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-50"
                  >
                    <ChevronRightIcon />
                  </button>
                </div>

                <h2 className="text-[2rem] font-semibold tracking-[-0.05em] text-slate-900">
                  {formatMonthLabel(activeMonth)}
                </h2>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setActiveMonth((current) => new Date(current.getFullYear(), current.getMonth() - 1, 1, 12))
                  }
                  className="rounded-lg bg-white/88 px-4 py-2 text-sm font-medium text-slate-600 shadow-[0_8px_20px_rgba(98,78,90,0.08)] transition hover:bg-white"
                >
                  Previous
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setActiveMonth((current) => new Date(current.getFullYear(), current.getMonth() + 1, 1, 12))
                  }
                  className="rounded-lg bg-white/88 px-4 py-2 text-sm font-medium text-slate-600 shadow-[0_8px_20px_rgba(98,78,90,0.08)] transition hover:bg-white"
                >
                  Next
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-1.5">
              {weekdays.map((day) => (
                <div
                  key={day}
                  className="px-2 py-1 text-center text-[10px] font-medium tracking-[0.2em] text-slate-400"
                >
                  {day}
                </div>
              ))}

              {days.map((day) => {
                const tone = phaseTone(day.phase.key)
                const isSelected = selectedDate.toDateString() === day.date.toDateString()

                return (
                  <button
                    key={day.isoDate}
                    type="button"
                    onClick={() => setSelectedDate(new Date(day.date))}
                    className={[
                      'group h-20 rounded-lg border border-[#dbd7e8] p-2 text-left shadow-[0_12px_26px_rgba(110,88,104,0.06)] transition duration-200 hover:-translate-y-0.5',
                      tone.cell,
                      day.inCurrentMonth ? 'opacity-100' : 'opacity-40',
                      isSelected ? 'ring-2 ring-slate-200' : '',
                      day.isPredictedStart ? 'border-dashed border-amber-300 bg-[#fff6ea]' : '',
                    ].join(' ')}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-sm font-semibold text-slate-900">{day.dayNumber}</span>
                      <span className={`mt-1 h-2 w-2 rounded-full ${tone.dot}`} />
                    </div>
                    <p className="mt-2 text-[10px] font-medium leading-4">
                      {day.isPredictedStart ? formatReadableDate(day.date) : day.phase.label}
                    </p>
                  </button>
                )
              })}
            </div>
          </section>

          <aside className="rounded-lg bg-[linear-gradient(135deg,#8f6a8e_0%,#b78faf_55%,#e0b8c8_100%)] p-4 text-white shadow-[0_24px_60px_rgba(106,75,99,0.24)] transition hover:-translate-y-0.5">
            <div className="space-y-3">
              <div className="rounded-lg bg-[linear-gradient(135deg,rgba(114,78,109,0.28),rgba(255,255,255,0.14))] p-4">
                <h2 className="text-[1.7rem] font-semibold leading-tight tracking-[-0.04em]">{getGreeting()}</h2>
                <p className="mt-2 max-w-sm text-sm leading-6 text-white/85">
                  {getPhaseMessage(data?.phase)}
                </p>
              </div>

              <div className="rounded-lg border border-white/16 bg-white/16 p-4 backdrop-blur">
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-white/75">Focus</p>
                <p className="mt-2 text-sm font-medium text-white">Gentle tracking and steady routines</p>
              </div>

              <div className="rounded-lg bg-white px-4 py-4 text-slate-700 shadow-[0_14px_34px_rgba(90,63,85,0.12)]">
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">Reminder</p>
                <p className="mt-2 text-sm font-medium text-slate-700">Listen to energy shifts and hydrate well</p>
              </div>

              <Link
                to="/pain"
                className="block rounded-lg bg-white px-4 py-4 text-slate-800 shadow-[0_14px_34px_rgba(90,63,85,0.12)] transition hover:-translate-y-0.5"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-base font-semibold">Update pain log</p>
                    <p className="mt-1 text-sm text-slate-500">Save today&apos;s symptoms in under a minute.</p>
                  </div>
                  <span className="text-slate-300">
                    <ChevronRightIcon />
                  </span>
                </div>
              </Link>
            </div>
          </aside>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <div className="rounded-lg bg-white/82 p-4 shadow-[0_18px_48px_rgba(118,91,107,0.1)] transition hover:-translate-y-0.5">
            <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Current Phase</p>
            <div className="mt-4 flex items-center gap-3">
              <span className="text-[#775c9f]">
                <PhaseIcon />
              </span>
              <div>
                <p className="text-base font-semibold leading-none tracking-[-0.03em] text-slate-900">
                  {data?.phase || '--'}
                </p>
                <p className="mt-2 text-sm text-slate-500">Cycle day {cycleDay} post-ovulation phase.</p>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-white/82 p-4 shadow-[0_18px_48px_rgba(118,91,107,0.1)] transition hover:-translate-y-0.5">
            <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Pain Score</p>
            <p className="mt-3 text-base font-semibold tracking-[-0.03em] text-slate-900">
              {formatPainScore(data?.painScore)}
            </p>
            <p className="mt-2 text-sm text-slate-500">Current average pain level</p>
          </div>

          <div className="rounded-lg bg-[linear-gradient(135deg,rgba(255,252,246,0.98),rgba(255,246,236,0.96))] p-4 shadow-[0_18px_48px_rgba(118,91,107,0.1)] transition hover:-translate-y-0.5">
            <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Next Period</p>
            <div className="mt-3 flex items-start justify-between gap-3">
              <div>
                <p className="text-base font-semibold leading-none tracking-[-0.03em] text-slate-900">
                  {formatReadableDate(nextPeriod)}
                </p>
                <p className="mt-2 text-sm text-slate-500">Predicted start of next cycle</p>
              </div>
              <div className="inline-flex items-center gap-2 rounded-lg border border-dashed border-amber-300 bg-white/80 px-3 py-2 text-sm font-medium text-amber-700">
                <CalendarIcon />
                <span>{formatMonthLabel(nextPeriod)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
