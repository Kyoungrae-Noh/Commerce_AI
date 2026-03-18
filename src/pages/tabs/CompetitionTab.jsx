import { useState } from 'react'
import KeywordSearch from '../../components/dashboard/KeywordSearch'
import CompetitorTable from '../../components/competition/CompetitorTable'
import DifficultyMeter from '../../components/competition/DifficultyMeter'
import PriceRangeBar from '../../components/competition/PriceRangeBar'
import StatCard from '../../components/shared/StatCard'
import { getCompetition } from '../../api/competition'
import './CompetitionTab.css'

export default function CompetitionTab() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [data, setData] = useState(null)

  const handleSearch = async (kw) => {
    setLoading(true)
    setError(null)
    try {
      const result = await getCompetition(kw)
      setData(result)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const topSeller = data?.topSellers?.[0]

  return (
    <div className="comp-tab">
      <div className="comp-tab-header">
        <h2 className="comp-tab-title">경쟁 분석</h2>
        <p className="comp-tab-desc">키워드별 상위 셀러와 진입 난이도를 분석합니다</p>
      </div>

      <KeywordSearch onSearch={handleSearch} loading={loading} placeholder="분석할 키워드를 입력하세요  예: 미니 가습기, 블루투스 이어폰" />

      {error && (
        <div style={{ color: 'var(--accent3)', padding: '1rem', textAlign: 'center' }}>
          ⚠️ {error}
        </div>
      )}

      {loading && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.75rem', padding: '3rem', color: 'var(--muted)' }}>
          <div className="rec-loading-spinner" />
          <span>경쟁 분석 중...</span>
        </div>
      )}

      {data && !loading && (
        <>
          <div className="comp-keyword-badge">
            <span className="comp-keyword-label">분석 키워드</span>
            <span className="comp-keyword-value">"{data.keyword}"</span>
          </div>

          {/* 요약 통계 */}
          <div className="comp-stats">
            <StatCard icon="👤" value={data.topSellers.length + '명'} label="상위 셀러" />
            {topSeller && (
              <>
                <StatCard icon="⭐" value={topSeller.rating} label="1위 평점" />
                <StatCard icon="💬" value={topSeller.reviewCount.toLocaleString() + '개'} label="1위 리뷰" />
                <StatCard icon="💰" value={'₩' + (topSeller.estimatedMonthlyRevenue / 10000).toLocaleString() + '만'} label="1위 월매출" />
              </>
            )}
          </div>

          <div className="comp-body">
            <div className="comp-side">
              <DifficultyMeter difficulty={data.difficulty} />
              <PriceRangeBar min={data.priceRange.min} max={data.priceRange.max} avg={data.priceRange.avg} />
            </div>
            <div className="comp-main">
              <h3 className="comp-section-title">상위 셀러 랭킹</h3>
              <CompetitorTable data={data.topSellers} />
            </div>
          </div>
        </>
      )}

      {!data && !loading && !error && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', padding: '4rem 2rem', color: 'var(--muted)' }}>
          <span style={{ fontSize: '2.5rem' }}>📊</span>
          <p>키워드를 입력하면 경쟁 현황을 분석합니다</p>
        </div>
      )}
    </div>
  )
}
