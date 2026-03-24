import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import analysisHtml from '../design/analysis.html?raw'
import notiHtml from '../design/noti.html?raw'
import settingHtml from '../design/setting.html?raw'
import subscriptionHtml from '../design/subscription.html?raw'
import supportHtml from '../design/support.html?raw'

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

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/analysis" replace />} />
      {designPages.map((page) => (
        <Route
          key={page.path}
          path={page.path}
          element={<DesignFrame html={page.html} title={page.title} />}
        />
      ))}
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}
