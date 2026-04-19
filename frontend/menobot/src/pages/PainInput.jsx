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
    <div className="mx-auto max-w-3xl space-y-6">
      <header className="rounded-[32px] border border-white/70 bg-white/90 p-6 shadow-lg shadow-rose-100/40 sm:p-8">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-rose-500">Pain Input</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
          Log today&apos;s pain level
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
          Record your current pain level and last period date so the backend can save your latest entry.
        </p>
      </header>

      <form
        onSubmit={handleSubmit}
        className="rounded-[32px] border border-white/70 bg-white/90 p-6 shadow-lg shadow-rose-100/40 sm:p-8"
      >
        <div className="grid gap-6">
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Last period date</span>
            <input
              type="date"
              name="lastPeriod"
              value={formData.lastPeriod}
              onChange={handleChange}
              max={new Date().toISOString().split('T')[0]}
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-rose-300 focus:bg-white"
              required
            />
          </label>

          <div className="rounded-3xl bg-slate-50 px-5 py-5">
            <div className="flex items-center justify-between gap-3">
              <label htmlFor="painScore" className="text-sm font-medium text-slate-700">
                Pain score
              </label>
              <span className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-slate-900 shadow-sm">
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
              className="mt-5 w-full accent-rose-500"
            />

            <div className="mt-2 flex justify-between text-xs uppercase tracking-[0.15em] text-slate-400">
              <span>No pain</span>
              <span>Severe</span>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {isSubmitting ? 'Saving...' : 'Submit pain data'}
          </button>
        </div>
      </form>

      {successMessage ? (
        <div className="rounded-[28px] border border-emerald-100 bg-emerald-50 p-5 text-sm text-emerald-700 shadow-lg shadow-emerald-100/40">
          {successMessage}
        </div>
      ) : null}

      {error ? (
        <div className="rounded-[28px] border border-rose-100 bg-rose-50 p-5 text-sm text-rose-700 shadow-lg shadow-rose-100/40">
          {error}
        </div>
      ) : null}
    </div>
  )
}

export default PainInput
