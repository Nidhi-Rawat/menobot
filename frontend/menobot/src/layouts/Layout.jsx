import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar'

function Layout() {
  return (
    <div className="min-h-screen bg-[#221e1f] p-2 sm:p-3 lg:p-4">
      <div className="mx-auto flex min-h-[calc(100vh-1rem)] max-w-[1560px] flex-col overflow-hidden rounded-[28px] bg-[linear-gradient(135deg,#f7eef3_0%,#f8f2f7_48%,#f6eef6_100%)] shadow-[0_30px_80px_rgba(24,16,19,0.38)] lg:min-h-[calc(100vh-2rem)] lg:flex-row lg:rounded-[34px]">
        <Sidebar />
        <main className="min-w-0 flex-1 px-3 py-3 sm:px-4 sm:py-4 lg:px-5 lg:py-5">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default Layout
