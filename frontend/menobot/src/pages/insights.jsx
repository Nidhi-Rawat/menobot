import CycleInfoCard from '../components/CycleInfoCard'
import PainLevelCard from '../components/PainLevelCard'
import { useDashboardData } from '../hooks/useDashboardData'

function InsightsSummary({ phase, category }) {
  const message = (() => {
    if (category) {
      return `Your latest symptom entry is currently categorized as ${category}.`
    }

    if (phase) {
      return `You are currently in the ${phase} phase. Keep tracking daily changes to spot more reliable patterns.`
    }

    return 'Add more tracking data to unlock clearer trends and recommendations.'
  })()

  return (
    <section className="rounded-[28px] border border-white/70 bg-white/90 p-6 shadow-lg shadow-rose-100/40">
      <p className="text-sm font-medium text-slate-500">Overview insight</p>
      <p className="mt-3 text-base leading-7 text-slate-700">{message}</p>
    </section>
  )
}

function InsightsPage() {
  const { data, isLoading, error } = useDashboardData()

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <header className="rounded-[32px] border border-white/70 bg-white/80 p-6 shadow-lg shadow-rose-100/40 sm:p-8">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-rose-500">Insights</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
          Trends, timing, and symptom context
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
          This page gathers your cycle timeline and symptom breakdown so the dashboard can stay clean and minimal.
        </p>
      </header>

      {isLoading ? (
        <div className="rounded-[28px] border border-white/70 bg-white/90 p-8 text-sm text-slate-500 shadow-lg shadow-rose-100/40">
          Loading insights...
        </div>
      ) : null}

      {!isLoading && error ? (
        <div className="rounded-[28px] border border-rose-100 bg-rose-50 p-8 text-sm text-rose-700 shadow-lg shadow-rose-100/40">
          {error}
        </div>
      ) : null}

      {!isLoading && !error ? (
        <div className="grid gap-6 xl:grid-cols-2">
          <div className="xl:col-span-2">
            <InsightsSummary phase={data?.phase} category={data?.category} />
          </div>
          <CycleInfoCard
            lastPeriod={data?.lastPeriod}
            nextPeriod={data?.nextPeriod}
            cycles={data?.cycles}
            phase={data?.phase}
          />
          <PainLevelCard
            painScore={data?.painScore}
            category={data?.category}
            cramps={data?.cramps}
            mood={data?.mood}
            fatigue={data?.fatigue}
            flow={data?.flow}
          />
        </div>
      ) : null}
    </div>
  )
}

export default InsightsPage
