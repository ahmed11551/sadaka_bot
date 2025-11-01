/**
 * Утилиты для шаринга в социальные сети
 */

export const shareContent = {
  shareCampaign: (campaignId: number, title: string) => {
    const url = `${window.location.origin}/campaigns/${campaignId}`
    const text = `Поддержите кампанию: ${title}`
    
    if (navigator.share) {
      navigator.share({
        title,
        text,
        url,
      }).catch(() => {
        // Fallback если пользователь отменил
      })
    } else {
      // Копируем в буфер обмена
      navigator.clipboard.writeText(`${text}\n${url}`)
      alert('Ссылка скопирована в буфер обмена!')
    }
  },
  
  shareFund: (fundId: number, name: string) => {
    const url = `${window.location.origin}/donate?fund=${fundId}`
    const text = `Поддержите фонд: ${name}`
    
    if (navigator.share) {
      navigator.share({
        title: name,
        text,
        url,
      }).catch(() => {})
    } else {
      navigator.clipboard.writeText(`${text}\n${url}`)
      alert('Ссылка скопирована!')
    }
  },
  
  shareToTelegram: (text: string, url: string) => {
    const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`
    window.open(telegramUrl, '_blank')
  },
  
  shareToVK: (text: string, url: string) => {
    const vkUrl = `https://vk.com/share.php?url=${encodeURIComponent(url)}&title=${encodeURIComponent(text)}`
    window.open(vkUrl, '_blank')
  },
  
  shareToWhatsApp: (text: string, url: string) => {
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`
    window.open(whatsappUrl, '_blank')
  },
}

