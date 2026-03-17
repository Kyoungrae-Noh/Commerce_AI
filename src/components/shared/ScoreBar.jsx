import './ScoreBar.css'

export default function ScoreBar({ label, value, color = 'var(--accent)' }) {
  return (
    <div className="score-bar-wrap">
      <div className="score-bar-header">
        <span className="score-bar-label">{label}</span>
        <span className="score-bar-value" style={{ color }}>{value}</span>
      </div>
      <div className="score-bar-track">
        <div className="score-bar-fill" style={{ width: `${value}%`, background: color, transition: 'width 0.8s ease' }} />
      </div>
    </div>
  )
}
