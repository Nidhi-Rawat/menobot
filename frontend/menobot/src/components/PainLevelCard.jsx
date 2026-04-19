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
    high: 'border-rose-100 bg-rose-100 text-rose-700',
    medium: 'border-amber-100 bg-amber-100 text-amber-700',
    low: 'border-emerald-100 bg-emerald-100 text-emerald-700',
  }[painLevel.color]

  return (
    <section className="flex h-full flex-col rounded-xl border border-white/70 bg-white/90 p-4 shadow-md shadow-rose-100/30">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-500">Pain profile</p>
          <h3 className="mt-1 text-lg font-semibold text-slate-900">Symptoms today</h3>
        </div>
        <span className={`rounded-lg border px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] ${badgeClass}`}>
          {painLevel.level}
        </span>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl bg-[linear-gradient(135deg,#8f6a8e_0%,#b78faf_55%,#e0b8c8_100%)] px-4 py-4 text-white">
          <p className="text-sm text-white/75">Overall pain score</p>
          <p className="mt-2 text-xl font-semibold">
            {formatScore(painScore)}
            <span className="ml-1 text-sm text-white/70">/10</span>
          </p>
        </div>
        <div className="rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-4">
          <p className="text-sm text-emerald-700">Wellness score</p>
          <p className="mt-2 text-xl font-semibold text-emerald-900">{wellnessScore}/10</p>
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {symptoms.map((symptom) => (
          <div key={symptom.name} className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="font-medium text-slate-700">{symptom.name}</span>
              <span className="text-slate-500">{formatScore(symptom.value)}/10</span>
            </div>
            <div className="h-2 rounded-full bg-white">
              <div
                className="h-2 rounded-full bg-[linear-gradient(90deg,#8f6a8e_0%,#b78faf_55%,#e0b8c8_100%)]"
                style={{ width: `${symptom.value * 10}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {category ? (
        <div className="mt-auto pt-4">
          <div className="rounded-xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-slate-700">
            <span className="font-medium text-slate-900">Clinical category:</span> {category}
          </div>
        </div>
      ) : null}
    </section>
  )
}

export default PainLevelCard
