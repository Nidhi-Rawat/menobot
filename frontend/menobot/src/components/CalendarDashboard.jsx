import { useState } from 'react'
import {
  PHASES,
  formatMonthLabel,
  formatReadableCalendarDate,
  formatISODate,
  getCalendarDays,
  getPhaseForDate,
  parseISODate,
} from '../utils/calendar'

const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function CalendarLegend() {
  const items = Object.values(PHASES)

  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <div
          key={item.key}
          className={`inline-flex items-center gap-2 rounded-full border ${item.borderColor} ${item.softColor} px-3 py-2`}
        >
          <span className={`h-2.5 w-2.5 rounded-full ${item.color}`} />
          <p className={`text-sm font-semibold ${item.textColor}`}>{item.label}</p>
          <p className="text-xs text-slate-500">{item.dayRange}</p>
        </div>
      ))}
    </div>
  )
}

function CalendarDashboard({ cycleData }) {
  const initialMonth = parseISODate(cycleData?.lastPeriodDate) || new Date()
  const [activeMonth, setActiveMonth] = useState(
    new Date(initialMonth.getFullYear(), initialMonth.getMonth(), 1, 12),
  )
  const [selectedDate, setSelectedDate] = useState(null)

  if (!cycleData?.lastPeriodDate) {
    return (
      <section className="rounded-[28px] border border-white/70 bg-white/90 p-5 shadow-lg shadow-rose-100/40 sm:p-6">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-rose-500">Cycle calendar</p>
        <h2 className="mt-2 text-xl font-semibold text-slate-900">Calendar will appear after your first health entry</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
          Save your last period date and symptom scores in the pain log, and the dashboard calendar will start showing phase colors, predictions, and pain markers automatically.
        </p>
      </section>
    )
  }

  const { days, nextPredictedPeriodStart } = getCalendarDays(activeMonth, cycleData)
  const detailDate = new Date(selectedDate || new Date())
  detailDate.setHours(12, 0, 0, 0)

  const detailData = getPhaseForDate(
    detailDate,
    parseISODate(cycleData.lastPeriodDate),
    cycleData.cycleLength || 28,
  )

  const selectedPainLog = cycleData.painLogs.find((entry) => entry.date === formatISODate(detailDate))
  const monthPainAlerts = days.filter((day) => day.hasHighPain).length

  function goToPreviousMonth() {
    setActiveMonth((current) => new Date(current.getFullYear(), current.getMonth() - 1, 1, 12))
  }

  function goToNextMonth() {
    setActiveMonth((current) => new Date(current.getFullYear(), current.getMonth() + 1, 1, 12))
  }

  return (
    <div className="mx-auto max-w-7xl space-y-4">
      <header className="rounded-[28px] border border-white/70 bg-white/90 p-5 shadow-lg shadow-rose-100/35 sm:p-6">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-rose-500">Cycle calendar</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">
              Your month at a glance
            </h2>
          </div>

          <div className="flex flex-wrap gap-2">
            <div className="rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600">
              <span className="font-semibold text-slate-900">{cycleData.cycleLength}</span> day cycle
            </div>
            <div className="rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600">
              Last period <span className="font-semibold text-slate-900">{formatReadableCalendarDate(parseISODate(cycleData.lastPeriodDate))}</span>
            </div>
            <div className="rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600">
              High pain <span className="font-semibold text-slate-900">{monthPainAlerts}</span>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <CalendarLegend />
        </div>
      </header>

      <div className="grid gap-4 xl:grid-cols-[1.65fr_0.7fr]">
        <section className="rounded-[28px] border border-white/70 bg-white/90 p-4 shadow-lg shadow-rose-100/35 sm:p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Monthly view</p>
              <h2 className="mt-1 text-xl font-semibold text-slate-900">{formatMonthLabel(activeMonth)}</h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={goToPreviousMonth}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-rose-200 hover:bg-rose-50"
              >
                Previous
              </button>
              <button
                type="button"
                onClick={() => setActiveMonth(new Date())}
                className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-emerald-200 hover:bg-emerald-50"
              >
                Today
              </button>
              <button
                type="button"
                onClick={goToNextMonth}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-rose-200 hover:bg-rose-50"
              >
                Next
              </button>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-7 gap-2 text-center text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
            {weekdays.map((day) => (
              <div key={day} className="py-1.5">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {days.map((day) => (
              <button
                key={day.isoDate}
                type="button"
                onClick={() => setSelectedDate(new Date(day.date))}
                className={[
                  'group relative min-h-[82px] overflow-visible rounded-[22px] border p-2.5 text-left transition duration-200',
                  day.phase.softColor,
                  day.phase.borderColor,
                  day.inCurrentMonth ? 'opacity-100' : 'opacity-40',
                  day.isToday ? 'ring-2 ring-slate-900 shadow-lg shadow-slate-900/10' : 'hover:-translate-y-0.5 hover:shadow-md',
                  day.isPredictedStart ? 'border-dashed ring-2 ring-rose-300 ring-offset-2 ring-offset-white' : '',
                  selectedDate && day.isoDate === formatISODate(selectedDate) ? 'border-slate-900 ring-2 ring-slate-200' : '',
                ].join(' ')}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className={`text-sm font-semibold ${day.inCurrentMonth ? 'text-slate-900' : 'text-slate-500'}`}>
                      {day.dayNumber}
                    </p>
                    <p className={`mt-1 line-clamp-1 text-[10px] font-medium ${day.phase.textColor}`}>{day.phase.label}</p>
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    {day.hasHighPain ? (
                      <span className="rounded-full bg-slate-900 px-1.5 py-1 text-[9px] font-semibold uppercase tracking-[0.14em] text-white">
                        High
                      </span>
                    ) : null}
                    {day.isPredictedStart ? (
                      <span className="rounded-full bg-white/90 px-1.5 py-1 text-[9px] font-semibold uppercase tracking-[0.14em] text-rose-600 shadow-sm">
                        Next
                      </span>
                    ) : null}
                  </div>
                </div>

                <div className="mt-3 flex items-end justify-between">
                  <span className={`inline-flex h-2.5 w-2.5 rounded-full ${day.phase.color}`} />
                  {day.painScore !== null ? (
                    <span className="rounded-full bg-white/90 px-2 py-1 text-[10px] font-semibold text-slate-700 shadow-sm">
                      {day.painScore}
                    </span>
                  ) : null}
                </div>

                <div className="pointer-events-none absolute left-1/2 top-2 z-20 hidden w-44 -translate-x-1/2 rounded-2xl border border-slate-200 bg-slate-900 px-3 py-3 text-xs text-white shadow-xl group-hover:block">
                  <p className="font-semibold">{formatReadableCalendarDate(day.date)}</p>
                  <p className="mt-2">{day.phase.label} phase</p>
                  <p className="mt-1">Cycle day {day.cycleDay}</p>
                  <p className="mt-1">
                    Pain score: {day.painScore !== null ? `${day.painScore}/10` : 'No pain log'}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </section>

        <aside className="space-y-4">
          <section className="rounded-[28px] border border-white/70 bg-white/90 p-5 shadow-lg shadow-rose-100/35">
            <p className="text-sm font-medium text-slate-500">Selected date</p>
            <h3 className="mt-2 text-xl font-semibold text-slate-900">
              {formatReadableCalendarDate(detailDate)}
            </h3>
            <div className={`mt-4 rounded-3xl border ${detailData.phase.borderColor} ${detailData.phase.softColor} p-4`}>
              <div className="flex items-center gap-3">
                <span className={`h-3 w-3 rounded-full ${detailData.phase.color}`} />
                <p className={`text-sm font-semibold uppercase tracking-[0.18em] ${detailData.phase.textColor}`}>
                  {detailData.phase.label}
                </p>
              </div>
              <p className="mt-3 text-base font-semibold text-slate-900">Cycle day {detailData.cycleDay}</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">{detailData.phase.description}</p>
              <p className="mt-2 text-sm text-slate-600">
                Pain score: {selectedPainLog ? `${selectedPainLog.pain}/10` : 'No pain entry for this date'}
              </p>
            </div>
          </section>

          <section className="rounded-[28px] border border-rose-100 bg-rose-50/90 p-5 shadow-lg shadow-rose-100/35">
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-rose-500">Prediction</p>
            <h3 className="mt-2 text-xl font-semibold text-slate-900">
              {formatReadableCalendarDate(nextPredictedPeriodStart)}
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Next predicted period start based on a {cycleData.cycleLength}-day cycle.
            </p>
            <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-rose-200 bg-white px-3 py-2 text-sm font-semibold text-rose-600">
              <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-rose-400" />
              Marker enabled
            </div>
          </section>

        </aside>
      </div>
    </div>
  )
}

export default CalendarDashboard
