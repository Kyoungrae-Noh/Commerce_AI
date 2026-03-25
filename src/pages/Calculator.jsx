import { useState, useMemo } from 'react'
import { NavLink } from 'react-router-dom'
import DashboardSidebar from '../components/dashboard/DashboardSidebar'
import CalculatorForm from '../components/calculator/CalculatorForm'
import ProfitResult from '../components/calculator/ProfitResult'
import PlatformCompare from '../components/calculator/PlatformCompare'
import { platformFees } from '../data/mockData'
import './Dashboard.css'
import './Calculator.css'

function calcPlatform(values, fee) {
  const commission = Math.round(values.sellingPrice * fee.commissionRate)
  const totalCost = values.sourcingCost + values.intlShipping + values.domesticShipping + values.adCost + commission + fee.fulfillmentFee
  const netProfit = values.sellingPrice - totalCost
  const marginRate = values.sellingPrice > 0 ? (netProfit / values.sellingPrice) * 100 : 0
  return { commission, fulfillmentFee: fee.fulfillmentFee, totalCost, netProfit, marginRate }
}

export default function Calculator() {
  const [values, setValues] = useState({
    sourcingCost: 5000,
    intlShipping: 2000,
    domesticShipping: 3000,
    sellingPrice: 15900,
    adCost: 500,
  })
  const [platform, setPlatform] = useState('compare')

  const coupang = useMemo(() => calcPlatform(values, platformFees.coupangRocket), [values])
  const smart = useMemo(() => calcPlatform(values, platformFees.smartStore), [values])

  const activeResult = useMemo(() => {
    const r = platform === 'smartStore' ? smart : coupang
    return {
      netProfit: r.netProfit,
      marginRate: r.marginRate,
      breakdown: [
        { label: '소싱가', value: values.sourcingCost },
        { label: '해외 배송비', value: values.intlShipping },
        { label: '국내 배송비', value: values.domesticShipping },
        { label: '광고비', value: values.adCost },
        { label: '플랫폼 수수료', value: r.commission },
        { label: '풀필먼트비', value: r.fulfillmentFee },
        { label: '총 비용', value: r.totalCost, isTotal: true },
      ],
    }
  }, [values, platform, coupang, smart])

  return (
    <div className="dashboard-layout">
      <DashboardSidebar />
      {/* Mobile tab bar */}
      <div className="dash-mobile-tabs">
        <NavLink to="/" className={({ isActive }) => `dash-mobile-tab dash-mobile-home ${isActive ? 'active' : ''}`}>Source<span>ly</span></NavLink>
        <NavLink to="/dashboard/recommendations" className="dash-mobile-tab">⚡ AI 추천</NavLink>
        <NavLink to="/dashboard/keywords" className="dash-mobile-tab">🔍 키워드</NavLink>
        <NavLink to="/dashboard/competition" className="dash-mobile-tab">📊 경쟁 분석</NavLink>
        <NavLink to="/calculator" className={({ isActive }) => `dash-mobile-tab ${isActive ? 'active' : ''}`}>💰 마진 계산기</NavLink>
      </div>
      <main className="dashboard-content">
        <div className="calc-header">
          <h2 className="calc-title">마진 계산기</h2>
          <p className="calc-desc">소싱가와 판매가를 입력하면 실시간으로 수익을 계산합니다</p>
        </div>

        <div className="calc-body">
          <CalculatorForm values={values} onChange={setValues} platform={platform} onPlatformChange={setPlatform} />

          {platform === 'compare' ? (
            <PlatformCompare coupang={coupang} smartStore={smart} />
          ) : (
            <ProfitResult result={activeResult} />
          )}
        </div>
      </main>
    </div>
  )
}
