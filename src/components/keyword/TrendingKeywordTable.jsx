import './TrendingKeywordTable.css'

const levelColors = {
  low: 'var(--accent)',
  medium: '#FFD000',
  high: 'var(--accent3)',
  very_high: 'var(--accent3)',
}

const levelLabels = {
  low: '낮음',
  medium: '보통',
  high: '높음',
  very_high: '매우 높음',
}

const changeKeys = {
  daily: 'dailyChange',
  weekly: 'weeklyChange',
  monthly: 'monthlyChange',
}

function formatVolume(num) {
  if (!num) return '-'
  if (num >= 10000) return (num / 10000).toFixed(1).replace(/\.0$/, '') + '만'
  if (num >= 1000) return (num / 1000).toFixed(1).replace(/\.0$/, '') + '천'
  return num.toLocaleString()
}

function RankBadge({ rank }) {
  if (rank === 1) return <span className="rank-medal rank-1">1</span>
  if (rank === 2) return <span className="rank-medal rank-2">2</span>
  if (rank === 3) return <span className="rank-medal rank-3">3</span>
  return <span className="rank-num">{rank}</span>
}

function ChangeArrow({ value }) {
  if (value > 1) return <span className="trend-change up">▲ {value}%</span>
  if (value < -1) return <span className="trend-change down">▼ {Math.abs(value)}%</span>
  return <span className="trend-change flat">— </span>
}

export default function TrendingKeywordTable({ data, title, timestamp, period = 'daily', onKeywordClick }) {
  const changeKey = changeKeys[period] || 'dailyChange'

  return (
    <div className="trending-kw-table">
      <div className="trending-kw-header">
        <h3 className="trending-kw-title">{title}</h3>
        {timestamp && (
          <span className="trending-kw-timestamp">{new Date(timestamp).toLocaleString('ko-KR')} 기준</span>
        )}
      </div>
      <table className="trending-kw-data">
        <thead>
          <tr>
            <th className="col-rank">순위</th>
            <th className="col-keyword">키워드</th>
            <th className="col-category">카테고리</th>
            <th className="col-search-volume">검색수</th>
            <th className="col-volume">상품수</th>
            <th className="col-competition">경쟁강도</th>
            <th className="col-change">변동</th>
          </tr>
        </thead>
        <tbody>
          {data.map(item => (
            <tr key={item.keyword} onClick={() => onKeywordClick?.(item.keyword)} className="clickable-row">
              <td className="col-rank">
                <RankBadge rank={item.rank} />
              </td>
              <td className="col-keyword">{item.keyword}</td>
              <td className="col-category">{item.categoryIcon} {item.category}</td>
              <td className="col-search-volume">{formatVolume(item.monthlyVolume)}</td>
              <td className="col-volume">{(item.competitorCount || 0).toLocaleString()}</td>
              <td className="col-competition">
                <span
                  className="kw-level-badge"
                  style={{
                    color: levelColors[item.competitionLevel],
                    borderColor: levelColors[item.competitionLevel] + '44',
                    background: levelColors[item.competitionLevel] + '18',
                  }}
                >
                  {levelLabels[item.competitionLevel]}
                </span>
              </td>
              <td className="col-change">
                <ChangeArrow value={item[changeKey] ?? 0} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
