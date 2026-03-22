import './BestSellers.css'

export default function BestSellers({ data }) {
  if (!data || data.length === 0) return null

  const featured = data[0]
  const rest = data.slice(1)

  return (
    <div className="best-sellers">
      <h3 className="best-sellers-title">판매량 Best</h3>
      <p className="best-sellers-desc">네이버쇼핑에서 판매량이 높은 상품들입니다</p>

      <div className="best-sellers-layout">
        {/* 1위 대형 카드 */}
        <div className="best-seller-featured">
          <span className="best-seller-rank-badge">판매량 1위</span>
          {featured.image && (
            <div className="best-seller-featured-img">
              <img src={featured.image} alt={featured.title} />
            </div>
          )}
          <div className="best-seller-featured-info">
            <span className="best-seller-mall">{featured.mallName}</span>
            <h4 className="best-seller-featured-title">{featured.title}</h4>
            <span className="best-seller-price">₩{featured.price?.toLocaleString()}</span>
          </div>
        </div>

        {/* 2위~ 리스트 */}
        <div className="best-seller-list">
          {rest.map(item => (
            <div key={item.rank} className="best-seller-item">
              <span className="best-seller-rank">판매량 {item.rank}위</span>
              <div className="best-seller-item-content">
                {item.image && (
                  <img className="best-seller-thumb" src={item.image} alt={item.title} />
                )}
                <div className="best-seller-item-info">
                  <span className="best-seller-mall">{item.mallName}</span>
                  <p className="best-seller-item-title">{item.title}</p>
                  <span className="best-seller-price">₩{item.price?.toLocaleString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
