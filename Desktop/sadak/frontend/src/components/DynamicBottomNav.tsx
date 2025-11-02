import { useLocation } from 'react-router-dom'
import { NavLink } from 'react-router-dom'
import Icon from './Icon'
import { haptic } from '../utils/haptic'
import './TabNavigation.css'
import './DynamicBottomNav.css'

// Конфигурация меню для разных страниц
const menuConfigs: Record<string, Array<{ path: string; label: string; icon: string }>> = {
  '/': [
    { path: '/', label: 'Главная', icon: 'home' },
    { path: '/donate', label: 'Пожертвования', icon: 'coins' },
    { path: '/campaigns', label: 'Кампании', icon: 'target' },
    { path: '/zakat', label: 'Закят', icon: 'handHeart' },
    { path: '/history', label: 'История', icon: 'history' },
  ],
  '/donate': [
    { path: '/', label: 'Главная', icon: 'home' },
    { path: '/donate', label: 'Пожертвования', icon: 'coins' },
    { path: '/campaigns', label: 'Кампании', icon: 'target' },
    { path: '/support', label: 'Поддержка', icon: 'heart' },
    { path: '/history', label: 'История', icon: 'history' },
  ],
  '/support': [
    { path: '/', label: 'Главная', icon: 'home' },
    { path: '/donate', label: 'Пожертвовать', icon: 'coins' },
    { path: '/support', label: 'Поддержать', icon: 'heart' },
    { path: '/subscription', label: 'Подписки', icon: 'calendar' },
    { path: '/history', label: 'История', icon: 'history' },
  ],
  '/campaigns': [
    { path: '/', label: 'Главная', icon: 'home' },
    { path: '/campaigns', label: 'Кампании', icon: 'target' },
    { path: '/donate', label: 'Пожертвовать', icon: 'coins' },
    { path: '/zakat', label: 'Закят', icon: 'handHeart' },
    { path: '/history', label: 'История', icon: 'history' },
  ],
  '/subscription': [
    { path: '/', label: 'Главная', icon: 'home' },
    { path: '/subscription', label: 'Подписки', icon: 'calendar' },
    { path: '/support', label: 'Поддержать', icon: 'heart' },
    { path: '/donate', label: 'Пожертвовать', icon: 'coins' },
    { path: '/history', label: 'История', icon: 'history' },
  ],
  '/zakat': [
    { path: '/', label: 'Главная', icon: 'home' },
    { path: '/zakat', label: 'Закят', icon: 'handHeart' },
    { path: '/donate', label: 'Пожертвовать', icon: 'coins' },
    { path: '/campaigns', label: 'Кампании', icon: 'target' },
    { path: '/history', label: 'История', icon: 'history' },
  ],
  '/history': [
    { path: '/', label: 'Главная', icon: 'home' },
    { path: '/history', label: 'История', icon: 'history' },
    { path: '/donate', label: 'Пожертвовать', icon: 'coins' },
    { path: '/campaigns', label: 'Кампании', icon: 'target' },
    { path: '/zakat', label: 'Закят', icon: 'handHeart' },
  ],
  '/partners': [
    { path: '/', label: 'Главная', icon: 'home' },
    { path: '/partners', label: 'Партнеры', icon: 'building' },
    { path: '/campaigns', label: 'Кампании', icon: 'target' },
    { path: '/donate', label: 'Пожертвовать', icon: 'coins' },
    { path: '/history', label: 'История', icon: 'history' },
  ],
}

// Функция для определения активного меню на основе текущего пути
const getMenuForPath = (pathname: string): Array<{ path: string; label: string; icon: string }> => {
  // Проверяем точное совпадение
  if (menuConfigs[pathname]) {
    return menuConfigs[pathname]
  }

  // Проверяем пути с параметрами (например, /campaigns/123)
  if (pathname.startsWith('/campaigns/')) {
    return menuConfigs['/campaigns']
  }

  // Дефолтное меню для главной
  return menuConfigs['/']
}

const DynamicBottomNav = () => {
  const location = useLocation()
  const currentMenu = getMenuForPath(location.pathname)

  return (
    <nav className="tab-navigation dynamic-nav">
      {currentMenu.map((tab) => (
        <NavLink
          key={tab.path}
          to={tab.path}
          className={({ isActive }) =>
            `tab-item ${isActive ? 'active' : ''}`
          }
          onClick={(e) => {
            haptic.selectionChanged()
            // Визуальная обратная связь
            const target = e.currentTarget
            target.style.transform = 'scale(0.9)'
            setTimeout(() => {
              target.style.transform = ''
            }, 150)
          }}
        >
          {({ isActive }) => (
            <>
              <span className="tab-icon">
                <Icon 
                  name={tab.icon as any} 
                  size={22}
                  color={isActive ? '#10b981' : undefined}
                />
              </span>
              <span className="tab-label">{tab.label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}

export default DynamicBottomNav

