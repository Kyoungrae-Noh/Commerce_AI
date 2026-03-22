import { useParams, Navigate, NavLink } from 'react-router-dom'
import DashboardSidebar from '../components/dashboard/DashboardSidebar'
import RecommendationTab from './tabs/RecommendationTab'
import KeywordTab from './tabs/KeywordTab'
import CompetitionTab from './tabs/CompetitionTab'
import RankingTab from './tabs/RankingTab'
import SourcingTab from './tabs/SourcingTab'
import UtilityTab from './tabs/UtilityTab'
import DiscoveryTab from './tabs/DiscoveryTab'
import './Dashboard.css'

const tabComponents = {
  recommendations: RecommendationTab,
  discovery: DiscoveryTab,
  keywords: KeywordTab,
  competition: CompetitionTab,
  ranking: RankingTab,
  sourcing: SourcingTab,
  utility: UtilityTab,
}

const mobileTabs = [
  { to: '/dashboard/recommendations', icon: '⚡', label: 'AI 추천' },
  { to: '/dashboard/discovery', icon: '💎', label: '아이템발굴' },
  { to: '/dashboard/keywords', icon: '🔍', label: '키워드' },
  { to: '/dashboard/competition', icon: '📊', label: '경쟁 분석' },
  { to: '/dashboard/ranking', icon: '🏆', label: '랭킹추적' },
  { to: '/dashboard/sourcing', icon: '🏭', label: '소싱' },
]

export default function Dashboard() {
  const { tab } = useParams()

  if (!tab || !tabComponents[tab]) {
    return <Navigate to="/dashboard/recommendations" replace />
  }

  const TabContent = tabComponents[tab]

  return (
    <div className="dashboard-layout">
      <DashboardSidebar />
      {/* Mobile tab bar */}
      <div className="dash-mobile-tabs">
        {mobileTabs.map(t => (
          <NavLink
            key={t.to}
            to={t.to}
            className={({ isActive }) => `dash-mobile-tab ${isActive ? 'active' : ''}`}
          >
            <span>{t.icon}</span>
            {t.label}
          </NavLink>
        ))}
      </div>
      <main className="dashboard-content">
        <TabContent />
      </main>
    </div>
  )
}
