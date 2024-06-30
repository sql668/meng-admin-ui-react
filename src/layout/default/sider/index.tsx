import useRootSetting from "@/hooks/setting/useRootSetting"
import { Drawer } from "antd"
import Sider from "./sider"
import { useMenuSetting } from "@/hooks/setting/useMenuSetting"
import { useDesign } from "@/hooks/useDesign"

function LayoutSider() {
  
  const { getIsMobile } = useRootSetting()
  const { getMenuWidth, getCollapsed, toggleCollapsed } = useMenuSetting()
  const { prefixCls } = useDesign('layout-sider-wrapper')

  return (
    <>
      {getIsMobile && (
        <Drawer
          className={prefixCls}
          placement='left'
          width={getMenuWidth}
          getContainer={false}
          open={!getCollapsed}
        onClose={toggleCollapsed}>
          <Sider></Sider>
        </Drawer>
      )}

      {!getIsMobile && <Sider></Sider>}
    </>
  )

}

export default LayoutSider