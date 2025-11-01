import { useState, useCallback } from 'react'
import ToastComponent, { ToastType } from '../components/Toast'

interface ToastState {
  message: string
  type: ToastType
  id: number
}

export const useToast = () => {
  const [toasts, setToasts] = useState<ToastState[]>([])
  const [toastId, setToastId] = useState<number>(0)

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = toastId + 1
    setToastId(id)
    setToasts((prev) => [...prev, { message, type, id }])
  }, [toastId])

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  const ToastContainer = () => {
    return (
      <>
        {toasts.map((toast) => (
          <ToastComponent
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </>
    )
  }

  const success = useCallback((message: string) => showToast(message, 'success'), [showToast])
  const error = useCallback((message: string) => showToast(message, 'error'), [showToast])
  const info = useCallback((message: string) => showToast(message, 'info'), [showToast])
  const warning = useCallback((message: string) => showToast(message, 'warning'), [showToast])

  return {
    showToast,
    ToastContainer,
    success,
    error,
    info,
    warning,
  }
}

