import { useState, useEffect, useMemo } from 'react'
import KeywordSearch from '../../components/dashboard/KeywordSearch'
import ScoreBreakdown from '../../components/dashboard/ScoreBreakdown'
import VerdictBadge from '../../components/dashboard/VerdictBadge'
import ScoreRing from '../../components/shared/ScoreRing'
import StatCard from '../../components/shared/StatCard'
import { LoadingState, ErrorState, EmptyState } from '../../components/shared/StatusStates'
import TrendingCard from '../../components/recommendation/TrendingCard'
import CategoryFilter from '../../components/recommendation/CategoryFilter'
import BestSellers from '../../components/recommendation/BestSellers'
import SellerProfileSetup, { loadProfile, ProfileSummary } from '../../components/profile/SellerProfileSetup'
import { analyzeProduct, getTrending, getBestSellers } from '../../api/products'
import './RecommendationTab.css'

export default function RecommendationTab() {
  // 수동 검색 상태 (기존)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [result, setResult] = useState(null)

  // 프로필 상태
  const [profile, setProfile] = useState(() => loadProfile())
  const [showProfileSetup, setShowProfileSetup] = useState(false)

  // 트렌딩 상태 (신규)
  const [trending, setTrending] = useState(null)
  const [trendingLoading, setTrendingLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [bestSellers, setBestSellers] = useState(null)

  useEffect(() => {
    loadTrending()
    loadBestSellers()
  }, [])

  const loadTrending = async (category = null) => {
    setTrendingLoading(true)
    try {
      const data = await getTrending(category)
      setTrending(data)
    } catch (err) {
      console.error('Trending load error:', err)
    } finally {
      setTrendingLoading(false)
    }
  }

  const loadBestSellers = async () => {
    try {
      const data = await getBestSellers()
      setBestSellers(data.bestSellers)
    } catch (err) {
      console.error('Best sellers error:', err)
    }
  }

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId)
    loadTrending(categoryId)
  }

  const handleTrendingClick = async (item) => {
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const data = await analyzeProduct(item.keyword)
      setResult(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async (keyword) => {
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const data = await analyzeProduct(keyword)
      setResult(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleBackToList = () => {
    setResult(null)
    setError(null)
  }

  const handleProfileSave = (newProfile) => {
    setProfile(newProfile)
    setShowProfileSetup(false)
  }

  // 프로필 기반 필터링
  const filteredItems = useMemo(() => {
    if (!trending?.items) return []
    if (!profile) return trending.items

    return trending.items.filter(item => {
      // 자본금 필터: 소싱가 + 배송비 < 자본금의 10%
      const investLimit = profile.capital * 0.1
      const itemCost = (item.sourcingCost?.estimatedPrice || 0) + (item.sourcingCost?.shippingEstimate || 3000)
      if (itemCost > investLimit) return false

      // 경험 필터: 난이도 제한
      const difficulty = item.difficulty?.overall || item.difficulty || 5
      if (profile.experience === 'beginner' && difficulty > 5) return false
      if (profile.experience === 'intermediate' && difficulty > 7) return false

      // 리스크 필터: verdict 기반
      if (profile.risk === 'safe' && item.verdict !== 'recommended') return false
      if (profile.risk === 'balanced' && item.verdict === 'not_recommended') return false

      // 카테고리 필터: 선호 카테고리가 있으면 적용
      if (profile.categories?.length > 0 && !profile.categories.includes(item.category)) return false

      return true
    })
  }, [trending, profile])

  return (
    <div className="rec-tab">
      <div className="rec-tab-header">
        <h2 className="rec-tab-title">
          {result ? 'AI 상품 분석' : 'AI 상품 추천'}
        </h2>
        <p className="rec-tab-desc">
          {result
            ? '키워드 분석 결과'
            : '트렌딩 상품을 자동으로 분석하여 추천합니다'}
        </p>
        {trending?.lastUpdated && !result && (
          <span className="rec-last-updated">
            마지막 업데이트: {new Date(trending.lastUpdated).toLocaleString('ko-KR')}
          </span>
        )}
      </div>

      <KeywordSearch onSearch={handleSearch} loading={loading} placeholder="분석할 상품 키워드를 입력하세요  예: 미니 가습기" />

      {error && <ErrorState message={error} />}
      {loading && <LoadingState />}

      {/* 상세 분석 뷰 */}
      {result && !loading && (
        <>
          <button className="rec-back-btn" onClick={handleBackToList}>
            ← 추천 목록으로 돌아가기
          </button>

          <div className="rec-stats">
            <StatCard icon="🎯" value={result.sourcelyScore} label="소싱 점수" />
            <StatCard icon="📦" value={(result.competitorCount || 0).toLocaleString() + '개'} label="경쟁 상품" />
            <StatCard icon="💰" value={'₩' + (result.avgPrice || 0).toLocaleString()} label="평균 판매가" />
            <StatCard icon="🏭" value={'₩' + (result.sourcingCost?.estimatedPrice || 0).toLocaleString()} label="예상 소싱가" />
          </div>

          <div className="rec-body">
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

      {/* 프로필 설정 뷰 */}
      {!result && !loading && !error && (!profile || showProfileSetup) && (
        <SellerProfileSetup
          onSave={handleProfileSave}
          initialProfile={profile}
        />
      )}

      {/* 트렌딩 목록 뷰 (기본) */}
      {!result && !loading && !error && profile && !showProfileSetup && (
        <>
          <ProfileSummary profile={profile} onEdit={() => setShowProfileSetup(true)} />

          {trendingLoading ? (
            <LoadingState message="맞춤 추천 상품 불러오는 중..." />
          ) : filteredItems.length > 0 ? (
            <>
              <CategoryFilter
                categories={trending.categories}
                selected={selectedCategory}
                onSelect={handleCategorySelect}
              />
              <div className="trending-grid">
                {filteredItems.map((item, i) => (
                  <TrendingCard
                    key={`${item.keyword}-${i}`}
                    item={item}
                    onClick={handleTrendingClick}
                  />
                ))}
              </div>

              {bestSellers && bestSellers.length > 0 && (
                <BestSellers data={bestSellers} />
              )}
            </>
          ) : trending?.items?.length > 0 ? (
            <EmptyState
              icon="🔍"
              message="프로필 조건에 맞는 추천 상품이 없습니다"
              hint="프로필 조건을 조정하거나 키워드를 직접 검색해보세요"
            />
          ) : trending?.isRefreshing ? (
            <EmptyState
              icon="📊"
              message="추천 데이터를 준비 중입니다"
              hint="서버에서 상품을 분석 중입니다. 약 1-2분 소요됩니다."
            />
          ) : (
            <EmptyState
              icon="🔍"
              message="추천 데이터가 아직 없습니다"
              hint="서버를 시작하면 자동으로 분석이 시작됩니다. 키워드를 직접 검색할 수도 있습니다."
            />
          )}
        </>
      )}
    </div>
  )
}
