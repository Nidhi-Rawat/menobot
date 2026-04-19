import EmptyStateCard from '../components/EmptyStateCard'
import HealthTrendsChart from '../components/HealthTrendsChart'
import CycleInfoCard from '../components/CycleInfoCard'
import PainLevelCard from '../components/PainLevelCard'
import { useDashboardData } from '../hooks/useDashboardData'
import { useHealthHistory } from '../hooks/useHealthHistory'
import { useInsightsData } from '../hooks/useInsightsData'

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
    <section className="rounded-xl border border-white/70 bg-white/90 p-4 shadow-md shadow-rose-100/30">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-500">Overview insight</p>
          <p className="mt-2 text-sm leading-6 text-slate-700">{message}</p>
        </div>
        <span className="rounded-lg border border-rose-100 bg-rose-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-rose-600">
          Insight
        </span>
      </div>
    </section>
  )
}

function InsightsPage() {
  const { data, isLoading: isLatestLoading, error: latestError } = useDashboardData()
  const { history, isLoading: isHistoryLoading, error: historyError } = useHealthHistory()
  const { insightsData, isLoading: isInsightsLoading, error: insightsError } = useInsightsData()
  const isLoading = isLatestLoading || isHistoryLoading || isInsightsLoading
  const error = latestError || historyError || insightsError

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-4">
      <header className="rounded-xl border border-white/70 bg-white/80 p-4 shadow-md shadow-rose-100/30">
        <p className="text-xs font-medium uppercase tracking-[0.22em] text-rose-500">Insights</p>
        <h1 className="mt-2 text-[2rem] font-semibold tracking-[-0.05em] text-slate-900">
          Trends, timing, and symptom context
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
          This page gathers your cycle timeline and symptom breakdown so the dashboard can stay clean and minimal.
        </p>
      </header>

      {isLoading ? (
        <div className="rounded-xl border border-white/70 bg-white/90 p-4 text-sm text-slate-500 shadow-md shadow-rose-100/30">
          Loading insights...
        </div>
      ) : null}

      {!isLoading && error ? (
        <div className="rounded-xl border border-rose-100 bg-rose-50 p-4 text-sm text-rose-700 shadow-md shadow-rose-100/20">
          {error}
        </div>
      ) : null}

      {!isLoading && !error && !data ? <EmptyStateCard /> : null}

      {!isLoading && !error && data ? (
        <div className="grid gap-4 xl:grid-cols-2">
          <div className="xl:col-span-2">
            <InsightsSummary phase={data?.phase} category={data?.category} />
          </div>

          {Array.isArray(insightsData?.insights) && insightsData.insights.length > 0 ? (
            <section className="xl:col-span-2 rounded-xl border border-white/70 bg-white/90 p-4 shadow-md shadow-rose-100/30">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-slate-500">Smart insights</p>
                  <h3 className="mt-1 text-lg font-semibold text-slate-900">Pattern detection</h3>
                </div>
                <span className="rounded-lg border border-rose-100 bg-rose-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-rose-600">
                  Smart
                </span>
              </div>
              <div className="mt-4 grid gap-3 md:grid-cols-3">
                {insightsData.insights.map((insight) => (
                  <div
                    key={insight}
                    className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-4 text-sm leading-6 text-slate-600 transition hover:-translate-y-0.5"
                  >
                    {insight}
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          <HealthTrendsChart history={history} />
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
