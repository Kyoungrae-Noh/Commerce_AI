import SEED_KEYWORDS from '../data/seedKeywords.js'
import { getSalesAdapter, getSourcingAdapter, getAllPlatformFees } from '../utils/platformRegistry.js'
import { analyzeProduct } from './scoringEngine.js'

const DELAY_MS = 1200
const CACHE_TTL = 24 * 60 * 60 * 1000

let cache = {
  results: [],
  lastUpdated: null,
  isRefreshing: false,
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function analyzeKeyword(keyword) {
  const naver = getSalesAdapter('naver')
  const sourcing = getSourcingAdapter('ali1688')

  // searchKeyword는 내부에서 Shopping + DataLab + SearchAd를 병렬 호출
  // getCompetition은 별도 Shopping API 호출
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

  return {
    keyword,
    ...scoring,
    avgPrice: keywordData.avgPrice,
    competitorCount: keywordData.competitorCount,
    monthlyVolume: keywordData.monthlyVolume,
    monthlyTrend: keywordData.monthlyTrend,
    difficulty: competitionData.difficulty?.overall || 0,
    sourcingCost,
    topItems: (keywordData.items || []).slice(0, 3),
  }
}

export async function refreshTrendingCache() {
  if (cache.isRefreshing) return
  cache.isRefreshing = true

  console.log('[Trending] 캐시 갱신 시작...')
  const results = []

  for (const [categoryId, category] of Object.entries(SEED_KEYWORDS)) {
    for (const keyword of category.keywords) {
      try {
        const analysis = await analyzeKeyword(keyword)
        results.push({
          category: categoryId,
          categoryName: category.name,
          categoryIcon: category.icon,
          ...analysis,
        })
        console.log(`[Trending] ✓ "${keyword}" (${analysis.sourcelyScore}점)`)
      } catch (err) {
        console.error(`[Trending] ✕ "${keyword}" 실패:`, err.message)
      }
      await delay(DELAY_MS)
    }
  }

  results.sort((a, b) => b.sourcelyScore - a.sourcelyScore)

  cache = {
    results,
    lastUpdated: new Date().toISOString(),
    isRefreshing: false,
  }

  console.log(`[Trending] 캐시 갱신 완료: ${results.length}개 키워드 분석`)
}

export function getTrendingResults(category = null) {
  let items = cache.results
  if (category && category !== 'all') {
    items = items.filter(r => r.category === category)
  }
  return {
    items,
    lastUpdated: cache.lastUpdated,
    isRefreshing: cache.isRefreshing,
    categories: Object.entries(SEED_KEYWORDS).map(([id, cat]) => ({
      id,
      name: cat.name,
      icon: cat.icon,
      count: cache.results.filter(r => r.category === id).length,
    })),
  }
}

export function isCacheStale() {
  if (!cache.lastUpdated) return true
  return Date.now() - new Date(cache.lastUpdated).getTime() > CACHE_TTL
}

export function getCacheStatus() {
  return {
    itemCount: cache.results.length,
    lastUpdated: cache.lastUpdated,
    isRefreshing: cache.isRefreshing,
    isStale: isCacheStale(),
  }
}
