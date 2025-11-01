import { NavLink } from 'react-router-dom'
import Icon from './Icon'
import './TabNavigation.css'

const TabNavigation = () => {
  const tabs = [
    { path: '/', label: 'Главная', icon: 'home' as const },
    { path: '/donate', label: 'Пожертвовать', icon: 'coins' as const },
    { path: '/support', label: 'Поддержать', icon: 'heart' as const },
    { path: '/campaigns', label: 'Кампании', icon: 'target' as const },
    { path: '/zakat', label: 'Закят', icon: 'handHeart' as const },
    { path: '/history', label: 'История', icon: 'history' as const },
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
          <span className="tab-icon">
            <Icon name={tab.icon} size={22} />
          </span>
          <span className="tab-label">{tab.label}</span>
        </NavLink>
      ))}
    </nav>
  )
}

export default TabNavigation

