import './VerdictBadge.css'

const verdictMap = {
  recommended: { label: '추천', icon: '✓', cls: 'green' },
  hold: { label: '보류', icon: '△', cls: 'yellow' },
  not_recommended: { label: '비추천', icon: '✕', cls: 'red' },
}

export default function VerdictBadge({ verdict, size = 'default' }) {
  const v = verdictMap[verdict] || verdictMap.hold
  return (
    <span className={`verdict-badge ${v.cls} ${size}`}>
      <span className="verdict-icon">{v.icon}</span>
      {v.label}
    </span>
  )
}
