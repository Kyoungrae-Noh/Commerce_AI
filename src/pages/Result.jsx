import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { analyzeKeyword } from '../api/ai'
import './Result.css'

const verdictLabel = {
  recommended: '추천',
  hold: '보류',
  not_recommended: '비추천',
}

const verdictClass = {
  recommended: 'verdict-good',
  hold: 'verdict-hold',
  not_recommended: 'verdict-bad',
}

const scoreLabels = { demand: '시장 관심도 (추정)', competition: '경쟁 강도 (상품 수 기반)', margin: '마진 (추정 소싱가 기반)', trend: '트렌드' }

const platformNames = { smartStore: '스마트스토어', coupangRocket: '쿠팡 로켓그로스' }

export default function Result() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const keyword = params.get('keyword') || ''

  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!keyword) return
    setLoading(true)
    setError(null)
    analyzeKeyword(keyword)
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [keyword])

  if (!keyword) {
    return (
      <div className="result-page">
        <div className="result-empty">
          <p>키워드가 입력되지 않았습니다.</p>
          <button className="result-back" onClick={() => navigate('/')}>홈으로</button>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="result-page">
        <div className="result-loading">
          <div className="result-spinner" />
          <p><strong>"{keyword}"</strong> 분석 중...</p>
          <p className="result-loading-sub">AI가 데이터를 수집하고 분석하고 있습니다</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="result-page">
        <div className="result-error">
          <p>분석 중 오류가 발생했습니다</p>
          <p className="result-error-detail">{error}</p>
          <button className="result-back" onClick={() => navigate('/')}>다시 시도</button>
        </div>
      </div>
    )
  }

  const { sourcelyScore, verdict, scores, data: resData, ai } = data

  return (
    <div className="result-page">
      <header className="result-header">
        <button className="result-back-link" onClick={() => navigate('/')}>← 홈</button>
        <h1 className="result-keyword">"{keyword}" 분석 결과</h1>
      </header>

      {/* Score overview */}
      <section className="result-score-section">
        <div className="result-main-score">
          <div className="result-score-ring">
            <span className="result-score-number">{sourcelyScore}</span>
            <span className="result-score-max">/100</span>
          </div>
          <span className={`result-verdict ${verdictClass[verdict] || ''}`}>
            {verdictLabel[verdict] || verdict}
          </span>
        </div>

        <div className="result-sub-scores">
          {Object.entries(scores).map(([key, val]) => (
            <div key={key} className="result-sub-score">
              <div className="result-sub-bar-bg">
                <div className="result-sub-bar" style={{ width: `${val}%` }} />
              </div>
              <div className="result-sub-label">
                <span>{scoreLabels[key] || key}</span>
                <span className="result-sub-val">{val}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Data cards */}
      <section className="result-data-cards">
        <div className="result-card">
          <span className="result-card-label">검색 트렌드</span>
          <span className="result-card-value">{resData.trendRatio >= 70 ? '높음' : resData.trendRatio >= 40 ? '보통' : resData.trendRatio != null ? '낮음' : '데이터 없음'}</span>
        </div>
        <div className="result-card">
          <span className="result-card-label">경쟁 상품 수</span>
          <span className="result-card-value">{resData.competitorCount?.toLocaleString()}개</span>
        </div>
        <div className="result-card">
          <span className="result-card-label">평균 판매가</span>
          <span className="result-card-value">{resData.avgPrice?.toLocaleString()}원</span>
        </div>
        <div className="result-card">
          <span className="result-card-label">경쟁 강도 (상품 수 기반)</span>
          <span className="result-card-value">{resData.difficulty ?? 'N/A'}/10</span>
        </div>
      </section>

      {/* Platform margins */}
      {resData.marginByPlatform && (
        <section className="result-section">
          <h2 className="result-section-title">플랫폼별 예상 마진</h2>
          <p className="result-estimate-warning">소싱가는 판매가의 약 30%로 추정한 값입니다. 실제 소싱가와 다를 수 있습니다.</p>
          <div className="result-margin-table">
            {Object.entries(resData.marginByPlatform).map(([name, m]) => (
              <div key={name} className="result-margin-row">
                <span className="result-margin-name">{platformNames[name] || name}</span>
                <span className={`result-margin-profit ${m.netProfit >= 0 ? 'positive' : 'negative'}`}>
                  {m.netProfit?.toLocaleString()}원
                </span>
                <span className="result-margin-rate">{m.marginRate}%</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* AI Analysis */}
      {ai && (
        <section className="result-section result-ai">
          <h2 className="result-section-title">AI 분석</h2>

          <div className="result-ai-block">
            <h3 className="ai-heading-conclusion">종합 결론</h3>
            <p>{ai.conclusion}</p>
          </div>

          <div className="result-ai-block">
            <h3 className="ai-heading-reasons">추천 이유</h3>
            <ul>
              {ai.reasons?.map((r, i) => <li key={i}>{r}</li>)}
            </ul>
          </div>

          <div className="result-ai-block">
            <h3 className="ai-heading-risks">리스크</h3>
            <ul>
              {ai.risks?.map((r, i) => <li key={i}>{r}</li>)}
            </ul>
          </div>

          <div className="result-ai-block">
            <h3 className="ai-heading-strategy">진입 전략</h3>
            <p>{ai.entryStrategy}</p>
          </div>
        </section>
      )}
    </div>
  )
}
