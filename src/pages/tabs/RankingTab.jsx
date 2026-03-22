import { useState } from 'react'
import StatCard from '../../components/shared/StatCard'
import { LoadingState, ErrorState, EmptyState } from '../../components/shared/StatusStates'
import { checkRanking } from '../../api/ranking'
import './RankingTab.css'

export default function RankingTab() {
  const [keyword, setKeyword] = useState('')
  const [storeName, setStoreName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [result, setResult] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!keyword.trim() || !storeName.trim()) return

    setLoading(true)
    setError(null)
    try {
      const data = await checkRanking(keyword.trim(), storeName.trim())
      setResult(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rank-tab">
      <div className="rank-tab-header">
        <h2 className="rank-tab-title">실시간 랭킹추적</h2>
        <p className="rank-tab-desc">키워드와 스토어명을 입력하면 네이버쇼핑 검색 순위를 확인합니다</p>
      </div>

      <form className="rank-search-form" onSubmit={handleSubmit}>
        <div className="rank-platform-toggle">
          <label className="rank-platform active">
            <input type="radio" name="platform" value="naver" defaultChecked />
            네이버쇼핑
          </label>
          <label className="rank-platform disabled">
            <input type="radio" name="platform" value="coupang" disabled />
            쿠팡 (준비중)
          </label>
        </div>
        <div className="rank-inputs">
          <input
            type="text"
            className="rank-input"
            placeholder="키워드"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <input
            type="text"
            className="rank-input"
            placeholder="스토어명 또는 상품 URL"
            value={storeName}
            onChange={(e) => setStoreName(e.target.value)}
          />
          <button type="submit" className="rank-submit" disabled={loading || !keyword.trim() || !storeName.trim()}>
            {loading ? '검색 중...' : '검색'}
          </button>
        </div>
      </form>

      {error && <ErrorState message={error} />}
      {loading && <LoadingState message="순위를 검색하는 중..." />}

      {result && !loading && (
        <>
          <div className="rank-stats">
            <StatCard
              icon="🏆"
              value={result.foundCount > 0 ? `${result.results[0].rank}위` : '미노출'}
              label="최고 순위"
            />
            <StatCard
              icon="📦"
              value={result.foundCount + '개'}
              label="노출 상품 수"
            />
            <StatCard
              icon="🔍"
              value={result.totalProducts.toLocaleString() + '개'}
              label="전체 상품 수"
            />
          </div>

          {result.foundCount > 0 ? (
            <div className="rank-results">
              <h3 className="rank-section-title">
                "{result.keyword}" 검색 결과에서 "{result.storeName}" 상품
              </h3>
              <div className="rank-result-list">
                {result.results.map((item, i) => (
                  <div key={i} className="rank-result-item">
                    <div className="rank-result-rank">
                      <span className="rank-number">{item.rank}</span>
                      <span className="rank-label">위</span>
                    </div>
                    {item.image && (
                      <img className="rank-result-img" src={item.image} alt={item.title} />
                    )}
                    <div className="rank-result-info">
                      <p className="rank-result-title">{item.title}</p>
                      <div className="rank-result-meta">
                        <span className="rank-result-mall">{item.mallName}</span>
                        <span className="rank-result-price">₩{item.price?.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <EmptyState
              icon="📊"
              message={`"${result.keyword}" 검색 결과 상위 ${result.searchedCount}개에서 "${result.storeName}" 상품을 찾지 못했습니다`}
              hint="스토어명을 정확히 입력했는지 확인해주세요"
            />
          )}

          <span className="rank-checked-at">
            확인 시간: {new Date(result.checkedAt).toLocaleString('ko-KR')}
          </span>
        </>
      )}

      {!result && !loading && !error && (
        <div className="rank-preview">
          <EmptyState
            icon="📊"
            message="키워드와 스토어명을 입력하면 검색 순위를 확인합니다"
            hint="예: 키워드 '미니 가습기' + 스토어명 '비타플랜'"
          />
        </div>
      )}
    </div>
  )
}
