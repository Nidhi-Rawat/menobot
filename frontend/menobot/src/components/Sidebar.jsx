import { NavLink } from 'react-router-dom'

const navigation = [
  { to: '/', label: 'Dashboard', icon: 'home' },
  { to: '/pain', label: 'Pain Log', icon: 'drop' },
  { to: '/meals', label: 'Meals', icon: 'utensils' },
  { to: '/insights', label: 'Insights', icon: 'chart' },
  { to: '/chat', label: 'Chat', icon: 'chat' },
]

function Icon({ name, className = 'h-4 w-4' }) {
  const commonProps = {
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: '1.9',
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    viewBox: '0 0 24 24',
    className,
    'aria-hidden': true,
  }

  switch (name) {
    case 'home':
      return (
        <svg {...commonProps}>
          <path d="M3 10.5 12 3l9 7.5" />
          <path d="M5.5 9.5V20h13V9.5" />
          <path d="M9.5 20v-5h5v5" />
        </svg>
      )
    case 'drop':
      return (
        <svg {...commonProps}>
          <path d="M12 3c2.4 3.3 5 6.6 5 10a5 5 0 1 1-10 0c0-3.4 2.6-6.7 5-10Z" />
        </svg>
      )
    case 'utensils':
      return (
        <svg {...commonProps}>
          <path d="M5 3v8" />
          <path d="M8 3v8" />
          <path d="M5 7h3" />
          <path d="M6.5 11v10" />
          <path d="M16 3c-1.7 1.8-2.5 4.4-2.5 7.6V21" />
          <path d="M18.5 3v18" />
        </svg>
      )
    case 'chart':
      return (
        <svg {...commonProps}>
          <path d="M4 20h16" />
          <path d="M7 20v-6" />
          <path d="M12 20V9" />
          <path d="M17 20v-10" />
        </svg>
      )
    default:
      return (
        <svg {...commonProps}>
          <path d="M5 18h8" />
          <path d="M19 19l-2.6-2.6" />
          <path d="M11 17a6 6 0 1 0 0-12 6 6 0 0 0 0 12Z" />
        </svg>
      )
  }
}

function Sidebar() {
  return (
    <aside className="flex w-full shrink-0 flex-col bg-[linear-gradient(180deg,#2e2b42_0%,#232132_100%)] px-4 py-5 text-white lg:min-h-full lg:w-[250px] lg:px-5 lg:py-7">
      <div className="mb-6 flex items-center gap-3 px-1">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[linear-gradient(135deg,#ff8ca9,#f46ca1)] text-white shadow-[0_12px_30px_rgba(244,108,161,0.45)]">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5"
            aria-hidden="true"
          >
            <path d="M13 4c-1.4 1.2-2.4 3.5-2.4 5.8v3.5" />
            <path d="M10.6 13.3c-2 0-3.6 1.6-3.6 3.7s1.6 3.6 3.6 3.6 3.7-1.6 3.7-3.6V8.1a2.8 2.8 0 1 1 5.7 0" />
          </svg>
        </div>
        <div>
          <p className="text-[1.7rem] font-semibold leading-none tracking-[-0.04em] text-white">MenoBot</p>
          <p className="mt-1 max-w-[120px] text-xs leading-5 text-white/65">Women&apos;s health companion</p>
        </div>
      </div>

      <div className="mb-5 rounded-[22px] border border-white/8 bg-white/6 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
        <p className="text-sm text-white/72">Daily focus</p>
        <h2 className="mt-2 text-[1.1rem] font-semibold leading-8 text-white">Build a calmer cycle routine</h2>
        <p className="mt-3 text-sm leading-7 text-white/58">
          Track patterns, log pain, and get supportive recommendations in one place.
        </p>
      </div>

      <nav className="flex flex-1 flex-col gap-1.5">
        {navigation.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              [
                'flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium transition duration-200',
                isActive
                  ? 'bg-white/10 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]'
                  : 'text-white/70 hover:bg-white/6 hover:text-white',
              ].join(' ')
            }
          >
            <span className="flex h-5 w-5 items-center justify-center text-white/75">
              <Icon name={item.icon} />
            </span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="mt-5 border-t border-white/10 pt-4">
        <div className="rounded-2xl bg-white/6 px-3 py-3 text-sm text-white/75">
          <div className="flex items-center gap-2">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
              aria-hidden="true"
            >
              <path d="M7 18h9a4 4 0 0 0 .5-8 5.5 5.5 0 0 0-10.7 1.7A3.5 3.5 0 0 0 7 18Z" />
            </svg>
            <span>40 C Frosty sunny</span>
          </div>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
