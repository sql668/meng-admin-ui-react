import { useDesign } from '@/hooks/useDesign'
import { menuTypeListEnum } from '../../enums'
import { Tooltip } from 'antd'
import './_style.scss'
import classNames from 'classnames'
interface TypePickerProps {
  menuTypeList: typeof menuTypeListEnum
  handler: (item: (typeof menuTypeListEnum)[0]) => void
  def: string
}
function TypePicker(props: TypePickerProps) {
  const { menuTypeList, handler, def } = props
  const { prefixCls } = useDesign('setting-menu-type-picker')

  return (
    <div className={prefixCls}>
      {menuTypeList.map((item) => {
        return (
          <Tooltip key={item.title} title={item.title} placement='bottom'>
            <div
              onClick={() => handler(item)}
              className={classNames([
                `${prefixCls}__item`,
                `${prefixCls}__item--${item.type}`,
                {
                  [`${prefixCls}__item--active`]: def === item.type,
                },
              ])}>
              <div className='mix-sidebar'></div>
            </div>
          </Tooltip>
        )
      })}
    </div>
  )
}

export default TypePicker
