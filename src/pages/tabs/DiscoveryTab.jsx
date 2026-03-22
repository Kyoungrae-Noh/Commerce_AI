import { useState, useEffect, useMemo } from 'react'
import CategoryFilter from '../../components/recommendation/CategoryFilter'
import { LoadingState, EmptyState } from '../../components/shared/StatusStates'
import { getTrending } from '../../api/products'
import { searchKeyword } from '../../api/keywords'
import './DiscoveryTab.css'

const COMPETITION_RANGES = [
  { label: '전체', min: 0, max: Infinity },
  { label: '0~1,000', min: 0, max: 1000 },
  { label: '1,000~5,000', min: 1000, max: 5000 },
  { label: '5,000~10,000', min: 5000, max: 10000 },
  { label: '10,000~50,000', min: 10000, max: 50000 },
  { label: '50,000+', min: 50000, max: Infinity },
]

const DIFFICULTY_RANGES = [
  { label: '전체', min: 0, max: 10 },
  { label: '0~3 (쉬움)', min: 0, max: 3 },
  { label: '3~5', min: 3, max: 5 },
  { label: '5~7', min: 5, max: 7 },
  { label: '7+ (어려움)', min: 7, max: 10 },
]

const SORT_OPTIONS = [
  { key: 'sourcelyScore', label: '추천 점수순', dir: 'desc' },
  { key: 'competitorCount', label: '상품수 적은순', dir: 'asc' },
  { key: 'competitorCount', label: '상품수 많은순', dir: 'desc' },
  { key: 'difficulty', label: '난이도 낮은순', dir: 'asc' },
  { key: 'avgPrice', label: '가격 높은순', dir: 'desc' },
]

export default function DiscoveryTab() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [competitionRange, setCompetitionRange] = useState(0)
  const [difficultyRange, setDifficultyRange] = useState(0)
  const [sortIndex, setSortIndex] = useState(0)
  const [showFilters, setShowFilters] = useState(false)

  // 키워드 클릭 시 상세 검색
  const [selectedKeyword, setSelectedKeyword] = useState(null)
  const [keywordDetail, setKeywordDetail] = useState(null)
  const [detailLoading, setDetailLoading] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const result = await getTrending()
      setData(result)
    } catch (err) {
      console.error('Discovery load error:', err)
    } finally {
      setLoading(false)
    }
  }

  const filtered = useMemo(() => {
    if (!data?.items) return []

    let items = [...data.items]

    // 카테고리 필터
    if (selectedCategory) {
      items = items.filter(i => i.category === selectedCategory)
    }

    // 상품수 필터
    const compRange = COMPETITION_RANGES[competitionRange]
    items = items.filter(i =>
      i.competitorCount >= compRange.min && i.competitorCount < compRange.max
    )

    // 난이도 필터
    const diffRange = DIFFICULTY_RANGES[difficultyRange]
    items = items.filter(i =>
      i.difficulty >= diffRange.min && i.difficulty <= diffRange.max
    )

    // 정렬
    const sort = SORT_OPTIONS[sortIndex]
    items.sort((a, b) => {
      const va = a[sort.key] ?? 0
      const vb = b[sort.key] ?? 0
      return sort.dir === 'desc' ? vb - va : va - vb
    })

    return items.map((item, i) => ({ ...item, rank: i + 1 }))
  }, [data, selectedCategory, competitionRange, difficultyRange, sortIndex])

  const handleKeywordClick = async (keyword) => {
    setSelectedKeyword(keyword)
    setDetailLoading(true)
    try {
      const result = await searchKeyword(keyword)
      setKeywordDetail(result)
    } catch (err) {
      console.error('Keyword detail error:', err)
    } finally {
      setDetailLoading(false)
    }
  }

  const levelColors = {
    low: 'var(--accent)',
    medium: '#FFD000',
    high: 'var(--accent3)',
    very_high: 'var(--accent3)',
  }

  const getCompetitionLevel = (count) => {
    if (count > 200000) return 'very_high'
    if (count > 50000) return 'high'
    if (count > 10000) return 'medium'
    return 'low'
  }

  const getCompetitionLabel = (level) => {
    return { low: '낮음', medium: '보통', high: '높음', very_high: '매우 높음' }[level]
  }

  return (
    <div className="disc-tab">
      <div className="disc-tab-header">
        <h2 className="disc-tab-title">아이템 발굴</h2>
        <p className="disc-tab-desc">카테고리별 인기 키워드를 필터링하여 유망 아이템을 발굴합니다</p>
      </div>

      {loading ? (
        <LoadingState message="키워드 데이터 불러오는 중..." />
      ) : data?.items?.length > 0 ? (
        <>
          {/* 카테고리 필터 */}
          <CategoryFilter
            categories={data.categories}
            selected={selectedCategory}
            onSelect={setSelectedCategory}
          />

          {/* 필터 토글 */}
          <button className="disc-filter-toggle" onClick={() => setShowFilters(!showFilters)}>
            필터 선택 {showFilters ? '▲' : '▼'}
          </button>

          {showFilters && (
            <div className="disc-filters">
              <div className="disc-filter-group">
                <span className="disc-filter-label">상품수</span>
                <div className="disc-filter-options">
                  {COMPETITION_RANGES.map((r, i) => (
                    <button
                      key={i}
                      className={`disc-filter-btn ${competitionRange === i ? 'active' : ''}`}
                      onClick={() => setCompetitionRange(i)}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="disc-filter-group">
                <span className="disc-filter-label">경쟁강도</span>
                <div className="disc-filter-options">
                  {DIFFICULTY_RANGES.map((r, i) => (
                    <button
                      key={i}
                      className={`disc-filter-btn ${difficultyRange === i ? 'active' : ''}`}
                      onClick={() => setDifficultyRange(i)}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 결과 헤더 */}
          <div className="disc-results-header">
            <span className="disc-results-count">키워드 {filtered.length}개</span>
            <select
              className="disc-sort-select"
              value={sortIndex}
              onChange={e => setSortIndex(Number(e.target.value))}
            >
              {SORT_OPTIONS.map((opt, i) => (
                <option key={i} value={i}>{opt.label}</option>
              ))}
            </select>
          </div>

          {/* 결과 테이블 */}
          <div className="disc-table-wrap">
            <table className="disc-table">
              <thead>
                <tr>
                  <th>순위</th>
                  <th>키워드</th>
                  <th>카테고리</th>
                  <th className="align-right">상품수</th>
                  <th className="align-right">평균가</th>
                  <th className="align-center">경쟁강도</th>
                  <th className="align-right">추천점수</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(item => {
                  const level = getCompetitionLevel(item.competitorCount)
                  return (
                    <tr
                      key={item.keyword}
                      className={`disc-row ${selectedKeyword === item.keyword ? 'selected' : ''}`}
                      onClick={() => handleKeywordClick(item.keyword)}
                    >
                      <td className="disc-rank">{item.rank}</td>
                      <td className="disc-keyword">{item.keyword}</td>
                      <td className="disc-category">{item.categoryIcon} {item.categoryName}</td>
                      <td className="align-right disc-mono">{item.competitorCount?.toLocaleString()}</td>
                      <td className="align-right disc-mono">₩{item.avgPrice?.toLocaleString()}</td>
                      <td className="align-center">
                        <span
                          className="disc-level-badge"
                          style={{
                            color: levelColors[level],
                            borderColor: levelColors[level] + '44',
                            background: levelColors[level] + '18',
                          }}
                        >
                          {getCompetitionLabel(level)}
                        </span>
                      </td>
                      <td className="align-right disc-score">{item.sourcelyScore}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {filtered.length === 0 && (
            <EmptyState icon="🔍" message="필터 조건에 맞는 키워드가 없습니다" hint="필터를 조정해보세요" />
          )}

          {/* 키워드 상세 패널 */}
          {selectedKeyword && (
            <div className="disc-detail-panel">
              {detailLoading ? (
                <LoadingState message={`"${selectedKeyword}" 분석 중...`} />
              ) : keywordDetail ? (
                <>
                  <div className="disc-detail-header">
                    <h3>"{keywordDetail.primary.keyword}" 상세 분석</h3>
                    <button className="disc-detail-close" onClick={() => { setSelectedKeyword(null); setKeywordDetail(null) }}>✕</button>
                  </div>
                  <div className="disc-detail-grid">
                    <div className="disc-detail-item">
                      <span className="disc-detail-label">월간 검색량</span>
                      <span className="disc-detail-value">{keywordDetail.primary.monthlyVolume?.toLocaleString() || '추정 불가'}</span>
                    </div>
                    <div className="disc-detail-item">
                      <span className="disc-detail-label">경쟁 상품</span>
                      <span className="disc-detail-value">{keywordDetail.primary.competitorCount?.toLocaleString()}개</span>
                    </div>
                    <div className="disc-detail-item">
                      <span className="disc-detail-label">평균 판매가</span>
                      <span className="disc-detail-value">₩{keywordDetail.primary.avgPrice?.toLocaleString()}</span>
                    </div>
                    <div className="disc-detail-item">
                      <span className="disc-detail-label">경쟁 강도</span>
                      <span className="disc-detail-value">{getCompetitionLabel(keywordDetail.primary.competitionLevel)}</span>
                    </div>
                  </div>
                  {keywordDetail.related?.length > 0 && (
                    <div className="disc-related">
                      <span className="disc-detail-label">연관 키워드</span>
                      <div className="disc-related-chips">
                        {keywordDetail.related.slice(0, 8).map((r, i) => (
                          <span key={i} className="disc-related-chip" onClick={() => handleKeywordClick(r.keyword)}>
                            {r.keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              ) : null}
            </div>
          )}
        </>
      ) : (
        <EmptyState icon="📊" message="데이터를 준비 중입니다" hint="서버 시작 후 약 1-2분 소요됩니다" />
      )}
    </div>
  )
}
