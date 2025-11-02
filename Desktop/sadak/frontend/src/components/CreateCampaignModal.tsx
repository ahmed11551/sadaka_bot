import { useState } from 'react'
import { campaignsService, CampaignCreate } from '../services/campaignsService'
import LoadingSpinner from '../components/LoadingSpinner'
import { useToast } from '../hooks/useToast'
import Icon from './Icon'
import './CreateCampaignModal.css'

interface CreateCampaignModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

const CreateCampaignModal = ({ isOpen, onClose, onSuccess }: CreateCampaignModalProps) => {
  const [formData, setFormData] = useState<CampaignCreate>({
    fund_id: 0,
    title: '',
    description: '',
    category: '',
    goal_amount: 0,
    currency: 'RUB',
    banner_url: '',
    end_date: '',
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const { success, error } = useToast()

  const categories = [
    'мечеть',
    'сироты',
    'обучение',
    'медицина',
    'помощь нуждающимся',
    'строительство',
    'иное'
  ]

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) {
      newErrors.title = 'Название обязательно'
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Описание обязательно'
    }
    if (!formData.category) {
      newErrors.category = 'Выберите категорию'
    }
    if (!formData.goal_amount || formData.goal_amount <= 0) {
      newErrors.goal_amount = 'Укажите сумму цели'
    } else if (formData.goal_amount < 100) {
      newErrors.goal_amount = 'Минимальная сумма цели: 100 ₽'
    } else if (formData.goal_amount > 100000000) {
      newErrors.goal_amount = 'Максимальная сумма цели: 100,000,000 ₽'
    }
    if (!formData.fund_id || formData.fund_id <= 0) {
      newErrors.fund_id = 'Выберите фонд-получатель'
    }
    if (!formData.end_date) {
      newErrors.end_date = 'Укажите срок сбора'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setLoading(true)
    try {
      await campaignsService.createCampaign(formData)
      success('Кампания успешно создана и отправлена на модерацию!')
      onSuccess()
      onClose()
      // Сброс формы
      setFormData({
        fund_id: 0,
        title: '',
        description: '',
        category: '',
        goal_amount: 0,
        currency: 'RUB',
        banner_url: '',
        end_date: '',
      })
    } catch (err: any) {
      console.error('Error creating campaign:', err)
      error(err.response?.data?.detail || 'Ошибка при создании кампании')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Создать целевую кампанию</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="campaign-form">
          <div className="form-group">
            <label className="form-label required">Название цели</label>
            <input
              type="text"
              className={`form-input ${errors.title ? 'error' : ''}`}
              placeholder="Например: Ремонт мечети в Казани"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              maxLength={100}
            />
            {errors.title && <span className="error-message">{errors.title}</span>}
          </div>

          <div className="form-group">
            <label className="form-label required">Описание</label>
            <textarea
              className={`form-input ${errors.description ? 'error' : ''}`}
              placeholder="Подробно опишите цель сбора средств..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={5}
              maxLength={1000}
            />
            {errors.description && <span className="error-message">{errors.description}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label required">Категория</label>
              <select
                className={`form-input ${errors.category ? 'error' : ''}`}
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <option value="">Выберите категорию</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              {errors.category && <span className="error-message">{errors.category}</span>}
            </div>

            <div className="form-group">
              <label className="form-label required">Целевая сумма (₽)</label>
              <input
                type="number"
                className={`form-input ${errors.goal_amount ? 'error' : ''}`}
                placeholder="10000"
                value={formData.goal_amount || ''}
                onChange={(e) => {
                  const value = parseFloat(e.target.value) || 0
                  if (value >= 0 && value <= 100000000) {
                    setFormData({ ...formData, goal_amount: value })
                  }
                }}
                min="100"
                step="100"
                max="100000000"
              />
              {errors.goal_amount && <span className="error-message">{errors.goal_amount}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label required">Фонд-получатель</label>
              <input
                type="number"
                className={`form-input ${errors.fund_id ? 'error' : ''}`}
                placeholder="ID фонда"
                value={formData.fund_id || ''}
                onChange={(e) => {
                  const value = parseInt(e.target.value) || 0
                  if (value >= 0 && value <= 999999) {
                    setFormData({ ...formData, fund_id: value })
                  }
                }}
                min="1"
                max="999999"
              />
              {errors.fund_id && <span className="error-message">{errors.fund_id}</span>}
              <small className="form-hint">ID фонда из раздела "Фонды-партнёры"</small>
            </div>

            <div className="form-group">
              <label className="form-label required">Срок сбора (до)</label>
              <input
                type="datetime-local"
                className={`form-input ${errors.end_date ? 'error' : ''}`}
                value={formData.end_date}
                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                min={new Date().toISOString().slice(0, 16)}
              />
              {errors.end_date && <span className="error-message">{errors.end_date}</span>}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Ссылка на баннер/фото (опционально)</label>
            <input
              type="url"
              className="form-input"
              placeholder="https://example.com/image.jpg"
              value={formData.banner_url}
              onChange={(e) => setFormData({ ...formData, banner_url: e.target.value })}
            />
            <small className="form-hint">URL изображения для обложки кампании</small>
          </div>

          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                required
              />
              <span>Я подтверждаю, что указанные данные достоверны и средства будут использованы по назначению</span>
            </label>
          </div>

          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                required
              />
              <span>Согласен с правилами платформы и условиями сбора средств</span>
            </label>
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={loading}
            >
              Отмена
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <LoadingSpinner size="sm" />
                  Создание...
                </>
              ) : (
                <>
                  <Icon name="check" size={18} />
                  Создать кампанию
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateCampaignModal

