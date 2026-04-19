const tagStyles = {
  'iron-rich': 'bg-rose-50 text-rose-700 border-rose-100',
  light: 'bg-teal-50 text-teal-700 border-teal-100',
  fresh: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  'high-protein': 'bg-cyan-50 text-cyan-700 border-cyan-100',
  'magnesium-rich': 'bg-violet-50 text-violet-700 border-violet-100',
  'complex-carbs': 'bg-amber-50 text-amber-700 border-amber-100',
  'anti-inflammatory': 'bg-orange-50 text-orange-700 border-orange-100',
  balanced: 'bg-slate-100 text-slate-700 border-slate-200',
  normal: 'bg-slate-100 text-slate-700 border-slate-200',
}

function formatTagLabel(tag) {
  return tag.replace(/-/g, ' ')
}

function MealSuggestionsCard({ meals = [], nutritionTip = '' }) {
  return (
    <section className="rounded-[28px] border border-white/70 bg-white/90 p-6 shadow-lg shadow-rose-100/40">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">Nourishment</p>
          <h3 className="mt-2 text-xl font-semibold text-slate-900">Meal suggestions</h3>
        </div>
        <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">
          Nutrition
        </span>
      </div>

      {nutritionTip ? (
        <div className="mt-5 rounded-2xl bg-slate-50 px-4 py-4 text-sm leading-6 text-slate-600">
          {nutritionTip}
        </div>
      ) : null}

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {meals.map((meal, index) => (
          <article key={meal.name} className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4">
            <div className="flex gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-sm font-semibold text-slate-700 shadow-sm">
                {String.fromCharCode(65 + index)}
              </div>
              <div className="min-w-0">
                <h4 className="font-semibold text-slate-900">{meal.name}</h4>
                <div className="mt-3 flex flex-wrap gap-2">
                  {meal.tags.map((tag) => (
                    <span
                      key={`${meal.name}-${tag}`}
                      className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] ${tagStyles[tag] || tagStyles.normal}`}
                    >
                      {formatTagLabel(tag)}
                    </span>
                  ))}
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-600">{meal.reason}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default MealSuggestionsCard
