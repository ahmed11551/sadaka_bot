import { useState, ReactNode } from 'react'

interface ClickFeedbackProps {
  children: ReactNode
  onClick?: () => void
  className?: string
  style?: React.CSSProperties
}

const ClickFeedback = ({ children, onClick, className, style }: ClickFeedbackProps) => {
  const [isClicked, setIsClicked] = useState(false)

  const handleClick = () => {
    setIsClicked(true)
    setTimeout(() => setIsClicked(false), 300)
    onClick?.()
  }

  return (
    <div
      className={className}
      style={{
        ...style,
        transform: isClicked ? 'scale(0.95)' : 'scale(1)',
        transition: 'transform 0.1s ease-out',
        position: 'relative',
      }}
      onClick={handleClick}
    >
      {children}
      {isClicked && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            background: 'rgba(16, 185, 129, 0.2)',
            transform: 'translate(-50%, -50%) scale(0)',
            animation: 'ripple 0.6s ease-out',
            pointerEvents: 'none',
          }}
        />
      )}
    </div>
  )
}

export default ClickFeedback

