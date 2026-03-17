import { categories } from '../../data/mockData'
import './CategoryFilter.css'

export default function CategoryFilter({ active, onChange }) {
  return (
    <div className="category-filter">
      {categories.map(cat => (
        <button
          key={cat.id}
          className={`category-chip ${active === cat.id ? 'active' : ''}`}
          onClick={() => onChange(cat.id)}
        >
          {cat.label}
        </button>
      ))}
    </div>
  )
}
