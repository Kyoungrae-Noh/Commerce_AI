export default function SubscriptionPage() {
  return (
    <div>
      {/* Header */}
      <div className="max-w-5xl mx-auto mb-16 text-center">
        <span className="text-primary font-bold tracking-widest text-xs uppercase mb-4 block">Pricing Plans</span>
        <h1 className="text-4xl lg:text-5xl font-black text-on-surface font-headline mb-6 tracking-tight">이용권 안내</h1>
        <p className="text-on-surface-variant text-lg max-w-2xl mx-auto font-body">셀러의 성장을 위한 최적의 파트너. 데이터 분석을 통해 비즈니스 인사이트를 발견하세요.</p>
        {/* Toggle */}
        <div className="mt-10 inline-flex items-center p-1 bg-surface-container-high rounded-full">
          <button className="px-6 py-2 rounded-full bg-surface-container-lowest shadow-sm text-sm font-bold text-primary">월간 결제</button>
          <button className="px-6 py-2 rounded-full text-sm font-medium text-on-surface-variant hover:text-on-surface">연간 결제 (20% 할인)</button>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Starter */}
        <div className="bg-surface-container-low rounded-xl p-8 flex flex-col transition-all hover:translate-y-[-4px]">
          <div className="mb-8">
            <h3 className="text-xl font-bold font-headline mb-2">Starter</h3>
            <p className="text-on-surface-variant text-sm h-10">개인 셀러를 위한 기초 데이터 분석 도구</p>
          </div>
          <div className="mb-8">
            <span className="text-4xl font-black font-headline">&#8361;0</span>
            <span className="text-on-surface-variant text-sm">/월</span>
          </div>
          <ul className="flex-1 space-y-4 mb-10">
            <FeatureItem checked>일일 트렌드 리포트 (3회)</FeatureItem>
            <FeatureItem checked>기본 아이템 분석 도구</FeatureItem>
            <FeatureItem checked>커뮤니티 지원</FeatureItem>
            <FeatureItem>실시간 시장 감시</FeatureItem>
          </ul>
          <button className="w-full py-3 px-4 rounded-lg bg-surface-container-high text-on-surface font-bold text-sm hover:bg-surface-container-highest transition-colors">현재 플랜</button>
        </div>

        {/* Professional */}
        <div className="relative bg-surface-container-lowest rounded-xl p-8 flex flex-col shadow-[0px_20px_50px_rgba(0,80,203,0.12)] border border-primary/10 ring-2 ring-primary transition-all hover:translate-y-[-4px]">
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary to-primary-container text-on-primary text-[10px] font-black tracking-widest px-4 py-1 rounded-full uppercase">Most Popular</div>
          <div className="mb-8">
            <h3 className="text-xl font-bold font-headline mb-2 text-primary">Professional</h3>
            <p className="text-on-surface-variant text-sm h-10">성장하는 비즈니스를 위한 전문 분석 시스템</p>
          </div>
          <div className="mb-8">
            <span className="text-4xl font-black font-headline text-on-surface">&#8361;49,000</span>
            <span className="text-on-surface-variant text-sm">/월</span>
          </div>
          <ul className="flex-1 space-y-4 mb-10">
            <FeatureItem checked filled>무제한 일일 트렌드 리포트</FeatureItem>
            <FeatureItem checked filled>고급 아이템 분석 및 예측</FeatureItem>
            <FeatureItem checked filled>실시간 시장 감시 알림</FeatureItem>
            <FeatureItem checked filled>경쟁사 추적 시스템</FeatureItem>
            <FeatureItem checked filled>1:1 기술 지원</FeatureItem>
          </ul>
          <button className="w-full py-3 px-4 rounded-lg bg-gradient-to-br from-primary to-primary-container text-on-primary font-bold text-sm shadow-lg shadow-primary/20 hover:opacity-90 transition-all">지금 업그레이드</button>
        </div>

        {/* Enterprise */}
        <div className="bg-surface-container-low rounded-xl p-8 flex flex-col transition-all hover:translate-y-[-4px]">
          <div className="mb-8">
            <h3 className="text-xl font-bold font-headline mb-2">Enterprise</h3>
            <p className="text-on-surface-variant text-sm h-10">대규모 팀을 위한 맞춤형 데이터 솔루션</p>
          </div>
          <div className="mb-8">
            <span className="text-4xl font-black font-headline text-on-surface">별도 문의</span>
          </div>
          <ul className="flex-1 space-y-4 mb-10">
            <FeatureItem checked>Professional 모든 기능 포함</FeatureItem>
            <FeatureItem checked>맞춤형 API 통합 지원</FeatureItem>
            <FeatureItem checked>전담 계정 매니저 배정</FeatureItem>
            <FeatureItem checked>맞춤형 데이터 대시보드</FeatureItem>
          </ul>
          <button className="w-full py-3 px-4 rounded-lg bg-on-surface text-surface-bright font-bold text-sm hover:opacity-90 transition-colors">도입 문의하기</button>
        </div>
      </div>

      {/* Feature Comparison Table */}
      <section className="mt-24 max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold font-headline mb-10 text-center">기능 비교</h2>
        <div className="bg-surface-container-low rounded-2xl overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container">
                <th className="p-6 text-sm font-bold text-on-surface">기능 상세</th>
                <th className="p-6 text-sm font-bold text-on-surface text-center">Starter</th>
                <th className="p-6 text-sm font-bold text-primary text-center bg-primary/5">Professional</th>
                <th className="p-6 text-sm font-bold text-on-surface text-center">Enterprise</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              <ComparisonRow feature="데이터 분석 한도" starter="일 3회" pro="무제한" enterprise="무제한" />
              <ComparisonRow feature="실시간 알림" starter={false} pro={true} enterprise={true} />
              <ComparisonRow feature="다중 사용자 접속" starter="1명" pro="최대 5명" enterprise="무제한" />
              <ComparisonRow feature="데이터 보관 기간" starter="3개월" pro="12개월" enterprise="영구" />
              <ComparisonRow feature="커스텀 리포트" starter={false} pro={true} enterprise={true} />
            </tbody>
          </table>
        </div>
      </section>

      {/* Trust Section */}
      <section className="mt-24 border-t border-outline-variant/10 pt-16 text-center pb-8">
        <p className="text-sm font-bold text-on-surface-variant mb-10 tracking-widest uppercase">Trusted by 2,000+ TOP SELLERS</p>
        <div className="flex flex-wrap justify-center gap-12 opacity-30">
          {['Partner A', 'Partner B', 'Partner C', 'Partner D'].map(name => (
            <div key={name} className="h-8 px-6 bg-surface-container-high rounded flex items-center text-xs font-bold text-on-surface-variant">{name}</div>
          ))}
        </div>
      </section>
    </div>
  )
}

function FeatureItem({ children, checked, filled }) {
  return (
    <li className={`flex items-start gap-3 text-sm ${!checked ? 'opacity-40' : ''}`}>
      <span
        className={`material-symbols-outlined ${checked ? 'text-secondary' : ''} text-lg`}
        style={filled ? { fontVariationSettings: "'FILL' 1" } : undefined}
      >
        {checked ? 'check_circle' : 'cancel'}
      </span>
      <span className={`text-on-surface ${filled ? 'font-semibold' : ''}`}>{children}</span>
    </li>
  )
}

function ComparisonRow({ feature, starter, pro, enterprise }) {
  const renderCell = (val, highlight) => {
    if (val === true) return <span className={`material-symbols-outlined text-lg text-secondary`}>check</span>
    if (val === false) return <span className="material-symbols-outlined text-lg text-outline-variant">horizontal_rule</span>
    return <span className="text-sm">{val}</span>
  }

  return (
    <tr>
      <td className="p-6 text-sm font-medium">{feature}</td>
      <td className="p-6 text-sm text-center">{renderCell(starter)}</td>
      <td className="p-6 text-sm text-center bg-primary/5">{renderCell(pro, true)}</td>
      <td className="p-6 text-sm text-center">{renderCell(enterprise)}</td>
    </tr>
  )
}
