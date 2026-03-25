import './TrendChart.css'

/** "2025-03-01" → "3월", "4월" → "4월" (이미 한글이면 그대로) */
function formatMonth(month) {
  if (!month) return ''
  if (month.includes('월')) return month
  const match = month.match(/-(\d{2})-/)
  if (match) return `${parseInt(match[1])}월`
  return month
}

/** Y축 라벨 포맷 (volume이면 k 단위, ratio면 상대값) */
function formatYLabel(val, isRatio) {
  if (isRatio) return Math.round(val)
  if (val >= 1000) return (val / 1000).toFixed(0) + 'k'
  return val
}

export default function TrendChart({ data, label = '월간 검색량 추이' }) {
  if (!data || data.length === 0) return null

  const getValue = (d) => d.volume ?? d.ratio ?? 0
  const isRatio = data[0]?.ratio !== undefined && data[0]?.volume === undefined
  const maxVol = Math.max(...data.map(getValue))
  const minVol = Math.min(...data.map(getValue))

  const W = 600
  const H = 200
  const padX = 40
  const padY = 20
  const chartW = W - padX * 2
  const chartH = H - padY * 2

  const points = data.map((d, i) => ({
    x: padX + (i / (data.length - 1)) * chartW,
    y: padY + chartH - ((getValue(d) - minVol) / (maxVol - minVol || 1)) * chartH,
  }))

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ')
  const areaPath = linePath + ` L${points[points.length - 1].x},${H - padY} L${points[0].x},${H - padY} Z`

  return (
    <div className="trend-chart">
      <h3 className="trend-chart-title">{label}</h3>
      <svg viewBox={`0 0 ${W} ${H + 30}`} className="trend-chart-svg">
        <defs>
          <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.3" />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
          const y = padY + chartH * (1 - ratio)
          const val = Math.round(minVol + (maxVol - minVol) * ratio)
          return (
            <g key={i}>
              <line x1={padX} y1={y} x2={W - padX} y2={y} stroke="var(--border)" strokeDasharray="4" />
              <text x={padX - 8} y={y + 4} textAnchor="end" fill="var(--muted)" fontSize="9" fontFamily="'JetBrains Mono', monospace">
                {formatYLabel(val, isRatio)}
              </text>
            </g>
          )
        })}

        {/* Area */}
        <path d={areaPath} fill="url(#trendGrad)" />

        {/* Line */}
        <path d={linePath} fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinejoin="round" />

        {/* Dots */}
        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="3" fill="var(--accent)" stroke="var(--surface)" strokeWidth="2" />
        ))}

        {/* Month labels */}
        {data.map((d, i) => (
          <text key={i} x={points[i].x} y={H + 10} textAnchor="middle" fill="var(--muted)" fontSize="10" fontFamily="'JetBrains Mono', monospace">
            {formatMonth(d.month)}
          </text>
        ))}
      </svg>
    </div>
  )
}
