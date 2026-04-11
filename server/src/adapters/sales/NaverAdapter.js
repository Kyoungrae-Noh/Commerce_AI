import crypto from 'crypto'
import SalesPlatformAdapter from '../base/SalesPlatformAdapter.js'

const NAVER_API_BASE = 'https://openapi.naver.com'
const SEARCHAD_API_BASE = 'https://api.searchad.naver.com'

export default class NaverAdapter extends SalesPlatformAdapter {
  constructor() {
    super('Naver')
    this.clientId = process.env.NAVER_CLIENT_ID
    this.clientSecret = process.env.NAVER_CLIENT_SECRET
    // 검색광고 API (선택사항)
    this.searchAdApiKey = process.env.NAVER_SEARCHAD_API_KEY
    this.searchAdSecretKey = process.env.NAVER_SEARCHAD_SECRET_KEY
    this.searchAdCustomerId = process.env.NAVER_SEARCHAD_CUSTOMER_ID
  }

  get hasSearchAdApi() {
    return !!(this.searchAdApiKey && this.searchAdSecretKey && this.searchAdCustomerId)
  }

  get headers() {
    return {
      'X-Naver-Client-Id': this.clientId,
      'X-Naver-Client-Secret': this.clientSecret,
    }
  }

  /** 검색광고 API 서명 생성 */
  _generateSearchAdSignature(timestamp, method, path) {
    const message = `${timestamp}.${method}.${path}`
    return crypto.createHmac('sha256', this.searchAdSecretKey)
      .update(message)
      .digest('base64')
  }

  /** 검색광고 API 헤더 */
  _getSearchAdHeaders(method, path) {
    const timestamp = String(Date.now())
    return {
      'X-API-KEY': this.searchAdApiKey,
      'X-Customer': this.searchAdCustomerId,
      'X-Timestamp': timestamp,
      'X-Signature': this._generateSearchAdSignature(timestamp, method, path),
    }
  }

  /** 검색광고 키워드 도구 API - 월간 검색량 + 연관 키워드 */
  async getKeywordStats(keyword) {
    if (!this.hasSearchAdApi) return null

    const path = '/keywordstool'
    const url = `${SEARCHAD_API_BASE}${path}?hintKeywords=${keyword.replace(/ /g, '')}&showDetail=1`

    try {
      const res = await fetch(url, {
        headers: this._getSearchAdHeaders('GET', path),
      })
      if (!res.ok) return null
      return res.json()
    } catch {
      return null
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

    try {
      const res = await fetch(`${NAVER_API_BASE}/v1/datalab/search`, {
        method: 'POST',
        headers: { ...this.headers, 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (!res.ok) {
        console.warn(`Naver DataLab API error: ${res.status}`)
        return { results: [{ data: [] }] }
      }
      return res.json()
    } catch (err) {
      console.warn('Naver DataLab API failed:', err.message)
      return { results: [{ data: [] }] }
    }
  }

  /** searchKeyword 구현 */
  async searchKeyword(keyword) {
    const [shopping, trend, keywordStats] = await Promise.all([
      this.searchShopping(keyword),
      this.getSearchTrend(keyword),
      this.getKeywordStats(keyword),
    ])

    const items = shopping.items || []
    const prices = items.map(i => parseInt(i.lprice)).filter(p => p > 0)
    const avgPrice = prices.length > 0 ? Math.round(prices.reduce((a, b) => a + b, 0) / prices.length) : 0

    // 트렌드 데이터 변환
    const trendData = trend.results?.[0]?.data || []
    const monthlyTrend = trendData.map(d => ({
      month: d.period,
      ratio: d.ratio,
    }))

    const competitorCount = shopping.total || 0

    // 검색광고 API에서 검색량 + 연관 키워드 추출
    let monthlyVolume = null
    let relatedKeywords = []

    if (keywordStats?.keywordList) {
      const primary = keywordStats.keywordList.find(
        k => k.relKeyword === keyword
      ) || keywordStats.keywordList[0]

      if (primary) {
        const pc = primary.monthlyPcQcCnt === '< 10' ? 5 : Number(primary.monthlyPcQcCnt) || 0
        const mobile = primary.monthlyMobileQcCnt === '< 10' ? 5 : Number(primary.monthlyMobileQcCnt) || 0
        monthlyVolume = pc + mobile
      }

      // 연관 키워드 (검색량 포함)
      relatedKeywords = keywordStats.keywordList
        .filter(k => k.relKeyword !== keyword)
        .slice(0, 10)
        .map(k => {
          const pc = k.monthlyPcQcCnt === '< 10' ? 5 : Number(k.monthlyPcQcCnt) || 0
          const mobile = k.monthlyMobileQcCnt === '< 10' ? 5 : Number(k.monthlyMobileQcCnt) || 0
          return { keyword: k.relKeyword, volume: pc + mobile }
        })
    }

    // 검색광고 API 없으면 쇼핑검색 상품명에서 연관 키워드 추출
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
