import { BrowserRouter, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import Home from './pages/Home'
import Result from './pages/Result'
import analysisHtml from '../design/analysis.html?raw'
import notiHtml from '../design/noti.html?raw'
import settingHtml from '../design/setting.html?raw'
import subscriptionHtml from '../design/subscription.html?raw'
import supportHtml from '../design/support.html?raw'
import './App.css'

const designPages = [
  { path: '/analysis', label: 'analysis', title: '상품 분석', html: analysisHtml },
  { path: '/noti', label: 'noti', title: '알림 센터', html: notiHtml },
  { path: '/setting', label: 'setting', title: '설정', html: settingHtml },
  { path: '/subscription', label: 'subscription', title: '이용권 안내', html: subscriptionHtml },
  { path: '/support', label: 'support', title: '문의하기', html: supportHtml },
]

function DesignFrame({ html, title }) {
  return (
    <iframe
      className="design-frame"
      srcDoc={html}
      title={title}
    />
  )
}

function DesignSwitcher() {
  const location = useLocation()
  const navigate = useNavigate()
  const isDesignPage = designPages.some((p) => p.path === location.pathname)
  if (!isDesignPage) return null

  return (
    <div className="design-switcher">
      {designPages.map((page) => (
        <button
          key={page.path}
          className={location.pathname === page.path ? 'design-switcher-button active' : 'design-switcher-button'}
          onClick={() => navigate(page.path)}
          type="button"
        >
          {page.label}
        </button>
      ))}
    </div>
  )
}

function AppRoutes() {
  return (
    <div className="design-app-shell">
      <DesignSwitcher />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/result" element={<Result />} />
        {designPages.map((page) => (
          <Route
            key={page.path}
            path={page.path}
            element={<DesignFrame html={page.html} title={page.title} />}
          />
        ))}
      </Routes>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}
