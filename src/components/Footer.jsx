import { Link } from 'react-router-dom'
import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <Link to="/" className="logo-small">Source<span>ly</span></Link>
      <p>&copy; 2025 Sourcely. 이커머스 셀러를 위한 AI 소싱 도구.</p>
      <nav className="footer-nav">
        <ul>
          <li><Link to="#">이용약관</Link></li>
          <li><Link to="#">개인정보처리방침</Link></li>
          <li><Link to="#">문의하기</Link></li>
        </ul>
      </nav>
    </footer>
  )
}
