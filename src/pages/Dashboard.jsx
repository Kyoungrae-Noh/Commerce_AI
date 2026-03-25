import { useParams, Navigate } from 'react-router-dom'
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

export default function Dashboard() {
  const { tab } = useParams()

  if (!tab || !tabComponents[tab]) {
    return <Navigate to="/dashboard/recommendations" replace />
  }

  const TabContent = tabComponents[tab]

  return <TabContent />
}
