import { useState, useRef, useEffect, ReactNode } from 'react'
import Icon from './Icon'
import './PullToRefresh.css'

interface PullToRefreshProps {
  onRefresh: () => Promise<void>
  children: ReactNode
  disabled?: boolean
}

const PullToRefresh = ({ onRefresh, children, disabled = false }: PullToRefreshProps) => {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [pullDistance, setPullDistance] = useState(0)
  const [canPull, setCanPull] = useState(false)
  const startY = useRef(0)
  const currentY = useRef(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const pullThreshold = 80 // Порог для активации обновления

  useEffect(() => {
    if (disabled || isRefreshing) return

    const container = containerRef.current
    if (!container) return

    const handleTouchStart = (e: TouchEvent) => {
      if (container.scrollTop <= 0) {
        startY.current = e.touches[0].clientY
        setCanPull(true)
      }
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (!canPull || container.scrollTop > 0) {
        setCanPull(false)
        return
      }

      currentY.current = e.touches[0].clientY
      const distance = currentY.current - startY.current

      if (distance > 0) {
        const maxDistance = 120
        const clampedDistance = Math.min(distance * 0.5, maxDistance)
        setPullDistance(clampedDistance)
        e.preventDefault()
      }
    }

    const handleTouchEnd = async () => {
      if (pullDistance >= pullThreshold) {
        setIsRefreshing(true)
        setPullDistance(pullThreshold)
        try {
          await onRefresh()
        } finally {
          setTimeout(() => {
            setIsRefreshing(false)
            setPullDistance(0)
            setCanPull(false)
          }, 300)
        }
      } else {
        setPullDistance(0)
        setCanPull(false)
      }
    }

    container.addEventListener('touchstart', handleTouchStart)
    container.addEventListener('touchmove', handleTouchMove, { passive: false })
    container.addEventListener('touchend', handleTouchEnd)

    return () => {
      container.removeEventListener('touchstart', handleTouchStart)
      container.removeEventListener('touchmove', handleTouchMove)
      container.removeEventListener('touchend', handleTouchEnd)
    }
  }, [canPull, pullDistance, pullThreshold, onRefresh, disabled, isRefreshing])

  const pullProgress = Math.min(pullDistance / pullThreshold, 1)
  const shouldShowRefresh = pullDistance > 20

  return (
    <div 
      ref={containerRef}
      className="pull-to-refresh-container"
      style={{
        position: 'relative',
        transform: `translateY(${pullDistance}px)`,
        transition: isRefreshing ? 'none' : 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      {/* Индикатор обновления */}
      {shouldShowRefresh && (
        <div 
          className="pull-to-refresh-indicator"
          style={{
            position: 'absolute',
            top: '-60px',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px',
            opacity: pullProgress,
            transition: 'opacity 0.2s',
          }}
        >
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: 'var(--tg-theme-button-color, var(--primary))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transform: `rotate(${pullProgress * 360}deg)`,
              transition: 'transform 0.2s',
              boxShadow: 'none',
            }}
          >
            <div
              style={{
                transform: `rotate(${-pullProgress * 360 + (isRefreshing ? 180 : 0)}deg)`,
                transition: 'transform 0.3s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Icon 
                name="arrowRight" 
                size={20} 
                color="#ffffff"
              />
            </div>
          </div>
          <span style={{
            fontSize: '13px',
            color: '#718ebf',
            fontWeight: 500,
          }}>
            {pullProgress >= 1 ? 'Отпустите для обновления' : 'Потяните для обновления'}
          </span>
        </div>
      )}

      {/* Контент */}
      <div style={{
        opacity: isRefreshing ? 0.6 : 1,
        transition: 'opacity 0.3s',
      }}>
        {children}
      </div>
    </div>
  )
}

export default PullToRefresh

