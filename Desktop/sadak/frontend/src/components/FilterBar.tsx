import { useState } from 'react'
import Icon from './Icon'
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
        <Icon name="filter" size={18} />
        Фильтры
        <Icon name="chevronDown" size={16} className={expanded ? 'expanded chevron-icon' : 'chevron-icon'} />
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

