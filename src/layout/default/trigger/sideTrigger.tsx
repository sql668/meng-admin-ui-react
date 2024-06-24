import { useMenuContext } from '@/context/menu'
import { DoubleLeftOutlined, DoubleRightOutlined } from '@ant-design/icons'
import { useMemoizedFn } from 'ahooks'
function SiderTrigger() { 
  const { onCollapse, collapsed } = useMenuContext()
  const clickHandle = useMemoizedFn(() => { 
    onCollapse && onCollapse(!collapsed)
  })
  return (
    <div onClick={clickHandle}>
      {collapsed && <DoubleRightOutlined />}
      {!collapsed && <DoubleLeftOutlined />}
    </div>
  )
}

export default SiderTrigger