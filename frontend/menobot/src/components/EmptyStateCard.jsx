import { Link } from 'react-router-dom'

function EmptyStateCard({
  title = 'Start tracking your health today',
  description = 'Add your first entry to unlock connected insights, meal suggestions, and personalized support.',
}) {
  return (
    <section className="rounded-xl border border-dashed border-rose-200 bg-white/90 p-6 shadow-md shadow-rose-100/20">
      <div className="max-w-xl">
        <p className="text-xs font-medium uppercase tracking-[0.22em] text-rose-500">No data yet</p>
        <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-slate-900">{title}</h2>
        <p className="mt-3 text-sm leading-6 text-slate-600">{description}</p>
        <Link
          to="/pain"
          className="mt-5 inline-flex items-center justify-center rounded-xl bg-[linear-gradient(135deg,#8f6a8e_0%,#b78faf_55%,#e0b8c8_100%)] px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:-translate-y-0.5 hover:opacity-95"
        >
          Add your first entry
        </Link>
      </div>
    </section>
  )
}

export default EmptyStateCard
