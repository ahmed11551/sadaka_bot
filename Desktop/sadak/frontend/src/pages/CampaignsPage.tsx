import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { campaignsService, Campaign } from '../services/campaignsService'
import { donationsService } from '../services/donationsService'
import LoadingSpinner from '../components/LoadingSpinner'
import Skeleton from '../components/Skeleton'
import CampaignCard from '../components/CampaignCard'
import CreateCampaignModal from '../components/CreateCampaignModal'
import FilterBar from '../components/FilterBar'
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
  
  const debouncedSearch = useDebounce(searchQuery, 300)
  
  // Получаем уникальные категории
  const categories = Array.from(new Set(campaigns.map(c => c.category).filter(Boolean)))

  useEffect(() => {
    loadCampaigns()
  }, [])

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
      const data = await campaignsService.getCampaigns({ status: selectedStatus })
      setCampaigns(data)
      setFilteredCampaigns(data)
    } catch (error) {
      console.error('Error loading campaigns:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDonate = (campaignId: number) => {
    const amount = prompt('Введите сумму пожертвования (минимум 100 ₽):')
    if (amount && parseFloat(amount) >= 100) {
      navigate(`/campaigns/${campaignId}`)
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
            <Skeleton height="200px" width="100%" style={{ marginBottom: '16px' }} />
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
        <span>🎯</span>
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
          <span>➕</span>
          Создать свою цель
        </button>

        {/* Поиск и фильтры */}
        <input
          type="text"
          className="form-input"
          placeholder="🔍 Поиск кампаний..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ marginBottom: '12px' }}
        />
        
        {categories.length > 0 && (
          <FilterBar
            filters={[
              {
                label: 'Категория',
                options: categories.map(cat => ({ value: cat, label: cat })),
                value: selectedCategory,
                onChange: setSelectedCategory,
              },
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
                  loadCampaigns()
                },
              },
            ]}
          />
        )}
      </div>

      {filteredCampaigns.length === 0 && campaigns.length > 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '48px 24px' }}>
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>🔍</div>
          <h3 style={{ marginBottom: '8px' }}>Кампании не найдены</h3>
          <p style={{ color: 'var(--text-muted)' }}>
            Попробуйте изменить фильтры поиска
          </p>
        </div>
      ) : campaigns.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '48px 24px' }}>
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>🎯</div>
          <h3 style={{ marginBottom: '8px' }}>Пока нет активных кампаний</h3>
          <p style={{ color: 'var(--text-muted)' }}>
            Станьте первым, кто создаст кампанию для сбора средств
          </p>
        </div>
      ) : (
        filteredCampaigns.map((campaign) => (
          <div 
            key={campaign.id} 
            onClick={() => navigate(`/campaigns/${campaign.id}`)} 
            style={{ cursor: 'pointer', marginBottom: '24px' }}
          >
            <CampaignCard
              campaign={campaign}
              onDonate={(id) => {
                // Открываем детальную страницу вместо prompt
                navigate(`/campaigns/${id}`)
              }}
            />
          </div>
        ))
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

