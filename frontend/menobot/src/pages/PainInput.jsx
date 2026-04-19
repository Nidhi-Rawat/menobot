import { useState } from 'react'
import { submitPainData } from '../services/api'

const initialFormState = {
  lastPeriod: '',
  painScore: 5,
}

function PainInput() {
  const [formData, setFormData] = useState(initialFormState)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [error, setError] = useState('')

  function handleChange(event) {
    const { name, value } = event.target

    setFormData((current) => ({
      ...current,
      [name]: name === 'painScore' ? Number(value) : value,
    }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setIsSubmitting(true)
    setSuccessMessage('')
    setError('')

    try {
      await submitPainData({
        lastPeriod: formData.lastPeriod,
        painScore: formData.painScore,
      })

      setSuccessMessage('Pain data submitted successfully.')
      setFormData(initialFormState)
    } catch (submitError) {
      setError(submitError.message || 'Failed to submit pain data.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-4">
      <header className="rounded-xl border border-white/70 bg-white/80 p-4 shadow-md shadow-rose-100/30">
        <p className="text-xs font-medium uppercase tracking-[0.22em] text-rose-500">Pain Input</p>
        <h1 className="mt-2 text-[2rem] font-semibold tracking-[-0.05em] text-slate-900">
          Log today&apos;s pain level
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
          Record your current pain level and last period date so the backend can save your latest entry.
        </p>
      </header>

      <form
        onSubmit={handleSubmit}
        className="rounded-xl border border-white/70 bg-white/90 p-4 shadow-md shadow-rose-100/30"
      >
        <div className="grid gap-4">
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

          <div className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-4">
            <div className="flex items-center justify-between gap-3">
              <label htmlFor="painScore" className="text-sm font-medium text-slate-700">
                Pain score
              </label>
              <span className="rounded-lg bg-white px-3 py-1 text-sm font-semibold text-slate-900 shadow-sm">
                {formData.painScore}/10
              </span>
            </div>

            <input
              id="painScore"
              type="range"
              min="0"
              max="10"
              step="1"
              name="painScore"
              value={formData.painScore}
              onChange={handleChange}
              className="mt-4 w-full accent-rose-500"
            />

            <div className="mt-2 flex justify-between text-[11px] uppercase tracking-[0.15em] text-slate-400">
              <span>No pain</span>
              <span>Severe</span>
            </div>
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center justify-center rounded-xl bg-[linear-gradient(135deg,#8f6a8e_0%,#b78faf_55%,#e0b8c8_100%)] px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? 'Saving...' : 'Submit pain data'}
          </button>
        </div>
      </form>

      {successMessage ? (
        <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4 text-sm text-emerald-700 shadow-md shadow-emerald-100/20">
          {successMessage}
        </div>
      ) : null}

      {error ? (
        <div className="rounded-xl border border-rose-100 bg-rose-50 p-4 text-sm text-rose-700 shadow-md shadow-rose-100/20">
          {error}
        </div>
      ) : null}
    </div>
  )
}

export default PainInput
