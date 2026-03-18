import { Router } from 'express'
import { getSalesAdapter } from '../utils/platformRegistry.js'

const router = Router()

// GET /api/keywords/search?q=미니가습기
router.get('/search', async (req, res) => {
  try {
    const keyword = req.query.q
    if (!keyword) return res.status(400).json({ error: '키워드를 입력하세요' })

    const naver = getSalesAdapter('naver')
    const data = await naver.searchKeyword(keyword)

    // 프론트 mockKeywordData 구조에 맞게 변환
    const related = data.items.slice(0, 8).map(item => ({
      keyword: item.title,
      volume: null,
    }))

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
      related,
      monthlyTrend: data.monthlyTrend,
    })
  } catch (err) {
    console.error('Keywords search error:', err)
    res.status(500).json({ error: err.message })
  }
})

export default router
