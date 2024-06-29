
import { useMenuSetting } from '@/hooks/setting/useMenuSetting'
import { DoubleLeftOutlined, DoubleRightOutlined } from '@ant-design/icons'
function SiderTrigger() { 
  const { getCollapsed,toggleCollapsed} = useMenuSetting()
  return (
    <div onClick={toggleCollapsed}>
      {getCollapsed && <DoubleRightOutlined />}
      {!getCollapsed && <DoubleLeftOutlined />}
    </div>
  )
}

export default SiderTrigger