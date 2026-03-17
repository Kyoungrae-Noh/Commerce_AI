import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Landing from './pages/Landing'
import Dashboard from './pages/Dashboard'
import Calculator from './pages/Calculator'

function Layout() {
  const { pathname } = useLocation()
  const isDashboard = pathname.startsWith('/dashboard') || pathname.startsWith('/calculator')

  return (
    <>
      {!isDashboard && <Navbar />}
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/dashboard" element={<Navigate to="/dashboard/recommendations" replace />} />
        <Route path="/dashboard/:tab" element={<Dashboard />} />
        <Route path="/calculator" element={<Calculator />} />
      </Routes>
      {!isDashboard && <Footer />}
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  )
}
