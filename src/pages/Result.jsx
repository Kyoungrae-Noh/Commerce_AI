import { useState, useEffect, useMemo } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { analyzeKeyword } from '../api/ai'
import Footer from '../components/shared/Footer'
import './Result.css'

const verdictLabel = {
  recommended: '추천',
  hold: '보통',
  not_recommended: '비추천',
}

const verdictClass = {
  recommended: 'verdict-good',
  hold: 'verdict-hold',
  not_recommended: 'verdict-bad',
}

function calcMargin(sellingPrice, sourcingCost, shippingCost, commissionRate) {
  const commission = Math.round(sellingPrice * (commissionRate / 100))
  const totalCost = sourcingCost + shippingCost + commission
  const netProfit = sellingPrice - totalCost
  const marginRate = sellingPrice > 0 ? Math.round((netProfit / sellingPrice) * 1000) / 10 : 0
  return { netProfit, marginRate }
}

export default function Result() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const keyword = params.get('keyword') || ''
  const category = params.get('category') || 'all'

  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [inputSellingPrice, setInputSellingPrice] = useState('')
  const [inputSourcingCost, setInputSourcingCost] = useState('')
  const [inputShippingCost, setInputShippingCost] = useState('')
  const [inputCommissionRate, setInputCommissionRate] = useState('')

  useEffect(() => {
    if (!keyword) return
    setLoading(true)
    setError(null)
    setInputSellingPrice('')
    setInputSourcingCost('')
    setInputShippingCost('')
    setInputCommissionRate('')
    analyzeKeyword(keyword, category)
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [keyword])

  const allFilled = inputSellingPrice !== '' && inputSourcingCost !== '' && inputShippingCost !== '' && inputCommissionRate !== ''

  const computed = useMemo(() => {
    if (!data) return null
    const { sourcelyScore, verdict } = data
    if (!allFilled) {
      return { sourcelyScore, verdict, margin: null }
    }
    const margin = calcMargin(Number(inputSellingPrice), Number(inputSourcingCost), Number(inputShippingCost), Number(inputCommissionRate))
    return { sourcelyScore, verdict, margin }
  }, [data, allFilled, inputSellingPrice, inputSourcingCost, inputShippingCost, inputCommissionRate])

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

  const { data: resData, ai } = data
  const { sourcelyScore, verdict, margin } = computed

  const competitionIntensity = (() => {
    if (!resData.monthlyVolume || !resData.competitorCount) return '데이터 없음'
    const ratio = resData.competitorCount / resData.monthlyVolume
    if (ratio <= 5) return '낮음'
    if (ratio <= 30) return '보통'
    return '높음'
  })()

  const growthLabel = (() => {
    const g = resData.trendGrowthRate
    if (g == null) return '데이터 없음'
    if (g >= 15) return '급상승'
    if (g >= 5) return '상승'
    if (g >= -5) return '유지'
    if (g >= -15) return '하락'
    return '급하락'
  })()

  return (
    <div className="result-page">
      <header className="result-header">
        <button className="result-back-link" onClick={() => navigate('/')}>← 홈</button>
        <h1 className="result-keyword">"{keyword}" 분석 결과</h1>
      </header>

      {/* Score overview */}
      <section className="result-score-section">
        <span className={`result-verdict ${verdictClass[verdict] || ''}`}>
          {verdictLabel[verdict] || verdict}
        </span>
        <span className="score-tooltip-wrap score-tooltip-topright">
          <span className="score-tooltip-icon">?</span>
          <span className="score-tooltip">월간검색량(33%) + 경쟁용이도(34%) + 트렌드(33%)</span>
        </span>
        <div className="result-main-score">
          <div className="result-score-ring">
            <span className="result-score-number">{sourcelyScore}</span>
            <span className="result-score-max">/100</span>
          </div>
        </div>
      </section>

      {/* AI Analysis */}
      {ai && (
        <section className="result-section result-ai">
          <h2 className="result-section-title">AI 분석</h2>

          <div className="result-ai-block">
            <h3 className="ai-heading-conclusion">종합 결론</h3>
            <p>{ai.conclusion}</p>
          </div>

          {sourcelyScore >= 70 && (
            <>
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
            </>
          )}

          {sourcelyScore >= 40 && sourcelyScore < 70 && (
            <>
              {ai.positives?.length > 0 && (
                <div className="result-ai-block">
                  <h3 className="ai-heading-reasons">긍정 요소</h3>
                  <ul>
                    {ai.positives.map((r, i) => <li key={i}>{r}</li>)}
                  </ul>
                </div>
              )}
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
            </>
          )}

          {sourcelyScore < 40 && (
            <>
              <div className="result-ai-block">
                <h3 className="ai-heading-risks">리스크</h3>
                <ul>
                  {ai.risks?.map((r, i) => <li key={i}>{r}</li>)}
                </ul>
              </div>
              <div className="result-ai-block">
                <h3 className="ai-heading-strategy">그럼에도 진입한다면</h3>
                <p>{ai.ifEntry}</p>
              </div>
            </>
          )}
        </section>
      )}

      {/* Margin calculator */}
      <section className="result-section">
        <h2 className="result-section-title">마진 계산기</h2>
        <div className="margin-inputs">
          <div className="sourcing-input-row">
            <label className="sourcing-input-label">판매가</label>
            <div className="sourcing-input-wrap">
              <input
                type="number"
                className="sourcing-input"
                placeholder="판매 예정가 입력"
                value={inputSellingPrice}
                onChange={(e) => setInputSellingPrice(e.target.value)}
              />
              <span className="sourcing-input-unit">원</span>
            </div>
          </div>
          <div className="sourcing-input-row">
            <label className="sourcing-input-label">소싱가</label>
            <div className="sourcing-input-wrap">
              <input
                type="number"
                className="sourcing-input"
                placeholder="소싱가 입력"
                value={inputSourcingCost}
                onChange={(e) => setInputSourcingCost(e.target.value)}
              />
              <span className="sourcing-input-unit">원</span>
            </div>
          </div>
          <div className="sourcing-input-row">
            <label className="sourcing-input-label">배송비</label>
            <div className="sourcing-input-wrap">
              <input
                type="number"
                className="sourcing-input"
                placeholder="배송비 입력"
                value={inputShippingCost}
                onChange={(e) => setInputShippingCost(e.target.value)}
              />
              <span className="sourcing-input-unit">원</span>
            </div>
          </div>
          <div className="sourcing-input-row">
            <label className="sourcing-input-label">수수료율</label>
            <div className="sourcing-input-wrap">
              <input
                type="number"
                className="sourcing-input"
                placeholder="수수료율 입력"
                value={inputCommissionRate}
                onChange={(e) => setInputCommissionRate(e.target.value)}
              />
              <span className="sourcing-input-unit">%</span>
            </div>
          </div>
        </div>
        {margin ? (
          <div className="result-margin-table">
            <div className="result-margin-row">
              <span className="result-margin-name">순이익</span>
              <span className={`result-margin-profit ${margin.netProfit >= 0 ? 'positive' : 'negative'}`}>
                {margin.netProfit.toLocaleString()}원
              </span>
              <span className="result-margin-rate">{margin.marginRate}%</span>
            </div>
          </div>
        ) : (
          <p className="margin-empty-hint">입력 후 계산됩니다</p>
        )}
        <p className="margin-fee-notice">수수료는 각 플랫폼 약관 기준으로 직접 입력해주세요</p>
      </section>

      {/* Data cards */}
      <section className="result-data-groups">
        <div className="result-card-group group-search">
          <h3 className="result-group-label">검색</h3>
          <div className="result-group-cards">
            <div className="result-card">
              <span className="result-card-label">
                월간 검색량
                <span className="score-tooltip-wrap">
                  <span className="score-tooltip-icon">?</span>
                  <span className="score-tooltip">네이버 통합검색 기준 (PC+모바일)</span>
                </span>
              </span>
              <span className="result-card-value">{resData.monthlyVolume ? resData.monthlyVolume.toLocaleString() + '회' : '데이터 없음'}</span>
            </div>
            <div className="result-card">
              <span className="result-card-label">성장세</span>
              <span className="result-card-value">{growthLabel}</span>
            </div>
          </div>
        </div>

        <div className="result-card-group group-price">
          <h3 className="result-group-label">가격</h3>
          <div className="result-group-cards">
            <div className="result-card">
              <span className="result-card-label">최저가</span>
              <span className="result-card-value">{resData.minPrice?.toLocaleString()}원</span>
            </div>
            <div className="result-card">
              <span className="result-card-label">평균 판매가</span>
              <span className="result-card-value">{resData.avgPrice?.toLocaleString()}원</span>
            </div>
            <div className="result-card">
              <span className="result-card-label">최고가</span>
              <span className="result-card-value">{resData.maxPrice?.toLocaleString()}원</span>
            </div>
          </div>
        </div>

        <div className="result-card-group group-competition">
          <h3 className="result-group-label">경쟁</h3>
          <div className="result-group-cards">
            <div className="result-card">
              <span className="result-card-label">
                경쟁 상품 수
                <span className="score-tooltip-wrap">
                  <span className="score-tooltip-icon">?</span>
                  <span className="score-tooltip">네이버 쇼핑 전체 기준 (스마트스토어, 쿠팡, 11번가 등 포함)</span>
                </span>
              </span>
              <span className="result-card-value">{resData.competitorCount?.toLocaleString()}개</span>
            </div>
            <div className="result-card">
              <span className="result-card-label">
                경쟁 강도
                <span className="score-tooltip-wrap">
                  <span className="score-tooltip-icon">?</span>
                  <span className="score-tooltip">경쟁 상품 수 / 월간 검색량</span>
                </span>
              </span>
              <span className="result-card-value">{competitionIntensity}</span>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  )
}
