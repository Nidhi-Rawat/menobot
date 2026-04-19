import { useEffect, useState } from 'react'
import MealSuggestionsCard from '../components/MealSuggestionsCard'
import { useDashboardData } from '../hooks/useDashboardData'
import { getMealSuggestions as requestMealSuggestions } from '../services/api'

const regionOptions = ['Indian', 'South Indian', 'North Indian', 'Western']
const dietTypeOptions = ['Veg', 'Non-Veg']

function MealsPage() {
  const { data, isLoading, error } = useDashboardData()
  const [region, setRegion] = useState('Indian')
  const [dietType, setDietType] = useState('Veg')
  const [mealResult, setMealResult] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [mealError, setMealError] = useState('')

  useEffect(() => {
    async function loadMeals() {
      if (!data?.phase || data?.painScore === undefined || data?.painScore === null) {
        return
      }

      setIsSubmitting(true)
      setMealError('')

      try {
        const response = await requestMealSuggestions({
          phase: data.phase,
          painScore: data.painScore,
          region,
          dietType,
        })

        setMealResult(response)
      } catch (requestError) {
        setMealError(requestError.message || 'Unable to load meal suggestions.')
      } finally {
        setIsSubmitting(false)
      }
    }

    loadMeals()
  }, [data?.phase, data?.painScore, region, dietType])

  function handleSubmit(event) {
    event.preventDefault()
  }

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6">
      <header className="rounded-[32px] border border-white/70 bg-white/80 p-6 shadow-lg shadow-rose-100/40 sm:p-8">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-rose-500">Meals</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
          Food ideas for your current phase
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
          Keep meal recommendations separate from the dashboard so they are easier to focus on when you need them.
        </p>
      </header>

      {isLoading ? (
        <div className="rounded-[28px] border border-white/70 bg-white/90 p-8 text-sm text-slate-500 shadow-lg shadow-rose-100/40">
          Loading meal suggestions...
        </div>
      ) : null}

      {!isLoading && error ? (
        <div className="rounded-[28px] border border-rose-100 bg-rose-50 p-8 text-sm text-rose-700 shadow-lg shadow-rose-100/40">
          {error}
        </div>
      ) : null}

      {!isLoading && !error ? (
        <>
          <form
            onSubmit={handleSubmit}
            className="rounded-[28px] border border-white/70 bg-white/90 p-6 shadow-lg shadow-rose-100/40"
          >
            <div className="grid gap-4 md:grid-cols-2">
              <label className="block">
                <span className="text-sm font-medium text-slate-700">Region</span>
                <select
                  value={region}
                  onChange={(event) => setRegion(event.target.value)}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-rose-300 focus:bg-white"
                >
                  {regionOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="text-sm font-medium text-slate-700">Diet type</span>
                <select
                  value={dietType}
                  onChange={(event) => setDietType(event.target.value)}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-rose-300 focus:bg-white"
                >
                  {dietTypeOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-sm font-semibold text-slate-700">
                Phase: {data?.phase || '--'}
              </span>
              <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-sm font-semibold text-slate-700">
                Pain score: {data?.painScore ?? '--'}
              </span>
            </div>
          </form>

          {isSubmitting ? (
            <div className="rounded-[28px] border border-white/70 bg-white/90 p-8 text-sm text-slate-500 shadow-lg shadow-rose-100/40">
              Loading meal suggestions...
            </div>
          ) : null}

          {mealError ? (
            <div className="rounded-[28px] border border-rose-100 bg-rose-50 p-8 text-sm text-rose-700 shadow-lg shadow-rose-100/40">
              {mealError}
            </div>
          ) : null}

          {!isSubmitting && !mealError && mealResult ? (
            <MealSuggestionsCard meals={mealResult.meals} nutritionTip={mealResult.nutritionTip} />
          ) : null}
        </>
      ) : null}
    </div>
  )
}

export default MealsPage
