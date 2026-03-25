export default function SupportPage() {
  return (
    <div className="max-w-[1200px] mx-auto space-y-10">
      {/* Hero Section */}
      <section className="flex flex-col md:flex-row justify-between items-end gap-6 mb-4">
        <div className="space-y-2">
          <span className="text-primary font-bold tracking-widest text-xs uppercase">Support Center</span>
          <h2 className="text-5xl font-extrabold font-headline tracking-tight text-on-surface">문의하기</h2>
          <p className="text-on-surface-variant text-lg max-w-lg">에디토리얼 인텔리전스 팀이 귀하의 비즈니스 성장을 돕기 위해 대기하고 있습니다. 궁금한 점을 남겨주세요.</p>
        </div>
        <div className="flex gap-3">
          <div className="flex flex-col items-end">
            <span className="text-3xl font-bold text-primary font-headline">98%</span>
            <span className="text-sm text-on-surface-variant">평균 응답 만족도</span>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <QuickLink
          icon="description"
          iconBg="bg-blue-50"
          iconColor="text-primary"
          title="가이드 및 문서"
          desc="플랫폼의 모든 기능을 마스터할 수 있는 상세 매뉴얼을 확인하세요."
          linkText="문서 보기"
          linkColor="text-primary"
          linkIcon="arrow_forward"
        />
        <QuickLink
          icon="school"
          iconBg="bg-secondary-container/20"
          iconColor="text-secondary"
          title="비디오 튜토리얼"
          desc="데이터 분석과 대시보드 활용법을 영상으로 쉽고 빠르게 배워보세요."
          linkText="강좌 보기"
          linkColor="text-secondary"
          linkIcon="play_circle"
        />
        <QuickLink
          icon="forum"
          iconBg="bg-tertiary-fixed"
          iconColor="text-tertiary"
          title="커뮤니티 포럼"
          desc="다른 셀러들과 인사이트를 공유하고 실전 팁을 나누어보세요."
          linkText="포럼 참여"
          linkColor="text-tertiary"
          linkIcon="groups"
        />
      </section>

      {/* FAQ + Inquiry Form */}
      <section className="grid grid-cols-1 lg:grid-cols-5 gap-10">
        {/* FAQ */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            <h3 className="text-lg font-bold mb-2">자주 묻는 질문 (FAQ)</h3>
            <p className="text-sm text-on-surface-variant">문의 전 확인하시면 빠른 해결이 가능합니다.</p>
          </div>
          <div className="space-y-4">
            <FaqItem question="유료 플랜 결제는 어떻게 하나요?" answer="설정 > 구독 메뉴에서 카드 등록 후 즉시 이용 가능합니다. 국내 모든 신용카드 및 간편결제를 지원합니다." defaultOpen />
            <FaqItem question="데이터 업데이트 주기가 궁금합니다." answer="기본적으로 매일 오전 6시에 전일 데이터가 최종 업데이트되며, 실시간 트렌드는 1시간 단위로 갱신됩니다." />
            <FaqItem question="여러 쇼핑몰을 연동할 수 있나요?" answer="엔터프라이즈 플랜을 사용 중이시라면 최대 5개의 쇼핑몰 계정을 통합 관리하실 수 있습니다." />
            <FaqItem question="환불 규정은 어떻게 되나요?" answer="결제 후 7일 이내, 서비스를 사용하지 않은 경우 전액 환불이 가능합니다. 상세 내용은 이용약관을 참고하세요." />
          </div>
        </div>

        {/* Inquiry Form */}
        <div className="lg:col-span-3">
          <div className="bg-surface-container-lowest rounded-2xl shadow-sm overflow-hidden p-1 shadow-primary/5">
            <div className="p-8 space-y-8">
              <div>
                <h3 className="text-2xl font-bold mb-2">1:1 문의하기</h3>
                <p className="text-sm text-on-surface-variant">업무일 기준 최대 24시간 이내에 답변 드립니다.</p>
              </div>
              <form className="space-y-6" onSubmit={e => e.preventDefault()}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-on-surface-variant ml-1">성함 / 업체명</label>
                    <input className="w-full bg-surface-container-highest border-none rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary/20 transition-all" placeholder="홍길동" type="text" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-on-surface-variant ml-1">이메일 주소</label>
                    <input className="w-full bg-surface-container-highest border-none rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary/20 transition-all" placeholder="example@email.com" type="email" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-on-surface-variant ml-1">문의 유형</label>
                  <select className="w-full bg-surface-container-highest border-none rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary/20 transition-all">
                    <option>플랜 및 결제 문의</option>
                    <option>계정 및 보안</option>
                    <option>데이터 오류 보고</option>
                    <option>기타 일반 문의</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-on-surface-variant ml-1">문의 내용</label>
                  <textarea className="w-full bg-surface-container-highest border-none rounded-lg p-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all resize-none" placeholder="상세한 내용을 적어주시면 더 정확한 답변이 가능합니다." rows={6} />
                </div>
                <div className="flex items-start gap-3 p-4 bg-surface-container-low rounded-lg">
                  <input className="mt-1 rounded border-outline-variant text-primary focus:ring-primary" id="privacy" type="checkbox" />
                  <label className="text-xs text-on-surface-variant leading-relaxed" htmlFor="privacy">
                    개인정보 수집 및 이용에 동의합니다. (필수) 답변을 위한 용도로만 사용되며 관련 법령에 따라 3년간 보관됩니다.
                  </label>
                </div>
                <button className="w-full py-4 bg-gradient-to-r from-primary to-primary-container text-on-primary font-bold rounded-xl shadow-lg shadow-primary/10 transition-all active:scale-[0.98]" type="submit">
                  문의 제출하기
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Contact */}
      <section className="bg-primary-container/10 border border-primary/10 rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative">
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-primary/5 rounded-full blur-3xl" />
        <div className="space-y-2 z-10">
          <h3 className="text-xl font-bold">도움이 더 필요하신가요?</h3>
          <p className="text-sm text-on-surface-variant">긴급한 기술 지원이 필요하시다면 고객센터로 직접 연락주세요.</p>
        </div>
        <div className="flex flex-wrap gap-4 z-10">
          <div className="flex items-center gap-3 bg-surface-container-lowest px-6 py-3 rounded-full border border-outline-variant/20">
            <span className="material-symbols-outlined text-primary">call</span>
            <span className="text-sm font-bold">1588-0000</span>
          </div>
          <div className="flex items-center gap-3 bg-surface-container-lowest px-6 py-3 rounded-full border border-outline-variant/20">
            <span className="material-symbols-outlined text-secondary">chat</span>
            <span className="text-sm font-bold">카카오톡 채널 상담</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="pt-8 border-t border-outline-variant/10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 opacity-50">
          <p className="text-xs">&copy; 2024 Editorial Data Intelligence. All rights reserved.</p>
          <div className="flex gap-6 text-xs font-medium">
            <a href="#">이용약관</a>
            <a href="#">개인정보처리방침</a>
            <a href="#">운영정책</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

function QuickLink({ icon, iconBg, iconColor, title, desc, linkText, linkColor, linkIcon }) {
  return (
    <div className="bg-surface-container-lowest p-6 rounded-xl transition-all hover:translate-y-[-4px]">
      <div className={`w-12 h-12 rounded-lg ${iconBg} flex items-center justify-center ${iconColor} mb-6`}>
        <span className="material-symbols-outlined text-2xl">{icon}</span>
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-on-surface-variant text-sm mb-6 leading-relaxed">{desc}</p>
      <a href="#" className={`${linkColor} font-bold text-sm flex items-center gap-1 group`}>
        {linkText} <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">{linkIcon}</span>
      </a>
    </div>
  )
}

function FaqItem({ question, answer, defaultOpen }) {
  return (
    <details className="group bg-surface-container-low rounded-xl overflow-hidden" open={defaultOpen}>
      <summary className="flex justify-between items-center p-5 cursor-pointer list-none">
        <span className="font-bold text-sm">{question}</span>
        <span className="material-symbols-outlined transition-transform group-open:rotate-180">expand_more</span>
      </summary>
      <div className="px-5 pb-5 pt-0 text-sm text-on-surface-variant leading-relaxed">
        {answer}
      </div>
    </details>
  )
}
