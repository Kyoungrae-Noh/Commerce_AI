import './FeedbackBanner.css'

export default function FeedbackBanner({ message }) {
  return (
    <div className="feedback-banner">
      <p className="feedback-banner-title">{message}</p>
      <div className="feedback-banner-buttons">
        <a
          className="feedback-btn feedback-btn-bug"
          href="https://tally.so/r/eqx7vQ"
          target="_blank"
          rel="noopener noreferrer"
        >
          버그 신고
        </a>
        <a
          className="feedback-btn feedback-btn-feature"
          href="https://tally.so/r/XxBMNP"
          target="_blank"
          rel="noopener noreferrer"
        >
          기능 제안
        </a>
        <a
          className="feedback-btn feedback-btn-kakao"
          href="https://open.kakao.com/o/g4IOcYqi"
          target="_blank"
          rel="noopener noreferrer"
        >
          카카오 오픈채팅
        </a>
      </div>
    </div>
  )
}
