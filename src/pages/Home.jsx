import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { categories } from '../data/mockData'
import './Home.css'

function normalizeKeyword(raw) {
  return raw.trim().toLowerCase().replace(/[^a-z0-9가-힣ㄱ-ㅎㅏ-ㅣ]/g, '')
}

export default function Home() {
  const [keyword, setKeyword] = useState('')
  const [category, setCategory] = useState('all')
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    const normalized = normalizeKeyword(keyword)
    if (!normalized) return
    const params = new URLSearchParams({ keyword: normalized, category })
    navigate(`/result?${params}`)
  }

  return (
    <div className="home-page">
      <div className="home-hero">
        <h1 className="home-logo">
          Source<span>ly</span>
        </h1>
        <p className="home-tagline">AI 상품 소싱 판단 보조 서비스</p>
        <p className="home-desc">키워드를 입력하면 검색량, 경쟁 강도, 예상 마진, 트렌드를 분석하고<br />AI가 진입 전략까지 제안합니다.</p>

        <form className="home-form" onSubmit={handleSubmit}>
          <div className="home-input-row">
            <input
              className="home-input"
              type="text"
              placeholder="분석할 키워드를 입력하세요 (예: 미니 가습기)"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              autoFocus
            />
            <button className="home-submit" type="submit" disabled={!keyword.trim()}>
              분석 시작
            </button>
          </div>

          <p className="home-hint">💡 구체적인 키워드일수록 정확해요</p>

          <div className="home-categories">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                className={`home-cat-btn ${category === cat.id ? 'active' : ''}`}
                onClick={() => setCategory(cat.id)}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </form>
      </div>
    </div>
  )
}
