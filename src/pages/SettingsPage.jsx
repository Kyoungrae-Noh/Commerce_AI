import { useState } from 'react'

export default function SettingsPage() {
  const [notifDaily, setNotifDaily] = useState(true)
  const [notifStock, setNotifStock] = useState(true)
  const [notifTeam, setNotifTeam] = useState(false)

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-10">
        <h2 className="text-4xl font-headline font-extrabold tracking-tight text-on-surface mb-2">설정</h2>
        <p className="text-on-surface-variant font-body">계정 정보, 샵 연동 및 팀 관리 기능을 제어합니다.</p>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-12 gap-8">
        {/* User Profile */}
        <section className="col-span-12 lg:col-span-7 bg-surface-container-low p-8 rounded-xl">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-headline font-bold text-on-surface">사용자 프로필</h3>
            <button className="text-primary font-bold text-sm hover:underline">편집하기</button>
          </div>
          <div className="flex flex-col md:flex-row items-start gap-8">
            <div className="relative">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center shadow-md">
                <span className="material-symbols-outlined text-4xl text-primary">person</span>
              </div>
              <button className="absolute -bottom-2 -right-2 bg-white p-2 rounded-lg shadow-lg border border-outline-variant/10 text-primary">
                <span className="material-symbols-outlined text-sm">photo_camera</span>
              </button>
            </div>
            <div className="flex-1 grid grid-cols-2 gap-6">
              <div className="space-y-1">
                <p className="text-[11px] uppercase tracking-widest text-outline font-bold">이름</p>
                <p className="text-lg font-semibold text-on-surface">김인사이트</p>
              </div>
              <div className="space-y-1">
                <p className="text-[11px] uppercase tracking-widest text-outline font-bold">직책</p>
                <p className="text-lg font-semibold text-on-surface">최고 경영자</p>
              </div>
              <div className="col-span-2 space-y-1">
                <p className="text-[11px] uppercase tracking-widest text-outline font-bold">이메일 주소</p>
                <p className="text-lg font-semibold text-on-surface">ceo@insightflux.io</p>
              </div>
            </div>
          </div>
        </section>

        {/* Plan Summary */}
        <section className="col-span-12 lg:col-span-5 bg-gradient-to-br from-primary to-primary-container p-8 rounded-xl text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-blue-100 text-sm font-bold mb-1">현재 사용 중인 플랜</p>
            <h3 className="text-3xl font-headline font-black mb-4">Enterprise Pro</h3>
            <div className="flex items-center gap-2 mb-6">
              <span className="bg-white/20 px-2 py-0.5 rounded text-xs font-bold">Active</span>
              <span className="text-blue-100 text-xs">다음 결제일: 2024년 6월 15일</span>
            </div>
            <button className="w-full bg-white text-primary py-3 rounded-lg font-bold hover:bg-blue-50 transition-colors">
              플랜 관리 및 영수증 확인
            </button>
          </div>
          <div className="absolute -bottom-10 -right-10 opacity-10">
            <span className="material-symbols-outlined text-[12rem]">verified</span>
          </div>
        </section>

        {/* Store Integration */}
        <section className="col-span-12 lg:col-span-8 bg-surface-container-low p-8 rounded-xl">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-headline font-bold text-on-surface">스토어 연동 관리</h3>
            <button className="bg-surface-container-high px-4 py-2 rounded-lg text-sm font-bold text-on-surface-variant hover:bg-surface-container-highest transition-colors flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">add</span>
              새 스토어 추가
            </button>
          </div>
          <div className="space-y-4">
            <StoreCard name="네이버 스마트스토어" account="insight_official_store" color="#03C75A" letter="N" lastSync="5분 전" />
            <StoreCard name="쿠팡 윙 (Coupang Wing)" account="flux_global_seller" color="#F21212" letter="C" lastSync="12분 전" />
          </div>
        </section>

        {/* Notification Preferences */}
        <section className="col-span-12 lg:col-span-4 bg-surface-container-low p-8 rounded-xl flex flex-col">
          <h3 className="text-xl font-headline font-bold text-on-surface mb-8">알림 설정</h3>
          <div className="space-y-6 flex-1">
            <ToggleSetting label="매일 성과 요약" desc="매일 오전 9시 알림 발송" checked={notifDaily} onChange={setNotifDaily} />
            <ToggleSetting label="재고 임계값 경고" desc="재고 10개 미만 시 즉시 알림" checked={notifStock} onChange={setNotifStock} />
            <ToggleSetting label="팀원 활동 로그" desc="권한 변경 및 데이터 삭제 시" checked={notifTeam} onChange={setNotifTeam} />
          </div>
          <div className="mt-8 p-4 bg-tertiary/10 rounded-lg">
            <p className="text-tertiary text-xs font-semibold leading-snug">
              <span className="material-symbols-outlined text-sm align-middle mr-1">info</span>
              주요 장애 발생 시 시스템 공지는 설정과 관계없이 발송됩니다.
            </p>
          </div>
        </section>

        {/* Team Management */}
        <section className="col-span-12 bg-surface-container-low p-8 rounded-xl">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
            <div>
              <h3 className="text-xl font-headline font-bold text-on-surface">팀원 관리</h3>
              <p className="text-sm text-on-surface-variant mt-1">현재 사용 중인 플랜에서는 최대 10명의 팀원을 초대할 수 있습니다.</p>
            </div>
            <button className="bg-primary text-white px-6 py-2.5 rounded-lg text-sm font-bold shadow-md hover:bg-primary-container transition-all flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">person_add</span>
              팀원 초대하기
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[11px] uppercase tracking-widest text-outline border-b border-outline-variant/10">
                  <th className="pb-4 font-bold">이름 / 이메일</th>
                  <th className="pb-4 font-bold">역할</th>
                  <th className="pb-4 font-bold">마지막 접속</th>
                  <th className="pb-4 font-bold text-right">관리</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/5">
                <TeamRow name="박지민" email="jimin.park@insightflux.io" role="Admin" roleBg="bg-blue-100 text-blue-800" lastLogin="2시간 전" />
                <TeamRow name="이도훈" email="dh.lee@insightflux.io" role="Viewer" roleBg="bg-slate-100 text-slate-600" lastLogin="어제 18:45" />
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {/* Danger Zone */}
      <div className="mt-16 pt-8 border-t border-outline-variant/20">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h4 className="text-lg font-bold text-tertiary">계정 해지</h4>
            <p className="text-sm text-on-surface-variant mt-1">계정을 삭제하면 모든 데이터와 연동 정보가 즉시 삭제되며 복구할 수 없습니다.</p>
          </div>
          <button className="px-6 py-2.5 border border-tertiary/50 text-tertiary rounded-lg text-sm font-bold hover:bg-tertiary hover:text-white transition-all">
            계정 삭제하기
          </button>
        </div>
      </div>
    </div>
  )
}

function StoreCard({ name, account, color, letter, lastSync }) {
  return (
    <div className="bg-surface-container-lowest p-6 rounded-xl flex items-center justify-between group hover:shadow-sm transition-all">
      <div className="flex items-center gap-5">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-xl" style={{ backgroundColor: color }}>{letter}</div>
        <div>
          <h4 className="font-bold text-on-surface">{name}</h4>
          <p className="text-sm text-on-surface-variant">{account}</p>
        </div>
      </div>
      <div className="flex items-center gap-6">
        <div className="text-right">
          <p className="text-xs font-bold text-secondary flex items-center justify-end gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
            연동 중
          </p>
          <p className="text-[10px] text-outline">최근 동기화: {lastSync}</p>
        </div>
        <button className="p-2 text-outline hover:text-primary transition-colors">
          <span className="material-symbols-outlined">more_vert</span>
        </button>
      </div>
    </div>
  )
}

function ToggleSetting({ label, desc, checked, onChange }) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="font-semibold text-on-surface">{label}</p>
        <p className="text-[11px] text-on-surface-variant">{desc}</p>
      </div>
      <label className="relative inline-flex items-center cursor-pointer">
        <input type="checkbox" className="sr-only peer" checked={checked} onChange={() => onChange(!checked)} />
        <div className="w-11 h-6 bg-surface-container-highest rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
      </label>
    </div>
  )
}

function TeamRow({ name, email, role, roleBg, lastLogin }) {
  return (
    <tr className="group hover:bg-surface-container transition-colors">
      <td className="py-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center">
            <span className="material-symbols-outlined text-slate-500 text-sm">person</span>
          </div>
          <div>
            <p className="font-semibold text-on-surface">{name}</p>
            <p className="text-xs text-outline">{email}</p>
          </div>
        </div>
      </td>
      <td className="py-5">
        <span className={`${roleBg} text-[11px] font-bold px-2 py-0.5 rounded uppercase`}>{role}</span>
      </td>
      <td className="py-5 text-sm text-on-surface-variant">{lastLogin}</td>
      <td className="py-5 text-right">
        <button className="text-outline hover:text-error transition-colors p-2">
          <span className="material-symbols-outlined text-lg">delete_outline</span>
        </button>
      </td>
    </tr>
  )
}
