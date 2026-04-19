import { NavLink } from 'react-router-dom'

const navigation = [
  { to: '/', label: 'Dashboard', description: 'Daily essentials' },
  { to: '/pain', label: 'Pain Log', description: 'Track daily symptoms' },
  { to: '/meals', label: 'Meals', description: 'Phase-based suggestions' },
  { to: '/insights', label: 'Insights', description: 'Patterns and trends' },
  { to: '/chat', label: 'Chat', description: 'Talk with MenoBot' },
]

function Sidebar() {
  return (
    <aside className="flex w-full shrink-0 flex-col border-b border-white/60 bg-white/80 px-5 py-6 backdrop-blur-xl lg:sticky lg:top-0 lg:h-screen lg:w-72 lg:border-r lg:border-b-0 lg:px-6">
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#f472b6,#fb7185)] text-lg font-semibold text-white shadow-lg shadow-rose-200/60">
          M
        </div>
        <div>
          <p className="text-lg font-semibold text-slate-900">MenoBot</p>
          <p className="text-sm text-slate-500">Women&apos;s health companion</p>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-2">
        {navigation.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              [
                'rounded-2xl border px-4 py-3 transition duration-200',
                isActive
                  ? 'border-transparent bg-[linear-gradient(135deg,rgba(251,113,133,0.14),rgba(244,114,182,0.08))] text-slate-900 shadow-sm'
                  : 'border-transparent bg-transparent text-slate-500 hover:bg-white/80 hover:text-slate-900',
              ].join(' ')
            }
          >
            <p className="font-medium">{item.label}</p>
            <p className="mt-1 text-sm text-slate-500">{item.description}</p>
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}

export default Sidebar
