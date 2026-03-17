import { Link } from 'react-router-dom'
import './Navbar.css'

export default function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/" className="logo">Source<span>ly</span></Link>
      <ul>
        <li><a href="#how">작동 방식</a></li>
        <li><a href="#features">기능</a></li>
        <li><a href="#pricing">요금</a></li>
        <li><Link to="/dashboard" className="nav-cta">대시보드 →</Link></li>
      </ul>
    </nav>
  )
}
