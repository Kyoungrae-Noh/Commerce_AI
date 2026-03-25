export default function AnalysisPage() {
  return (
    <div className="max-w-6xl mx-auto">
      {/* Header Section */}
      <section className="flex flex-col md:flex-row justify-between items-end mb-10">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-primary font-medium text-sm">
            <span>상품 분석</span>
            <span className="material-symbols-outlined text-xs">chevron_right</span>
            <span>프리미엄 가구</span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight font-headline text-on-background">상품 상세 분석</h1>
          <p className="text-on-surface-variant opacity-70">실시간 데이터 기반 마켓 성과 및 경쟁사 지표</p>
        </div>
        <div className="flex gap-3 mt-4 md:mt-0">
          <button className="px-5 py-2.5 rounded-lg bg-surface-container-high text-on-surface font-semibold flex items-center gap-2 hover:bg-surface-container-highest transition-colors">
            <span className="material-symbols-outlined">download</span>
            <span>리포트 다운로드</span>
          </button>
          <button className="px-5 py-2.5 rounded-lg bg-gradient-to-br from-primary to-primary-container text-on-primary font-bold shadow-md hover:shadow-lg transition-all">
            실시간 갱신
          </button>
        </div>
      </section>

      {/* Product Overview Bento Grid */}
      <div className="grid grid-cols-12 gap-6 mb-10">
        {/* Main Product Card */}
        <div className="col-span-12 lg:col-span-8 bg-surface-container-low rounded-xl p-8 flex flex-col md:flex-row gap-8 items-center border border-outline-variant/10">
          <div className="w-48 h-48 rounded-lg overflow-hidden flex-shrink-0 bg-white flex items-center justify-center">
            <span className="material-symbols-outlined text-6xl text-slate-300">chair</span>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-0.5 bg-secondary-container text-on-secondary-container text-[10px] font-bold rounded uppercase">Hot Trend</span>
              <span className="text-outline text-xs font-medium">SKU: FUR-3029-NW</span>
            </div>
            <h2 className="text-2xl font-bold mb-4 text-on-surface">모던 미니멀 오피스 체어 (Nordic White)</h2>
            <div className="grid grid-cols-3 gap-4 md:gap-6">
              <div className="p-4 bg-surface-container-lowest rounded-lg">
                <p className="text-xs text-outline mb-1">현재 판매가</p>
                <p className="text-xl font-black text-on-surface">&#8361;189,000</p>
              </div>
              <div className="p-4 bg-surface-container-lowest rounded-lg">
                <p className="text-xs text-outline mb-1">평균 구매 전환율</p>
                <p className="text-xl font-black text-secondary">4.82%</p>
              </div>
              <div className="p-4 bg-surface-container-lowest rounded-lg">
                <p className="text-xs text-outline mb-1">시장 점유율</p>
                <p className="text-xl font-black text-primary">12.5%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Secondary Metrics */}
        <div className="col-span-12 lg:col-span-4 grid grid-cols-2 gap-4">
          <MetricCard icon="trending_up" iconColor="text-primary" iconBg="bg-primary/10" label="검색량 (7D)" value="42.8k" change="+12%" changeColor="text-secondary" />
          <MetricCard icon="visibility" iconColor="text-tertiary" iconBg="bg-tertiary/10" label="노출 지수" value="892" change="-2.4%" changeColor="text-tertiary" />
          <MetricCard icon="star" iconColor="text-secondary" iconBg="bg-secondary/10" label="리뷰 점수" value="1,402" change="4.9/5" changeColor="text-secondary" />
          <MetricCard icon="inventory" iconColor="text-on-surface-variant" iconBg="bg-surface-container-highest" label="현재 재고" value="84" change="Low" changeColor="text-error" />
        </div>
      </div>

      {/* Analysis Charts Section */}
      <div className="grid grid-cols-12 gap-8 mb-10">
        {/* Trend Dynamics */}
        <div className="col-span-12 lg:col-span-8 bg-surface-container-low rounded-xl p-8 border border-outline-variant/10">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-xl font-bold font-headline text-on-surface">트렌드 다이나믹스</h3>
              <p className="text-sm text-outline">최근 30일간의 검색량과 가격 변동 추이</p>
            </div>
            <div className="flex gap-2 p-1 bg-surface-container-highest rounded-lg">
              <button className="px-3 py-1 bg-white shadow-sm rounded-md text-xs font-bold text-primary">7일</button>
              <button className="px-3 py-1 text-xs font-medium text-on-surface-variant">30일</button>
              <button className="px-3 py-1 text-xs font-medium text-on-surface-variant">90일</button>
            </div>
          </div>
          <div className="h-64 relative flex items-end gap-1">
            {[40,35,50,45,60,75,85,80,95,90,70,75,65,55,40].map((h, i) => (
              <div key={i} className="flex-1 bg-primary/20 rounded-t-sm transition-all hover:bg-primary/40" style={{ height: `${h}%` }} />
            ))}
            <div className="absolute inset-0 border-b-2 border-tertiary/40 border-dashed top-1/2" />
          </div>
          <div className="flex justify-between mt-4 text-[10px] text-outline font-medium px-1">
            <span>MAY 01</span><span>MAY 08</span><span>MAY 15</span><span>MAY 22</span><span>MAY 30</span>
          </div>
          <div className="mt-8 flex gap-6">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-primary" />
              <span className="text-xs text-on-surface-variant">검색 유입량</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-1 border-t-2 border-tertiary border-dashed" />
              <span className="text-xs text-on-surface-variant">평균 판매가</span>
            </div>
          </div>
        </div>

        {/* Competitor Mapping */}
        <div className="col-span-12 lg:col-span-4 bg-surface-container-low rounded-xl p-8 border border-outline-variant/10">
          <h3 className="text-xl font-bold font-headline mb-1 text-on-surface">경쟁사 맵핑</h3>
          <p className="text-sm text-outline mb-8">주요 경쟁 상품과의 포지셔닝 비교</p>
          <div className="space-y-4">
            <CompetitorCard name="A사 에르고 체어" price="&#8361;215,000" tier="High Tier" tierColor="text-primary" margin="+15%" />
            <CompetitorCard name="B사 우드 스툴" price="&#8361;142,000" tier="Mid Tier" tierColor="text-on-surface-variant" margin="+8%" />
            <CompetitorCard name="내 상품 (Nordic)" price="&#8361;189,000" tier="Sweet Spot" tierColor="text-primary" margin="+22%" highlight />
          </div>
          <button className="w-full mt-6 py-3 text-sm font-bold text-on-surface-variant hover:text-primary transition-colors flex items-center justify-center gap-2">
            상세 경쟁 지표 더보기
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </button>
        </div>
      </div>

      {/* AI SWOT Analysis */}
      <section className="bg-surface-container-low rounded-xl p-10 border border-outline-variant/10">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-gradient-to-tr from-blue-600 to-indigo-400 rounded-full flex items-center justify-center text-white shadow-lg">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
          </div>
          <div>
            <h3 className="text-2xl font-black font-headline text-on-surface">AI SWOT 전략</h3>
            <p className="text-sm text-outline">데이터 학습 모델 기반 상품 경쟁력 분석</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <SwotCard color="secondary" icon="verified" title="Strengths" items={['검색 전환율이 카테고리 평균 대비 24% 높음', '4.9점의 압도적인 사용자 리뷰 평점']} />
          <SwotCard color="tertiary" icon="warning" title="Weaknesses" items={['낮은 재고 수준으로 인한 품절 위험', '모바일 기기에서의 상세페이지 로딩 속도 저하']} />
          <SwotCard color="primary" icon="lightbulb" title="Opportunities" items={['사무용 가구 교체 시즌 진입 (6월)', '세트 상품 구성을 통한 객단가 상승 가능']} />
          <SwotCard color="error" icon="gpp_maybe" title="Threats" items={['C사의 유사 디자인 저가형 상품 출시 예정', '주요 원자재 가격 상승으로 인한 마진 압박']} />
        </div>
        <div className="mt-8 p-6 bg-primary/5 rounded-xl border border-primary/20 flex items-start gap-4">
          <span className="material-symbols-outlined text-primary mt-1">psychology</span>
          <div>
            <p className="text-primary font-bold text-sm mb-1">AI Recommendation</p>
            <p className="text-sm text-on-surface leading-relaxed">
              현재 높은 리뷰 평점과 전환율을 바탕으로 <strong>6월 중순 프로모션</strong>을 제안합니다.
              품절 위험이 있으니 즉시 <strong>재고 200개 이상을 확보</strong>하고,
              C사 저가형 공세에 대비해 &lsquo;품질 보증 5년&rsquo; 배너를 상세페이지 최상단에 배치하여 프리미엄 이미지를 강화하십시오.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

function MetricCard({ icon, iconColor, iconBg, label, value, change, changeColor }) {
  return (
    <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/5 shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <span className={`material-symbols-outlined ${iconColor} ${iconBg} p-2 rounded-lg`}>{icon}</span>
        <span className={`${changeColor} text-xs font-bold`}>{change}</span>
      </div>
      <p className="text-xs text-outline mb-1">{label}</p>
      <p className="text-2xl font-black text-on-surface">{value}</p>
    </div>
  )
}

function CompetitorCard({ name, price, tier, tierColor, margin, highlight }) {
  return (
    <div className={`p-4 bg-white rounded-lg flex items-center justify-between border border-outline-variant/5 ${highlight ? 'ring-1 ring-primary/30' : ''}`}>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded bg-slate-100 flex-shrink-0 flex items-center justify-center">
          <span className="material-symbols-outlined text-slate-400 text-sm">chair</span>
        </div>
        <div>
          <p className={`text-xs font-bold ${highlight ? 'text-primary' : 'text-on-surface'}`}>{name}</p>
          <p className="text-[10px] text-outline">가격: {price}</p>
        </div>
      </div>
      <div className="text-right">
        <p className={`text-xs font-bold ${tierColor}`}>{tier}</p>
        <p className="text-[10px] text-secondary">수익률 {margin}</p>
      </div>
    </div>
  )
}

function SwotCard({ color, icon, title, items }) {
  return (
    <div className={`bg-white p-6 rounded-xl border-l-4 border-${color} shadow-sm`}>
      <div className={`flex items-center gap-2 mb-4 text-${color}`}>
        <span className="material-symbols-outlined text-sm">{icon}</span>
        <span className="text-sm font-bold uppercase tracking-wider">{title}</span>
      </div>
      <ul className="space-y-3">
        {items.map((item, i) => (
          <li key={i} className="text-sm text-on-surface font-medium leading-relaxed">&bull; {item}</li>
        ))}
      </ul>
    </div>
  )
}
