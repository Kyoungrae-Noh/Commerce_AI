import './KeywordMarginCard.css'

const PLATFORM_LABELS = {
  smartStore: '스마트스토어',
  coupangRocket: '쿠팡 로켓',
}

export default function KeywordMarginCard({ sourcing, margin, avgPrice }) {
  if (!sourcing || !margin) return null

  return (
    <div className="kw-margin-card">
      <h3 className="kw-margin-title">플랫폼별 마진 분석</h3>
      <div className="kw-margin-platforms">
        {Object.entries(margin).map(([platform, data]) => {
          const isPositive = data.netProfit > 0
          return (
            <div key={platform} className="kw-margin-platform">
              <div className="kw-margin-platform-name">
                {PLATFORM_LABELS[platform] || platform}
              </div>
              <div className="kw-margin-rows">
                <div className="kw-margin-row">
                  <span className="kw-margin-row-label">판매가</span>
                  <span className="kw-margin-row-value">₩{avgPrice?.toLocaleString()}</span>
                </div>
                <div className="kw-margin-row">
                  <span className="kw-margin-row-label">소싱가 (추정)</span>
                  <span className="kw-margin-row-value">-₩{sourcing.estimatedPrice?.toLocaleString()}</span>
                </div>
                <div className="kw-margin-row">
                  <span className="kw-margin-row-label">해외배송비</span>
                  <span className="kw-margin-row-value">-₩{sourcing.shippingEstimate?.toLocaleString()}</span>
                </div>
                <div className="kw-margin-row">
                  <span className="kw-margin-row-label">국내배송비</span>
                  <span className="kw-margin-row-value">-₩3,000</span>
                </div>
                <div className="kw-margin-row">
                  <span className="kw-margin-row-label">플랫폼 수수료</span>
                  <span className="kw-margin-row-value">-₩{data.commission?.toLocaleString()}</span>
                </div>
                {data.fulfillmentFee > 0 && (
                  <div className="kw-margin-row">
                    <span className="kw-margin-row-label">풀필먼트비</span>
                    <span className="kw-margin-row-value">-₩{data.fulfillmentFee?.toLocaleString()}</span>
                  </div>
                )}
                <div className="kw-margin-row total">
                  <span className="kw-margin-row-label">총 비용</span>
                  <span className="kw-margin-row-value">₩{data.totalCost?.toLocaleString()}</span>
                </div>
              </div>
              <div className={`kw-margin-profit ${isPositive ? 'positive' : 'negative'}`}>
                <span className="kw-margin-profit-label">순이익</span>
                <span>
                  <span className="kw-margin-profit-value">
                    {isPositive ? '+' : ''}₩{data.netProfit?.toLocaleString()}
                  </span>
                  <span className="kw-margin-rate">({data.marginRate}%)</span>
                </span>
              </div>
            </div>
          )
        })}
      </div>
      <p className="kw-margin-note">{sourcing.note}</p>
    </div>
  )
}
