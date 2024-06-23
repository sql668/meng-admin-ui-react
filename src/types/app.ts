import { MenuModeEnum, MenuThemeEnum, MenuTypeEnum } from "@/core/enums/menuEnum";

export interface MenuSetting {
  /** 菜单栏宽度 */
  menuWidth: number
  fixed: boolean
  type: MenuTypeEnum
  mode: MenuModeEnum
  /** 菜单亮暗主题 */
  theme: MenuThemeEnum
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
}

export interface HeaderSetting {
  bgColor: string
  fixed: boolean
  show: boolean
  theme: MenuThemeEnum
}