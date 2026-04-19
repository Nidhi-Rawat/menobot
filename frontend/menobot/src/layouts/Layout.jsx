import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar'

function Layout() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(251,207,232,0.45),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(221,214,254,0.35),transparent_25%),linear-gradient(180deg,#fffafc,#f8fafc)]">
      <div className="mx-auto flex min-h-screen max-w-[1500px] flex-col lg:flex-row">
        <Sidebar />
        <main className="flex-1 px-5 py-6 sm:px-8 lg:px-10 lg:py-10">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default Layout
