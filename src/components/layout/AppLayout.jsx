import { Outlet, NavLink } from 'react-router-dom'
import AppSidebar from './AppSidebar'
import AppTopNav from './AppTopNav'

const mobileNav = [
  { to: '/dashboard/recommendations', icon: 'electric_bolt', label: 'AI 추천' },
  { to: '/dashboard/keywords', icon: 'search', label: '키워드' },
  { to: '/dashboard/competition', icon: 'monitoring', label: '경쟁분석' },
  { to: '/notifications', icon: 'notifications', label: '알림' },
  { to: '/settings', icon: 'settings', label: '설정' },
]

export default function AppLayout() {
  return (
    <div className="flex min-h-screen bg-surface">
      <AppSidebar />
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
        <AppTopNav />
        <main className="flex-1 p-6 md:p-10 overflow-x-hidden">
          <Outlet />
        </main>
      </div>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-50/90 backdrop-blur-md z-50 px-4 py-2 flex justify-between items-center shadow-[0_-4px_12px_rgba(0,0,0,0.05)] border-t border-outline-variant/10">
        {mobileNav.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 ${isActive ? 'text-blue-700' : 'text-slate-500'}`
            }
          >
            <span className="material-symbols-outlined text-xl">{item.icon}</span>
            <span className="text-[10px] font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
