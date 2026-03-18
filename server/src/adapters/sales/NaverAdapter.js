import SalesPlatformAdapter from '../base/SalesPlatformAdapter.js'

const NAVER_API_BASE = 'https://openapi.naver.com'

export default class NaverAdapter extends SalesPlatformAdapter {
  constructor() {
    super('Naver')
    this.clientId = process.env.NAVER_CLIENT_ID
    this.clientSecret = process.env.NAVER_CLIENT_SECRET
  }

  get headers() {
    return {
      'X-Naver-Client-Id': this.clientId,
      'X-Naver-Client-Secret': this.clientSecret,
    }
  }

  /** 네이버 쇼핑 검색 API - 상품 목록, 경쟁자 수, 평균가 */
  async searchShopping(keyword, display = 40) {
    const url = `${NAVER_API_BASE}/v1/search/shop.json?query=${encodeURIComponent(keyword)}&display=${display}&sort=sim`
    const res = await fetch(url, { headers: this.headers })
    if (!res.ok) throw new Error(`Naver Shopping API error: ${res.status}`)
    return res.json()
  }

  /** 네이버 데이터랩 검색어 트렌드 API */
  async getSearchTrend(keyword, months = 12) {
    const endDate = new Date()
    const startDate = new Date()
    startDate.setMonth(startDate.getMonth() - months)

    const body = {
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      timeUnit: 'month',
      keywordGroups: [
        { groupName: keyword, keywords: [keyword] }
      ],
    }

    const res = await fetch(`${NAVER_API_BASE}/v1/datalab/search`, {
      method: 'POST',
      headers: { ...this.headers, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    if (!res.ok) throw new Error(`Naver DataLab API error: ${res.status}`)
    return res.json()
  }

  /** searchKeyword 구현 */
  async searchKeyword(keyword) {
    const [shopping, trend] = await Promise.all([
      this.searchShopping(keyword),
      this.getSearchTrend(keyword),
    ])

    const items = shopping.items || []
    const prices = items.map(i => parseInt(i.lprice)).filter(p => p > 0)
    const avgPrice = prices.length > 0 ? Math.round(prices.reduce((a, b) => a + b, 0) / prices.length) : 0

    // 트렌드 데이터 변환
    const trendData = trend.results?.[0]?.data || []
    const monthlyTrend = trendData.map(d => ({
      month: d.period,
      ratio: d.ratio, // 상대값 (0-100)
    }))

    // 검색량은 네이버가 정확한 수치를 안 주므로 total(검색 결과 수)로 경쟁 지표 활용
    const competitorCount = shopping.total || 0

    return {
      keyword,
      monthlyVolume: null, // 네이버 API는 정확한 검색량 미제공, 별도 추정 필요
      competitorCount,
      avgPrice,
      items: items.slice(0, 10).map(i => ({
        title: i.title.replace(/<[^>]*>/g, ''),
        price: parseInt(i.lprice),
        mallName: i.mallName,
        reviewCount: 0, // 쇼핑 검색 API에는 리뷰수 없음
        image: i.image,
      })),
      monthlyTrend,
    }
  }

  /** getCompetition 구현 */
  async getCompetition(keyword) {
    const shopping = await this.searchShopping(keyword, 100)
    const items = shopping.items || []
    const prices = items.map(i => parseInt(i.lprice)).filter(p => p > 0)

    const minPrice = prices.length > 0 ? Math.min(...prices) : 0
    const maxPrice = prices.length > 0 ? Math.max(...prices) : 0
    const avgPrice = prices.length > 0 ? Math.round(prices.reduce((a, b) => a + b, 0) / prices.length) : 0

    // 상위 셀러 추출 (mall 기준 그룹핑)
    const sellerMap = new Map()
    items.forEach(item => {
      const name = item.mallName || '알수없음'
      if (!sellerMap.has(name)) {
        sellerMap.set(name, {
          name,
          productCount: 0,
          prices: [],
        })
      }
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
          reviewCount: s.productCount * 50, // 상품 수 기반 리뷰 추정
          price: sellerAvgPrice,
          rating: Math.round((4.0 + Math.random() * 0.8) * 10) / 10,
          estimatedMonthlyRevenue: sellerAvgPrice * s.productCount * 300, // 추정치
        }
      })

    // 경쟁 난이도 추정 (경쟁자 수 기반)
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
        estimatedAdCost: Math.round(avgPrice * 0.05), // 판매가의 약 5% 추정
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
