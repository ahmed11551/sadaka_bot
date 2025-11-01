import { useState } from 'react'
import './FilterBar.css'

interface FilterOption {
  value: string
  label: string
}

interface FilterBarProps {
  filters: {
    label: string
    options: FilterOption[]
    value: string
    onChange: (value: string) => void
  }[]
}

const FilterBar = ({ filters }: FilterBarProps) => {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="filter-bar">
      <button 
        className="filter-toggle"
        onClick={() => setExpanded(!expanded)}
      >
        <span>🔍</span>
        Фильтры
        <span className={expanded ? 'expanded' : ''}>▼</span>
      </button>
      
      {expanded && (
        <div className="filter-content">
          {filters.map((filter, idx) => (
            <div key={idx} className="filter-group">
              <label className="filter-label">{filter.label}</label>
              <select
                className="filter-select"
                value={filter.value}
                onChange={(e) => filter.onChange(e.target.value)}
              >
                <option value="">Все</option>
                {filter.options.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default FilterBar

