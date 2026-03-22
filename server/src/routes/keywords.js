import { Router } from 'express'
import { getSalesAdapter, getSourcingAdapter, getAllPlatformFees } from '../utils/platformRegistry.js'
import { getTrendingResults } from '../services/trendingService.js'
import { analyzeProduct } from '../services/scoringEngine.js'

const router = Router()

// 카테고리 자동 감지
const CATEGORY_KEYWORDS = {
  electronics: ['이어폰', '충전', '블루투스', '스피커', '케이블', '보조배터리', '마우스', '키보드', 'USB', '가습기', '선풍기', '공기청정기'],
  fashion: ['가방', '지갑', '모자', '양말', '장갑', '스카프', '벨트', '시계', '선글라스', '의류', '티셔츠', '바지'],
  beauty: ['화장', '립', '마스크팩', '세럼', '크림', '클렌징', '선크림', '파운데이션', '뷰티', '스킨', '로션'],
  living: ['수납', '정리', '인테리어', '조명', '쿠션', '매트', '커튼', '거울', '시계', '방향제'],
  pet: ['강아지', '고양이', '반려', '사료', '간식', '장난감', '하네스', '배변'],
  food: ['간식', '음료', '차', '커피', '식품'],
}

function detectCategory(keyword) {
  for (const [cat, words] of Object.entries(CATEGORY_KEYWORDS)) {
    if (words.some(w => keyword.includes(w))) return cat
  }
  return 'default'
}

// GET /api/keywords/search?q=미니가습기
router.get('/search', async (req, res) => {
  try {
    const keyword = req.query.q
    if (!keyword) return res.status(400).json({ error: '키워드를 입력하세요' })

    const naver = getSalesAdapter('naver')
    const ali1688 = getSourcingAdapter('ali1688')

    // 키워드 검색 + 경쟁 분석 병렬 실행
    const [data, competitionData] = await Promise.all([
      naver.searchKeyword(keyword),
      naver.getCompetition(keyword),
    ])

    const competitionLevel = data.competitorCount > 200000 ? 'very_high'
      : data.competitorCount > 50000 ? 'high'
      : data.competitorCount > 10000 ? 'medium' : 'low'

    // 소싱 비용 추정
    const category = detectCategory(keyword)
    const sourcingCost = await ali1688.getEstimatedCost(keyword, {
      avgSellingPrice: data.avgPrice,
      category,
    })

    // Sourcely Score 계산
    const platformFees = getAllPlatformFees()
    const scoring = analyzeProduct({
      keywordData: {
        competitorCount: data.competitorCount,
        monthlyTrend: data.monthlyTrend,
        avgPrice: data.avgPrice,
      },
      competitionData,
      sourcingCost,
      platformFees,
    })

    // 플랫폼별 마진 계산
    const marginByPlatform = {}
    for (const [name, fee] of Object.entries(platformFees)) {
      const commission = Math.round(data.avgPrice * fee.commissionRate)
      const totalCost = sourcingCost.estimatedPrice + sourcingCost.shippingEstimate + 3000 + commission + fee.fulfillmentFee
      const netProfit = data.avgPrice - totalCost
      const marginRate = data.avgPrice > 0 ? Math.round((netProfit / data.avgPrice) * 1000) / 10 : 0
      marginByPlatform[name] = {
        commission,
        fulfillmentFee: fee.fulfillmentFee,
        totalCost,
        netProfit,
        marginRate,
      }
    }

    res.json({
      primary: {
        keyword: data.keyword,
        monthlyVolume: data.monthlyVolume,
        competitorCount: data.competitorCount,
        avgPrice: data.avgPrice,
        competitionLevel,
      },
      related: data.relatedKeywords,
      monthlyTrend: data.monthlyTrend,
      // 원스톱 분석 데이터
      sourcing: sourcingCost,
      margin: marginByPlatform,
      score: scoring.sourcelyScore,
      verdict: scoring.verdict,
      scores: scoring.scores,
      difficulty: competitionData.difficulty,
    })
  } catch (err) {
    console.error('Keywords search error:', err)
    res.status(500).json({ error: err.message })
  }
})

// GET /api/keywords/trending
router.get('/trending', (req, res) => {
  const { items, lastUpdated, categories } = getTrendingResults()

  // 트렌드 변화율 계산 후 일간/주간 순위 생성
  const withTrend = items.map(item => {
    const trend = item.monthlyTrend || []
    let dailyChange = 0
    let weeklyChange = 0

    if (trend.length >= 2) {
      const last = trend[trend.length - 1]?.ratio || 0
      const prev = trend[trend.length - 2]?.ratio || 0
      dailyChange = prev > 0 ? ((last - prev) / prev) * 100 : 0
    }

    if (trend.length >= 4) {
      const recentWeek = (trend.slice(-2).reduce((a, b) => a + b.ratio, 0)) / 2
      const prevWeek = (trend.slice(-4, -2).reduce((a, b) => a + b.ratio, 0)) / 2
      weeklyChange = prevWeek > 0 ? ((recentWeek - prevWeek) / prevWeek) * 100 : 0
    }

    const competitorCount = item.competitorCount || 0
    const competitionLevel = competitorCount > 200000 ? 'very_high'
      : competitorCount > 50000 ? 'high'
      : competitorCount > 10000 ? 'medium' : 'low'

    return {
      keyword: item.keyword,
      category: item.categoryName,
      categoryIcon: item.categoryIcon,
      monthlyVolume: item.monthlyVolume,
      competitorCount,
      competitionLevel,
      avgPrice: item.avgPrice,
      sourcelyScore: item.sourcelyScore,
      dailyChange: Math.round(dailyChange * 10) / 10,
      weeklyChange: Math.round(weeklyChange * 10) / 10,
    }
  })

  // 일간: dailyChange 기준 내림차순
  const daily = [...withTrend]
    .sort((a, b) => b.dailyChange - a.dailyChange)
    .slice(0, 10)
    .map((item, i) => ({ rank: i + 1, ...item }))

  // 주간: weeklyChange 기준 내림차순
  const weekly = [...withTrend]
    .sort((a, b) => b.weeklyChange - a.weeklyChange)
    .slice(0, 10)
    .map((item, i) => ({ rank: i + 1, ...item }))

  res.json({ daily, weekly, lastUpdated, categories })
})

export default router
