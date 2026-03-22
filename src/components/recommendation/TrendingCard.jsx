import VerdictBadge from '../dashboard/VerdictBadge'
import ScoreRing from '../shared/ScoreRing'
import './TrendingCard.css'

function getTrendDirection(monthlyTrend) {
  if (!monthlyTrend || monthlyTrend.length < 6) return 'flat'
  const recent = monthlyTrend.slice(-3).reduce((a, b) => a + b.ratio, 0) / 3
  const older = monthlyTrend.slice(-6, -3).reduce((a, b) => a + b.ratio, 0) / 3
  if (recent > older * 1.1) return 'up'
  if (recent < older * 0.9) return 'down'
  return 'flat'
}

const trendLabel = { up: '상승', down: '하락', flat: '유지' }
const trendArrow = { up: '↑', down: '↓', flat: '→' }

export default function TrendingCard({ item, onClick }) {
  const trend = getTrendDirection(item.monthlyTrend)

  return (
    <div className="trending-card" onClick={() => onClick(item)}>
      <div className="trending-card-top">
        <span className="trending-card-category">{item.categoryIcon} {item.categoryName}</span>
        <VerdictBadge verdict={item.verdict} size="small" />
      </div>

      <h4 className="trending-card-keyword">{item.keyword}</h4>

      <div className="trending-card-bottom">
        <ScoreRing score={item.sourcelyScore} size={44} strokeWidth={3} />
        <div className="trending-card-stats">
          <div className="trending-stat">
            <span className="trending-stat-label">평균가</span>
            <span className="trending-stat-value">₩{(item.avgPrice || 0).toLocaleString()}</span>
          </div>
          <div className="trending-stat">
            <span className="trending-stat-label">난이도</span>
            <span className="trending-stat-value">{item.difficulty}/10</span>
          </div>
          <div className="trending-stat">
            <span className="trending-stat-label">트렌드</span>
            <span className={`trending-stat-value trend-${trend}`}>
              {trendArrow[trend]} {trendLabel[trend]}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
