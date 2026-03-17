import ScoreRing from '../shared/ScoreRing'
import VerdictBadge from './VerdictBadge'
import './ProductCard.css'

export default function ProductCard({ product }) {
  return (
    <div className="product-card">
      <span className="product-card-rank">#{product.rank}</span>
      <div className="product-card-icon" style={{ background: product.iconBg }}>
        {product.icon}
      </div>
      <div className="product-card-info">
        <div className="product-card-name">{product.name}</div>
        <div className="product-card-meta">
          검색량 {product.monthlySearchVolume.toLocaleString()} · 경쟁 {product.competitorCount}개 · 평균가 ₩{product.avgPrice.toLocaleString()}
        </div>
      </div>
      <VerdictBadge verdict={product.verdict} />
      <div className="product-card-margin">
        <span className="product-card-margin-val">{product.estimatedMargin}%</span>
        <span className="product-card-margin-lbl">마진율</span>
      </div>
      <ScoreRing score={product.sourcelyScore} size={52} strokeWidth={3} />
    </div>
  )
}
