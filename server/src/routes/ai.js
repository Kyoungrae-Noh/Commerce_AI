import { Router } from 'express'
import { getSalesAdapter, getSourcingAdapter, getAllPlatformFees } from '../utils/platformRegistry.js'
import { analyzeProduct } from '../services/scoringEngine.js'
import { generateAnalysis } from '../services/aiAnalysis.js'

const router = Router()

// POST /api/ai/analyze  { keyword: "미니 가습기" }
router.post('/analyze', async (req, res) => {
  try {
    const { keyword } = req.body
    if (!keyword) return res.status(400).json({ error: '키워드를 입력하세요' })

    const naver = getSalesAdapter('naver')
    const sourcing = getSourcingAdapter('ali1688')

    const [keywordData, competitionData] = await Promise.all([
      naver.searchKeyword(keyword),
      naver.getCompetition(keyword),
    ])

    const sourcingCost = await sourcing.getEstimatedCost(keyword, {
      avgSellingPrice: keywordData.avgPrice,
    })

    const platformFees = getAllPlatformFees()

    const scoring = analyzeProduct({
      keywordData,
      competitionData,
      sourcingCost,
      platformFees,
    })

    // 플랫폼별 마진 계산
    const marginByPlatform = {}
    for (const [name, fee] of Object.entries(platformFees)) {
      const commission = Math.round(keywordData.avgPrice * fee.commissionRate)
      const totalCost = sourcingCost.estimatedPrice + sourcingCost.shippingEstimate + 3000 + commission + fee.fulfillmentFee
      const netProfit = keywordData.avgPrice - totalCost
      const marginRate = keywordData.avgPrice > 0 ? Math.round((netProfit / keywordData.avgPrice) * 1000) / 10 : 0
      marginByPlatform[name] = { commission, fulfillmentFee: fee.fulfillmentFee, totalCost, netProfit, marginRate }
    }

    // GPT-4o-mini 분석
    const aiAnalysis = await generateAnalysis({
      keyword,
      scoring,
      keywordData: {
        monthlyVolume: keywordData.monthlyVolume,
        competitorCount: keywordData.competitorCount,
        avgPrice: keywordData.avgPrice,
      },
      competitionData,
      sourcingCost,
      marginByPlatform,
    })

    // 트렌드 성장률 계산 (최근 3개월 vs 이전 3개월 평균 비교)
    let trendGrowthRate = null
    const mt = keywordData.monthlyTrend
    if (mt && mt.length >= 6) {
      const recentAvg = mt.slice(-3).reduce((a, b) => a + b.ratio, 0) / 3
      const olderAvg = mt.slice(-6, -3).reduce((a, b) => a + b.ratio, 0) / 3
      if (olderAvg > 0) trendGrowthRate = ((recentAvg - olderAvg) / olderAvg) * 100
    }

    res.json({
      keyword,
      sourcelyScore: scoring.sourcelyScore,
      verdict: scoring.verdict,
      scores: scoring.scores,
      data: {
        monthlyVolume: keywordData.monthlyVolume,
        competitorCount: keywordData.competitorCount,
        avgPrice: keywordData.avgPrice,
        trendRatio: mt?.length > 0 ? mt[mt.length - 1].ratio : null,
        trendGrowthRate,
        marginByPlatform,
        sourcingCost,
      },
      ai: aiAnalysis,
    })
  } catch (err) {
    console.error('AI analyze error:', err)
    res.status(500).json({ error: err.message || 'AI 분석 중 오류가 발생했습니다' })
  }
})

export default router
