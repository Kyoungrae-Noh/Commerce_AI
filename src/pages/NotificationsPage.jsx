export default function NotificationsPage() {
  return (
    <div className="max-w-5xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-primary font-bold tracking-widest text-[10px] uppercase">Notification Hub</span>
            <div className="h-px w-8 bg-primary/30" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold font-headline tracking-tight text-on-surface mb-3">알림 센터</h1>
          <p className="text-on-surface-variant font-body max-w-lg">실시간 키워드 순위 변동 및 카테고리 트렌드, 시스템 주요 업데이트를 한눈에 확인하세요.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-surface-container-high text-on-primary-fixed-variant rounded-lg font-medium text-sm hover:bg-surface-container-highest transition-colors">전체 읽음 처리</button>
          <button className="px-4 py-2 bg-gradient-to-r from-primary to-primary-container text-white rounded-lg font-bold text-sm shadow-lg shadow-primary/20 flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">tune</span>
            알림 설정
          </button>
        </div>
      </div>

      {/* Filter Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <button className="flex flex-col p-4 bg-surface-container-lowest rounded-xl shadow-sm border border-primary/10 transition-all hover:ring-2 ring-primary/20">
          <span className="text-primary font-bold text-2xl mb-1">24</span>
          <span className="text-xs font-semibold text-on-surface-variant">전체 알림</span>
        </button>
        <FilterStat value="12" label="마켓 트렌드" color="text-secondary" icon="trending_up" />
        <FilterStat value="8" label="키워드 랭킹" color="text-primary" icon="key" />
        <FilterStat value="4" label="시스템 업데이트" color="text-tertiary" icon="info" />
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {/* Today */}
        <div>
          <h2 className="text-xs font-bold text-outline uppercase tracking-widest mb-4 flex items-center gap-2">
            <span>TODAY</span>
            <div className="h-px flex-1 bg-outline-variant/15" />
          </h2>
          <div className="space-y-3">
            <NotificationCard
              borderColor="border-primary"
              iconBg="bg-primary/10"
              iconColor="text-primary"
              icon="show_chart"
              tag="Keywords"
              tagColor="text-primary"
              tagBg="bg-primary/5"
              time="방금 전"
              title="관심 키워드 '무선 헤드셋' 순위 상승"
              description={<>전일 대비 <span className="text-secondary font-bold">12위</span> 상승하여 현재 3위에 랭크되었습니다.</>}
              actions
            />
            <NotificationCard
              borderColor="border-secondary"
              iconBg="bg-secondary/10"
              iconColor="text-secondary"
              icon="rocket_launch"
              iconFill
              tag="Market"
              tagColor="text-secondary"
              tagBg="bg-secondary/5"
              time="2시간 전"
              title="새로운 라이징 카테고리 감지: '스마트 가드닝'"
              description={<>해당 카테고리의 주간 검색량이 <span className="text-secondary font-bold">145%</span> 급증했습니다. 새로운 기회를 확인하세요.</>}
            />
          </div>
        </div>

        {/* Yesterday */}
        <div className="pt-6">
          <h2 className="text-xs font-bold text-outline uppercase tracking-widest mb-4 flex items-center gap-2">
            <span>YESTERDAY</span>
            <div className="h-px flex-1 bg-outline-variant/15" />
          </h2>
          <div className="space-y-3">
            <NotificationCard
              borderColor="border-tertiary/40"
              iconBg="bg-tertiary/10"
              iconColor="text-tertiary"
              icon="auto_awesome"
              iconFill
              tag="System"
              tagColor="text-tertiary"
              tagBg="bg-tertiary/5"
              time="1일 전"
              title="데이터 분석 엔진 v2.4 업데이트 안내"
              description="이제 네이버 쇼핑 데이터 수집 주기가 2시간에서 30분으로 단축되었습니다. 더 정밀한 실시간 분석을 경험해보세요."
            />
            <NotificationCard
              borderColor="border-primary/20"
              iconBg="bg-surface-container-high"
              iconColor="text-outline"
              icon="monitoring"
              tag="Keywords"
              tagColor="text-outline"
              tagBg="bg-surface-container-high"
              time="1일 전"
              title="관심 키워드 '캠핑 의자' 순위 하락"
              description="전일 대비 4위 하락하여 15위에 위치하고 있습니다."
              dimmed
            />
          </div>
        </div>
      </div>

      {/* Footer / Load more */}
      <div className="mt-12 flex flex-col items-center gap-6">
        <button className="group flex items-center gap-2 text-sm font-bold text-primary px-8 py-3 rounded-full bg-primary/5 hover:bg-primary/10 transition-all">
          이전 알림 더 보기
          <span className="material-symbols-outlined transition-transform group-hover:translate-y-0.5">keyboard_arrow_down</span>
        </button>
        <div className="flex items-center gap-8 text-[11px] text-outline-variant font-medium">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-primary" />
            <span>Keywords</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-secondary" />
            <span>Market Trends</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-tertiary" />
            <span>System Updates</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function FilterStat({ value, label, color, icon }) {
  return (
    <button className="flex flex-col p-4 bg-surface-container-low rounded-xl hover:bg-surface-container-highest transition-all group">
      <div className="flex justify-between items-start mb-1">
        <span className={`${color} font-bold text-2xl`}>{value}</span>
        <span className={`material-symbols-outlined ${color} opacity-0 group-hover:opacity-100 transition-opacity`}>{icon}</span>
      </div>
      <span className="text-xs font-medium text-on-surface-variant">{label}</span>
    </button>
  )
}

function NotificationCard({ borderColor, iconBg, iconColor, icon, iconFill, tag, tagColor, tagBg, time, title, description, actions, dimmed }) {
  return (
    <div className={`group relative flex items-start gap-5 p-5 bg-surface-container-lowest rounded-2xl border-l-4 ${borderColor} transition-all hover:shadow-md ${dimmed ? 'opacity-75 grayscale-[0.3]' : ''}`}>
      <div className={`w-12 h-12 rounded-xl ${iconBg} flex items-center justify-center flex-shrink-0`}>
        <span
          className={`material-symbols-outlined ${iconColor}`}
          style={iconFill ? { fontVariationSettings: "'FILL' 1" } : { fontVariationSettings: "'wght' 600" }}
        >{icon}</span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className={`text-[10px] font-bold ${tagColor} ${tagBg} px-2 py-0.5 rounded uppercase`}>{tag}</span>
          <span className="text-[11px] text-outline font-medium">{time}</span>
        </div>
        <h3 className="text-sm font-bold text-on-surface mb-1">{title}</h3>
        <p className="text-sm text-on-surface-variant leading-relaxed mb-3">{description}</p>
        {actions && (
          <div className="flex items-center gap-4">
            <button className="text-xs font-bold text-primary hover:underline underline-offset-4">상세 분석 보기</button>
            <button className="text-xs font-medium text-outline-variant hover:text-outline transition-colors">무시하기</button>
          </div>
        )}
      </div>
      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
        <button className="p-1 hover:bg-surface-container rounded">
          <span className="material-symbols-outlined text-outline">more_vert</span>
        </button>
      </div>
    </div>
  )
}
