function PainLevelCard({ painScore, category, cramps, mood, fatigue, flow }) {
  const formatScore = (value) => {
    const numericValue = Number(value)
    return Number.isNaN(numericValue) ? '0.0' : numericValue.toFixed(1)
  }

  const getPainLevel = (score) => {
    if (score >= 7) return { level: 'High', color: 'high' }
    if (score >= 4) return { level: 'Medium', color: 'medium' }
    return { level: 'Low', color: 'low' }
  }

  const getWellnessScore = () => {
    const totalSymptoms = (cramps || 0) + (mood || 0) + (fatigue || 0) + (flow || 0)
    const maxPossible = 40
    const wellnessScore = Math.max(0, 10 - Math.round((totalSymptoms / maxPossible) * 10))
    return wellnessScore
  }

  const painLevel = getPainLevel(painScore)
  const wellnessScore = getWellnessScore()

  const symptoms = [
    { name: 'Cramps', value: cramps || 0 },
    { name: 'Mood', value: mood || 0 },
    { name: 'Fatigue', value: fatigue || 0 },
    { name: 'Flow', value: flow || 0 },
  ]

  const badgeClass = {
    high: 'bg-rose-100 text-rose-700',
    medium: 'bg-amber-100 text-amber-700',
    low: 'bg-emerald-100 text-emerald-700',
  }[painLevel.color]

  return (
    <section className="flex h-full flex-col rounded-[28px] border border-white/70 bg-white/90 p-6 shadow-lg shadow-rose-100/40">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">Pain profile</p>
          <h3 className="mt-2 text-xl font-semibold text-slate-900">Symptoms today</h3>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${badgeClass}`}>
          {painLevel.level}
        </span>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl bg-slate-900 px-5 py-5 text-white">
          <p className="text-sm text-slate-300">Overall pain score</p>
          <p className="mt-3 text-4xl font-semibold">
            {formatScore(painScore)}
            <span className="text-lg text-slate-400">/10</span>
          </p>
        </div>
        <div className="rounded-2xl bg-emerald-50 px-5 py-5">
          <p className="text-sm text-emerald-700">Wellness score</p>
          <p className="mt-3 text-4xl font-semibold text-emerald-900">{wellnessScore}/10</p>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {symptoms.map((symptom) => (
          <div key={symptom.name}>
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="font-medium text-slate-700">{symptom.name}</span>
              <span className="text-slate-500">{formatScore(symptom.value)}/10</span>
            </div>
            <div className="h-2 rounded-full bg-slate-100">
              <div
                className="h-2 rounded-full bg-[linear-gradient(90deg,#fb7185,#f97316)]"
                style={{ width: `${symptom.value * 10}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {category && (
        <div className="mt-auto pt-6">
          <div className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-slate-700">
            <span className="font-medium text-slate-900">Clinical category:</span> {category}
          </div>
        </div>
      )}
    </section>
  )
}

export default PainLevelCard
