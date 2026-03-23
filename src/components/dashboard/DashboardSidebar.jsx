import { NavLink } from 'react-router-dom'
import './DashboardSidebar.css'

const tabs = [
  { to: '/dashboard/recommendations', icon: '⚡', label: 'AI 상품 추천' },
  { to: '/dashboard/discovery', icon: '💎', label: '아이템 발굴' },
  { to: '/dashboard/keywords', icon: '🔍', label: '키워드 분석' },
  { to: '/dashboard/competition', icon: '📊', label: '경쟁 분석' },
  { to: '/dashboard/ranking', icon: '🏆', label: '랭킹추적' },
  { to: '/dashboard/sourcing', icon: '🏭', label: '1688 소싱' },
  { to: '/dashboard/utility', icon: '🛠️', label: '유틸리티' },
]

export default function DashboardSidebar() {
  return (
    <aside className="dash-sidebar">
      <nav className="dash-sidebar-nav">
        <NavLink to="/" className="dash-sidebar-link dash-sidebar-logo-link">
          <span className="dash-sidebar-brand">Source<span>ly</span></span>
          <span className="dash-sidebar-tag">Dashboard</span>
        </NavLink>
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
        <NavLink
          to="/dashboard/recommendations"
          className="dash-sidebar-link"
          onClick={() => {
            // 프로필 설정으로 이동하기 위한 이벤트
            window.dispatchEvent(new CustomEvent('open-seller-profile'))
          }}
        >
          <span className="dash-sidebar-icon">👤</span>
          셀러 프로필
        </NavLink>
        <NavLink to="/" className="dash-sidebar-link back-link">
          ← 홈으로
        </NavLink>
      </div>
    </aside>
  )
}
