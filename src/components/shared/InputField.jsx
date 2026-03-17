import './InputField.css'

export default function InputField({ label, value, onChange, type = 'text', suffix, placeholder }) {
  return (
    <div className="input-field">
      {label && <label className="input-field-label">{label}</label>}
      <div className="input-field-wrap">
        <input
          type={type}
          value={value}
          onChange={e => onChange(type === 'number' ? Number(e.target.value) || 0 : e.target.value)}
          placeholder={placeholder}
          className="input-field-input"
        />
        {suffix && <span className="input-field-suffix">{suffix}</span>}
      </div>
    </div>
  )
}
