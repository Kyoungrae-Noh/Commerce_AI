import { useState } from 'react'
import KeywordSearch from '../../components/dashboard/KeywordSearch'
import StatCard from '../../components/shared/StatCard'
import { LoadingState, ErrorState, EmptyState } from '../../components/shared/StatusStates'
import { searchSourcing } from '../../api/sourcing'
import './SourcingTab.css'

export default function SourcingTab() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [result, setResult] = useState(null)

  const handleSearch = async (keyword) => {
    setLoading(true)
    setError(null)
    try {
      const data = await searchSourcing(keyword)
      setResult(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="src-tab">
      <div className="src-tab-header">
        <h2 className="src-tab-title">1688 소싱 탐색</h2>
        <p className="src-tab-desc">키워드를 입력하면 예상 소싱 비용과 마진을 분석합니다</p>
      </div>

      <KeywordSearch onSearch={handleSearch} loading={loading} placeholder="소싱할 상품 키워드를 입력하세요  예: 미니 가습기" />

      {error && <ErrorState message={error} />}
      {loading && <LoadingState message="소싱 정보 분석 중..." />}

      {result && !loading && (
        <>
          {/* 마진 요약 */}
          <div className="src-stats">
            <StatCard icon="💰" value={'₩' + (result.avgSellingPrice || 0).toLocaleString()} label="평균 판매가" />
            <StatCard icon="🏭" value={'₩' + (result.costEstimate?.estimatedPrice || 0).toLocaleString()} label="예상 소싱가" />
            <StatCard icon="🚢" value={'₩' + (result.costEstimate?.shippingEstimate || 0).toLocaleString()} label="예상 배송비" />
            <StatCard
              icon="📈"
              value={result.marginEstimate?.estimatedMarginRate + '%'}
              label="예상 마진율"
            />
          </div>

          {/* 마진 상세 */}
          <div className="src-margin-card">
            <h3 className="src-section-title">마진 분석 (스마트스토어 기준)</h3>
            <div className="src-margin-breakdown">
              <div className="src-margin-row">
                <span>평균 판매가</span>
                <span className="src-margin-value">₩{result.marginEstimate?.sellingPrice?.toLocaleString()}</span>
              </div>
              <div className="src-margin-row">
                <span>예상 소싱가</span>
                <span className="src-margin-value negative">-₩{result.marginEstimate?.sourcingCost?.toLocaleString()}</span>
              </div>
              <div className="src-margin-row">
                <span>국제 배송비</span>
                <span className="src-margin-value negative">-₩{result.marginEstimate?.shipping?.toLocaleString()}</span>
              </div>
              <div className="src-margin-row">
                <span>플랫폼 수수료 (5.5%)</span>
                <span className="src-margin-value negative">-₩{Math.round(result.marginEstimate?.sellingPrice * 0.055)?.toLocaleString()}</span>
              </div>
              <div className="src-margin-row total">
                <span>예상 순이익</span>
                <span className={`src-margin-value ${result.marginEstimate?.estimatedProfit >= 0 ? 'positive' : 'negative'}`}>
                  ₩{result.marginEstimate?.estimatedProfit?.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* 1688 검색 링크 */}
          <div className="src-links-card">
            <h3 className="src-section-title">소싱처에서 직접 검색</h3>
            <div className="src-links">
              <a href={result.searchLinks?.ali1688} target="_blank" rel="noopener noreferrer" className="src-link-btn">
                🇨🇳 1688.com에서 검색
              </a>
              <a href={result.searchLinks?.aliexpress} target="_blank" rel="noopener noreferrer" className="src-link-btn aliexpress">
                🌍 AliExpress에서 검색
              </a>
            </div>
            <p className="src-links-note">
              * 소싱가는 카테고리 기반 추정치입니다. 실제 가격은 위 링크에서 직접 확인하세요.
            </p>
          </div>

          {/* 네이버 쇼핑 상품 (경쟁 참고) */}
          {result.products?.length > 0 && (
            <div className="src-products-card">
              <h3 className="src-section-title">네이버쇼핑 판매 현황 (경쟁 참고)</h3>
              <div className="src-product-list">
                {result.products.map((item, i) => (
                  <div key={i} className="src-product-item">
                    {item.image && <img className="src-product-img" src={item.image} alt={item.title} />}
                    <div className="src-product-info">
                      <p className="src-product-title">{item.title}</p>
                      <div className="src-product-meta">
                        <span className="src-product-mall">{item.mallName}</span>
                        <span className="src-product-price">₩{item.price?.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {!result && !loading && !error && (
        <EmptyState
          icon="🏭"
          message="키워드를 입력하면 1688 소싱 비용을 분석합니다"
          hint="예: 미니 가습기, 블루투스 이어폰, 캠핑 의자"
        />
      )}
    </div>
  )
}
