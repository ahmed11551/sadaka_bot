import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { campaignsService, Campaign } from '../services/campaignsService'
import Icon from './Icon'
import LoadingSpinner from './LoadingSpinner'
import '../App.css'

interface UrgentCampaignsCarouselProps {
  maxItems?: number
}

const UrgentCampaignsCarousel = ({ maxItems = 5 }: UrgentCampaignsCarouselProps) => {
  const navigate = useNavigate()
  const [urgentCampaigns, setUrgentCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    loadUrgentCampaigns()
  }, [])

  const loadUrgentCampaigns = async () => {
    try {
      const allCampaigns = await campaignsService.getCampaigns({ status: 'active' })
      
      // Фильтруем срочные кампании (заканчиваются в ближайшие 7 дней или мало собрано)
      const now = new Date()
      let urgent = allCampaigns
        .filter(campaign => {
          const endDate = new Date(campaign.end_date)
          const daysLeft = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
          const progress = parseFloat(campaign.collected_amount) / parseFloat(campaign.goal_amount)
          
          // Срочные: заканчиваются через 7 дней или меньше, или собрано меньше 50%
          return (daysLeft <= 7 && daysLeft > 0) || (progress < 0.5 && daysLeft <= 30)
        })
        .sort((a, b) => {
          // Сначала те, что заканчиваются раньше
          const aEnd = new Date(a.end_date).getTime()
          const bEnd = new Date(b.end_date).getTime()
          return aEnd - bEnd
        })
        .slice(0, maxItems)
      
      // Если нет срочных, показываем последние активные кампании
      if (urgent.length === 0 && allCampaigns.length > 0) {
        urgent = allCampaigns
          .sort((a, b) => {
            const aDate = new Date(a.created_at || a.start_date).getTime()
            const bDate = new Date(b.created_at || b.start_date).getTime()
            return bDate - aDate // Последние созданные первыми
          })
          .slice(0, maxItems)
      }
      
      setUrgentCampaigns(urgent)
    } catch (error) {
      console.error('Error loading urgent campaigns:', error)
    } finally {
      setLoading(false)
    }
  }

  const scrollToIndex = (index: number) => {
    if (scrollContainerRef.current) {
      const cardWidth = scrollContainerRef.current.scrollWidth / urgentCampaigns.length
      scrollContainerRef.current.scrollTo({
        left: cardWidth * index,
        behavior: 'smooth'
      })
      setCurrentIndex(index)
    }
  }

  const getProgress = (campaign: Campaign) => {
    const collected = parseFloat(campaign.collected_amount)
    const goal = parseFloat(campaign.goal_amount)
    return Math.min((collected / goal) * 100, 100)
  }

  const getDaysLeft = (campaign: Campaign) => {
    const endDate = new Date(campaign.end_date)
    const now = new Date()
    const days = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    return days > 0 ? days : 0
  }

  if (loading) {
    return (
      <div style={{ 
        marginBottom: '24px',
        padding: '20px',
        textAlign: 'center'
      }}>
        <LoadingSpinner size="sm" />
      </div>
    )
  }

  // Показываем плейсхолдер только если действительно нет кампаний
  if (urgentCampaigns.length === 0 && !loading) {
    return (
      <div style={{ marginBottom: '32px' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '16px',
          padding: '0 4px'
        }}>
          <h2 style={{ 
            fontSize: '20px', 
            fontWeight: 700,
            margin: 0,
            color: 'var(--text-primary)',
            letterSpacing: '-0.3px'
          }}>
            Активные кампании
          </h2>
        </div>
        <div style={{
          padding: '32px 16px',
          textAlign: 'center',
          background: 'var(--tg-theme-secondary-bg-color, var(--bg-primary))',
          borderRadius: '12px',
          border: 'none',
          boxShadow: 'none',
          minHeight: '200px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <Icon name="target" size={48} color="var(--text-muted)" />
          <p style={{ 
            marginTop: '12px', 
            color: 'var(--text-secondary)',
            fontSize: '14px'
          }}>
            Пока нет активных кампаний
          </p>
        </div>
      </div>
    )
  }

  // Обработка свайпа жестов
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > 50
    const isRightSwipe = distance < -50

    if (isLeftSwipe && currentIndex < urgentCampaigns.length - 1) {
      scrollToIndex(currentIndex + 1)
    }
    if (isRightSwipe && currentIndex > 0) {
      scrollToIndex(currentIndex - 1)
    }
  }

  return (
    <div style={{ marginBottom: '32px' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '16px',
        padding: '0 4px'
      }}>
        <h2 style={{ 
          fontSize: '20px', 
          fontWeight: 700,
          margin: 0,
          color: 'var(--text-primary)',
          letterSpacing: '-0.3px'
        }}>
          {(() => {
            if (urgentCampaigns.length > 0 && urgentCampaigns[0].end_date) {
              const daysLeft = getDaysLeft(urgentCampaigns[0])
              return daysLeft <= 7 ? 'Срочные сборы' : 'Активные кампании'
            }
            return 'Активные кампании'
          })()}
        </h2>
        {urgentCampaigns.length > 1 && (
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
            {urgentCampaigns.map((_, index) => (
              <button
                key={index}
                onClick={() => scrollToIndex(index)}
                style={{
                  width: currentIndex === index ? '20px' : '6px',
                  height: '6px',
                  borderRadius: currentIndex === index ? '3px' : '50%',
                  border: 'none',
                  background: currentIndex === index ? 'var(--primary)' : 'rgba(0,0,0,0.12)',
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  padding: 0
                }}
                aria-label={`Перейти к слайду ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      <div
        ref={scrollContainerRef}
        style={{
          display: 'flex',
          gap: '16px',
          overflowX: 'auto',
          overflowY: 'hidden',
          scrollSnapType: 'x mandatory',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          paddingBottom: '12px',
          paddingLeft: '4px',
          paddingRight: '4px',
          WebkitOverflowScrolling: 'touch',
          scrollBehavior: 'smooth'
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onScroll={(e) => {
          const container = e.currentTarget
          const scrollLeft = container.scrollLeft
          const cardWidth = container.scrollWidth / urgentCampaigns.length
          const newIndex = Math.round(scrollLeft / cardWidth)
          if (newIndex !== currentIndex && newIndex >= 0 && newIndex < urgentCampaigns.length) {
            setCurrentIndex(newIndex)
          }
        }}
      >
        {urgentCampaigns.map((campaign, idx) => {
          const progress = getProgress(campaign)
          const daysLeft = getDaysLeft(campaign)
          const isUrgent = daysLeft <= 7
          
          return (
            <div
              key={campaign.id}
              onClick={() => navigate(`/campaigns/${campaign.id}`)}
              style={{
                flex: '0 0 calc(100% - 32px)',
                maxWidth: '345px',
                minWidth: '300px',
                scrollSnapAlign: 'start',
                background: 'var(--tg-theme-secondary-bg-color, var(--bg-primary))',
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: 'none',
                cursor: 'pointer',
                transition: 'background-color 0.2s ease',
                position: 'relative',
                border: 'none',
                animation: `slideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1) ${idx * 0.08}s both`
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--bg-secondary)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'var(--tg-theme-secondary-bg-color, var(--bg-primary))'
              }}
            >
              {/* Баннер изображение - компактный стиль Wisecrypto */}
              <div
                style={{
                  width: '100%',
                  height: '140px',
                  background: campaign.banner_url
                    ? `url(${campaign.banner_url}) center/cover`
                    : 'var(--primary)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {/* Градиентный оверлей для лучшей читаемости */}
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: '60px',
                  background: 'rgba(0,0,0,0.2)'
                }} />

                {/* Бейдж срочности - улучшенный дизайн */}
                {isUrgent && (
                  <div style={{
                    position: 'absolute',
                    top: '14px',
                    right: '14px',
                    background: daysLeft === 0 
                      ? 'var(--error)'
                      : 'var(--warning)',
                    color: '#ffffff',
                    padding: '7px 14px',
                    borderRadius: '16px',
                    fontSize: '11px',
                    fontWeight: 700,
                    backdropFilter: 'blur(12px)',
                    boxShadow: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    letterSpacing: '0.3px'
                  }}>
                    {daysLeft === 0 ? (
                      <>
                        <span style={{ fontSize: '12px' }}>🔥</span>
                        <span>Сегодня!</span>
                      </>
                    ) : (
                      <>
                        <span style={{ fontSize: '12px' }}>⏰</span>
                        <span>{daysLeft} {daysLeft === 1 ? 'день' : daysLeft < 5 ? 'дня' : 'дней'}</span>
                      </>
                    )}
                  </div>
                )}

                {/* Индикатор прогресса поверх изображения - улучшенный */}
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: '5px',
                  background: 'rgba(0,0,0,0.25)',
                  borderRadius: '0 0 20px 20px'
                }}>
                  <div style={{
                    height: '100%',
                    width: `${progress}%`,
                    background: progress < 30 
                      ? 'var(--error)'
                      : progress < 70
                      ? 'var(--warning)'
                      : 'var(--success)',
                    borderRadius: '0 0 20px 20px',
                    transition: 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxShadow: 'none'
                  }} />
                </div>
              </div>

              {/* Контент карточки - стиль Wisecrypto (компактный) */}
              <div style={{ padding: '16px' }}>
                <h3 style={{
                  fontSize: '17px',
                  fontWeight: 700,
                  margin: '0 0 10px 0',
                  color: 'var(--text-primary)',
                  lineHeight: '1.4',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  letterSpacing: '-0.3px'
                }}>
                  {campaign.title}
                </h3>

                {campaign.description && (
                  <p style={{
                    fontSize: '13px',
                    color: 'var(--text-secondary)',
                    margin: '0 0 14px 0',
                    lineHeight: '1.6',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    opacity: 0.8
                  }}>
                    {campaign.description}
                  </p>
                )}

                {/* Прогресс сбора - улучшенный дизайн */}
                <div style={{ marginBottom: '14px' }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-end',
                    marginBottom: '8px'
                  }}>
                    <div>
                      <div style={{
                        fontSize: '18px',
                        fontWeight: 700,
                        color: 'var(--text-primary)',
                        lineHeight: '1.2'
                      }}>
                        {parseFloat(campaign.collected_amount).toLocaleString('ru-RU')} {campaign.currency}
                      </div>
                      <div style={{
                        fontSize: '11px',
                        color: 'var(--text-secondary)',
                        marginTop: '2px',
                        opacity: 0.7
                      }}>
                        {Math.round(progress)}% собрано
                      </div>
                    </div>
                    <span style={{
                      fontSize: '13px',
                      color: 'var(--text-secondary)',
                      fontWeight: 500,
                      opacity: 0.8
                    }}>
                      из {parseFloat(campaign.goal_amount).toLocaleString('ru-RU')} {campaign.currency}
                    </span>
                  </div>
                  <div style={{
                    width: '100%',
                    height: '10px',
                    background: 'rgba(0,0,0,0.06)',
                    borderRadius: '10px',
                    overflow: 'hidden',
                    position: 'relative'
                  }}>
                    <div style={{
                      height: '100%',
                      width: `${progress}%`,
                      background: progress < 30 
                        ? 'var(--error)'
                        : progress < 70
                        ? 'var(--warning)'
                        : 'var(--success)',
                      borderRadius: '10px',
                      transition: 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                      boxShadow: `inset 0 1px 2px rgba(255,255,255,0.3)`
                    }} />
                  </div>
                </div>

                {/* Дополнительная информация - улучшенный дизайн */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingTop: '12px',
                  borderTop: '1px solid rgba(0,0,0,0.06)'
                }}>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '6px',
                    fontSize: '12px',
                    color: 'var(--text-secondary)',
                    fontWeight: 500
                  }}>
                    <div style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      background: 'var(--tg-theme-button-color, var(--primary))',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '4px'
                    }}>
                      <Icon name="users" size={12} color="#ffffff" />
                    </div>
                    <span>{campaign.participants_count}</span>
                  </div>
                  {daysLeft > 0 && (
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '6px',
                      fontSize: '12px',
                      color: isUrgent ? '#ef4444' : 'var(--text-secondary)',
                      fontWeight: isUrgent ? 600 : 500
                    }}>
                      <Icon name="clock" size={14} color={isUrgent ? '#ef4444' : undefined} />
                      <span>{daysLeft} {daysLeft === 1 ? 'день' : daysLeft < 5 ? 'дня' : 'дней'}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <style>{`
        div[style*="overflow-x: auto"]::-webkit-scrollbar {
          display: none;
        }
        
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  )
}

export default UrgentCampaignsCarousel

