import './RelatedKeywords.css'

export default function RelatedKeywords({ keywords, onSelect }) {
  return (
    <div className="related-kw">
      <h3 className="related-kw-title">연관 키워드</h3>
      <div className="related-kw-list">
        {keywords.map((kw, i) => (
          <button key={i} className="related-kw-chip" onClick={() => onSelect?.(kw.keyword)}>
            <span className="related-kw-text">{kw.keyword}</span>
            {kw.volume != null && <span className="related-kw-vol">{kw.volume.toLocaleString()}</span>}
          </button>
        ))}
      </div>
    </div>
  )
}
