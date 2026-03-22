import { Router } from 'express'
import { getSalesAdapter, getSourcingAdapter, getAllPlatformFees } from '../utils/platformRegistry.js'
import { analyzeProduct } from '../services/scoringEngine.js'
import { getTrendingResults, refreshTrendingCache, getCacheStatus } from '../services/trendingService.js'

const router = Router()

// POST /api/products/analyze  { keyword: "미니 가습기" }
router.post('/analyze', async (req, res) => {
  try {
    const { keyword } = req.body
    if (!keyword) return res.status(400).json({ error: '키워드를 입력하세요' })

    const naver = getSalesAdapter('naver')
    const sourcing = getSourcingAdapter('ali1688')

    // 병렬로 데이터 수집
    const [keywordData, competitionData] = await Promise.all([
      naver.searchKeyword(keyword),
      naver.getCompetition(keyword),
    ])

    // 소싱가 추정 (평균 판매가 기반)
    const sourcingCost = await sourcing.getEstimatedCost(keyword, {
      avgSellingPrice: keywordData.avgPrice,
    })

    const platformFees = getAllPlatformFees()

    // 수익성 판정
    const scoring = analyzeProduct({
      keywordData,
      competitionData,
      sourcingCost,
      platformFees,
    })

    res.json({
      keyword,
      ...scoring,
      avgPrice: keywordData.avgPrice,
      competitorCount: keywordData.competitorCount,
      monthlyTrend: keywordData.monthlyTrend,
      sourcingCost,
      competitionData: {
        difficulty: competitionData.difficulty,
        priceRange: competitionData.priceRange,
        topSellers: competitionData.topSellers,
      },
    })
  } catch (err) {
    console.error('Product analyze error:', err)
    res.status(500).json({ error: err.message })
  }
})

// GET /api/products/trending?category=camping
router.get('/trending', (req, res) => {
  const category = req.query.category || null
  const data = getTrendingResults(category)
  res.json(data)
})

// POST /api/products/trending/refresh
router.post('/trending/refresh', async (req, res) => {
  const status = getCacheStatus()
  if (status.isRefreshing) {
    return res.json({ message: '이미 갱신 중입니다', ...status })
  }
  refreshTrendingCache()
  res.json({ message: '갱신이 시작되었습니다', ...status })
})

// GET /api/products/trending/status
router.get('/trending/status', (req, res) => {
  res.json(getCacheStatus())
})

// GET /api/products/best-sellers?category=all
router.get('/best-sellers', (req, res) => {
  const category = req.query.category || null
  const { items, lastUpdated, categories } = getTrendingResults(category)

  // 각 키워드의 topItems를 모아서 판매량 Best 생성
  const allProducts = []
  for (const item of items) {
    if (!item.topItems) continue
    for (const product of item.topItems) {
      allProducts.push({
        title: product.title,
        price: product.price,
        mallName: product.mallName,
        image: product.image,
        keyword: item.keyword,
        category: item.categoryName,
        categoryIcon: item.categoryIcon,
        sourcelyScore: item.sourcelyScore,
      })
    }
  }

  // 가격 기준 정렬 (높은 가격 = 인기 상품 프록시) 후 중복 제거
  const seen = new Set()
  const unique = allProducts.filter(p => {
    const key = p.title
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })

  // 상위 10개
  const bestSellers = unique.slice(0, 10).map((p, i) => ({
    rank: i + 1,
    ...p,
  }))

  res.json({ bestSellers, lastUpdated, categories })
})

export default router
