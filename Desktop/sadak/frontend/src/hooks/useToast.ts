import { useState, useCallback } from 'react'
import Toast, { ToastType } from '../components/Toast'

interface ToastState {
  message: string
  type: ToastType
  id: number
}

export const useToast = () => {
  const [toasts, setToasts] = useState<ToastState[]>([])
  const [toastId, setToastId] = useState(0)

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
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </>
    )
  }

  return {
    showToast,
    ToastContainer,
    success: (message: string) => showToast(message, 'success'),
    error: (message: string) => showToast(message, 'error'),
    info: (message: string) => showToast(message, 'info'),
    warning: (message: string) => showToast(message, 'warning'),
  }
}

