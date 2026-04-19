import { useEffect, useState } from 'react'
import { getCachedHealthData, getLatestHealthData, submitHealthData } from '../services/api'
import { formatReadableDate } from '../utils/date'

const initialFormData = {
  lastPeriod: '',
  cycles: '28,30,27',
  cramps: 3,
  mood: 3,
  fatigue: 3,
  flow: 3,
}

const sliderFields = [
  { name: 'cramps', label: 'Cramps' },
  { name: 'mood', label: 'Mood' },
  { name: 'fatigue', label: 'Fatigue' },
  { name: 'flow', label: 'Flow' },
]

function PainPage() {
  const [formData, setFormData] = useState(initialFormData)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoadingSavedData, setIsLoadingSavedData] = useState(true)
  const [error, setError] = useState('')
  const [result, setResult] = useState(null)

  function normalizeHealthData(payload) {
    if (Array.isArray(payload)) {
      return payload[0] || null
    }

    if (payload?.data && Array.isArray(payload.data)) {
      return payload.data[0] || null
    }

    if (payload?.data && typeof payload.data === 'object') {
      return payload.data
    }

    return payload || null
  }

  function formatDateForInput(value) {
    if (!value) return ''

    const parsedDate = new Date(value)
    if (Number.isNaN(parsedDate.getTime())) return ''

    return parsedDate.toISOString().split('T')[0]
  }

  function mapSavedDataToForm(savedData) {
    if (!savedData) {
      return initialFormData
    }

    const normalizeSliderValue = (value, fallback) => {
      const numericValue = Number(value)
      if (Number.isNaN(numericValue)) return fallback
      return Math.min(5, Math.max(1, numericValue))
    }

    return {
      lastPeriod: formatDateForInput(savedData.lastPeriod),
      cycles: Array.isArray(savedData.cycles) ? savedData.cycles.join(',') : initialFormData.cycles,
      cramps: normalizeSliderValue(savedData.cramps, initialFormData.cramps),
      mood: normalizeSliderValue(savedData.mood, initialFormData.mood),
      fatigue: normalizeSliderValue(savedData.fatigue, initialFormData.fatigue),
      flow: normalizeSliderValue(savedData.flow, initialFormData.flow),
    }
  }

  useEffect(() => {
    let isMounted = true

    async function loadSavedData() {
      setIsLoadingSavedData(true)

      try {
        const response = await getLatestHealthData()
        const savedData = normalizeHealthData(response)

        if (isMounted && savedData) {
          setFormData(mapSavedDataToForm(savedData))
          setResult(savedData)
        }
      } catch (loadError) {
        if (isMounted) {
          const cachedData = normalizeHealthData(getCachedHealthData())

          if (cachedData) {
            setFormData(mapSavedDataToForm(cachedData))
            setResult(cachedData)
            setError('')
          } else {
            setError(loadError.message || 'Unable to load saved pain data.')
          }
        }
      } finally {
        if (isMounted) {
          setIsLoadingSavedData(false)
        }
      }
    }

    loadSavedData()

    return () => {
      isMounted = false
    }
  }, [])

  function handleChange(event) {
    const { name, value } = event.target

    setFormData((current) => ({
      ...current,
      [name]: name === 'lastPeriod' || name === 'cycles' ? value : Number(value),
    }))
  }

  function formatScore(value) {
    const numericValue = Number(value)
    return Number.isNaN(numericValue) ? '--' : numericValue.toFixed(1)
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setIsSubmitting(true)
    setError('')
    setResult(null)

    try {
      const payload = {
        ...formData,
        cycles: formData.cycles
          .split(',')
          .map((value) => Number(value.trim()))
          .filter(Boolean),
      }

      const response = await submitHealthData(payload)
      setResult(response)
      window.dispatchEvent(new Event('health-data-updated'))
      setFormData((current) => ({ ...current }))
    } catch (submitError) {
      setError(submitError.message || 'Unable to submit symptom data.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-4">
      <header className="rounded-xl border border-white/70 bg-white/80 p-4 shadow-md shadow-rose-100/30">
        <p className="text-xs font-medium uppercase tracking-[0.22em] text-rose-500">Pain tracking</p>
        <h1 className="mt-2 text-[2rem] font-semibold tracking-[-0.05em] text-slate-900">
          Log today&apos;s symptoms
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
          Capture pain, mood, fatigue, and flow to keep your dashboard current and help MenoBot respond with better context.
        </p>
      </header>

      <form
        onSubmit={handleSubmit}
        className="rounded-xl border border-white/70 bg-white/90 p-4 shadow-md shadow-rose-100/30 transition hover:-translate-y-0.5"
      >
        {isLoadingSavedData ? (
          <div className="mb-4 rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-500">
            Loading saved pain data...
          </div>
        ) : null}

        <div className="grid gap-4 lg:grid-cols-2">
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Last period date</span>
            <input
              type="date"
              name="lastPeriod"
              value={formData.lastPeriod}
              onChange={handleChange}
              max={new Date().toISOString().split('T')[0]}
              className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-rose-300 focus:bg-white"
              required
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-700">Recent cycle lengths</span>
            <input
              type="text"
              name="cycles"
              value={formData.cycles}
              onChange={handleChange}
              placeholder="28,30,27"
              className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-rose-300 focus:bg-white"
            />
          </label>
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          {sliderFields.map((field) => (
            <div key={field.name} className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-4">
              <div className="flex items-center justify-between gap-3">
                <label htmlFor={field.name} className="text-sm font-medium text-slate-700">
                  {field.label}
                </label>
                <span className="rounded-lg bg-white px-3 py-1 text-sm font-semibold text-slate-900 shadow-sm">
                  {formData[field.name]}/5
                </span>
              </div>

              <input
                id={field.name}
                type="range"
                min="1"
                max="5"
                step="1"
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                className="mt-4 w-full accent-rose-500"
              />

              <div className="mt-2 flex justify-between text-[11px] text-slate-500">
                <span>Low (1)</span>
                <span>Medium (3)</span>
                <span>High (5)</span>
              </div>

              <p className="mt-1 text-[11px] text-slate-500">1 = minimal, 5 = severe</p>
            </div>
          ))}
        </div>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-500">Your entry updates the dashboard and can be reused by the chat assistant.</p>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center justify-center rounded-xl bg-[linear-gradient(135deg,#8f6a8e_0%,#b78faf_55%,#e0b8c8_100%)] px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? 'Saving...' : 'Save health data'}
          </button>
        </div>
      </form>

      {error ? (
        <div className="rounded-xl border border-rose-100 bg-rose-50 p-4 text-sm text-rose-700 shadow-md shadow-rose-100/30">
          {error}
        </div>
      ) : null}

      {result ? (
        <div className="rounded-xl border border-emerald-100 bg-white/90 p-4 shadow-md shadow-emerald-100/20">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.22em] text-emerald-600">Saved successfully</p>
              <p className="mt-1 text-sm text-slate-500">Your latest metrics are ready across the app.</p>
            </div>
            <span className="rounded-lg border border-emerald-100 bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
              Updated
            </span>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-4">
              <p className="text-sm text-slate-500">Pain score</p>
              <p className="mt-2 text-sm font-semibold text-slate-900">{formatScore(result?.painScore)}</p>
            </div>
            <div className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-4">
              <p className="text-sm text-slate-500">Category</p>
              <p className="mt-2 text-sm font-semibold text-slate-900">{result?.category || '--'}</p>
            </div>
            <div className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-4">
              <p className="text-sm text-slate-500">Phase</p>
              <p className="mt-2 text-sm font-semibold text-slate-900">{result?.phase || '--'}</p>
            </div>
            <div className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-4">
              <p className="text-sm text-slate-500">Next period</p>
              <p className="mt-2 text-sm font-semibold text-slate-900">{formatReadableDate(result?.nextPeriod)}</p>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default PainPage
