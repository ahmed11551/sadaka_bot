import { useEffect, ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import './PageTransition.css'

interface PageTransitionProps {
  children: ReactNode
}

const PageTransitionWrapper = ({ children }: PageTransitionProps) => {
  const location = useLocation()

  useEffect(() => {
    // Анимация появления страницы при переходе
    const timer = setTimeout(() => {
      const containers = document.querySelectorAll('.page-container')
      containers.forEach(container => {
        container.classList.add('page-enter')
      })
    }, 10)
    
    return () => clearTimeout(timer)
  }, [location.pathname])

  return <>{children}</>
}

const PageTransition = ({ children }: PageTransitionProps) => {
  return <PageTransitionWrapper>{children}</PageTransitionWrapper>
}

export default PageTransition

