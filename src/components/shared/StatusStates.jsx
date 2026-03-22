import './StatusStates.css'

export function LoadingState({ message = '데이터 분석 중...' }) {
  return (
    <div className="status-loading">
      <div className="status-spinner" />
      <span>{message}</span>
    </div>
  )
}

export function ErrorState({ message = 'API 요청 실패' }) {
  return (
    <div className="status-error">
      <span>⚠️ {message}</span>
    </div>
  )
}

export function EmptyState({ icon = '🔍', message, hint }) {
  return (
    <div className="status-empty">
      <span className="status-empty-icon">{icon}</span>
      <p>{message}</p>
      {hint && <p className="status-empty-hint">{hint}</p>}
    </div>
  )
}
