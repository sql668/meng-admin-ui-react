import { useDesign } from '@/hooks/useDesign'
import { HandlerEnum } from '../../enums'
import Switch from '@/components/switch'
import { SwitchProps } from 'antd'
import './_style.scss'

interface SwitchItemProps {
  event: HandlerEnum
  title: string
  disabled: boolean
  def: boolean
  onChange?: SwitchProps['onChange']
}

function SwitchItem(props: SwitchItemProps) {
  const { title, def, disabled, onChange } = props
  const { prefixCls } = useDesign('setting-switch-item')
  return (
    <div className={prefixCls}>
      <span>{title}</span>
      <Switch
        checked={def}
        disabled={disabled}
        onChange={onChange}
        checkedChildren='开'
        unCheckedChildren='关'></Switch>
    </div>
  )
}

export default SwitchItem
