import { useState } from 'react'
import './DataTable.css'

export default function DataTable({ columns, data }) {
  const [sortKey, setSortKey] = useState(null)
  const [sortDir, setSortDir] = useState('desc')

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDir(d => d === 'desc' ? 'asc' : 'desc')
    } else {
      setSortKey(key)
      setSortDir('desc')
    }
  }

  const sorted = sortKey
    ? [...data].sort((a, b) => {
        const va = a[sortKey], vb = b[sortKey]
        const cmp = typeof va === 'number' ? va - vb : String(va).localeCompare(String(vb))
        return sortDir === 'desc' ? -cmp : cmp
      })
    : data

  return (
    <div className="data-table-wrap">
      <table className="data-table">
        <thead>
          <tr>
            {columns.map(col => (
              <th
                key={col.key}
                style={{ textAlign: col.align || 'left', cursor: 'pointer' }}
                onClick={() => handleSort(col.key)}
              >
                {col.label}
                {sortKey === col.key && <span className="sort-arrow">{sortDir === 'desc' ? ' ↓' : ' ↑'}</span>}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.map((row, i) => (
            <tr key={i}>
              {columns.map(col => (
                <td key={col.key} style={{ textAlign: col.align || 'left' }}>
                  {col.render ? col.render(row[col.key], row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
