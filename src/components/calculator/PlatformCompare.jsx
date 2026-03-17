import './PlatformCompare.css'

export default function PlatformCompare({ coupang, smartStore }) {
  const better = coupang.netProfit >= smartStore.netProfit ? 'coupang' : 'smart'

  return (
    <div className="platform-compare">
      <h3 className="platform-compare-title">플랫폼 비교</h3>
      <div className="platform-compare-grid">
        <div className={`platform-col ${better === 'coupang' ? 'winner' : ''}`}>
          <div className="platform-col-header">
            {better === 'coupang' && <span className="platform-winner-tag">유리</span>}
            <span className="platform-col-name">쿠팡 로켓그로스</span>
          </div>
          <div className="platform-col-rows">
            <Row label="수수료율" value="10.8%" />
            <Row label="풀필먼트비" value={`₩${coupang.fulfillmentFee.toLocaleString()}`} />
            <Row label="플랫폼 수수료" value={`₩${coupang.commission.toLocaleString()}`} />
            <Row label="총 비용" value={`₩${coupang.totalCost.toLocaleString()}`} />
            <Row label="순이익" value={`₩${coupang.netProfit.toLocaleString()}`} highlight={coupang.netProfit >= 0} />
            <Row label="마진율" value={`${coupang.marginRate.toFixed(1)}%`} highlight={coupang.marginRate >= 15} />
          </div>
        </div>
        <div className={`platform-col ${better === 'smart' ? 'winner' : ''}`}>
          <div className="platform-col-header">
            {better === 'smart' && <span className="platform-winner-tag">유리</span>}
            <span className="platform-col-name">스마트스토어</span>
          </div>
          <div className="platform-col-rows">
            <Row label="수수료율" value="5.5%" />
            <Row label="풀필먼트비" value="₩0" />
            <Row label="플랫폼 수수료" value={`₩${smartStore.commission.toLocaleString()}`} />
            <Row label="총 비용" value={`₩${smartStore.totalCost.toLocaleString()}`} />
            <Row label="순이익" value={`₩${smartStore.netProfit.toLocaleString()}`} highlight={smartStore.netProfit >= 0} />
            <Row label="마진율" value={`${smartStore.marginRate.toFixed(1)}%`} highlight={smartStore.marginRate >= 15} />
          </div>
        </div>
      </div>
    </div>
  )
}

function Row({ label, value, highlight }) {
  return (
    <div className="platform-row">
      <span className="platform-row-label">{label}</span>
      <span className={`platform-row-value ${highlight ? 'good' : ''}`}>{value}</span>
    </div>
  )
}
