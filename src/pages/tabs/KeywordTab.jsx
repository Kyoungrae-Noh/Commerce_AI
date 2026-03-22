import { useState, useEffect } from 'react'
import KeywordSearch from '../../components/dashboard/KeywordSearch'
import KeywordTable from '../../components/keyword/KeywordTable'
import RelatedKeywords from '../../components/keyword/RelatedKeywords'
import TrendChart from '../../components/keyword/TrendChart'
import TrendingKeywordTable from '../../components/keyword/TrendingKeywordTable'
import StatCard from '../../components/shared/StatCard'
import { LoadingState, ErrorState, EmptyState } from '../../components/shared/StatusStates'
import { searchKeyword, getTrendingKeywords } from '../../api/keywords'
import './KeywordTab.css'

export default function KeywordTab() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [data, setData] = useState(null)

  // 트렌드 키워드
  const [trending, setTrending] = useState(null)
  const [trendingLoading, setTrendingLoading] = useState(true)

  useEffect(() => {
    loadTrending()
  }, [])

  const loadTrending = async () => {
    setTrendingLoading(true)
    try {
      const result = await getTrendingKeywords()
      setTrending(result)
    } catch (err) {
      console.error('Trending keywords error:', err)
    } finally {
      setTrendingLoading(false)
    }
  }

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

  const handleBackToTrending = () => {
    setData(null)
    setError(null)
  }

  return (
    <div className="kw-tab">
      <div className="kw-tab-header">
        <h2 className="kw-tab-title">키워드 분석</h2>
        <p className="kw-tab-desc">키워드별 검색량, 경쟁도, 시즌 트렌드를 분석합니다</p>
      </div>

      <KeywordSearch onSearch={handleSearch} loading={loading} placeholder="분석할 키워드를 입력하세요  예: 미니 가습기, 블루투스 이어폰" />

      {error && <ErrorState message={error} />}
      {loading && <LoadingState />}

      {/* 키워드 분석 결과 */}
      {data && !loading && (
        <>
          <button className="kw-back-btn" onClick={handleBackToTrending}>
            ← 트렌드 키워드로 돌아가기
          </button>

          <div className="kw-stats">
            <StatCard icon="🔍" value={data.primary.monthlyVolume ? data.primary.monthlyVolume.toLocaleString() : '추정 불가'} label="월간 검색량" />
            <StatCard icon="📦" value={data.primary.competitorCount.toLocaleString() + '개'} label="경쟁 상품 수" />
            <StatCard icon="💰" value={'₩' + data.primary.avgPrice.toLocaleString()} label="평균 판매가" />
          </div>

          {data.monthlyTrend && data.monthlyTrend.length > 0 && (
            <TrendChart data={data.monthlyTrend} label={`"${data.primary.keyword}" 검색 트렌드`} />
          )}

          <div className="kw-bottom">
            <div className="kw-table-section">
              <h3 className="kw-section-title">키워드 상세</h3>
              <KeywordTable data={[data.primary]} />
            </div>

            {data.related && data.related.length > 0 && (
              <RelatedKeywords keywords={data.related} onSelect={handleSearch} />
            )}
          </div>
        </>
      )}

      {/* 트렌드 키워드 (기본 화면) */}
      {!data && !loading && !error && (
        <>
          {trendingLoading ? (
            <LoadingState message="트렌드 키워드 불러오는 중..." />
          ) : trending?.daily?.length > 0 ? (
            <div className="kw-trending-section">
              <h3 className="kw-trending-section-title">트렌드 키워드</h3>
              <div className="kw-trending-tables">
                <TrendingKeywordTable
                  data={trending.daily}
                  title="일간 트렌드 키워드"
                  timestamp={trending.lastUpdated}
                  onKeywordClick={handleSearch}
                />
                <TrendingKeywordTable
                  data={trending.weekly}
                  title="주간 트렌드 키워드"
                  timestamp={trending.lastUpdated}
                  onKeywordClick={handleSearch}
                />
              </div>
            </div>
          ) : (
            <EmptyState
              icon="🔍"
              message="키워드를 입력하면 검색 트렌드와 경쟁 현황을 분석합니다"
              hint="서버에서 트렌드 데이터를 준비 중입니다"
            />
          )}
        </>
      )}
    </div>
  )
}
