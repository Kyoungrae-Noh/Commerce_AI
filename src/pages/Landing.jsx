import { useEffect } from 'react'
import './Landing.css'

function useReveal() {
  useEffect(() => {
    const reveals = document.querySelectorAll('.reveal')
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add('visible')
          }, 60 * (Array.from(reveals).indexOf(entry.target) % 5))
          observer.unobserve(entry.target)
        }
      })
    }, { threshold: 0.1 })
    reveals.forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])
}

function useScoreBarAnimation() {
  useEffect(() => {
    const timer = setTimeout(() => {
      document.querySelectorAll('.score-fill').forEach(bar => {
        const w = bar.style.width
        bar.style.width = '0'
        requestAnimationFrame(() => { bar.style.width = w })
      })
    }, 800)
    return () => clearTimeout(timer)
  }, [])
}

export default function Landing() {
  useReveal()
  useScoreBarAnimation()

  return (
    <>
      {/* HERO */}
      <section className="hero">
        <div className="hero-bg" />
        <div className="hero-grid" />
        <div className="hero-inner">
          <div>
            <div className="badge">AI-powered sourcing · Beta</div>
            <h1>지금 팔릴 상품을<br /><span className="highlight">AI가 먼저</span> 찾아드려요</h1>
            <p>쿠팡·스마트스토어 셀러를 위한 AI 상품 소싱 도구. 시장 데이터와 가격 정보를 실시간으로 분석해 판매 가능성이 높은 상품을 추천해드립니다.</p>
            <div className="hero-actions">
              <a href="#cta" className="btn-primary">무료로 시작하기 →</a>
              <a href="#how" className="btn-secondary">작동 방식 보기 ↓</a>
            </div>
          </div>
          <div className="hero-visual">
            <div className="dashboard-card">
              <div className="dash-header">
                <span className="dash-title">AI 추천 상품 · 실시간</span>
                <span className="dash-status">분석 중</span>
              </div>
              <div className="product-list">
                {[
                  { rank: 1, icon: '🌱', color: 'rgba(0,229,160,0.1)', name: '미니 가습기 USB 타입', meta: '경쟁강도 낮음 · 마진율 42%', score: 94 },
                  { rank: 2, icon: '🎧', color: 'rgba(0,87,255,0.1)', name: '블루투스 넥밴드 이어폰', meta: '수요 급상승 · 마진율 35%', score: 88 },
                  { rank: 3, icon: '🧴', color: 'rgba(255,77,109,0.1)', name: '퍼스널컬러 진단 키트', meta: '트렌드 급부상 · 마진율 51%', score: 82 },
                ].map(item => (
                  <div className="product-item" key={item.rank}>
                    <span className="product-rank">#{item.rank}</span>
                    <div className="product-icon" style={{ background: item.color }}>{item.icon}</div>
                    <div className="product-info">
                      <div className="product-name">{item.name}</div>
                      <div className="product-meta">{item.meta}</div>
                    </div>
                    <div className="product-score">
                      <div className="score-value">{item.score}</div>
                      <div className="score-label">소싱점수</div>
                      <div className="score-bar"><div className="score-fill" style={{ width: `${item.score}%` }} /></div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="dash-footer">
                <div className="stat-pill"><div className="stat-pill-val">2,841</div><div className="stat-pill-lbl">분석 상품 수</div></div>
                <div className="stat-pill"><div className="stat-pill-val">98%</div><div className="stat-pill-lbl">예측 정확도</div></div>
                <div className="stat-pill"><div className="stat-pill-val">실시간</div><div className="stat-pill-lbl">데이터 업데이트</div></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* POSITIONING */}
      <section className="positioning" id="about">
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <p className="section-label reveal">Sourcely 란?</p>
          <h2 className="section-title reveal">우리가 하는 일을<br />세 가지로 설명하면</h2>
          <div className="pos-grid">
            {[
              { num: '01', cls: 'card-1', tag: '제품 정의', headline: 'AI 기반\n이커머스 상품 발굴 SaaS', desc: '데이터 기반으로 시장 기회를 포착하고, 어떤 상품을 팔아야 할지 AI가 정확하게 알려주는 B2B 서비스입니다.' },
              { num: '02', cls: 'card-2', tag: '사용자 관점', headline: '셀러가 팔 상품을\n찾도록 도와주는 AI', desc: '쿠팡, 스마트스토어에서 무엇을 팔아야 할지 막막한 셀러를 위해 AI가 최적의 상품 후보를 제시합니다.' },
              { num: '03', cls: 'card-3', tag: '문제 해결 관점', headline: '초보 셀러의 상품 선택\n실패 확률을 줄여주는 AI', desc: '잘못된 상품 선택으로 인한 손실을 줄이고, 검증된 데이터 인사이트로 첫 판매부터 성공 가능성을 높입니다.' },
            ].map(card => (
              <div className={`pos-card ${card.cls} reveal`} key={card.num}>
                <div className="pos-num">{card.num}</div>
                <div className="pos-tag">{card.tag}</div>
                <div className="pos-headline">{card.headline.split('\n').map((l, i) => <span key={i}>{l}<br /></span>)}</div>
                <p className="pos-desc">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="how" id="how">
        <div className="how-inner">
          <p className="section-label reveal">How It Works</p>
          <h2 className="section-title reveal">4단계로 간단하게</h2>
          <div className="steps">
            {[
              { title: '채널 선택', desc: '쿠팡 또는 스마트스토어 중 판매 채널을 선택합니다.' },
              { title: '카테고리 설정', desc: '관심 카테고리와 희망 마진율, 예산을 입력합니다.' },
              { title: 'AI 분석', desc: '시장 데이터·경쟁 강도·트렌드를 AI가 종합 분석합니다.' },
              { title: '상품 추천 수령', desc: '소싱 점수와 함께 판매 가능 상품 리스트를 받습니다.' },
            ].map((step, i) => (
              <div className="step reveal" key={i}>
                <div className="step-circle">{i + 1}</div>
                <div className="step-title">{step.title}</div>
                <p className="step-desc">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="features" id="features">
        <p className="section-label reveal">Features</p>
        <h2 className="section-title reveal">셀러에게 필요한<br />모든 인사이트</h2>
        <div className="features-grid">
          {[
            { icon: '📊', cls: 'green', title: '실시간 시장 데이터 분석', desc: '쿠팡·스마트스토어의 판매 데이터를 실시간으로 수집·분석해 지금 팔리는 상품 트렌드를 즉시 파악합니다.' },
            { icon: '🎯', cls: 'blue', title: '경쟁 강도 분석', desc: '동일 카테고리 내 경쟁 셀러 수, 가격 분포, 리뷰 현황을 분석해 진입 가능한 틈새 시장을 찾아드립니다.' },
            { icon: '🔥', cls: 'red', title: '트렌드 알림', desc: '검색량 급등, SNS 화제 상품을 사전에 감지해 남들보다 빠르게 소싱 기회를 잡을 수 있도록 알림을 보냅니다.' },
            { icon: '💰', cls: 'yellow', title: '마진 계산기', desc: '소싱가·배송비·플랫폼 수수료를 고려한 예상 마진을 자동으로 계산해 수익성을 즉시 확인할 수 있습니다.' },
          ].map((feat, i) => (
            <div className="feat-card reveal" key={i}>
              <div className={`feat-icon ${feat.cls}`}>{feat.icon}</div>
              <div>
                <div className="feat-title">{feat.title}</div>
                <p className="feat-desc">{feat.desc}</p>
              </div>
            </div>
          ))}
          <div className="feat-card large reveal">
            <div className="feat-icon green" style={{ width: 56, height: 56, fontSize: 26 }}>🤖</div>
            <div>
              <div className="feat-title">AI 소싱 점수 (Sourcely Score)</div>
              <p className="feat-desc">수요·경쟁·마진·트렌드·시장 성장성 등 5가지 핵심 지표를 종합해 0~100점으로 산출되는 독자적인 소싱 점수. 숫자 하나로 상품 판매 가능성을 즉시 판단할 수 있습니다.</p>
            </div>
          </div>
        </div>
      </section>

      {/* SOCIAL PROOF */}
      <section className="proof">
        <div className="proof-stats reveal">
          {[
            { val: '3,200+', lbl: '베타 셀러 사용 중' },
            { val: '98%', lbl: '추천 상품 판매 전환율' },
            { val: '2.4배', lbl: '평균 매출 증가' },
          ].map((s, i) => (
            <div key={i}>
              <div className="proof-stat-val">{s.val}</div>
              <div className="proof-stat-lbl">{s.lbl}</div>
            </div>
          ))}
        </div>
        <div className="testimonials">
          {[
            { text: '"처음에는 반신반의했는데, AI 추천 상품 3개 소싱했더니 2개가 월 200만원 이상 팔렸어요. 이제 소싱이 두렵지 않아요."', name: '김지수', role: '쿠팡 셀러 1년차' },
            { text: '"경쟁 분석 기능이 정말 좋아요. 어디서 싸울지, 어디서 피해야 할지 전략적으로 생각하게 됐어요."', name: '박현우', role: '스마트스토어 셀러 3년차' },
            { text: '"트렌드 알림 덕분에 스탠리 텀블러 유행하기 2주 전에 미리 소싱했어요. 타이밍이 전부라는 걸 깨달았습니다."', name: '이소연', role: '스마트스토어 상위 셀러' },
          ].map((t, i) => (
            <div className="testimonial reveal" key={i}>
              <p className="t-text">{t.text}</p>
              <p className="t-author"><strong>{t.name}</strong> · {t.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section className="pricing" id="pricing">
        <p className="section-label reveal">Pricing</p>
        <h2 className="section-title reveal" style={{ maxWidth: 'none' }}>간단하고 투명한 요금</h2>
        <div className="plans">
          {[
            { name: 'Starter', price: '무료', period: '/ 영구', sub: '기본 기능 체험', features: ['월 10회 상품 추천', '기본 소싱 점수', '주간 트렌드 리포트', '1개 채널 연동'], btn: '무료로 시작', featured: false },
            { name: 'Pro', price: '₩49,000', period: '/ 월', sub: '성장하는 셀러에게 최적', features: ['무제한 상품 추천', '전체 소싱 점수 + 상세 분석', '실시간 트렌드 알림', '마진 계산기 연동', '쿠팡 + 스마트스토어'], btn: '14일 무료 체험', featured: true },
            { name: 'Business', price: '₩129,000', period: '/ 월', sub: '파워 셀러 · 팀 사용', features: ['Pro 전체 포함', '팀원 5명 추가', 'API 연동 지원', '전담 CS 지원', '커스텀 알림 설정'], btn: '상담 신청', featured: false },
          ].map((plan, i) => (
            <div className={`plan reveal ${plan.featured ? 'featured' : ''}`} key={i}>
              <div className="plan-name">{plan.name}</div>
              <div className="plan-price">{plan.price} <span>{plan.period}</span></div>
              <div className="plan-period">{plan.sub}</div>
              <ul className="plan-features">
                {plan.features.map((f, j) => <li key={j}>{f}</li>)}
              </ul>
              <button className="plan-btn">{plan.btn}</button>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section" id="cta">
        <h2 className="reveal">지금 바로 소싱을<br />시작해보세요</h2>
        <p className="reveal">신용카드 없이, 14일 무료. 언제든 취소 가능.</p>
        <a href="#" className="btn-primary reveal" style={{ display: 'inline-flex', fontSize: 16, padding: '16px 40px' }}>
          무료로 시작하기 →
        </a>
      </section>
    </>
  )
}
