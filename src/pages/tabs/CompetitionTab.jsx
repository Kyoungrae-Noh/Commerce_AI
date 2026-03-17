import { useState } from 'react'
import KeywordSearch from '../../components/dashboard/KeywordSearch'
import CompetitorTable from '../../components/competition/CompetitorTable'
import DifficultyMeter from '../../components/competition/DifficultyMeter'
import PriceRangeBar from '../../components/competition/PriceRangeBar'
import StatCard from '../../components/shared/StatCard'
import { mockCompetitionData, defaultKeyword } from '../../data/mockData'
import './CompetitionTab.css'

export default function CompetitionTab() {
  const [activeKeyword, setActiveKeyword] = useState(defaultKeyword)
  const data = mockCompetitionData[activeKeyword] || mockCompetitionData[defaultKeyword]

  const handleSearch = (kw) => {
    setActiveKeyword(mockCompetitionData[kw] ? kw : defaultKeyword)
  }

  const topSeller = data.topSellers[0]

  return (
    <div className="comp-tab">
      <div className="comp-tab-header">
        <h2 className="comp-tab-title">경쟁 분석</h2>
        <p className="comp-tab-desc">키워드별 상위 셀러와 진입 난이도를 분석합니다</p>
      </div>

      <KeywordSearch onSearch={handleSearch} placeholder="분석할 키워드를 입력하세요  예: 미니 가습기, 블루투스 이어폰" />

      <div className="comp-keyword-badge">
        <span className="comp-keyword-label">분석 키워드</span>
        <span className="comp-keyword-value">"{data.keyword}"</span>
      </div>

      {/* 요약 통계 */}
      <div className="comp-stats">
        <StatCard icon="👤" value={data.topSellers.length + '명'} label="상위 셀러" />
        <StatCard icon="⭐" value={topSeller.rating} label="1위 평점" />
        <StatCard icon="💬" value={topSeller.reviewCount.toLocaleString() + '개'} label="1위 리뷰" />
        <StatCard icon="💰" value={'₩' + (topSeller.estimatedMonthlyRevenue / 10000).toLocaleString() + '만'} label="1위 월매출" />
      </div>

      <div className="comp-body">
        <div className="comp-side">
          <DifficultyMeter difficulty={data.difficulty} />
          <PriceRangeBar min={data.priceRange.min} max={data.priceRange.max} avg={data.priceRange.avg} />
        </div>
        <div className="comp-main">
          <h3 className="comp-section-title">상위 셀러 랭킹</h3>
          <CompetitorTable data={data.topSellers} />
        </div>
      </div>
    </div>
  )
}
