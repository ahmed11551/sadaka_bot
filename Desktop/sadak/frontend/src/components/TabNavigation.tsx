import { NavLink } from 'react-router-dom'
import './TabNavigation.css'

const TabNavigation = () => {
  const tabs = [
    { path: '/', label: 'Главная', icon: '🏠' },
    { path: '/donate', label: 'Пожертвовать', icon: '💰' },
    { path: '/support', label: 'Поддержать', icon: '💝' },
    { path: '/campaigns', label: 'Кампании', icon: '🎯' },
    { path: '/zakat', label: 'Закят', icon: '📿' },
    { path: '/history', label: 'История', icon: '📜' },
  ]

  return (
    <nav className="tab-navigation">
      {tabs.map((tab) => (
        <NavLink
          key={tab.path}
          to={tab.path}
          className={({ isActive }) =>
            `tab-item ${isActive ? 'active' : ''}`
          }
        >
          <span className="tab-icon">{tab.icon}</span>
          <span className="tab-label">{tab.label}</span>
        </NavLink>
      ))}
    </nav>
  )
}

export default TabNavigation

