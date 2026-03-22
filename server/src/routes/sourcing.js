import { Router } from 'express'
import { getSourcingAdapter, getSalesAdapter } from '../utils/platformRegistry.js'

const router = Router()

// 카테고리 자동 감지
const CATEGORY_KEYWORDS = {
  electronics: ['이어폰', '충전기', '배터리', '스마트', '키보드', '마우스', '웹캠', '프로젝터', '워치', '거치대', '드라이어'],
  fashion: ['가방', '백', '양말', '모자', '캡', '머플러', '선글라스', '벨트', '스카프', '옷', '의류'],
  beauty: ['고데기', '브러시', '클렌징', '네일', '롤러', '파우치', '화장', '뷰티', '미용'],
  living: ['가습기', '청소기', '필터', '선반', '테이블', '등', '수건', '제습'],
  pet: ['강아지', '고양이', '펫', '사료', '간식'],
  baby: ['아기', '유아', '유모차', '이유식', '턱받이'],
  food: ['식품', '간식', '음료'],
}

function detectCategory(keyword) {
  const kw = keyword.toLowerCase()
  for (const [cat, words] of Object.entries(CATEGORY_KEYWORDS)) {
    if (words.some(w => kw.includes(w))) return cat
  }
  return 'default'
}

// GET /api/sourcing/estimate?q=키워드&avgPrice=15900&category=living
router.get('/estimate', async (req, res) => {
  try {
    const { q, avgPrice, category } = req.query
    if (!q) return res.status(400).json({ error: '키워드를 입력하세요' })

    const adapter = getSourcingAdapter('ali1688')
    const data = await adapter.getEstimatedCost(q, {
      avgSellingPrice: Number(avgPrice) || 15000,
      category: category || 'default',
    })

    res.json(data)
  } catch (err) {
    console.error('Sourcing error:', err)
    res.status(500).json({ error: err.message })
  }
})

// POST /api/sourcing/search  { keyword }
// 키워드로 네이버 쇼핑 상품 조회 + 소싱 비용 추정 + 1688 검색 링크
router.post('/search', async (req, res) => {
  try {
    const { keyword } = req.body
    if (!keyword) return res.status(400).json({ error: '키워드를 입력하세요' })

    const naver = getSalesAdapter('naver')
    const sourcing = getSourcingAdapter('ali1688')

    const shopping = await naver.searchShopping(keyword, 20)
    const items = shopping.items || []
    const prices = items.map(i => parseInt(i.lprice)).filter(p => p > 0)
    const avgPrice = prices.length > 0 ? Math.round(prices.reduce((a, b) => a + b, 0) / prices.length) : 0

    const category = detectCategory(keyword)
    const costEstimate = await sourcing.getEstimatedCost(keyword, {
      avgSellingPrice: avgPrice,
      category,
    })

    // 상품 목록
    const products = items.slice(0, 10).map(i => ({
      title: i.title.replace(/<[^>]*>/g, ''),
      price: parseInt(i.lprice),
      mallName: i.mallName,
      image: i.image,
      link: i.link,
    }))

    // 1688 검색 URL 생성 (중국어 키워드는 번역 필요하지만 MVP에서는 한국어 그대로)
    const search1688Url = `https://s.1688.com/selloffer/offer_search.htm?keywords=${encodeURIComponent(keyword)}`
    const searchAliUrl = `https://www.aliexpress.com/wholesale?SearchText=${encodeURIComponent(keyword)}`

    res.json({
      keyword,
      category,
      avgSellingPrice: avgPrice,
      totalProducts: shopping.total || 0,
      costEstimate,
      products,
      searchLinks: {
        ali1688: search1688Url,
        aliexpress: searchAliUrl,
      },
      marginEstimate: {
        sellingPrice: avgPrice,
        sourcingCost: costEstimate.estimatedPrice,
        shipping: costEstimate.shippingEstimate,
        estimatedProfit: avgPrice - costEstimate.estimatedPrice - costEstimate.shippingEstimate - Math.round(avgPrice * 0.055),
        estimatedMarginRate: avgPrice > 0
          ? Math.round(((avgPrice - costEstimate.estimatedPrice - costEstimate.shippingEstimate - Math.round(avgPrice * 0.055)) / avgPrice) * 100)
          : 0,
      },
    })
  } catch (err) {
    console.error('Sourcing search error:', err)
    res.status(500).json({ error: err.message })
  }
})

export default router
