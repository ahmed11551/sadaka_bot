import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { campaignsService, Campaign } from '../services/campaignsService'
import Skeleton from '../components/Skeleton'
import CampaignCard from '../components/CampaignCard'
import CreateCampaignModal from '../components/CreateCampaignModal'
import FilterBar from '../components/FilterBar'
import Icon from '../components/Icon'
import { useDebounce } from '../hooks/useDebounce'
import '../App.css'

const CampaignsPage = () => {
  const navigate = useNavigate()
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [filteredCampaigns, setFilteredCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('active')
  const [selectedSort, setSelectedSort] = useState<string>('newest')
  const [selectedCountry, setSelectedCountry] = useState<string>('')
  
  const debouncedSearch = useDebounce(searchQuery, 300)
  
  // Получаем уникальные категории
  const categories = Array.from(new Set(campaigns.map(c => c.category).filter((cat): cat is string => Boolean(cat))))
  
  // Список стран (можно расширить)
  const countries = [
    { value: 'RU', label: '🇷🇺 Россия' },
    { value: 'KZ', label: '🇰🇿 Казахстан' },
    { value: 'UZ', label: '🇺🇿 Узбекистан' },
    { value: 'KG', label: '🇰🇬 Кыргызстан' },
    { value: 'TJ', label: '🇹🇯 Таджикистан' },
    { value: 'AZ', label: '🇦🇿 Азербайджан' },
    { value: 'TR', label: '🇹🇷 Турция' },
  ]

  useEffect(() => {
    loadCampaigns()
  }, [selectedStatus, selectedSort, selectedCountry])

  useEffect(() => {
    let filtered = campaigns

    // Фильтр по поисковому запросу
    if (debouncedSearch) {
      filtered = filtered.filter(campaign =>
        campaign.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        campaign.description?.toLowerCase().includes(debouncedSearch.toLowerCase())
      )
    }

    // Фильтр по категории
    if (selectedCategory) {
      filtered = filtered.filter(campaign => campaign.category === selectedCategory)
    }

    // Фильтр по статусу
    if (selectedStatus) {
      filtered = filtered.filter(campaign => campaign.status === selectedStatus)
    }

    setFilteredCampaigns(filtered)
  }, [campaigns, debouncedSearch, selectedCategory, selectedStatus])

  const loadCampaigns = async () => {
    try {
      setLoading(true)
      const data = await campaignsService.getCampaigns({ 
        status: selectedStatus,
        sort: selectedSort,
        country_code: selectedCountry || undefined
      })
      setCampaigns(data)
      setFilteredCampaigns(data)
    } catch (error) {
      console.error('Error loading campaigns:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCampaignCreated = () => {
    loadCampaigns()
  }

  if (loading) {
    return (
      <div className="page-container">
        <Skeleton height="32px" width="250px" className="page-title" />
        <div style={{ marginBottom: '24px' }}>
          <Skeleton height="48px" className="skeleton-button" />
        </div>
        {[1, 2].map((i) => (
          <div key={i} className="card">
            <div style={{ marginBottom: '16px' }}>
              <Skeleton height="200px" width="100%" />
            </div>
            <Skeleton height="24px" width="70%" className="skeleton-title" />
            <Skeleton height="16px" className="skeleton-text" />
            <Skeleton height="16px" width="90%" className="skeleton-text short" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="page-container fade-in">
      <h1 className="page-title">
        <Icon name="target" size={28} />
        Целевые кампании
      </h1>
      <p className="page-subtitle">
        Поддержите конкретные проекты и следите за их прогрессом
      </p>
      
      <div style={{ marginBottom: '24px' }}>
            <button 
              className="btn btn-primary" 
              onClick={() => setShowCreateModal(true)}
              style={{ marginBottom: '16px' }}
            >
              <Icon name="plus" size={20} />
              <span className="btn-text-responsive">Создать цель</span>
            </button>

        {/* Поиск и фильтры */}
        <input
          type="text"
          className="form-input"
          placeholder="Поиск кампаний..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ marginBottom: '12px' }}
        />
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
          <FilterBar
            filters={[
              {
                label: 'Страна',
                options: [
                  { value: '', label: 'Все страны' },
                  ...countries,
                ],
                value: selectedCountry,
                onChange: (value) => {
                  setSelectedCountry(value)
                },
              },
              ...(categories.length > 0 ? [{
                label: 'Категория',
                options: [
                  { value: '', label: 'Все категории' },
                  ...categories.map(cat => ({ value: cat, label: cat })),
                ],
                value: selectedCategory,
                onChange: setSelectedCategory,
              }] : []),
              {
                label: 'Статус',
                options: [
                  { value: 'active', label: 'Активные' },
                  { value: 'completed', label: 'Завершенные' },
                  { value: 'pending', label: 'На модерации' },
                ],
                value: selectedStatus,
                onChange: (value) => {
                  setSelectedStatus(value)
                },
              },
            ]}
          />
          
          {/* Сортировка */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <label style={{ fontSize: '14px', color: 'var(--text-muted)', fontWeight: '500' }}>
              Сортировка:
            </label>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {[
                { value: 'newest', label: '🆕 Новые' },
                { value: 'popularity', label: '⭐ Популярные' },
                { value: 'progress', label: '📈 По прогрессу' },
              ].map((option) => (
                <button
                  key={option.value}
                  className={`btn ${selectedSort === option.value ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setSelectedSort(option.value)}
                  style={{ 
                    padding: '8px 16px', 
                    fontSize: '14px',
                    borderRadius: '8px',
                    border: selectedSort === option.value ? '2px solid var(--primary)' : '1px solid var(--border)',
                  }}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {filteredCampaigns.length === 0 && campaigns.length > 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '48px 24px' }}>
          <div style={{ marginBottom: '16px' }}>
            <Icon name="search" size={64} color="var(--text-muted)" />
          </div>
          <h3 style={{ marginBottom: '8px' }}>Кампании не найдены</h3>
          <p style={{ color: 'var(--text-muted)' }}>
            Попробуйте изменить фильтры поиска
          </p>
        </div>
      ) : campaigns.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '48px 24px' }}>
          <div style={{ marginBottom: '16px' }}>
            <Icon name="target" size={64} color="var(--text-muted)" />
          </div>
          <h3 style={{ marginBottom: '8px' }}>Пока нет активных кампаний</h3>
          <p style={{ color: 'var(--text-muted)' }}>
            Станьте первым, кто создаст кампанию для сбора средств
          </p>
        </div>
      ) : (
        <div className="campaigns-list">
          {filteredCampaigns.map((campaign) => (
            <div 
              key={campaign.id} 
              onClick={() => navigate(`/campaigns/${campaign.id}`)} 
              style={{ cursor: 'pointer', marginBottom: '24px', textDecoration: 'none' }}
            >
              <CampaignCard
                campaign={campaign}
                onDonate={(id) => {
                  navigate(`/campaigns/${id}`)
                }}
              />
            </div>
          ))}
        </div>
      )}

      <CreateCampaignModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={handleCampaignCreated}
      />
    </div>
  )
}

export default CampaignsPage

