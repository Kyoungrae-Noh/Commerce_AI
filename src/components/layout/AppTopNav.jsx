import { Link } from 'react-router-dom'

export default function AppTopNav() {
  return (
    <header className="bg-slate-50/80 backdrop-blur-md sticky top-0 z-30 border-b border-outline-variant/10">
      <div className="flex justify-between items-center px-8 py-3 w-full max-w-[1440px] mx-auto">
        <div className="flex items-center gap-8">
          <span className="text-xl font-bold tracking-tight text-blue-800 font-headline">Insight Flux</span>
          <nav className="hidden lg:flex items-center gap-6 font-headline text-sm font-medium">
            <Link to="/dashboard/recommendations" className="text-slate-500 hover:text-blue-600 transition-colors no-underline">Dashboard</Link>
            <Link to="/dashboard/discovery" className="text-slate-500 hover:text-blue-600 transition-colors no-underline">Market Trends</Link>
            <Link to="/analysis" className="text-slate-500 hover:text-blue-600 transition-colors no-underline">Item Analysis</Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative hidden lg:block">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">search</span>
            <input
              className="pl-10 pr-4 py-1.5 bg-surface-container-highest rounded-full border-none text-sm focus:ring-2 focus:ring-primary/20 w-64 transition-all"
              placeholder="상품 또는 키워드 검색"
              type="text"
            />
          </div>
          <div className="flex gap-1">
            <Link to="/notifications" className="p-2 hover:bg-blue-50/50 rounded-full transition-colors relative">
              <span className="material-symbols-outlined text-slate-600">notifications</span>
            </Link>
            <Link to="/support" className="p-2 hover:bg-blue-50/50 rounded-full transition-colors">
              <span className="material-symbols-outlined text-slate-600">help_outline</span>
            </Link>
          </div>
          <div className="w-8 h-8 rounded-full bg-surface-container-high overflow-hidden border border-outline-variant/20">
            <div className="w-full h-full bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-sm">person</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
