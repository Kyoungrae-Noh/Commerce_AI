import './ProfitResult.css'

function getMarginColor(rate) {
  if (rate >= 30) return 'var(--accent)'
  if (rate >= 15) return '#FFD000'
  return 'var(--accent3)'
}

export default function ProfitResult({ result }) {
  const marginColor = getMarginColor(result.marginRate)

  return (
    <div className="profit-result">
      <h3 className="profit-result-title">수익 분석</h3>

      <div className="profit-main-cards">
        <div className="profit-card highlight">
          <span className="profit-card-label">예상 순이익</span>
          <span className="profit-card-value" style={{ color: result.netProfit >= 0 ? 'var(--accent)' : 'var(--accent3)' }}>
            ₩{result.netProfit.toLocaleString()}
          </span>
        </div>
        <div className="profit-card highlight">
          <span className="profit-card-label">마진율</span>
          <span className="profit-card-value" style={{ color: marginColor }}>
            {result.marginRate.toFixed(1)}%
          </span>
        </div>
      </div>

      <div className="profit-breakdown">
        <h4 className="profit-breakdown-title">비용 구조</h4>
        {result.breakdown.map((item, i) => (
          <div className="profit-breakdown-row" key={i}>
            <span className="profit-breakdown-label">{item.label}</span>
            <span className="profit-breakdown-value" style={item.isTotal ? { color: 'var(--text)', fontWeight: 700 } : {}}>
              ₩{item.value.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
