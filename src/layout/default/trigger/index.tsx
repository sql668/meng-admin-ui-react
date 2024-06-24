import { MenuThemeEnum } from "@/core/enums/menuEnum"
import SiderTrigger from "./sideTrigger"
import HeaderTrigger from "./headerTrigger"

interface LayoutTriggerProps{
  sider?: boolean
  theme?: MenuThemeEnum
}
function LayoutTrigger(props: LayoutTriggerProps) {
  const { sider,theme} = props
  return <>{sider && <SiderTrigger></SiderTrigger>} { !sider && <HeaderTrigger></HeaderTrigger>}</>
}

export default LayoutTrigger