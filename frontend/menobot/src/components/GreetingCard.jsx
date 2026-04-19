function GreetingCard({ phase, userName }) {
  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 17) return 'Good afternoon'
    return 'Good evening'
  }

  const getPhaseMessage = (currentPhase) => {
    switch (currentPhase?.toLowerCase()) {
      case 'follicular':
        return 'You\'re in your follicular phase - a great time for new beginnings!'
      case 'ovulatory':
        return 'You\'re in your ovulatory phase - peak energy and confidence!'
      case 'luteal':
        return 'You\'re in your luteal phase - focus on self-care and preparation.'
      case 'menstrual':
        return 'You\'re in your menstrual phase - rest and rejuvenate.'
      default:
        return 'Track your cycle to get personalized insights.'
    }
  }

  return (
    <section className="flex h-full flex-col overflow-hidden rounded-[28px] bg-[linear-gradient(135deg,#0f172a,#1e293b_40%,#be185d_140%)] p-5 text-white shadow-xl shadow-slate-900/10">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-rose-100/80">Daily check-in</p>
          <h3 className="mt-2 text-xl font-semibold">
            {getGreeting()}, {userName || 'there'}
          </h3>
        </div>
        <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-rose-50">
          {phase || 'Unknown phase'}
        </span>
      </div>
      <p className="mt-4 max-w-xl text-sm leading-6 text-slate-200">
        {getPhaseMessage(phase)}
      </p>
      <div className="mt-5">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-4">
            <p className="text-xs uppercase tracking-[0.16em] text-rose-100/80">Focus</p>
            <p className="mt-2 text-sm font-medium text-white">Gentle tracking and steady routines</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-4">
            <p className="text-xs uppercase tracking-[0.16em] text-rose-100/80">Reminder</p>
            <p className="mt-2 text-sm font-medium text-white">Listen to energy shifts and hydrate well</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default GreetingCard
