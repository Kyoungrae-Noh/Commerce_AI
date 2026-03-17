import { useState } from 'react'
import KeywordSearch from '../../components/dashboard/KeywordSearch'
import KeywordTable from '../../components/keyword/KeywordTable'
import RelatedKeywords from '../../components/keyword/RelatedKeywords'
import TrendChart from '../../components/keyword/TrendChart'
import StatCard from '../../components/shared/StatCard'
import { mockKeywordData, defaultKeyword } from '../../data/mockData'
import './KeywordTab.css'

export default function KeywordTab() {
  const [activeKeyword, setActiveKeyword] = useState(defaultKeyword)
  const data = mockKeywordData[activeKeyword] || mockKeywordData[defaultKeyword]

  const handleSearch = (kw) => {
    setActiveKeyword(mockKeywordData[kw] ? kw : defaultKeyword)
  }

  return (
    <div className="kw-tab">
      <div className="kw-tab-header">
        <h2 className="kw-tab-title">키워드 분석</h2>
        <p className="kw-tab-desc">키워드별 검색량, 경쟁도, 시즌 트렌드를 분석합니다</p>
      </div>

      <KeywordSearch onSearch={handleSearch} placeholder="분석할 키워드를 입력하세요  예: 미니 가습기, 블루투스 이어폰" />

      {/* 요약 통계 */}
      <div className="kw-stats">
        <StatCard icon="🔍" value={data.primary.monthlyVolume.toLocaleString()} label="월간 검색량" />
        <StatCard icon="📦" value={data.primary.competitorCount.toLocaleString() + '개'} label="경쟁 상품 수" />
        <StatCard icon="💰" value={'₩' + data.primary.avgPrice.toLocaleString()} label="평균 판매가" />
      </div>

      {/* 트렌드 차트 */}
      <TrendChart data={data.monthlyTrend} label={`"${data.primary.keyword}" 월간 검색량 추이`} />

      <div className="kw-bottom">
        {/* 키워드 테이블 */}
        <div className="kw-table-section">
          <h3 className="kw-section-title">키워드 상세</h3>
          <KeywordTable data={[data.primary]} />
        </div>

        {/* 연관 키워드 */}
        <RelatedKeywords keywords={data.related} onSelect={handleSearch} />
      </div>
    </div>
  )
}
