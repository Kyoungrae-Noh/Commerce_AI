import DataTable from '../shared/DataTable'
import './KeywordTable.css'

const levelColors = {
  low: 'var(--accent)',
  medium: '#FFD000',
  high: 'var(--accent3)',
}

const levelLabels = {
  low: '낮음',
  medium: '보통',
  high: '높음',
}

const columns = [
  { key: 'keyword', label: '키워드' },
  {
    key: 'monthlyVolume', label: '월간 검색량', align: 'right',
    render: (v) => v.toLocaleString(),
  },
  {
    key: 'competitorCount', label: '경쟁 상품', align: 'right',
    render: (v) => v.toLocaleString() + '개',
  },
  {
    key: 'avgPrice', label: '평균가', align: 'right',
    render: (v) => '₩' + v.toLocaleString(),
  },
  {
    key: 'competitionLevel', label: '경쟁 강도', align: 'center',
    render: (v) => (
      <span className="keyword-level-badge" style={{ color: levelColors[v], borderColor: levelColors[v] + '44', background: levelColors[v] + '18' }}>
        {levelLabels[v]}
      </span>
    ),
  },
]

export default function KeywordTable({ data }) {
  return <DataTable columns={columns} data={data} />
}
