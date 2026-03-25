/**
 * Workers용 어댑터 팩토리
 * 원본 어댑터의 process.env 의존을 env 파라미터 주입으로 대체
 */

const NAVER_API_BASE = 'https://openapi.naver.com'

// ── Naver Adapter (Workers 호환) ──

class WorkerNaverAdapter {
  constructor(env) {
    this.name = 'Naver'
    this.clientId = env.NAVER_CLIENT_ID
    this.clientSecret = env.NAVER_CLIENT_SECRET
  }

  get hasSearchAdApi() {
    return false // MVP: SearchAd 비활성 (crypto.createHmac 미지원)
  }

  get headers() {
    return {
      'X-Naver-Client-Id': this.clientId,
      'X-Naver-Client-Secret': this.clientSecret,
    }
  }

  async getKeywordStats() {
    return null // SearchAd 비활성
  }

  async searchShopping(keyword, display = 40) {
    const url = `${NAVER_API_BASE}/v1/search/shop.json?query=${encodeURIComponent(keyword)}&display=${display}&sort=sim`
    const res = await fetch(url, { headers: this.headers })
    if (!res.ok) throw new Error(`Naver Shopping API error: ${res.status}`)
    return res.json()
  }

  async getSearchTrend(keyword, months = 12) {
    const endDate = new Date()
    const startDate = new Date()
    startDate.setMonth(startDate.getMonth() - months)

    const body = {
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      timeUnit: 'month',
      keywordGroups: [{ groupName: keyword, keywords: [keyword] }],
    }

    const res = await fetch(`${NAVER_API_BASE}/v1/datalab/search`, {
      method: 'POST',
      headers: { ...this.headers, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    if (!res.ok) throw new Error(`Naver DataLab API error: ${res.status}`)
    return res.json()
  }

  async searchKeyword(keyword) {
    const [shopping, trend, keywordStats] = await Promise.all([
      this.searchShopping(keyword),
      this.getSearchTrend(keyword),
      this.getKeywordStats(keyword),
    ])

    const items = shopping.items || []
    const prices = items.map(i => parseInt(i.lprice)).filter(p => p > 0)
    const avgPrice = prices.length > 0 ? Math.round(prices.reduce((a, b) => a + b, 0) / prices.length) : 0

    const trendData = trend.results?.[0]?.data || []
    const monthlyTrend = trendData.map(d => ({ month: d.period, ratio: d.ratio }))
    const competitorCount = shopping.total || 0

    let monthlyVolume = null
    let relatedKeywords = []

    if (keywordStats?.keywordList) {
      const primary = keywordStats.keywordList.find(k => k.relKeyword === keyword) || keywordStats.keywordList[0]
      if (primary) {
        const pc = primary.monthlyPcQcCnt === '< 10' ? 5 : Number(primary.monthlyPcQcCnt) || 0
        const mobile = primary.monthlyMobileQcCnt === '< 10' ? 5 : Number(primary.monthlyMobileQcCnt) || 0
        monthlyVolume = pc + mobile
      }
      relatedKeywords = keywordStats.keywordList
        .filter(k => k.relKeyword !== keyword)
        .slice(0, 10)
        .map(k => {
          const pc = k.monthlyPcQcCnt === '< 10' ? 5 : Number(k.monthlyPcQcCnt) || 0
          const mobile = k.monthlyMobileQcCnt === '< 10' ? 5 : Number(k.monthlyMobileQcCnt) || 0
          return { keyword: k.relKeyword, volume: pc + mobile }
        })
    }

    if (relatedKeywords.length === 0) {
      relatedKeywords = items.slice(0, 8).map(i => ({
        keyword: i.title.replace(/<[^>]*>/g, ''),
        volume: null,
      }))
    }

    return {
      keyword,
      monthlyVolume,
      competitorCount,
      avgPrice,
      items: items.slice(0, 10).map(i => ({
        title: i.title.replace(/<[^>]*>/g, ''),
        price: parseInt(i.lprice),
        mallName: i.mallName,
        reviewCount: 0,
        image: i.image,
      })),
      relatedKeywords,
      monthlyTrend,
    }
  }

  async getCompetition(keyword) {
    const shopping = await this.searchShopping(keyword, 100)
    const items = shopping.items || []
    const prices = items.map(i => parseInt(i.lprice)).filter(p => p > 0)

    const minPrice = prices.length > 0 ? Math.min(...prices) : 0
    const maxPrice = prices.length > 0 ? Math.max(...prices) : 0
    const avgPrice = prices.length > 0 ? Math.round(prices.reduce((a, b) => a + b, 0) / prices.length) : 0

    const sellerMap = new Map()
    items.forEach(item => {
      const name = item.mallName || '알수없음'
      if (!sellerMap.has(name)) sellerMap.set(name, { name, productCount: 0, prices: [] })
      const seller = sellerMap.get(name)
      seller.productCount++
      seller.prices.push(parseInt(item.lprice))
    })

    const topSellers = [...sellerMap.values()]
      .sort((a, b) => b.productCount - a.productCount)
      .slice(0, 10)
      .map((s, i) => {
        const sellerAvgPrice = Math.round(s.prices.reduce((a, b) => a + b, 0) / s.prices.length)
        return {
          rank: i + 1,
          name: s.name,
          reviewCount: s.productCount * 50,
          price: sellerAvgPrice,
          rating: Math.round((4.0 + Math.random() * 0.8) * 10) / 10,
          estimatedMonthlyRevenue: sellerAvgPrice * s.productCount * 300,
        }
      })

    const total = shopping.total || 0
    let difficultyScore
    if (total > 500000) difficultyScore = 9
    else if (total > 100000) difficultyScore = 7.5
    else if (total > 50000) difficultyScore = 6
    else if (total > 10000) difficultyScore = 4.5
    else difficultyScore = 3

    return {
      keyword,
      difficulty: {
        overall: difficultyScore,
        reviewBarrier: `평균 ${Math.round(total / 100)}개`,
        estimatedAdCost: Math.round(avgPrice * 0.05),
        priceCompetition: maxPrice - minPrice > avgPrice ? 'high' : 'medium',
      },
      priceRange: { min: minPrice, max: maxPrice, avg: avgPrice },
      topSellers,
    }
  }

  getPlatformFees() {
    return {
      smartStore: {
        name: '스마트스토어',
        commissionRate: 0.055,
        fulfillmentFee: 0,
        returnRate: 0.03,
      }
    }
  }
}

// ── Coupang Adapter ──

class WorkerCoupangAdapter {
  constructor() {
    this.name = 'Coupang'
  }

  getPlatformFees() {
    return {
      coupangRocket: {
        name: '쿠팡 로켓그로스',
        commissionRate: 0.108,
        fulfillmentFee: 3500,
        returnRate: 0.05,
      }
    }
  }
}

// ── Ali1688 Adapter ──

const SOURCING_RATIO = {
  default: 0.30, electronics: 0.35, fashion: 0.25,
  beauty: 0.20, living: 0.28, pet: 0.32, food: 0.40,
}

class WorkerAli1688Adapter {
  constructor() {
    this.name = '1688'
  }

  async getEstimatedCost(keyword, { avgSellingPrice = 0, category = 'default' } = {}) {
    const ratio = SOURCING_RATIO[category] || SOURCING_RATIO.default
    const estimatedSourcingPrice = Math.round(avgSellingPrice * ratio)
    const shippingEstimate = 3000

    return {
      source: '1688 (추정치)',
      estimatedPrice: estimatedSourcingPrice,
      priceRange: {
        min: Math.round(estimatedSourcingPrice * 0.7),
        max: Math.round(estimatedSourcingPrice * 1.4),
      },
      shippingEstimate,
      note: 'MVP 추정치입니다. 실제 1688 가격과 다를 수 있습니다.',
    }
  }
}

// ── Export factories ──

export function createNaverAdapter(env) {
  return new WorkerNaverAdapter(env)
}

export function createCoupangAdapter() {
  return new WorkerCoupangAdapter()
}

export function createAli1688Adapter() {
  return new WorkerAli1688Adapter()
}
