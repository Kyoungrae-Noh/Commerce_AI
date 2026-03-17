import { useState } from 'react'
import KeywordSearch from '../../components/dashboard/KeywordSearch'
import CategoryFilter from '../../components/dashboard/CategoryFilter'
import ProductCard from '../../components/dashboard/ProductCard'
import ScoreBreakdown from '../../components/dashboard/ScoreBreakdown'
import VerdictBadge from '../../components/dashboard/VerdictBadge'
import ScoreRing from '../../components/shared/ScoreRing'
import StatCard from '../../components/shared/StatCard'
import { mockProducts } from '../../data/mockData'
import './RecommendationTab.css'

export default function RecommendationTab() {
  const [category, setCategory] = useState('all')
  const [selectedProduct, setSelectedProduct] = useState(mockProducts[0])

  const filtered = category === 'all'
    ? mockProducts
    : mockProducts.filter(p => p.category === category)

  return (
    <div className="rec-tab">
      <div className="rec-tab-header">
        <h2 className="rec-tab-title">AI 상품 추천</h2>
        <p className="rec-tab-desc">시장 데이터 기반 소싱 추천 상품을 확인하세요</p>
      </div>

      <KeywordSearch onSearch={(kw) => console.log('search:', kw)} placeholder="분석할 상품 키워드를 입력하세요  예: 미니 가습기" />
      <CategoryFilter active={category} onChange={setCategory} />

      {/* 요약 통계 */}
      <div className="rec-stats">
        <StatCard icon="📦" value={filtered.length} label="추천 상품" />
        <StatCard icon="✓" value={filtered.filter(p => p.verdict === 'recommended').length} label="추천" trend={12} />
        <StatCard icon="△" value={filtered.filter(p => p.verdict === 'hold').length} label="보류" />
        <StatCard icon="✕" value={filtered.filter(p => p.verdict === 'not_recommended').length} label="비추천" />
      </div>

      <div className="rec-body">
        {/* 상품 리스트 */}
        <div className="rec-list">
          <h3 className="rec-section-title">상품 랭킹</h3>
          <div className="rec-list-items">
            {filtered.map(p => (
              <div key={p.id} onClick={() => setSelectedProduct(p)} className={`rec-list-item-wrap ${selectedProduct?.id === p.id ? 'selected' : ''}`}>
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        </div>

        {/* 선택 상품 상세 */}
        {selectedProduct && (
          <div className="rec-detail">
            <div className="rec-detail-header">
              <div>
                <h3 className="rec-detail-name">{selectedProduct.name}</h3>
                <VerdictBadge verdict={selectedProduct.verdict} size="large" />
              </div>
              <ScoreRing score={selectedProduct.sourcelyScore} size={80} strokeWidth={4} label="소싱점수" />
            </div>

            <ScoreBreakdown scores={selectedProduct.scores} />

            <div className="rec-detail-info">
              <h3 className="rec-section-title">상품 정보</h3>
              <div className="rec-detail-grid">
                <div className="rec-detail-item">
                  <span className="rec-detail-item-label">월간 검색량</span>
                  <span className="rec-detail-item-value">{selectedProduct.monthlySearchVolume.toLocaleString()}</span>
                </div>
                <div className="rec-detail-item">
                  <span className="rec-detail-item-label">경쟁 상품 수</span>
                  <span className="rec-detail-item-value">{selectedProduct.competitorCount}개</span>
                </div>
                <div className="rec-detail-item">
                  <span className="rec-detail-item-label">평균 판매가</span>
                  <span className="rec-detail-item-value">₩{selectedProduct.avgPrice.toLocaleString()}</span>
                </div>
                <div className="rec-detail-item">
                  <span className="rec-detail-item-label">예상 마진율</span>
                  <span className="rec-detail-item-value" style={{ color: 'var(--accent)' }}>{selectedProduct.estimatedMargin}%</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
