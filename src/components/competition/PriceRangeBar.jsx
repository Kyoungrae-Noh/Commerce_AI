import './PriceRangeBar.css'

export default function PriceRangeBar({ min, max, avg }) {
  const range = max - min || 1
  const avgPct = ((avg - min) / range) * 100

  return (
    <div className="price-range">
      <h3 className="price-range-title">가격 분포</h3>
      <div className="price-range-bar-wrap">
        <div className="price-range-bar">
          <div className="price-range-fill" />
          <div className="price-range-avg" style={{ left: `${avgPct}%` }}>
            <div className="price-range-avg-line" />
            <div className="price-range-avg-label">평균<br />₩{avg.toLocaleString()}</div>
          </div>
        </div>
        <div className="price-range-labels">
          <span>₩{min.toLocaleString()}</span>
          <span>₩{max.toLocaleString()}</span>
        </div>
      </div>
    </div>
  )
}
