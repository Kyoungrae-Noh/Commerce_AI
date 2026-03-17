import InputField from '../shared/InputField'
import './CalculatorForm.css'

export default function CalculatorForm({ values, onChange, platform, onPlatformChange }) {
  const update = (key) => (val) => onChange({ ...values, [key]: val })

  return (
    <div className="calc-form">
      <h3 className="calc-form-title">비용 입력</h3>

      <InputField label="소싱가 (매입가)" value={values.sourcingCost} onChange={update('sourcingCost')} type="number" suffix="원" placeholder="0" />
      <InputField label="해외 배송비" value={values.intlShipping} onChange={update('intlShipping')} type="number" suffix="원" placeholder="0" />
      <InputField label="국내 배송비" value={values.domesticShipping} onChange={update('domesticShipping')} type="number" suffix="원" placeholder="0" />
      <InputField label="판매 희망가" value={values.sellingPrice} onChange={update('sellingPrice')} type="number" suffix="원" placeholder="0" />
      <InputField label="단위당 광고비" value={values.adCost} onChange={update('adCost')} type="number" suffix="원" placeholder="0" />

      <div className="calc-platform-toggle">
        <label className="calc-form-label">플랫폼</label>
        <div className="calc-platform-btns">
          {[
            { key: 'coupangRocket', label: '쿠팡 로켓' },
            { key: 'smartStore', label: '스마트스토어' },
            { key: 'compare', label: '비교 모드' },
          ].map(p => (
            <button
              key={p.key}
              className={`calc-platform-btn ${platform === p.key ? 'active' : ''}`}
              onClick={() => onPlatformChange(p.key)}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
