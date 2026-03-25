import ScoreBar from '../shared/ScoreBar'
import './ScoreBreakdown.css'

const axes = [
  { key: 'demand', label: '수요', color: 'var(--accent)' },
  { key: 'competition', label: '경쟁 여유', color: 'var(--accent2)' },
  { key: 'margin', label: '마진 가능성', color: 'var(--accent3)' },
  { key: 'trend', label: '트렌드', color: '#FFD000' },
]

export default function ScoreBreakdown({ scores }) {
  return (
    <div className="score-breakdown">
      <h3 className="score-breakdown-title">세부 점수</h3>
      {axes.map(axis => (
        <ScoreBar key={axis.key} label={axis.label} value={scores[axis.key]} color={axis.color} />
      ))}
    </div>
  )
}
