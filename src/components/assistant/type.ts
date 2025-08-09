import { ReactNode } from 'react'
import { ChatProps } from '../chat'

export interface AssistantProps extends ChatProps {
  showBubble?: boolean
  isVisible?: boolean
  onClose?: () => void
  bottom?: number
  icon?: ReactNode
}
