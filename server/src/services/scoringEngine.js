/**
 * 수익성 판정 알고리즘
 *
 * 입력: 키워드 데이터 + 경쟁 데이터 + 소싱가 데이터
 * 출력: sourcelyScore (0-100) + verdict + 세부 점수
 */

/**
 * 수요 점수 (25%)
 * - 경쟁자 수가 적절한 범위에 있으면 높은 점수
 * - 트렌드 상승 시 가산점
 */
function calcDemandScore(keywordData) {
  const { competitorCount, monthlyTrend } = keywordData
  let score = 50

  // 경쟁 상품 수 기반 (너무 적으면 수요 없음, 너무 많으면 레드오션)
  if (competitorCount >= 1000 && competitorCount <= 50000) score += 30
  else if (competitorCount >= 50000 && competitorCount <= 200000) score += 20
  else if (competitorCount < 1000) score += 10
  else score += 5

  // 트렌드 상승 여부 (최근 3개월 vs 이전 3개월)
  if (monthlyTrend && monthlyTrend.length >= 6) {
    const recent = monthlyTrend.slice(-3)
    const previous = monthlyTrend.slice(-6, -3)
    const recentAvg = recent.reduce((a, b) => a + b.ratio, 0) / 3
    const previousAvg = previous.reduce((a, b) => a + b.ratio, 0) / 3

    if (recentAvg > previousAvg * 1.1) score += 20       // 10% 이상 성장
    else if (recentAvg > previousAvg) score += 10          // 소폭 성장
    else if (recentAvg < previousAvg * 0.9) score -= 10    // 하락
  }

  return Math.max(0, Math.min(100, score))
}

/**
 * 경쟁 점수 (25%)
 * - 난이도가 낮을수록 높은 점수
 * - 상위 셀러 집중도가 낮을수록 진입 가능
 */
function calcCompetitionScore(competitionData) {
  const { difficulty, topSellers } = competitionData
  let score = 100

  // 난이도 기반 감점
  score -= difficulty.overall * 8 // 난이도 10이면 -80

  // 상위 셀러 집중도 (상위 3개가 전체의 50% 이상이면 감점)
  if (topSellers && topSellers.length >= 3) {
    const top3Products = topSellers.slice(0, 3).reduce((a, b) => a + b.productCount, 0)
    const totalProducts = topSellers.reduce((a, b) => a + b.productCount, 0)
    if (totalProducts > 0 && top3Products / totalProducts > 0.5) {
      score -= 15
    }
  }

  return Math.max(0, Math.min(100, score))
}

/**
 * 마진 점수 (30%) - 가장 중요
 * - 예상 마진율 기반
 */
function calcMarginScore(avgPrice, sourcingCost, platformFees) {
  // 쿠팡/네이버 중 더 좋은 마진 기준
  const bestMargin = Object.values(platformFees).reduce((best, fee) => {
    const commission = avgPrice * fee.commissionRate
    const totalCost = sourcingCost.estimatedPrice + sourcingCost.shippingEstimate + 3000 + commission + fee.fulfillmentFee
    const margin = avgPrice > 0 ? ((avgPrice - totalCost) / avgPrice) * 100 : 0
    return margin > best ? margin : best
  }, 0)

  // 마진율 → 점수 매핑
  if (bestMargin >= 40) return 95
  if (bestMargin >= 30) return 80
  if (bestMargin >= 20) return 65
  if (bestMargin >= 10) return 45
  if (bestMargin >= 0) return 25
  return 10 // 적자
}

/**
 * 트렌드 점수 (20%)
 * - 최근 3개월 대비 성장률
 */
function calcTrendScore(monthlyTrend) {
  if (!monthlyTrend || monthlyTrend.length < 6) return 50

  const recent3 = monthlyTrend.slice(-3)
  const older3 = monthlyTrend.slice(-6, -3)
  const recentAvg = recent3.reduce((a, b) => a + b.ratio, 0) / 3
  const olderAvg = older3.reduce((a, b) => a + b.ratio, 0) / 3

  if (olderAvg === 0) return 50

  const growthRate = ((recentAvg - olderAvg) / olderAvg) * 100

  if (growthRate >= 30) return 95
  if (growthRate >= 15) return 80
  if (growthRate >= 5) return 65
  if (growthRate >= -5) return 50
  if (growthRate >= -15) return 35
  return 20
}

/**
 * 종합 판정
 */
export function analyzeProduct({ keywordData, competitionData, sourcingCost, platformFees }) {
  const demandScore = calcDemandScore(keywordData)
  const competitionScore = calcCompetitionScore(competitionData)
  const marginScore = calcMarginScore(keywordData.avgPrice, sourcingCost, platformFees)
  const trendScore = calcTrendScore(keywordData.monthlyTrend)

  // 가중 평균
  const sourcelyScore = Math.round(
    demandScore * 0.25 +
    competitionScore * 0.25 +
    marginScore * 0.30 +
    trendScore * 0.20
  )

  let verdict
  if (sourcelyScore >= 75) verdict = 'recommended'
  else if (sourcelyScore >= 50) verdict = 'hold'
  else verdict = 'not_recommended'

  return {
    sourcelyScore,
    verdict,
    scores: {
      demand: demandScore,
      competition: competitionScore,
      margin: marginScore,
      trend: trendScore,
    },
  }
}
