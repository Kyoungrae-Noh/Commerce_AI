import { useState } from 'react'
import './UtilityTab.css'

// 키워드 조합기
function KeywordCombiner() {
  const [baseWords, setBaseWords] = useState('')
  const [modifiers, setModifiers] = useState('')
  const [results, setResults] = useState([])

  const handleGenerate = () => {
    const bases = baseWords.split('\n').map(s => s.trim()).filter(Boolean)
    const mods = modifiers.split('\n').map(s => s.trim()).filter(Boolean)
    if (!bases.length) return

    const combined = []
    for (const base of bases) {
      combined.push(base)
      for (const mod of mods) {
        combined.push(`${base} ${mod}`)
        combined.push(`${mod} ${base}`)
      }
    }
    setResults([...new Set(combined)])
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(results.join('\n'))
  }

  return (
    <div className="util-tool-panel">
      <div className="util-tool-inputs">
        <div className="util-input-group">
          <label>기본 키워드 (줄바꿈 구분)</label>
          <textarea
            value={baseWords}
            onChange={e => setBaseWords(e.target.value)}
            placeholder={"미니 가습기\n캠핑 랜턴\n블루투스 이어폰"}
            rows={5}
          />
        </div>
        <div className="util-input-group">
          <label>조합 키워드 (줄바꿈 구분)</label>
          <textarea
            value={modifiers}
            onChange={e => setModifiers(e.target.value)}
            placeholder={"추천\n인기\n가성비\n2024\n무선"}
            rows={5}
          />
        </div>
      </div>
      <button className="util-generate-btn" onClick={handleGenerate}>
        조합 생성 ({baseWords.split('\n').filter(Boolean).length} x {modifiers.split('\n').filter(Boolean).length})
      </button>
      {results.length > 0 && (
        <div className="util-results">
          <div className="util-results-header">
            <span>{results.length}개 키워드 생성</span>
            <button className="util-copy-btn" onClick={handleCopy}>복사</button>
          </div>
          <div className="util-keyword-chips">
            {results.map((kw, i) => (
              <span key={i} className="util-keyword-chip">{kw}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// 상품명 생성기
function TitleGenerator() {
  const [keyword, setKeyword] = useState('')
  const [features, setFeatures] = useState('')
  const [titles, setTitles] = useState([])

  const templates = [
    (kw, feats) => `${kw} ${feats.join(' ')}`,
    (kw, feats) => `[인기] ${kw} ${feats.slice(0, 2).join(' ')} - ${feats.slice(2).join(' ')}`,
    (kw, feats) => `${feats[0] || ''} ${kw} ${feats.slice(1).join('/')}`,
    (kw, feats) => `${kw} | ${feats.join(' | ')}`,
    (kw, feats) => `[BEST] ${kw} ${feats.join(' ')} 추천`,
    (kw, feats) => `${kw} (${feats.join(', ')})`,
  ]

  const handleGenerate = () => {
    if (!keyword.trim()) return
    const feats = features.split('\n').map(s => s.trim()).filter(Boolean)
    const generated = templates.map(t => t(keyword.trim(), feats)).filter(Boolean)
    setTitles(generated)
  }

  const handleCopy = (title) => {
    navigator.clipboard.writeText(title)
  }

  return (
    <div className="util-tool-panel">
      <div className="util-tool-inputs">
        <div className="util-input-group">
          <label>메인 키워드</label>
          <input
            type="text"
            value={keyword}
            onChange={e => setKeyword(e.target.value)}
            placeholder="미니 가습기"
          />
        </div>
        <div className="util-input-group">
          <label>특징/속성 (줄바꿈 구분)</label>
          <textarea
            value={features}
            onChange={e => setFeatures(e.target.value)}
            placeholder={"무소음\nUSB 충전\n대용량\n사무실용\n7색 LED"}
            rows={5}
          />
        </div>
      </div>
      <button className="util-generate-btn" onClick={handleGenerate}>상품명 생성</button>
      {titles.length > 0 && (
        <div className="util-results">
          <div className="util-results-header">
            <span>{titles.length}개 상품명 생성</span>
          </div>
          <div className="util-title-list">
            {titles.map((title, i) => (
              <div key={i} className="util-title-item">
                <span className="util-title-text">{title}</span>
                <button className="util-copy-btn small" onClick={() => handleCopy(title)}>복사</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

const tools = [
  {
    id: 'keyword-combiner',
    icon: '🔗',
    name: '키워드 조합기',
    desc: '기본 키워드와 수식어를 조합하여 SEO 키워드를 대량 생성합니다',
    component: KeywordCombiner,
  },
  {
    id: 'title-generator',
    icon: '✏️',
    name: '상품명 생성기',
    desc: '키워드와 특징을 입력하면 검색 최적화된 상품명을 생성합니다',
    component: TitleGenerator,
  },
  {
    id: 'image-translator',
    icon: '🌐',
    name: '이미지 번역기',
    desc: '중국어 상품 이미지의 텍스트를 자동으로 번역합니다',
    soon: true,
  },
  {
    id: 'bg-remover',
    icon: '🖼️',
    name: '배경 제거',
    desc: '상품 이미지의 배경을 깔끔하게 제거합니다',
    soon: true,
  },
]

export default function UtilityTab() {
  const [activeTool, setActiveTool] = useState(null)

  const ActiveComponent = activeTool?.component

  return (
    <div className="util-tab">
      <div className="util-tab-header">
        <h2 className="util-tab-title">유틸리티</h2>
        <p className="util-tab-desc">셀러를 위한 편의 도구 모음</p>
      </div>

      {activeTool ? (
        <>
          <button className="util-back-btn" onClick={() => setActiveTool(null)}>
            ← 도구 목록으로
          </button>
          <div className="util-active-header">
            <span className="util-active-icon">{activeTool.icon}</span>
            <div>
              <h3 className="util-active-name">{activeTool.name}</h3>
              <p className="util-active-desc">{activeTool.desc}</p>
            </div>
          </div>
          {ActiveComponent && <ActiveComponent />}
        </>
      ) : (
        <div className="util-tool-grid">
          {tools.map(tool => (
            <div
              key={tool.id}
              className={`util-tool-card ${tool.soon ? 'soon' : ''}`}
              onClick={() => !tool.soon && setActiveTool(tool)}
            >
              <span className="util-tool-icon">{tool.icon}</span>
              <div className="util-tool-info">
                <h4 className="util-tool-name">
                  {tool.name}
                  {tool.soon && <span className="util-soon-badge">SOON</span>}
                </h4>
                <p className="util-tool-desc">{tool.desc}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
