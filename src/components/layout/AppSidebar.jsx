import { NavLink, Link } from 'react-router-dom'

const analysisNav = [
  { to: '/dashboard/recommendations', icon: 'electric_bolt', label: 'AI 상품 추천' },
  { to: '/dashboard/discovery', icon: 'diamond', label: '아이템 발굴' },
  { to: '/dashboard/keywords', icon: 'search', label: '키워드 분석' },
  { to: '/dashboard/competition', icon: 'monitoring', label: '경쟁 분석' },
  { to: '/dashboard/ranking', icon: 'trophy', label: '랭킹추적' },
  { to: '/dashboard/sourcing', icon: 'factory', label: '1688 소싱' },
  { to: '/dashboard/utility', icon: 'handyman', label: '유틸리티' },
]

const toolsNav = [
  { to: '/calculator', icon: 'calculate', label: '마진 계산기' },
  { to: '/analysis', icon: 'query_stats', label: '상품 분석' },
]

const accountNav = [
  { to: '/notifications', icon: 'notifications', label: '알림 센터' },
  { to: '/subscription', icon: 'card_membership', label: '이용권 안내' },
  { to: '/support', icon: 'contact_support', label: '문의하기' },
  { to: '/settings', icon: 'settings', label: '설정' },
]

function SidebarLink({ to, icon, label }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2.5 rounded-lg font-body text-sm transition-all duration-200 ${
          isActive
            ? 'bg-blue-50 text-blue-700 font-semibold translate-x-1'
            : 'text-slate-600 hover:text-blue-600 hover:bg-slate-200/50 hover:translate-x-1'
        }`
      }
    >
      <span className="material-symbols-outlined text-lg">{icon}</span>
      <span>{label}</span>
    </NavLink>
  )
}

export default function AppSidebar() {
  return (
    <aside className="hidden md:flex flex-col h-screen w-64 fixed left-0 top-0 bg-slate-50 z-40 border-r border-outline-variant/15">
      <div className="p-4 flex flex-col h-full gap-1">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-3 px-2 mb-6 mt-2 no-underline">
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-on-primary shadow-lg">
            <span className="material-symbols-outlined">insights</span>
          </div>
          <div>
            <p className="font-black text-blue-700 text-base leading-tight font-headline">Intelligence</p>
            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Seller Pro</p>
          </div>
        </Link>

        {/* Analytics Nav */}
        <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold px-3 mb-1">Analytics</p>
        <nav className="space-y-0.5 mb-4">
          {analysisNav.map(item => <SidebarLink key={item.to} {...item} />)}
        </nav>

        {/* Tools */}
        <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold px-3 mb-1">Tools</p>
        <nav className="space-y-0.5 mb-4">
          {toolsNav.map(item => <SidebarLink key={item.to} {...item} />)}
        </nav>

        {/* Account */}
        <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold px-3 mb-1">Account</p>
        <nav className="space-y-0.5">
          {accountNav.map(item => <SidebarLink key={item.to} {...item} />)}
        </nav>

        {/* Bottom section */}
        <div className="mt-auto pb-2 space-y-3">
          <div className="bg-primary/5 p-4 rounded-xl border border-primary/10">
            <p className="text-xs font-bold text-primary mb-1">PRO PLAN</p>
            <p className="text-[11px] text-slate-500 mb-3 leading-tight">고급 분석 기능을 모두 사용해보세요.</p>
            <button className="w-full py-2 bg-gradient-to-br from-primary to-primary-container text-on-primary text-xs font-bold rounded-lg shadow-sm hover:shadow-md transition-all">
              Upgrade Plan
            </button>
          </div>
          <a href="#" className="flex items-center gap-3 px-3 py-2 text-slate-500 hover:text-error transition-colors rounded-lg text-sm">
            <span className="material-symbols-outlined">logout</span>
            <span>Logout</span>
          </a>
        </div>
      </div>
    </aside>
  )
}
