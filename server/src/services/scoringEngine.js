/**
 * 수익성 판정 알고리즘
 *
 * 입력: 키워드 데이터 + 경쟁 데이터 + 소싱가 데이터
 * 출력: sourcelyScore (0-100) + verdict + 세부 점수
 */

/**
 * 수요 점수 (25%)
 * - 월간 검색량 구간별 직접 점수 할당
 */
function calcDemandScore(keywordData) {
  const { monthlyVolume } = keywordData

  if (monthlyVolume == null) return 0
  if (monthlyVolume >= 100000) return 100
  if (monthlyVolume >= 50000) return 85
  if (monthlyVolume >= 20000) return 70
  if (monthlyVolume >= 10000) return 55
  if (monthlyVolume >= 5000) return 40
  if (monthlyVolume >= 1000) return 25
  return 10
}

/**
 * 경쟁 점수 (25%)
 * - 경쟁 상품수 / 월간 검색량 비율 기반
 * - 비율이 낮을수록 진입 쉬움 (높은 점수)
 */
function calcCompetitionScore(competitorCount, monthlyVolume) {

  // 검색량 데이터 없으면 중립
  if (!monthlyVolume) return 50

  const ratio = competitorCount / monthlyVolume

  if (ratio <= 1) return 95
  if (ratio <= 3) return 80
  if (ratio <= 10) return 65
  if (ratio <= 30) return 50
  if (ratio <= 100) return 35
  return 15
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
  const competitionScore = calcCompetitionScore(keywordData.competitorCount, keywordData.monthlyVolume)
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
