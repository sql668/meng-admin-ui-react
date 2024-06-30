import { ThemeEnum } from "@/core/enums/appEnum";
import { MenuModeEnum, MenuTypeEnum, TriggerEnum } from "@/core/enums/menuEnum";

export interface MenuSetting {
  bgColor: string
  /** 菜单栏宽度 */
  menuWidth: number
  fixed: boolean
  type: MenuTypeEnum
  mode: MenuModeEnum
  /** 菜单亮暗主题 */
  theme: ThemeEnum
  /** 顶部菜单栏对齐方式 */
  topMenuAlign: 'start' | 'center' | 'end'
  // 分隔菜单
  splitMenu: boolean
  /** 左侧菜单栏是否收起 */
  collapsed: boolean
  /** 是否开启左侧菜单栏 */
  show: boolean
  /** 隐藏菜单栏，一般顶部菜单没有children时，会隐藏左侧的菜单栏 */
  hidden: boolean
  /** 固定左侧混合菜单模式 */
  mixSideFixed: boolean
  /** 左侧菜单收起时是否显示菜单名称 */
  collapsedShowTitle: boolean
  siderHidden: boolean
  trigger: TriggerEnum
}

export interface HeaderSetting {
  bgColor: string
  fixed: boolean
  show: boolean
  theme: ThemeEnum
}

export interface RootSetting {

  // 全局亮暗主题
  theme: ThemeEnum
  // 是否是移动端
  isMobile: boolean

  // 禁止切换到移动端
  disableMobile: boolean

  //是否显示面包屑
  showBreadCrumb: boolean
  // 面包屑是否显示菜单图标
  showBreadCrumbIcon: boolean

  showLogo: boolean

  // 系统应用名称
  appName: string

  // 全屏 内容区域
  fullContent:boolean

}

export interface MultiTabsSetting {
  cache: boolean
  show: boolean
  showQuick: boolean
  canDrag: boolean
  showRedo: boolean
  showFold: boolean
  autoCollapse: boolean
}

export interface BeforeMiniState {
  menuCollapsed?: boolean
  menuSplit?: boolean
  menuMode?: MenuModeEnum
  menuType?: MenuTypeEnum
}