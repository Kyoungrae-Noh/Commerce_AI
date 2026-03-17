import DataTable from '../shared/DataTable'

const columns = [
  { key: 'rank', label: '순위', align: 'center', render: (v) => `#${v}` },
  { key: 'name', label: '셀러명' },
  {
    key: 'reviewCount', label: '리뷰 수', align: 'right',
    render: (v) => v.toLocaleString() + '개',
  },
  {
    key: 'price', label: '가격', align: 'right',
    render: (v) => '₩' + v.toLocaleString(),
  },
  {
    key: 'rating', label: '평점', align: 'center',
    render: (v) => `⭐ ${v}`,
  },
  {
    key: 'estimatedMonthlyRevenue', label: '예상 월매출', align: 'right',
    render: (v) => '₩' + (v / 10000).toLocaleString() + '만',
  },
]

export default function CompetitorTable({ data }) {
  return <DataTable columns={columns} data={data} />
}
