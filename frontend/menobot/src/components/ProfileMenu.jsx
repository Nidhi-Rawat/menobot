import { useEffect, useMemo, useRef, useState } from 'react'

const PROFILE_STORAGE_KEY = 'menobot-profile'

const defaultProfile = {
  name: 'Mia',
  age: '28',
  cycleLength: '28',
  lastPeriodDate: '',
  region: 'India',
  dietPreference: 'Vegetarian',
  avatarUrl: '',
}

function readStoredProfile() {
  if (typeof window === 'undefined') {
    return defaultProfile
  }

  try {
    const saved = window.localStorage.getItem(PROFILE_STORAGE_KEY)
    if (!saved) return defaultProfile

    return {
      ...defaultProfile,
      ...JSON.parse(saved),
    }
  } catch {
    return defaultProfile
  }
}

function BellIcon() {
  return (
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
      <path d="M15 17h5l-1.4-1.4A2 2 0 0 1 18 14.2V11a6 6 0 1 0-12 0v3.2a2 2 0 0 1-.6 1.4L4 17h5" />
      <path d="M10 17a2 2 0 0 0 4 0" />
    </svg>
  )
}

function ProfileMenu({ compactHeader = false }) {
  const [isOpen, setIsOpen] = useState(false)
  const [activeModal, setActiveModal] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [profile, setProfile] = useState(readStoredProfile)
  const [draft, setDraft] = useState(readStoredProfile)
  const containerRef = useRef(null)

  useEffect(() => {
    function handlePointerDown(event) {
      if (!containerRef.current?.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handlePointerDown)
    return () => document.removeEventListener('mousedown', handlePointerDown)
  }, [])

  useEffect(() => {
    if (!activeModal) {
      setDraft(profile)
      setIsEditing(false)
    }
  }, [activeModal, profile])

  const avatarLabel = useMemo(() => {
    const name = (profile.name || '').trim()
    return name ? name.charAt(0).toUpperCase() : 'M'
  }, [profile.name])

  function openProfile() {
    setDraft(profile)
    setIsOpen(false)
    setActiveModal('profile')
  }

  function handleChange(event) {
    const { name, value } = event.target
    setDraft((current) => ({
      ...current,
      [name]: value,
    }))
  }

  function handleSave() {
    setProfile(draft)
    window.localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(draft))
    setIsEditing(false)
  }

  function handleLogout() {
    window.localStorage.removeItem(PROFILE_STORAGE_KEY)
    setProfile(defaultProfile)
    setDraft(defaultProfile)
    setIsEditing(false)
    setIsOpen(false)
    setActiveModal(null)
  }

  const fields = [
    { name: 'name', label: 'Name', type: 'text', placeholder: 'Enter your name' },
    { name: 'age', label: 'Age', type: 'number', placeholder: 'Age' },
    { name: 'cycleLength', label: 'Cycle length', type: 'number', placeholder: '28' },
    { name: 'lastPeriodDate', label: 'Last period date', type: 'date', placeholder: '' },
    { name: 'region', label: 'Region', type: 'text', placeholder: 'Region' },
    { name: 'dietPreference', label: 'Diet preference', type: 'text', placeholder: 'Vegetarian' },
  ]

  return (
    <>
      <div ref={containerRef} className="relative">
        {compactHeader ? (
          <div className="flex items-center gap-3">
            <div className="inline-flex items-center gap-2 rounded-xl bg-white/85 px-3 py-1 text-sm text-slate-600 shadow-[0_10px_24px_rgba(98,78,90,0.08)]">
              <span>Today</span>
              <span className="h-4 w-px bg-slate-200" />
              <span>Status</span>
            </div>

            <button
              type="button"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-white/70 bg-white/85 text-slate-500 shadow-sm transition hover:-translate-y-0.5 hover:bg-white hover:text-slate-700"
              aria-label="Notifications"
            >
              <BellIcon />
            </button>

            <button
              type="button"
              onClick={() => setIsOpen((current) => !current)}
              className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border border-white/70 bg-[linear-gradient(135deg,#8f6a8e_0%,#b78faf_55%,#e0b8c8_100%)] text-xs font-semibold text-white shadow-md transition duration-200 hover:-translate-y-0.5 hover:shadow-lg"
              aria-label="Open profile menu"
            >
              {profile.avatarUrl ? (
                <img src={profile.avatarUrl} alt={profile.name} className="h-full w-full object-cover" />
              ) : (
                avatarLabel
              )}
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setIsOpen((current) => !current)}
            className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border border-white/70 bg-[linear-gradient(135deg,#8f6a8e_0%,#b78faf_55%,#e0b8c8_100%)] text-xs font-semibold text-white shadow-md transition duration-200 hover:-translate-y-0.5 hover:shadow-lg"
            aria-label="Open profile menu"
          >
            {profile.avatarUrl ? (
              <img src={profile.avatarUrl} alt={profile.name} className="h-full w-full object-cover" />
            ) : (
              avatarLabel
            )}
          </button>
        )}

        <div
          className={[
            'absolute right-0 top-full z-40 mt-2 w-48 origin-top-right rounded-xl border border-white/70 bg-white/95 p-3 shadow-md shadow-rose-100/40 transition-all duration-200',
            isOpen ? 'visible translate-y-0 opacity-100' : 'invisible -translate-y-1 opacity-0',
          ].join(' ')}
        >
          <div className="mb-2 border-b border-slate-100 pb-2">
            <p className="text-sm font-semibold text-slate-900">{profile.name || 'Your profile'}</p>
            <p className="text-xs text-slate-500">Manage your account</p>
          </div>

          <div className="space-y-1">
            <button
              type="button"
              onClick={openProfile}
              className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm text-slate-700 transition hover:bg-rose-50 hover:text-rose-700"
            >
              <span>Profile</span>
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm text-slate-700 transition hover:bg-rose-50 hover:text-rose-700"
            >
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {activeModal === 'profile' ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/30 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-[28px] border border-white/70 bg-[linear-gradient(135deg,#fff8fb_0%,#f9f3f8_50%,#f7eef6_100%)] p-4 shadow-[0_30px_80px_rgba(24,16,19,0.24)] sm:p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border border-white/70 bg-[linear-gradient(135deg,#8f6a8e_0%,#b78faf_55%,#e0b8c8_100%)] text-xl font-semibold text-white shadow-md">
                  {draft.avatarUrl ? (
                    <img src={draft.avatarUrl} alt={draft.name} className="h-full w-full object-cover" />
                  ) : (
                    ((draft.name || '').trim().charAt(0) || 'M').toUpperCase()
                  )}
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.22em] text-rose-500">Profile</p>
                  <h2 className="mt-1 text-2xl font-semibold tracking-[-0.04em] text-slate-900">
                    {draft.name || 'Your profile'}
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">Keep your wellness details up to date.</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/70 bg-white/80 text-slate-500 transition hover:bg-white hover:text-slate-700"
                aria-label="Close profile modal"
              >
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
                  <path d="M6 6l12 12" />
                  <path d="M18 6 6 18" />
                </svg>
              </button>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {fields.map((field) => (
                <label
                  key={field.name}
                  className={field.name === 'lastPeriodDate' ? 'md:col-span-2' : 'block'}
                >
                  <span className="text-sm font-medium text-slate-700">{field.label}</span>
                  <input
                    type={field.type}
                    name={field.name}
                    value={draft[field.name]}
                    onChange={handleChange}
                    disabled={!isEditing}
                    placeholder={field.placeholder}
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-white/80 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-rose-300 focus:bg-white disabled:cursor-default disabled:bg-slate-50 disabled:text-slate-500"
                  />
                </label>
              ))}
            </div>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-slate-500">
                {isEditing ? 'Update your information and save changes.' : 'Tap edit to update your profile.'}
              </p>

              <div className="flex gap-3">
                {isEditing ? (
                  <button
                    type="button"
                    onClick={() => {
                      setDraft(profile)
                      setIsEditing(false)
                    }}
                    className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                ) : null}

                <button
                  type="button"
                  onClick={() => {
                    if (isEditing) {
                      handleSave()
                    } else {
                      setIsEditing(true)
                    }
                  }}
                  className="inline-flex items-center justify-center rounded-xl bg-[linear-gradient(135deg,#8f6a8e_0%,#b78faf_55%,#e0b8c8_100%)] px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:opacity-95"
                >
                  {isEditing ? 'Save' : 'Edit'}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}

export default ProfileMenu
