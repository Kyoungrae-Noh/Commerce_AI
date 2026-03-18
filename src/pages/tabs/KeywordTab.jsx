import { useState } from 'react'
import KeywordSearch from '../../components/dashboard/KeywordSearch'
import KeywordTable from '../../components/keyword/KeywordTable'
import RelatedKeywords from '../../components/keyword/RelatedKeywords'
import TrendChart from '../../components/keyword/TrendChart'
import StatCard from '../../components/shared/StatCard'
import { searchKeyword } from '../../api/keywords'
import './KeywordTab.css'

export default function KeywordTab() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [data, setData] = useState(null)

  const handleSearch = async (kw) => {
    setLoading(true)
    setError(null)
    try {
      const result = await searchKeyword(kw)
      setData(result)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="kw-tab">
      <div className="kw-tab-header">
        <h2 className="kw-tab-title">키워드 분석</h2>
        <p className="kw-tab-desc">키워드별 검색량, 경쟁도, 시즌 트렌드를 분석합니다</p>
      </div>

      <KeywordSearch onSearch={handleSearch} loading={loading} placeholder="분석할 키워드를 입력하세요  예: 미니 가습기, 블루투스 이어폰" />

      {error && (
        <div className="kw-error" style={{ color: 'var(--accent3)', padding: '1rem', textAlign: 'center' }}>
          ⚠️ {error}
        </div>
      )}

      {loading && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.75rem', padding: '3rem', color: 'var(--muted)' }}>
          <div className="rec-loading-spinner" />
          <span>데이터 분석 중...</span>
        </div>
      )}

      {data && !loading && (
        <>
          {/* 요약 통계 */}
          <div className="kw-stats">
            <StatCard icon="🔍" value={data.primary.monthlyVolume ? data.primary.monthlyVolume.toLocaleString() : '추정 불가'} label="월간 검색량" />
            <StatCard icon="📦" value={data.primary.competitorCount.toLocaleString() + '개'} label="경쟁 상품 수" />
            <StatCard icon="💰" value={'₩' + data.primary.avgPrice.toLocaleString()} label="평균 판매가" />
          </div>

          {/* 트렌드 차트 */}
          {data.monthlyTrend && data.monthlyTrend.length > 0 && (
            <TrendChart data={data.monthlyTrend} label={`"${data.primary.keyword}" 검색 트렌드`} />
          )}

          <div className="kw-bottom">
            {/* 키워드 테이블 */}
            <div className="kw-table-section">
              <h3 className="kw-section-title">키워드 상세</h3>
              <KeywordTable data={[data.primary]} />
            </div>

            {/* 연관 키워드 */}
            {data.related && data.related.length > 0 && (
              <RelatedKeywords keywords={data.related} onSelect={handleSearch} />
            )}
          </div>
        </>
      )}

      {!data && !loading && !error && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', padding: '4rem 2rem', color: 'var(--muted)' }}>
          <span style={{ fontSize: '2.5rem' }}>🔍</span>
          <p>키워드를 입력하면 검색 트렌드와 경쟁 현황을 분석합니다</p>
        </div>
      )}
    </div>
  )
}
