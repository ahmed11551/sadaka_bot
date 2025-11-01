import { useEffect } from 'react'
import Icon from './Icon'
import './Toast.css'

export type ToastType = 'success' | 'error' | 'info' | 'warning'

interface ToastProps {
  message: string
  type: ToastType
  onClose: () => void
  duration?: number
}

const Toast = ({ message, type, onClose, duration = 3000 }: ToastProps) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  const icons = {
    success: 'checkCircle',
    error: 'alertCircle',
    info: 'info',
    warning: 'alertTriangle',
  } as const

  const iconColors = {
    success: '#10b981',
    error: '#ef4444',
    info: '#3b82f6',
    warning: '#f59e0b',
  }

  return (
    <div className={`toast toast-${type}`} onClick={onClose}>
      <div className="toast-content">
        <Icon 
          name={icons[type]} 
          size={20} 
          color={iconColors[type]}
        />
        <span className="toast-message">{message}</span>
      </div>
      <button className="toast-close" onClick={onClose}>
        <Icon name="x" size={18} />
      </button>
    </div>
  )
}

export default Toast

