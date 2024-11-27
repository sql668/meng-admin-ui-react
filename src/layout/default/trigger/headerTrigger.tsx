import { useMenuSetting } from '@/hooks/setting/useMenuSetting'
import { useDesign } from '@/hooks/useDesign'
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons'
import classNames from 'classnames'
import { useMemo } from 'react'

function HeaderTrigger() {
  const { prefixCls } = useDesign('layout-header-trigger')
  const { getCollapsed, toggleCollapsed } = useMenuSetting()
  const getWrapClass = useMemo(() => {
    return classNames([
      prefixCls,
      //  {
      //    [`${prefixCls}--fixed`]: fixed,
      //    [`${prefixCls}--${themeMode}`]: themeMode,
      //  },
    ])
  }, [prefixCls])
  return (
    <span className={getWrapClass} onClick={toggleCollapsed}>
      {getCollapsed && <MenuUnfoldOutlined />}
      {!getCollapsed && <MenuFoldOutlined />}
    </span>
  )
}
export default HeaderTrigger
