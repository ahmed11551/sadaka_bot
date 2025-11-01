import './ShareButton.css'

interface ShareButtonProps {
  url: string
  title: string
  text?: string
}

const ShareButton = ({ url, title, text }: ShareButtonProps) => {
  const handleShare = async () => {
    const shareText = text || title
    
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: shareText,
          url,
        })
      } catch (err) {
        // Пользователь отменил шаринг
      }
    } else {
      // Fallback - копируем в буфер
      navigator.clipboard.writeText(`${shareText}\n${url}`)
      alert('Ссылка скопирована в буфер обмена!')
    }
  }

  return (
    <button className="share-button" onClick={handleShare}>
      <span className="share-icon">📤</span>
      <span>Поделиться</span>
    </button>
  )
}

export default ShareButton

