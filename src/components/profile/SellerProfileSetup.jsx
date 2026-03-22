import { useState } from 'react'
import './SellerProfileSetup.css'

const STORAGE_KEY = 'sourcely-seller-profile'

const CAPITAL_OPTIONS = [
  { value: 1000000, label: '100만원' },
  { value: 3000000, label: '300만원' },
  { value: 5000000, label: '500만원' },
  { value: 10000000, label: '1,000만원+' },
]

const EXPERIENCE_OPTIONS = [
  { value: 'beginner', label: '초보' },
  { value: 'intermediate', label: '중급' },
  { value: 'advanced', label: '고급' },
]

const RISK_OPTIONS = [
  { value: 'safe', label: '안정형' },
  { value: 'balanced', label: '균형형' },
  { value: 'aggressive', label: '공격형' },
]

const CATEGORIES = [
  { value: 'camping', label: '⛺ 캠핑' },
  { value: 'kitchen', label: '🍳 주방' },
  { value: 'beauty', label: '💄 뷰티' },
  { value: 'pet', label: '🐾 반려동물' },
  { value: 'digital', label: '📱 디지털' },
  { value: 'living', label: '🏠 생활' },
  { value: 'fashion', label: '👗 패션' },
  { value: 'baby', label: '👶 유아' },
]

export function loadProfile() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : null
  } catch {
    return null
  }
}

export function saveProfile(profile) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profile))
}

export function ProfileSummary({ profile, onEdit }) {
  if (!profile) return null

  const capitalLabel = CAPITAL_OPTIONS.find(o => o.value === profile.capital)?.label || ''
  const expLabel = EXPERIENCE_OPTIONS.find(o => o.value === profile.experience)?.label || ''
  const riskLabel = RISK_OPTIONS.find(o => o.value === profile.risk)?.label || ''
  const catLabels = profile.categories
    ?.map(c => CATEGORIES.find(cat => cat.value === c)?.label)
    .filter(Boolean)
    .join(', ')

  return (
    <>
      <div className="seller-profile-summary">
        <span className="seller-profile-chip">자본금 {capitalLabel}</span>
        <span className="seller-profile-chip">{expLabel} 셀러</span>
        <span className="seller-profile-chip">{riskLabel}</span>
        {catLabels && <span className="seller-profile-chip">{catLabels}</span>}
        <button className="seller-profile-edit-btn" onClick={onEdit}>프로필 수정</button>
      </div>
      <div className="seller-profile-match-msg">
        자본금 {capitalLabel}, {expLabel} 셀러에게 적합한 아이템을 추천합니다
      </div>
    </>
  )
}

export default function SellerProfileSetup({ onSave, initialProfile }) {
  const [capital, setCapital] = useState(initialProfile?.capital || null)
  const [experience, setExperience] = useState(initialProfile?.experience || null)
  const [risk, setRisk] = useState(initialProfile?.risk || null)
  const [categories, setCategories] = useState(initialProfile?.categories || [])

  const toggleCategory = (cat) => {
    setCategories(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    )
  }

  const canSave = capital && experience && risk

  const handleSave = () => {
    const profile = { capital, experience, risk, categories }
    saveProfile(profile)
    onSave(profile)
  }

  return (
    <div className="seller-profile-setup">
      <div className="seller-profile-header">
        <div className="seller-profile-icon">👤</div>
        <h2 className="seller-profile-title">셀러 프로필 설정</h2>
        <p className="seller-profile-desc">맞춤 추천을 위해 간단한 정보를 입력해주세요</p>
      </div>

      <div className="seller-profile-section">
        <div className="seller-profile-label">투자 가능 자본금</div>
        <div className="seller-profile-options">
          {CAPITAL_OPTIONS.map(opt => (
            <button
              key={opt.value}
              className={`seller-profile-opt ${capital === opt.value ? 'selected' : ''}`}
              onClick={() => setCapital(opt.value)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="seller-profile-section">
        <div className="seller-profile-label">셀링 경험</div>
        <div className="seller-profile-options">
          {EXPERIENCE_OPTIONS.map(opt => (
            <button
              key={opt.value}
              className={`seller-profile-opt ${experience === opt.value ? 'selected' : ''}`}
              onClick={() => setExperience(opt.value)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="seller-profile-section">
        <div className="seller-profile-label">리스크 성향</div>
        <div className="seller-profile-options">
          {RISK_OPTIONS.map(opt => (
            <button
              key={opt.value}
              className={`seller-profile-opt ${risk === opt.value ? 'selected' : ''}`}
              onClick={() => setRisk(opt.value)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="seller-profile-section">
        <div className="seller-profile-label">관심 카테고리 (선택)</div>
        <div className="seller-profile-categories">
          {CATEGORIES.map(cat => (
            <button
              key={cat.value}
              className={`seller-profile-cat ${categories.includes(cat.value) ? 'selected' : ''}`}
              onClick={() => toggleCategory(cat.value)}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      <button className="seller-profile-save" disabled={!canSave} onClick={handleSave}>
        맞춤 추천 시작하기
      </button>
    </div>
  )
}
