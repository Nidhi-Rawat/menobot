import { useEffect, useState } from 'react'
import EmptyStateCard from '../components/EmptyStateCard'
import MealSuggestionsCard from '../components/MealSuggestionsCard'
import { useDashboardData } from '../hooks/useDashboardData'
import { getMealSuggestions as requestMealSuggestions } from '../services/api'

const regionOptions = [
  { value: 'india', label: 'Indian' },
  { value: 'us', label: 'US' },
  { value: 'europe', label: 'Europe' },
]

const dietTypeOptions = [
  { value: 'veg', label: 'Veg' },
  { value: 'nonveg', label: 'Non-Veg' },
]

function MealsPage() {
  const { data, isLoading, error } = useDashboardData()
  const [region, setRegion] = useState('india')
  const [dietType, setDietType] = useState('veg')
  const [mealResult, setMealResult] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [mealError, setMealError] = useState('')

  useEffect(() => {
    async function loadMeals() {
      const phase = data?.phase
      const painScore = data?.painScore

      if (!phase || painScore === undefined || painScore === null) {
        return
      }

      setIsSubmitting(true)
      setMealError('')

      try {
        console.log('Sending:', { region, dietType, phase, painScore })

        const response = await requestMealSuggestions({
          region,
          dietType,
          phase,
          painScore,
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
    <div className="mx-auto flex max-w-6xl flex-col gap-4">
      <header className="rounded-xl border border-white/70 bg-white/80 p-4 shadow-md shadow-rose-100/30">
        <p className="text-xs font-medium uppercase tracking-[0.22em] text-rose-500">Meals</p>
        <h1 className="mt-2 text-[2rem] font-semibold tracking-[-0.05em] text-slate-900">
          Food ideas for your current phase
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
          Keep meal recommendations separate from the dashboard so they are easier to focus on when you need them.
        </p>
      </header>

      {isLoading ? (
        <div className="rounded-xl border border-white/70 bg-white/90 p-4 text-sm text-slate-500 shadow-md shadow-rose-100/30">
          Fetching personalized meal suggestions...
        </div>
      ) : null}

      {!isLoading && error ? (
        <div className="rounded-xl border border-rose-100 bg-rose-50 p-4 text-sm text-rose-700 shadow-md shadow-rose-100/20">
          {error}
        </div>
      ) : null}

      {!isLoading && !error && !data ? <EmptyStateCard /> : null}

      {!isLoading && !error && data ? (
        <>
          <form
            onSubmit={handleSubmit}
            className="rounded-xl border border-white/70 bg-white/90 p-4 shadow-md shadow-rose-100/30 transition hover:-translate-y-0.5"
          >
            <div className="grid gap-4 md:grid-cols-2">
              <label className="block">
                <span className="text-sm font-medium text-slate-700">Region</span>
                <select
                  value={region}
                  onChange={(event) => setRegion(event.target.value)}
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-rose-300 focus:bg-white"
                >
                  {regionOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="text-sm font-medium text-slate-700">Diet type</span>
                <select
                  value={dietType}
                  onChange={(event) => setDietType(event.target.value)}
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-rose-300 focus:bg-white"
                >
                  {dietTypeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <span className="rounded-lg border border-emerald-100 bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">
                Phase: {data?.phase || '--'}
              </span>
              <span className="rounded-lg border border-sky-100 bg-sky-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-sky-700">
                Pain score: {data?.painScore ?? '--'}
              </span>
            </div>
          </form>

          {isSubmitting ? (
            <div className="rounded-xl border border-white/70 bg-white/90 p-4 text-sm text-slate-500 shadow-md shadow-rose-100/30">
              Fetching personalized meal suggestions...
            </div>
          ) : null}

          {mealError ? (
            <div className="rounded-xl border border-rose-100 bg-rose-50 p-4 text-sm text-rose-700 shadow-md shadow-rose-100/20">
              Unable to fetch meals, try again
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
