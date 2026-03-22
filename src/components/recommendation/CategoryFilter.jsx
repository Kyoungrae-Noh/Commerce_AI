import './CategoryFilter.css'

export default function CategoryFilter({ categories, selected, onSelect }) {
  return (
    <div className="category-filter">
      <button
        className={`category-chip ${!selected ? 'active' : ''}`}
        onClick={() => onSelect(null)}
      >
        전체
      </button>
      {categories.map(cat => (
        <button
          key={cat.id}
          className={`category-chip ${selected === cat.id ? 'active' : ''}`}
          onClick={() => onSelect(cat.id)}
        >
          {cat.icon} {cat.name}
          {cat.count > 0 && <span className="category-count">{cat.count}</span>}
        </button>
      ))}
    </div>
  )
}
