import { Hono } from 'hono'
import { handle } from 'hono/cloudflare-pages'
import { cors } from 'hono/cors'
import { createPlatformRegistry } from '../_shared/platformRegistry.js'
import { generateAnalysis } from '../_shared/ai.js'

// ── 순수 함수 (서버 코드와 동일) ──

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

function calcCompetitionScore(competitorCount, monthlyVolume) {
  if (!monthlyVolume) return 50

  const ratio = competitorCount / monthlyVolume

  if (ratio <= 1) return 95
  if (ratio <= 5) return 80
  if (ratio <= 15) return 65
  if (ratio <= 30) return 50
  if (ratio <= 50) return 35
  return 15
}

function calcMarginScore(avgPrice, sourcingCost, platformFees) {
  const bestMargin = Object.values(platformFees).reduce((best, fee) => {
    const commission = avgPrice * fee.commissionRate
    const totalCost = sourcingCost.estimatedPrice + sourcingCost.shippingEstimate + 3000 + commission + fee.fulfillmentFee
    const margin = avgPrice > 0 ? ((avgPrice - totalCost) / avgPrice) * 100 : 0
    return margin > best ? margin : best
  }, 0)
  if (bestMargin >= 40) return 95
  if (bestMargin >= 30) return 80
  if (bestMargin >= 20) return 65
  if (bestMargin >= 10) return 45
  if (bestMargin >= 0) return 25
  return 10
}

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

function analyzeProduct({ keywordData, competitionData, sourcingCost, platformFees }) {
  const demandScore = calcDemandScore(keywordData)
  const competitionScore = calcCompetitionScore(keywordData.competitorCount, keywordData.monthlyVolume)
  const marginScore = calcMarginScore(keywordData.avgPrice, sourcingCost, platformFees)
  const trendScore = calcTrendScore(keywordData.monthlyTrend)
  const sourcelyScore = Math.round(demandScore * 0.25 + competitionScore * 0.25 + marginScore * 0.30 + trendScore * 0.20)
  let verdict
  if (sourcelyScore >= 75) verdict = 'recommended'
  else if (sourcelyScore >= 50) verdict = 'hold'
  else verdict = 'not_recommended'
  return { sourcelyScore, verdict, scores: { demand: demandScore, competition: competitionScore, margin: marginScore, trend: trendScore } }
}

function calcPlatformProfit(values, platformFee) {
  const commission = Math.round(values.sellingPrice * platformFee.commissionRate)
  const totalCost = values.sourcingCost + values.intlShipping + values.domesticShipping + values.adCost + commission + platformFee.fulfillmentFee
  const netProfit = values.sellingPrice - totalCost
  const marginRate = values.sellingPrice > 0 ? Math.round((netProfit / values.sellingPrice) * 1000) / 10 : 0
  return { commission, fulfillmentFee: platformFee.fulfillmentFee, totalCost, netProfit, marginRate }
}

// ── 유틸 ──

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

function calcMarginByPlatform(avgPrice, sourcingCost, platformFees) {
  const marginByPlatform = {}
  for (const [name, fee] of Object.entries(platformFees)) {
    const commission = Math.round(avgPrice * fee.commissionRate)
    const totalCost = sourcingCost.estimatedPrice + sourcingCost.shippingEstimate + 3000 + commission + fee.fulfillmentFee
    const netProfit = avgPrice - totalCost
    const marginRate = avgPrice > 0 ? Math.round((netProfit / avgPrice) * 1000) / 10 : 0
    marginByPlatform[name] = { commission, fulfillmentFee: fee.fulfillmentFee, totalCost, netProfit, marginRate }
  }
  return marginByPlatform
}

// ── Hono App ──

const app = new Hono().basePath('/api')

app.use('/*', cors())

// Health check
app.get('/health', (c) => c.json({ status: 'ok' }))

// ── AI 분석 ──

app.post('/ai/analyze', async (c) => {
  try {
    const { keyword } = await c.req.json()
    if (!keyword) return c.json({ error: '키워드를 입력하세요' }, 400)

    const registry = createPlatformRegistry(c.env)
    const naver = registry.getSalesAdapter('naver')
    const sourcing = registry.getSourcingAdapter('ali1688')

    const [keywordData, competitionData] = await Promise.all([
      naver.searchKeyword(keyword),
      naver.getCompetition(keyword),
    ])

    const sourcingCost = await sourcing.getEstimatedCost(keyword, { avgSellingPrice: keywordData.avgPrice })
    const platformFees = registry.getAllPlatformFees()
    const scoring = analyzeProduct({ keywordData, competitionData, sourcingCost, platformFees })
    const marginByPlatform = calcMarginByPlatform(keywordData.avgPrice, sourcingCost, platformFees)

    const aiAnalysis = await generateAnalysis(c.env, {
      keyword, scoring,
      keywordData: { monthlyVolume: keywordData.monthlyVolume, competitorCount: keywordData.competitorCount, avgPrice: keywordData.avgPrice },
      competitionData, sourcingCost, marginByPlatform,
    })

    // 트렌드 성장률 계산 (최근 3개월 vs 이전 3개월 평균 비교)
    let trendGrowthRate = null
    const mt = keywordData.monthlyTrend
    if (mt && mt.length >= 6) {
      const recentAvg = mt.slice(-3).reduce((a, b) => a + b.ratio, 0) / 3
      const olderAvg = mt.slice(-6, -3).reduce((a, b) => a + b.ratio, 0) / 3
      if (olderAvg > 0) trendGrowthRate = ((recentAvg - olderAvg) / olderAvg) * 100
    }

    return c.json({
      keyword,
      sourcelyScore: scoring.sourcelyScore,
      verdict: scoring.verdict,
      scores: scoring.scores,
      data: {
        monthlyVolume: keywordData.monthlyVolume,
        trendRatio: mt?.length > 0 ? mt[mt.length - 1].ratio : null,
        trendGrowthRate,
        competitorCount: keywordData.competitorCount,
        avgPrice: keywordData.avgPrice,
        minPrice: keywordData.minPrice,
        maxPrice: keywordData.maxPrice,
        difficulty: competitionData.difficulty?.overall,
        marginByPlatform,
        sourcingCost,
      },
      ai: aiAnalysis,
    })
  } catch (err) {
    return c.json({ error: err.message || 'AI 분석 중 오류가 발생했습니다' }, 500)
  }
})

// ── 키워드 검색 ──

app.get('/keywords/search', async (c) => {
  try {
    const keyword = c.req.query('q')
    if (!keyword) return c.json({ error: '키워드를 입력하세요' }, 400)

    const registry = createPlatformRegistry(c.env)
    const naver = registry.getSalesAdapter('naver')
    const ali1688 = registry.getSourcingAdapter('ali1688')

    const [data, competitionData] = await Promise.all([
      naver.searchKeyword(keyword),
      naver.getCompetition(keyword),
    ])

    const competitionLevel = data.competitorCount > 200000 ? 'very_high'
      : data.competitorCount > 50000 ? 'high'
      : data.competitorCount > 10000 ? 'medium' : 'low'

    const category = detectCategory(keyword)
    const sourcingCost = await ali1688.getEstimatedCost(keyword, { avgSellingPrice: data.avgPrice, category })
    const platformFees = registry.getAllPlatformFees()
    const scoring = analyzeProduct({
      keywordData: { monthlyVolume: data.monthlyVolume, competitorCount: data.competitorCount, monthlyTrend: data.monthlyTrend, avgPrice: data.avgPrice },
      competitionData, sourcingCost, platformFees,
    })
    const marginByPlatform = calcMarginByPlatform(data.avgPrice, sourcingCost, platformFees)

    return c.json({
      primary: { keyword: data.keyword, monthlyVolume: data.monthlyVolume, competitorCount: data.competitorCount, avgPrice: data.avgPrice, competitionLevel },
      related: data.relatedKeywords,
      monthlyTrend: data.monthlyTrend,
      sourcing: sourcingCost,
      margin: marginByPlatform,
      score: scoring.sourcelyScore,
      verdict: scoring.verdict,
      scores: scoring.scores,
      difficulty: competitionData.difficulty,
    })
  } catch (err) {
    return c.json({ error: err.message }, 500)
  }
})

// ── 키워드 트렌딩 (MVP: 빈 결과) ──

app.get('/keywords/trending', (c) => {
  return c.json({ daily: [], weekly: [], monthly: [], lastUpdated: null, categories: [] })
})

// ── 경쟁 분석 ──

app.get('/competition/:keyword', async (c) => {
  try {
    const keyword = c.req.param('keyword')
    if (!keyword) return c.json({ error: '키워드를 입력하세요' }, 400)

    const registry = createPlatformRegistry(c.env)
    const naver = registry.getSalesAdapter('naver')
    const data = await naver.getCompetition(keyword)

    return c.json(data)
  } catch (err) {
    return c.json({ error: err.message }, 500)
  }
})

// ── 마진 계산기 ──

app.post('/calculator/profit', async (c) => {
  try {
    const { sourcingCost, intlShipping, domesticShipping, sellingPrice, adCost, platform } = await c.req.json()
    const values = {
      sourcingCost: Number(sourcingCost) || 0,
      intlShipping: Number(intlShipping) || 0,
      domesticShipping: Number(domesticShipping) || 0,
      sellingPrice: Number(sellingPrice) || 0,
      adCost: Number(adCost) || 0,
    }

    const registry = createPlatformRegistry(c.env)
    const fees = registry.getAllPlatformFees()

    if (platform === 'compare' || !platform) {
      const results = {}
      for (const [key, fee] of Object.entries(fees)) {
        results[key] = { platformName: fee.name, ...calcPlatformProfit(values, fee) }
      }
      return c.json({ mode: 'compare', results })
    } else {
      const fee = fees[platform]
      if (!fee) return c.json({ error: `Unknown platform: ${platform}` }, 400)
      return c.json({ mode: 'single', platform, result: calcPlatformProfit(values, fee) })
    }
  } catch (err) {
    return c.json({ error: err.message }, 500)
  }
})

app.get('/calculator/fees', (c) => {
  const registry = createPlatformRegistry(c.env)
  return c.json(registry.getAllPlatformFees())
})

// ── 소싱 ──

app.get('/sourcing/estimate', async (c) => {
  try {
    const q = c.req.query('q')
    const avgPrice = c.req.query('avgPrice')
    const category = c.req.query('category')
    if (!q) return c.json({ error: '키워드를 입력하세요' }, 400)

    const registry = createPlatformRegistry(c.env)
    const adapter = registry.getSourcingAdapter('ali1688')
    const data = await adapter.getEstimatedCost(q, { avgSellingPrice: Number(avgPrice) || 15000, category: category || 'default' })

    return c.json(data)
  } catch (err) {
    return c.json({ error: err.message }, 500)
  }
})

app.post('/sourcing/search', async (c) => {
  try {
    const { keyword } = await c.req.json()
    if (!keyword) return c.json({ error: '키워드를 입력하세요' }, 400)

    const registry = createPlatformRegistry(c.env)
    const naver = registry.getSalesAdapter('naver')
    const sourcing = registry.getSourcingAdapter('ali1688')

    const shopping = await naver.searchShopping(keyword, 20)
    const items = shopping.items || []
    const prices = items.map(i => parseInt(i.lprice)).filter(p => p > 0)
    const avgPrice = prices.length > 0 ? Math.round(prices.reduce((a, b) => a + b, 0) / prices.length) : 0

    const category = detectCategory(keyword)
    const costEstimate = await sourcing.getEstimatedCost(keyword, { avgSellingPrice: avgPrice, category })

    const products = items.slice(0, 10).map(i => ({
      title: i.title.replace(/<[^>]*>/g, ''),
      price: parseInt(i.lprice),
      mallName: i.mallName,
      image: i.image,
      link: i.link,
    }))

    const search1688Url = `https://s.1688.com/selloffer/offer_search.htm?keywords=${encodeURIComponent(keyword)}`
    const searchAliUrl = `https://www.aliexpress.com/wholesale?SearchText=${encodeURIComponent(keyword)}`

    return c.json({
      keyword, category, avgSellingPrice: avgPrice,
      totalProducts: shopping.total || 0,
      costEstimate, products,
      searchLinks: { ali1688: search1688Url, aliexpress: searchAliUrl },
      marginEstimate: {
        sellingPrice: avgPrice,
        sourcingCost: costEstimate.estimatedPrice,
        shipping: costEstimate.shippingEstimate,
        estimatedProfit: avgPrice - costEstimate.estimatedPrice - costEstimate.shippingEstimate - Math.round(avgPrice * 0.055),
        estimatedMarginRate: avgPrice > 0
          ? Math.round(((avgPrice - costEstimate.estimatedPrice - costEstimate.shippingEstimate - Math.round(avgPrice * 0.055)) / avgPrice) * 100) : 0,
      },
    })
  } catch (err) {
    return c.json({ error: err.message }, 500)
  }
})

// ── 랭킹 ──

app.post('/ranking/check', async (c) => {
  try {
    const { keyword, storeName } = await c.req.json()
    if (!keyword || !storeName) return c.json({ error: '키워드와 스토어명을 입력하세요' }, 400)

    const registry = createPlatformRegistry(c.env)
    const naver = registry.getSalesAdapter('naver')
    const shopping = await naver.searchShopping(keyword, 100)
    const items = shopping.items || []
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

    return c.json({ keyword, storeName, totalProducts: shopping.total || 0, searchedCount: items.length, foundCount: results.length, results, checkedAt: new Date().toISOString() })
  } catch (err) {
    return c.json({ error: err.message }, 500)
  }
})

app.post('/ranking/check-multi', async (c) => {
  try {
    const { keywords, storeName } = await c.req.json()
    if (!keywords?.length || !storeName) return c.json({ error: '키워드 목록과 스토어명을 입력하세요' }, 400)

    const registry = createPlatformRegistry(c.env)
    const naver = registry.getSalesAdapter('naver')
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
              bestItem = { title: item.title.replace(/<[^>]*>/g, ''), price: parseInt(item.lprice), image: item.image }
            }
          }
        })

        results.push({ keyword, rank: bestRank, totalProducts: shopping.total || 0, product: bestItem })
      } catch (err) {
        results.push({ keyword, rank: null, error: err.message })
      }
      await new Promise(r => setTimeout(r, 300))
    }

    return c.json({ storeName, results, checkedAt: new Date().toISOString() })
  } catch (err) {
    return c.json({ error: err.message }, 500)
  }
})

// ── 상품 분석 ──

app.post('/products/analyze', async (c) => {
  try {
    const { keyword } = await c.req.json()
    if (!keyword) return c.json({ error: '키워드를 입력하세요' }, 400)

    const registry = createPlatformRegistry(c.env)
    const naver = registry.getSalesAdapter('naver')
    const sourcing = registry.getSourcingAdapter('ali1688')

    const [keywordData, competitionData] = await Promise.all([
      naver.searchKeyword(keyword),
      naver.getCompetition(keyword),
    ])

    const sourcingCost = await sourcing.getEstimatedCost(keyword, { avgSellingPrice: keywordData.avgPrice })
    const platformFees = registry.getAllPlatformFees()
    const scoring = analyzeProduct({ keywordData, competitionData, sourcingCost, platformFees })

    return c.json({
      keyword, ...scoring,
      avgPrice: keywordData.avgPrice,
      competitorCount: keywordData.competitorCount,
      monthlyTrend: keywordData.monthlyTrend,
      sourcingCost,
      competitionData: { difficulty: competitionData.difficulty, priceRange: competitionData.priceRange, topSellers: competitionData.topSellers },
    })
  } catch (err) {
    return c.json({ error: err.message }, 500)
  }
})

// ── 트렌딩 (MVP: 빈 결과) ──

app.get('/products/trending', (c) => {
  return c.json({ items: [], lastUpdated: null, categories: [] })
})

app.post('/products/trending/refresh', (c) => {
  return c.json({ message: '트렌딩 캐시는 Workers에서 지원되지 않습니다', isRefreshing: false })
})

app.get('/products/trending/status', (c) => {
  return c.json({ isRefreshing: false, lastUpdated: null, itemCount: 0 })
})

app.get('/products/best-sellers', (c) => {
  return c.json({ bestSellers: [], lastUpdated: null, categories: [] })
})

export const onRequest = handle(app)
