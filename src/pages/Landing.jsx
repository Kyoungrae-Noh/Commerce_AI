import { useEffect } from 'react'
import './Landing.css'

const commandMetrics = [
  { label: 'Signal Coverage', value: '92', suffix: '%', previous: '84%', tone: 'blue' },
  { label: 'Margin Window', value: '31', suffix: 'pt', previous: '24pt', tone: 'neutral' },
  { label: 'Decision Latency', value: '4.2', suffix: 'h', previous: '9.8h', tone: 'blue' },
]

const intelligenceModules = [
  {
    eyebrow: 'Demand Signal',
    title: 'Market narratives distilled into decisive motion.',
    body: '카테고리 노이즈를 제거하고 실제로 움직이는 수요만 남긴 executive-grade snapshot.',
  },
  {
    eyebrow: 'Competitive Window',
    title: 'Price pressure and saturation read as one coherent field.',
    body: '가격 압박, 진입 여지, 카테고리 피로도를 분리하지 않고 하나의 전략 캔버스로 보여줍니다.',
  },
  {
    eyebrow: 'Operating Tempo',
    title: 'A command rhythm for sourcing teams that need speed without chaos.',
    body: '다음 액션이 바로 보이는 구조로 설계해 분석 도구가 아니라 지휘실처럼 작동하게 만듭니다.',
  },
]

const decisionFeed = [
  { time: '08:40 KST', title: 'Portable humidifier cluster', note: 'Royal-blue signal spike with widening margin band.' },
  { time: '09:15 KST', title: 'Beauty accessory basket', note: 'High demand, but compression risk visible in lower-tier sellers.' },
  { time: '11:05 KST', title: 'Desk utility micro-category', note: 'Low competition profile and faster decision window.' },
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
          <a href="#framework">Framework</a>
          <a href="#modules">Modules</a>
          <a href="#contact" className="topbar-cta">Request Access</a>
        </nav>
      </header>

      <section className="hero-section" id="top">
        <div className="hero-copy">
          <p className="micro-kicker reveal">THE SOVEREIGN INTELLIGENCE FRAMEWORK</p>
          <h1 className="reveal">
            Design the product like a
            <span>digital command center.</span>
          </h1>
          <p className="hero-body reveal">
            `DESIGN.md`의 핵심만 남겨, 평범한 SaaS 랜딩이 아니라 전략적 판단을 위한 고밀도 인터페이스로 재구성했습니다.
            기능보다 분위기, 계층, 타이포, 시선 흐름이 먼저 읽히도록 정리한 버전입니다.
          </p>
          <div className="hero-actions reveal">
            <a href="#modules" className="action-primary">View The System</a>
            <a href="#contact" className="action-secondary">Design Brief</a>
          </div>
        </div>

        <div className="hero-stage reveal">
          <div className="stage-glass">
            <div className="stage-header">
              <div>
                <p className="eyebrow">Executive Signal Board</p>
                <h2>Focused power, not feature noise.</h2>
              </div>
              <div className="signal-chip">LIVE</div>
            </div>

            <div className="metric-grid">
              {commandMetrics.map((metric) => (
                <article className="metric-card" key={metric.label}>
                  <p className="metric-label">{metric.label}</p>
                  <div className="metric-stack">
                    <span className="metric-previous">{metric.previous}</span>
                    <div className={`metric-current ${metric.tone}`}>
                      {metric.value}
                      <span>{metric.suffix}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <div className="stage-panel">
              <div className="panel-copy">
                <p className="eyebrow">Strategic Layering</p>
                <h3>Glass, tonal depth, and asymmetry as hierarchy.</h3>
              </div>
              <div className="panel-graph" aria-hidden="true">
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

      <section className="framework-section reveal" id="framework">
        <div className="section-heading">
          <p className="micro-kicker">CREATIVE NORTH STAR</p>
          <h2>Everything resolves toward authority, clarity, and tonal depth.</h2>
        </div>
        <div className="framework-grid">
          <article className="framework-card">
            <p className="eyebrow">Palette</p>
            <h3>Midnight base with royal-blue pulse.</h3>
            <p>밝은 카드 위에 깊은 네이비 레이어를 포개고, 핵심 액션만 블루 그라데이션으로 강조합니다.</p>
          </article>
          <article className="framework-card">
            <p className="eyebrow">Typography</p>
            <h3>Manrope for authority, Inter for precision.</h3>
            <p>큰 메시지는 넓고 단단하게, 세부 데이터는 작고 읽기 쉬운 비율로 분리해 밀도를 제어합니다.</p>
          </article>
          <article className="framework-card">
            <p className="eyebrow">Surfaces</p>
            <h3>No mechanical dividers. Only layered value shifts.</h3>
            <p>선 대신 배경 톤 차이와 여백으로 구획을 만들고, 필요한 경우에도 ghost outline만 아주 약하게 씁니다.</p>
          </article>
        </div>
      </section>

      <section className="modules-section" id="modules">
        <div className="section-heading reveal">
          <p className="micro-kicker">INTELLIGENCE MODULES</p>
          <h2>A visual system that behaves like high-stakes software.</h2>
        </div>

        <div className="modules-layout">
          <div className="modules-list">
            {intelligenceModules.map((module) => (
              <article className="module-card reveal" key={module.eyebrow}>
                <p className="eyebrow">{module.eyebrow}</p>
                <h3>{module.title}</h3>
                <p>{module.body}</p>
              </article>
            ))}
          </div>

          <aside className="decision-rail reveal">
            <div className="decision-rail-head">
              <p className="eyebrow">Decision Feed</p>
              <h3>Recent command notes</h3>
            </div>
            <div className="decision-list">
              {decisionFeed.map((item) => (
                <article className="decision-item" key={item.time}>
                  <span className="decision-time">{item.time}</span>
                  <h4>{item.title}</h4>
                  <p>{item.note}</p>
                </article>
              ))}
            </div>
          </aside>
        </div>
      </section>

      <section className="contact-section reveal" id="contact">
        <div>
          <p className="micro-kicker">DESIGN-ONLY CUT</p>
          <h2>The functional product can be rebuilt later. The visual language is already here.</h2>
        </div>
        <a href="#top" className="action-primary">Return To Top</a>
      </section>
    </main>
  )
}
