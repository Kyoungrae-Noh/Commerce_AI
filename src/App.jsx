import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import AppLayout from './components/layout/AppLayout'
import Landing from './pages/Landing'
import Dashboard from './pages/Dashboard'
import Calculator from './pages/Calculator'
import AnalysisPage from './pages/AnalysisPage'
import NotificationsPage from './pages/NotificationsPage'
import SettingsPage from './pages/SettingsPage'
import SubscriptionPage from './pages/SubscriptionPage'
import SupportPage from './pages/SupportPage'

function AppRoutes() {
  return (
    <Routes>
      {/* Landing page - no sidebar layout */}
      <Route path="/" element={<Landing />} />

      {/* All app pages with shared layout */}
      <Route element={<AppLayout />}>
        <Route path="/dashboard" element={<Navigate to="/dashboard/recommendations" replace />} />
        <Route path="/dashboard/:tab" element={<Dashboard />} />
        <Route path="/calculator" element={<Calculator />} />
        <Route path="/analysis" element={<AnalysisPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/subscription" element={<SubscriptionPage />} />
        <Route path="/support" element={<SupportPage />} />
      </Route>
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
