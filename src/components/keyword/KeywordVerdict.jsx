import './KeywordVerdict.css'

const VERDICT_MAP = {
  recommended: { label: '진입 추천', color: 'var(--accent)' },
  hold: { label: '보통', color: '#FFD000' },
  not_recommended: { label: '비추천', color: 'var(--accent3)' },
}

const SCORE_BARS = [
  { key: 'demand', label: '수요', color: 'var(--accent2)' },
  { key: 'competition', label: '경쟁', color: 'var(--accent)' },
  { key: 'margin', label: '마진', color: '#FFD000' },
  { key: 'trend', label: '트렌드', color: '#A78BFA' },
]

function generateComment(scores, verdict) {
  const parts = []

  if (scores.competition >= 70) parts.push('경쟁이 적어 진입 기회가 있고')
  else if (scores.competition <= 30) parts.push('경쟁이 치열하고')

  if (scores.margin >= 70) parts.push('마진율이 높습니다')
  else if (scores.margin >= 45) parts.push('마진율이 보통입니다')
  else parts.push('마진율이 낮습니다')

  if (scores.trend >= 70) parts.push('트렌드도 상승 중입니다')
  else if (scores.trend <= 35) parts.push('트렌드가 하락세입니다')

  if (scores.demand >= 70) parts.push('수요도 충분합니다')

  if (verdict === 'recommended') {
    return parts.join('. ') + '. 진입을 추천합니다.'
  } else if (verdict === 'hold') {
    return parts.join('. ') + '. 신중한 검토가 필요합니다.'
  }
  return parts.join('. ') + '. 다른 키워드를 검토해보세요.'
}

export default function KeywordVerdict({ score, verdict, scores }) {
  if (score == null || !scores) return null

  const verdictInfo = VERDICT_MAP[verdict] || VERDICT_MAP.hold
  const circumference = 2 * Math.PI * 42
  const offset = circumference - (score / 100) * circumference
  const comment = generateComment(scores, verdict)

  return (
    <div className="kw-verdict">
      <h3 className="kw-verdict-title">AI 종합 판정</h3>
      <div className="kw-verdict-content">
        <div className="kw-verdict-score-wrap">
          <div className="kw-verdict-ring">
            <svg width="100" height="100" viewBox="0 0 100 100">
              <circle className="kw-verdict-ring-bg" cx="50" cy="50" r="42" />
              <circle
                className="kw-verdict-ring-fill"
                cx="50" cy="50" r="42"
                stroke={verdictInfo.color}
                strokeDasharray={circumference}
                strokeDashoffset={offset}
              />
            </svg>
            <span className="kw-verdict-ring-text" style={{ color: verdictInfo.color }}>
              {score}
            </span>
          </div>
          <span className={`kw-verdict-badge ${verdict}`}>
            {verdictInfo.label}
          </span>
        </div>

        <div className="kw-verdict-details">
          {SCORE_BARS.map(bar => (
            <div key={bar.key} className="kw-verdict-bar-item">
              <span className="kw-verdict-bar-label">{bar.label}</span>
              <div className="kw-verdict-bar-track">
                <div
                  className="kw-verdict-bar-fill"
                  style={{ width: `${scores[bar.key]}%`, background: bar.color }}
                />
              </div>
              <span className="kw-verdict-bar-value" style={{ color: bar.color }}>
                {scores[bar.key]}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="kw-verdict-comment">
        <span className="kw-verdict-comment-icon">💡</span>
        {comment}
      </div>
    </div>
  )
}
