import { useState } from 'react'
import './KeywordSearch.css'

export default function KeywordSearch({ onSearch, placeholder = '상품 키워드를 입력하세요', loading = false }) {
  const [value, setValue] = useState('')

  const handleSubmit = () => {
    if (value.trim()) onSearch(value.trim())
  }

  return (
    <div className="keyword-search">
      <input
        value={value}
        onChange={e => setValue(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && handleSubmit()}
        placeholder={placeholder}
        className="keyword-search-input"
      />
      <button onClick={handleSubmit} disabled={loading || !value.trim()} className="keyword-search-btn">
        {loading ? '분석 중...' : '분석하기'}
      </button>
    </div>
  )
}
