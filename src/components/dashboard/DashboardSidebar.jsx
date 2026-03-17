import { NavLink } from 'react-router-dom'
import './DashboardSidebar.css'

const tabs = [
  { to: '/dashboard/recommendations', icon: '⚡', label: 'AI 상품 추천' },
  { to: '/dashboard/keywords', icon: '🔍', label: '키워드 분석' },
  { to: '/dashboard/competition', icon: '📊', label: '경쟁 분석' },
]

export default function DashboardSidebar() {
  return (
    <aside className="dash-sidebar">
      <div className="dash-sidebar-logo">
        <span className="dash-sidebar-brand">Source<span>ly</span></span>
        <span className="dash-sidebar-tag">Dashboard</span>
      </div>
      <nav className="dash-sidebar-nav">
        {tabs.map(tab => (
          <NavLink
            key={tab.to}
            to={tab.to}
            className={({ isActive }) => `dash-sidebar-link ${isActive ? 'active' : ''}`}
          >
            <span className="dash-sidebar-icon">{tab.icon}</span>
            {tab.label}
          </NavLink>
        ))}
        <div className="dash-sidebar-divider" />
        <NavLink
          to="/calculator"
          className={({ isActive }) => `dash-sidebar-link ${isActive ? 'active' : ''}`}
        >
          <span className="dash-sidebar-icon">💰</span>
          마진 계산기
        </NavLink>
      </nav>
      <div className="dash-sidebar-bottom">
        <NavLink to="/" className="dash-sidebar-link back-link">
          ← 홈으로
        </NavLink>
      </div>
    </aside>
  )
}
