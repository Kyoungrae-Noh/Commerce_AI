import { Router } from 'express'
import { getSalesAdapter, getSourcingAdapter, getAllPlatformFees } from '../utils/platformRegistry.js'
import { analyzeProduct } from '../services/scoringEngine.js'

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

export default router
