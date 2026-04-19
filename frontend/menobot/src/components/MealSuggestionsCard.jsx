const tagStyles = {
  'iron-rich': 'border-rose-100 bg-rose-50 text-rose-700',
  light: 'border-teal-100 bg-teal-50 text-teal-700',
  fresh: 'border-emerald-100 bg-emerald-50 text-emerald-700',
  'high-protein': 'border-cyan-100 bg-cyan-50 text-cyan-700',
  'magnesium-rich': 'border-violet-100 bg-violet-50 text-violet-700',
  'complex-carbs': 'border-amber-100 bg-amber-50 text-amber-700',
  'anti-inflammatory': 'border-orange-100 bg-orange-50 text-orange-700',
  balanced: 'border-slate-200 bg-slate-100 text-slate-700',
  normal: 'border-slate-200 bg-slate-100 text-slate-700',
}

function formatTagLabel(tag) {
  return tag.replace(/-/g, ' ')
}

function MealSuggestionsCard({ meals = [], nutritionTip = '' }) {
  return (
    <section className="rounded-xl border border-white/70 bg-white/90 p-4 shadow-md shadow-rose-100/30">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-500">Nourishment</p>
          <h3 className="mt-1 text-lg font-semibold text-slate-900">Meal suggestions</h3>
        </div>
        <span className="rounded-lg border border-amber-100 bg-amber-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-amber-700">
          Nutrition
        </span>
      </div>

      {nutritionTip ? (
        <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50 px-4 py-4 text-sm leading-6 text-slate-600">
          {nutritionTip}
        </div>
      ) : null}

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {meals.map((meal, index) => (
          <article key={meal.name} className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-4">
            <div className="flex gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-sm font-semibold text-slate-700 shadow-sm">
                {String.fromCharCode(65 + index)}
              </div>
              <div className="min-w-0">
                <h4 className="text-sm font-semibold text-slate-900">{meal.name}</h4>
                <div className="mt-3 flex flex-wrap gap-2">
                  {meal.tags.map((tag) => (
                    <span
                      key={`${meal.name}-${tag}`}
                      className={`rounded-lg border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] ${tagStyles[tag] || tagStyles.normal}`}
                    >
                      {formatTagLabel(tag)}
                    </span>
                  ))}
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-600">{meal.benefit || meal.reason}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default MealSuggestionsCard
