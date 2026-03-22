import { Router } from 'express'
import { getSalesAdapter } from '../utils/platformRegistry.js'

const router = Router()

// POST /api/ranking/check  { keyword, storeName }
router.post('/check', async (req, res) => {
  try {
    const { keyword, storeName } = req.body
    if (!keyword || !storeName) {
      return res.status(400).json({ error: '키워드와 스토어명을 입력하세요' })
    }

    const naver = getSalesAdapter('naver')
    const shopping = await naver.searchShopping(keyword, 100)
    const items = shopping.items || []

    // 스토어명으로 상품 찾기 (대소문자 무시, 부분 매칭)
    const storeNameLower = storeName.toLowerCase()
    const results = []

    items.forEach((item, index) => {
      const mallName = (item.mallName || '').toLowerCase()
      if (mallName.includes(storeNameLower) || storeNameLower.includes(mallName)) {
        results.push({
          rank: index + 1,
          title: item.title.replace(/<[^>]*>/g, ''),
          price: parseInt(item.lprice),
          mallName: item.mallName,
          image: item.image,
          link: item.link,
          productId: item.productId,
        })
      }
    })

    res.json({
      keyword,
      storeName,
      totalProducts: shopping.total || 0,
      searchedCount: items.length,
      foundCount: results.length,
      results,
      checkedAt: new Date().toISOString(),
    })
  } catch (err) {
    console.error('Ranking check error:', err)
    res.status(500).json({ error: err.message })
  }
})

// POST /api/ranking/check-multi  { keywords: [...], storeName }
router.post('/check-multi', async (req, res) => {
  try {
    const { keywords, storeName } = req.body
    if (!keywords?.length || !storeName) {
      return res.status(400).json({ error: '키워드 목록과 스토어명을 입력하세요' })
    }

    const naver = getSalesAdapter('naver')
    const storeNameLower = storeName.toLowerCase()
    const results = []

    for (const keyword of keywords.slice(0, 10)) {
      try {
        const shopping = await naver.searchShopping(keyword, 100)
        const items = shopping.items || []

        let bestRank = null
        let bestItem = null

        items.forEach((item, index) => {
          const mallName = (item.mallName || '').toLowerCase()
          if (mallName.includes(storeNameLower) || storeNameLower.includes(mallName)) {
            if (!bestRank || index + 1 < bestRank) {
              bestRank = index + 1
              bestItem = {
                title: item.title.replace(/<[^>]*>/g, ''),
                price: parseInt(item.lprice),
                image: item.image,
              }
            }
          }
        })

        results.push({
          keyword,
          rank: bestRank,
          totalProducts: shopping.total || 0,
          product: bestItem,
        })
      } catch (err) {
        results.push({ keyword, rank: null, error: err.message })
      }

      // Rate limit
      await new Promise(r => setTimeout(r, 300))
    }

    res.json({
      storeName,
      results,
      checkedAt: new Date().toISOString(),
    })
  } catch (err) {
    console.error('Ranking multi-check error:', err)
    res.status(500).json({ error: err.message })
  }
})

export default router
