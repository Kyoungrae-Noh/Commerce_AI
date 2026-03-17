import './StatCard.css'

export default function StatCard({ value, label, icon, trend }) {
  return (
    <div className="stat-card">
      {icon && <span className="stat-card-icon">{icon}</span>}
      <div>
        <div className="stat-card-value">
          {value}
          {trend && (
            <span className={`stat-card-trend ${trend > 0 ? 'up' : 'down'}`}>
              {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
            </span>
          )}
        </div>
        <div className="stat-card-label">{label}</div>
      </div>
    </div>
  )
}
