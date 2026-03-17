import './ScoreRing.css'

function getScoreColor(score) {
  if (score >= 80) return 'var(--accent)'
  if (score >= 60) return 'var(--accent2)'
  if (score >= 40) return '#FFD000'
  return 'var(--accent3)'
}

export default function ScoreRing({ score, size = 48, strokeWidth = 3, label }) {
  const radius = (size - strokeWidth * 2) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference
  const color = getScoreColor(score)

  return (
    <div className="score-ring-wrap">
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="var(--border)" strokeWidth={strokeWidth} />
        <circle
          cx={size / 2} cy={size / 2} r={radius} fill="none"
          stroke={color} strokeWidth={strokeWidth}
          strokeDasharray={circumference} strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.8s ease' }}
        />
        <text
          x={size / 2} y={size / 2 + 5}
          textAnchor="middle" fill="var(--text)"
          fontSize={size * 0.3} fontWeight="700"
          fontFamily="'Syne', sans-serif"
          style={{ transform: 'rotate(90deg)', transformOrigin: `${size / 2}px ${size / 2}px` }}
        >
          {score}
        </text>
      </svg>
      {label && <span className="score-ring-label">{label}</span>}
    </div>
  )
}
