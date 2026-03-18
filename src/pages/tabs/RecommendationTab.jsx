import { useState } from 'react'
import KeywordSearch from '../../components/dashboard/KeywordSearch'
import ProductCard from '../../components/dashboard/ProductCard'
import ScoreBreakdown from '../../components/dashboard/ScoreBreakdown'
import VerdictBadge from '../../components/dashboard/VerdictBadge'
import ScoreRing from '../../components/shared/ScoreRing'
import StatCard from '../../components/shared/StatCard'
import { analyzeProduct } from '../../api/products'
import './RecommendationTab.css'

export default function RecommendationTab() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [result, setResult] = useState(null)

  const handleSearch = async (keyword) => {
    setLoading(true)
    setError(null)
    try {
      const data = await analyzeProduct(keyword)
      setResult(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rec-tab">
      <div className="rec-tab-header">
        <h2 className="rec-tab-title">AI 상품 분석</h2>
        <p className="rec-tab-desc">키워드를 입력하면 수익성을 분석해드립니다</p>
      </div>

      <KeywordSearch onSearch={handleSearch} loading={loading} placeholder="분석할 상품 키워드를 입력하세요  예: 미니 가습기" />

      {error && (
        <div className="rec-error">
          <span>⚠️ {error}</span>
        </div>
      )}

      {loading && (
        <div className="rec-loading">
          <div className="rec-loading-spinner" />
          <span>데이터 분석 중...</span>
        </div>
      )}

      {result && !loading && (
        <>
          {/* 요약 통계 */}
          <div className="rec-stats">
            <StatCard icon="🎯" value={result.sourcelyScore} label="소싱 점수" />
            <StatCard icon="📦" value={result.competitorCount?.toLocaleString() + '개'} label="경쟁 상품" />
            <StatCard icon="💰" value={'₩' + (result.avgPrice || 0).toLocaleString()} label="평균 판매가" />
            <StatCard icon="🏭" value={'₩' + (result.sourcingCost?.estimatedPrice || 0).toLocaleString()} label="예상 소싱가" />
          </div>

          <div className="rec-body">
            {/* 분석 결과 */}
            <div className="rec-detail" style={{ flex: 1 }}>
              <div className="rec-detail-header">
                <div>
                  <h3 className="rec-detail-name">{result.keyword}</h3>
                  <VerdictBadge verdict={result.verdict} size="large" />
                </div>
                <ScoreRing score={result.sourcelyScore} size={80} strokeWidth={4} label="소싱점수" />
              </div>

              <ScoreBreakdown scores={result.scores} />

              <div className="rec-detail-info">
                <h3 className="rec-section-title">분석 정보</h3>
                <div className="rec-detail-grid">
                  <div className="rec-detail-item">
                    <span className="rec-detail-item-label">경쟁 상품 수</span>
                    <span className="rec-detail-item-value">{(result.competitorCount || 0).toLocaleString()}개</span>
                  </div>
                  <div className="rec-detail-item">
                    <span className="rec-detail-item-label">평균 판매가</span>
                    <span className="rec-detail-item-value">₩{(result.avgPrice || 0).toLocaleString()}</span>
                  </div>
                  <div className="rec-detail-item">
                    <span className="rec-detail-item-label">예상 소싱가</span>
                    <span className="rec-detail-item-value">₩{(result.sourcingCost?.estimatedPrice || 0).toLocaleString()}</span>
                  </div>
                  <div className="rec-detail-item">
                    <span className="rec-detail-item-label">예상 배송비</span>
                    <span className="rec-detail-item-value">₩{(result.sourcingCost?.shippingEstimate || 0).toLocaleString()}</span>
                  </div>
                  <div className="rec-detail-item">
                    <span className="rec-detail-item-label">진입 난이도</span>
                    <span className="rec-detail-item-value">{result.competitionData?.difficulty?.overall || '-'} / 10</span>
                  </div>
                  <div className="rec-detail-item">
                    <span className="rec-detail-item-label">소싱가 참고</span>
                    <span className="rec-detail-item-value" style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>{result.sourcingCost?.note || ''}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {!result && !loading && !error && (
        <div className="rec-empty">
          <span className="rec-empty-icon">🔍</span>
          <p>키워드를 입력하면 AI가 수익성을 분석합니다</p>
          <p className="rec-empty-hint">예: 미니 가습기, 블루투스 이어폰, 강아지 자동 급식기</p>
        </div>
      )}
    </div>
  )
}
