import './DifficultyMeter.css'

function getDifficultyColor(score) {
  if (score <= 3) return 'var(--accent)'
  if (score <= 6) return '#FFD000'
  return 'var(--accent3)'
}

function getDifficultyLabel(score) {
  if (score <= 3) return '쉬움'
  if (score <= 6) return '보통'
  return '어려움'
}

const priceCompLabels = {
  low: '낮음',
  medium: '보통',
  high: '높음',
  very_high: '매우 높음',
}

export default function DifficultyMeter({ difficulty }) {
  const color = getDifficultyColor(difficulty.overall)
  const pct = (difficulty.overall / 10) * 100

  return (
    <div className="difficulty-meter">
      <h3 className="difficulty-meter-title">진입 난이도</h3>

      <div className="difficulty-gauge">
        <div className="difficulty-gauge-track">
          <div className="difficulty-gauge-fill" style={{ width: `${pct}%`, background: color }} />
        </div>
        <div className="difficulty-gauge-info">
          <span className="difficulty-gauge-score" style={{ color }}>{difficulty.overall}</span>
          <span className="difficulty-gauge-max">/ 10</span>
          <span className="difficulty-gauge-label" style={{ color }}>{getDifficultyLabel(difficulty.overall)}</span>
        </div>
      </div>

      <div className="difficulty-details">
        <div className="difficulty-item">
          <span className="difficulty-item-label">리뷰 진입장벽</span>
          <span className="difficulty-item-value">{difficulty.reviewBarrier}</span>
        </div>
        <div className="difficulty-item">
          <span className="difficulty-item-label">예상 클릭 광고비</span>
          <span className="difficulty-item-value">₩{difficulty.estimatedAdCost.toLocaleString()}/클릭</span>
        </div>
        <div className="difficulty-item">
          <span className="difficulty-item-label">가격 경쟁도</span>
          <span className="difficulty-item-value">{priceCompLabels[difficulty.priceCompetition] || difficulty.priceCompetition}</span>
        </div>
      </div>
    </div>
  )
}
