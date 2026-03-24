import { useEffect } from 'react'
import './Landing.css'

const heroMetrics = [
  { label: '분석 신호 포착률', current: '92%', previous: '84%' },
  { label: '예상 마진 구간', current: '31pt', previous: '24pt' },
  { label: '의사결정 소요 시간', current: '4.2h', previous: '9.8h' },
]

const principleCards = [
  {
    label: '색상 체계',
    title: '미드나잇 베이스 위에 로열 블루만 강하게 남깁니다.',
    body: '배경은 깊고 차분해야 하고, 시선은 오직 핵심 수치와 액션에만 모여야 합니다.',
  },
  {
    label: '타이포그래피',
    title: '큰 메시지는 Manrope, 세부 데이터는 Inter로 분리합니다.',
    body: '요약과 분석이 한 화면에 공존해도 읽는 우선순위가 흐트러지지 않게 설계합니다.',
  },
  {
    label: '구획 방식',
    title: '선으로 자르지 않고, 톤 차이와 여백으로 계층을 만듭니다.',
    body: '카드와 섹션은 배경값의 대비로만 분리하고, 기계적인 1px divider는 배제합니다.',
  },
]

const moduleCards = [
  {
    label: 'Glass & Gradient',
    title: '떠 있는 것이 아니라 공간에 스며든 패널',
    body: '상단 구조물과 메인 스테이지는 반투명 유리층과 블러를 적용해 하나의 지휘실처럼 연결합니다.',
  },
  {
    label: 'Metric Overlap',
    title: '현재 수치 뒤로 이전 수치를 겹쳐 시간의 층을 만듭니다.',
    body: '단순 비교가 아니라 변화의 방향이 먼저 느껴지도록 배치합니다.',
  },
  {
    label: 'Sparkline',
    title: '축이 없는 파형으로 흐름만 남깁니다.',
    body: '무거운 차트보다, 의사결정에 필요한 상승과 압축의 리듬만 간결하게 보여줍니다.',
  },
]

const doItems = [
  '여백을 넉넉하게 사용해 고밀도 화면을 더 명확하게 만듭니다.',
  '큰 인사이트와 작은 데이터의 서체 역할을 분리합니다.',
  'surface-on-surface layering으로 깊이를 만듭니다.',
]

const dontItems = [
  '1px 구분선으로 섹션을 자르지 않습니다.',
  '과한 초록색이나 소비재 느낌의 색을 남발하지 않습니다.',
  '정교한 시스템에 어울리지 않는 과도한 둥근 모서리를 쓰지 않습니다.',
]

function useReveal() {
  useEffect(() => {
    const reveals = document.querySelectorAll('.reveal')
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.14 },
    )

    reveals.forEach((node) => observer.observe(node))
    return () => observer.disconnect()
  }, [])
}

export default function Landing() {
  useReveal()

  return (
    <main className="landing-shell">
      <div className="landing-ambient landing-ambient-left" />
      <div className="landing-ambient landing-ambient-right" />

      <header className="topbar">
        <a href="#top" className="brand-mark">COMMERCE AI</a>
        <nav className="topbar-nav">
          <a href="#principles">원칙</a>
          <a href="#modules">구성</a>
          <a href="#rules">가이드</a>
        </nav>
      </header>

      <section className="hero-section" id="top">
        <div className="hero-copy">
          <p className="micro-kicker reveal">THE DIGITAL COMMAND CENTER</p>
          <h1 className="reveal">
            기능이 아니라
            <span>판단의 분위기부터</span>
            설계합니다
          </h1>
          <p className="hero-body reveal">
            이 화면은 기능을 설명하는 랜딩이 아닙니다. `DESIGN.md`의 방향 그대로, 이커머스 데이터를
            평범한 SaaS가 아니라 고급 전략 도구처럼 보이게 만드는 디자인 언어만 남긴 정적 시안입니다.
          </p>
          <div className="hero-actions reveal">
            <a href="#modules" className="action-primary">디자인 구조 보기</a>
            <a href="#rules" className="action-secondary">규칙 확인하기</a>
          </div>
        </div>

        <div className="hero-stage reveal">
          <div className="stage-glass">
            <div className="stage-header">
              <div>
                <p className="eyebrow">핵심 지표 보드</p>
                <h2>의사결정을 위한 장면을 먼저 만듭니다.</h2>
              </div>
              <div className="signal-chip">실시간</div>
            </div>

            <div className="metric-grid">
              {heroMetrics.map((metric) => (
                <article className="metric-card" key={metric.label}>
                  <p className="metric-label">{metric.label}</p>
                  <div className="metric-stack">
                    <span className="metric-previous">{metric.previous}</span>
                    <div className="metric-current">{metric.current}</div>
                  </div>
                </article>
              ))}
            </div>

            <div className="stage-panel">
              <div className="panel-copy">
                <p className="eyebrow">신호 흐름</p>
                <h3>축은 지우고, 흐름만 남긴 로열 블루 파형</h3>
                <p>묵직한 차트 대신 방향성과 긴장감만 읽히도록 정리합니다.</p>
              </div>
              <div className="panel-graph" aria-hidden="true">
                <span />
                <span />
                <span />
                <span />
                <span />
                <span />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="principles-section reveal" id="principles">
        <div className="section-heading">
          <p className="micro-kicker">DESIGN PRINCIPLES</p>
          <h2>문서는 설명하고, 화면은 그 설명을 그대로 보여줘야 합니다.</h2>
        </div>
        <div className="principle-grid">
          {principleCards.map((card) => (
            <article className="info-card" key={card.label}>
              <p className="eyebrow">{card.label}</p>
              <h3>{card.title}</h3>
              <p>{card.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="modules-section" id="modules">
        <div className="section-heading reveal">
          <p className="micro-kicker">PRECISION COMPONENTS</p>
          <h2>DESIGN.md에 적힌 핵심 장치를 화면 안에서 바로 읽히게 만듭니다.</h2>
        </div>

        <div className="modules-layout">
          <div className="modules-list">
            {moduleCards.map((card) => (
              <article className="info-card reveal" key={card.label}>
                <p className="eyebrow">{card.label}</p>
                <h3>{card.title}</h3>
                <p>{card.body}</p>
              </article>
            ))}
          </div>

          <aside className="decision-rail reveal">
            <div className="decision-rail-head">
              <p className="eyebrow">Surface Hierarchy</p>
              <h3>밝기와 재질만으로 위계를 만듭니다.</h3>
            </div>
            <div className="surface-stack">
              <div className="surface-base">
                <span>Level 0</span>
                <strong>surface-container-low</strong>
              </div>
              <div className="surface-card">
                <span>Level 1</span>
                <strong>surface-container-lowest</strong>
              </div>
              <div className="surface-bright">
                <span>Level 2</span>
                <strong>active / floating layer</strong>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="rules-section reveal" id="rules">
        <div className="rule-column">
          <p className="micro-kicker">DO</p>
          <div className="rule-list">
            {doItems.map((item) => (
              <article className="rule-card" key={item}>
                <p>{item}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="rule-column">
          <p className="micro-kicker">DON'T</p>
          <div className="rule-list">
            {dontItems.map((item) => (
              <article className="rule-card rule-card-caution" key={item}>
                <p>{item}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
