import {
  Home,
  Heart,
  Target,
  Coins,
  Calendar,
  History,
  Shield,
  CheckCircle,
  Zap,
  Globe,
  Share2,
  HandHeart,
  TrendingUp,
  Users,
  Clock,
  Gift,
  Building,
  FileText,
  Settings,
  ChevronRight,
  Search,
  Filter,
  Plus,
  Trash2,
  Edit,
  ExternalLink,
  ChevronDown,
  Menu,
  X,
  ArrowRight,
  Info,
  AlertCircle,
  AlertTriangle,
  Check,
  Star,
  Award,
  Moon,
  Sun,
  Sparkles,
  CreditCard,
  Inbox,
  Repeat
} from 'lucide-react'
import './Icon.css'

export type IconName =
  | 'home'
  | 'heart'
  | 'target'
  | 'coins'
  | 'calendar'
  | 'history'
  | 'shield'
  | 'checkCircle'
  | 'zap'
  | 'globe'
  | 'share'
  | 'handHeart'
  | 'trendingUp'
  | 'users'
  | 'clock'
  | 'gift'
  | 'building'
  | 'fileText'
  | 'settings'
  | 'chevronRight'
  | 'search'
  | 'filter'
  | 'plus'
  | 'trash'
  | 'edit'
  | 'externalLink'
  | 'chevronDown'
  | 'menu'
  | 'x'
  | 'arrowRight'
  | 'info'
  | 'alert'
  | 'alertCircle'
  | 'alertTriangle'
  | 'check'
  | 'star'
  | 'award'
  | 'moon'
  | 'sun'
  | 'sparkles'
  | 'creditCard'
  | 'inbox'
  | 'repeat'

interface IconProps {
  name: IconName
  size?: number | string
  color?: string
  className?: string
  strokeWidth?: number
}

const iconMap: Record<IconName, React.ComponentType<any>> = {
  home: Home,
  heart: Heart,
  target: Target,
  coins: Coins,
  calendar: Calendar,
  history: History,
  shield: Shield,
  checkCircle: CheckCircle,
  zap: Zap,
  globe: Globe,
  share: Share2,
  handHeart: HandHeart,
  trendingUp: TrendingUp,
  users: Users,
  clock: Clock,
  gift: Gift,
  building: Building,
  fileText: FileText,
  settings: Settings,
  chevronRight: ChevronRight,
  search: Search,
  filter: Filter,
  plus: Plus,
  trash: Trash2,
  edit: Edit,
  externalLink: ExternalLink,
  chevronDown: ChevronDown,
  menu: Menu,
  x: X,
  arrowRight: ArrowRight,
  info: Info,
  alert: AlertCircle,
  alertCircle: AlertCircle,
  alertTriangle: AlertTriangle,
  check: Check,
  star: Star,
  award: Award,
  moon: Moon,
  sun: Sun,
  sparkles: Sparkles,
  creditCard: CreditCard,
  inbox: Inbox,
  repeat: Repeat,
}

const Icon = ({ name, size = 24, color, className = '', strokeWidth = 2 }: IconProps) => {
  const IconComponent = iconMap[name]
  
  if (!IconComponent) {
    console.warn(`Icon "${name}" not found`)
    return null
  }

  return (
    <IconComponent
      size={size}
      color={color}
      strokeWidth={strokeWidth}
      className={`icon ${className}`}
    />
  )
}

export default Icon

