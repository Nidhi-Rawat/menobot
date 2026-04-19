export const PHASES = {
  menstrual: {
    key: 'menstrual',
    label: 'Menstrual',
    description: 'Period days and reset time.',
    dayRange: 'Day 1-5',
    color: 'bg-rose-500',
    softColor: 'bg-rose-50',
    textColor: 'text-rose-700',
    ringColor: 'ring-rose-200',
    borderColor: 'border-rose-200',
  },
  follicular: {
    key: 'follicular',
    label: 'Follicular',
    description: 'Energy building and recovery.',
    dayRange: 'Day 6-13',
    color: 'bg-emerald-500',
    softColor: 'bg-emerald-50',
    textColor: 'text-emerald-700',
    ringColor: 'ring-emerald-200',
    borderColor: 'border-emerald-200',
  },
  ovulation: {
    key: 'ovulation',
    label: 'Ovulation',
    description: 'Fertility peak and higher energy.',
    dayRange: 'Day 14',
    color: 'bg-amber-400',
    softColor: 'bg-amber-50',
    textColor: 'text-amber-700',
    ringColor: 'ring-amber-200',
    borderColor: 'border-amber-200',
  },
  luteal: {
    key: 'luteal',
    label: 'Luteal',
    description: 'Post-ovulation and wind-down.',
    dayRange: 'Day 15-28',
    color: 'bg-sky-500',
    softColor: 'bg-sky-50',
    textColor: 'text-sky-700',
    ringColor: 'ring-sky-200',
    borderColor: 'border-sky-200',
  },
}

const DAY_IN_MS = 24 * 60 * 60 * 1000

export function parseISODate(value) {
  if (!value) return null

  const [year, month, day] = value.split('-').map(Number)
  if (!year || !month || !day) return null

  return new Date(year, month - 1, day, 12)
}

export function formatISODate(date) {
  const year = date.getFullYear()
  const month = `${date.getMonth() + 1}`.padStart(2, '0')
  const day = `${date.getDate()}`.padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function formatMonthLabel(date) {
  return date.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  })
}

export function formatReadableCalendarDate(date) {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

export function addDays(date, amount) {
  const nextDate = new Date(date)
  nextDate.setDate(nextDate.getDate() + amount)
  return nextDate
}

export function isSameDay(firstDate, secondDate) {
  return (
    firstDate.getFullYear() === secondDate.getFullYear() &&
    firstDate.getMonth() === secondDate.getMonth() &&
    firstDate.getDate() === secondDate.getDate()
  )
}

export function getCycleDay(date, lastPeriodDate, cycleLength = 28) {
  const diffInDays = Math.floor((date - lastPeriodDate) / DAY_IN_MS)
  const safeCycleLength = Math.max(1, cycleLength)
  const normalizedOffset = ((diffInDays % safeCycleLength) + safeCycleLength) % safeCycleLength
  return normalizedOffset + 1
}

export function getPhaseForCycleDay(cycleDay) {
  if (cycleDay <= 5) return PHASES.menstrual
  if (cycleDay <= 13) return PHASES.follicular
  if (cycleDay === 14) return PHASES.ovulation
  return PHASES.luteal
}

export function getPhaseForDate(date, lastPeriodDate, cycleLength = 28) {
  const cycleDay = getCycleDay(date, lastPeriodDate, cycleLength)
  return {
    cycleDay,
    phase: getPhaseForCycleDay(cycleDay),
  }
}

export function getNextPredictedPeriodStart(lastPeriodDate, cycleLength = 28, referenceDate = new Date()) {
  let predictedDate = new Date(lastPeriodDate)

  while (predictedDate <= referenceDate) {
    predictedDate = addDays(predictedDate, cycleLength)
  }

  return predictedDate
}

export function createPainLogMap(painLogs = []) {
  return painLogs.reduce((accumulator, entry) => {
    if (entry?.date) {
      accumulator[entry.date] = Number(entry.pain) || 0
    }

    return accumulator
  }, {})
}

export function getCalendarDays(monthDate, cycleData) {
  const firstDayOfMonth = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1, 12)
  const lastDayOfMonth = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0, 12)
  const firstGridDate = addDays(firstDayOfMonth, -firstDayOfMonth.getDay())
  const lastGridDate = addDays(lastDayOfMonth, 6 - lastDayOfMonth.getDay())
  const today = new Date()
  today.setHours(12, 0, 0, 0)

  const lastPeriodDate = parseISODate(cycleData.lastPeriodDate)
  const cycleLength = cycleData.cycleLength || 28
  const painLogMap = createPainLogMap(cycleData.painLogs)
  const nextPredictedPeriodStart = getNextPredictedPeriodStart(lastPeriodDate, cycleLength, today)
  const days = []

  for (let cursor = new Date(firstGridDate); cursor <= lastGridDate; cursor = addDays(cursor, 1)) {
    const isoDate = formatISODate(cursor)
    const { cycleDay, phase } = getPhaseForDate(cursor, lastPeriodDate, cycleLength)
    const painScore = painLogMap[isoDate] ?? null

    days.push({
      isoDate,
      date: new Date(cursor),
      dayNumber: cursor.getDate(),
      inCurrentMonth: cursor.getMonth() === monthDate.getMonth(),
      isToday: isSameDay(cursor, today),
      isPredictedStart: isSameDay(cursor, nextPredictedPeriodStart),
      cycleDay,
      phase,
      painScore,
      hasHighPain: painScore !== null && painScore > 5,
    })
  }

  return {
    days,
    nextPredictedPeriodStart,
  }
}
