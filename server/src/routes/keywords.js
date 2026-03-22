import { Router } from 'express'
import { getSalesAdapter } from '../utils/platformRegistry.js'
import { getTrendingResults } from '../services/trendingService.js'

const router = Router()

// GET /api/keywords/search?q=미니가습기
router.get('/search', async (req, res) => {
  try {
    const keyword = req.query.q
    if (!keyword) return res.status(400).json({ error: '키워드를 입력하세요' })

    const naver = getSalesAdapter('naver')
    const data = await naver.searchKeyword(keyword)

    res.json({
      primary: {
        keyword: data.keyword,
        monthlyVolume: data.monthlyVolume,
        competitorCount: data.competitorCount,
        avgPrice: data.avgPrice,
        competitionLevel: data.competitorCount > 200000 ? 'very_high'
          : data.competitorCount > 50000 ? 'high'
          : data.competitorCount > 10000 ? 'medium' : 'low',
      },
      related: data.relatedKeywords,
      monthlyTrend: data.monthlyTrend,
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
