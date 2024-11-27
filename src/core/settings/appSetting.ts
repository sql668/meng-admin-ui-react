import { HeaderSetting, MenuSetting, MultiTabsSetting, RootSetting } from '@/types/app'
import { MenuModeEnum, MenuTypeEnum, TriggerEnum } from '../enums/menuEnum'
import { HEADER_PRESET_BG_COLOR_LIST, SIDE_BAR_BG_COLOR_LIST } from './designSetting'
import { ThemeEnum } from '../enums/appEnum'

// 菜单配置相关 默认值
export const MenuSettingDefault: MenuSetting = {
  bgColor: SIDE_BAR_BG_COLOR_LIST[0],
  // Menu width
  menuWidth: 210,

  fixed: true,
  // Menu mode
  mode: MenuModeEnum.INLINE,
  // Menu type
  type: MenuTypeEnum.MIX,
  // Menu theme
  theme: ThemeEnum.DARK,
  topMenuAlign: 'center',
  splitMenu: true,
  show: true,
  hidden: false,
  collapsed: false,
  mixSideFixed: false,
  collapsedShowTitle: false,
  siderHidden: false,
  trigger: TriggerEnum.HEADER,
}

export const HeaderSettingDefault: HeaderSetting = {
  show: true,
  fixed: true,
  bgColor: HEADER_PRESET_BG_COLOR_LIST[0],
  theme: ThemeEnum.LIGHT,
}
export const RootSettingDEfault: RootSetting = {
  theme: ThemeEnum.LIGHT,
  isMobile: false,
  disableMobile: false,
  showBreadCrumb: false,
  showBreadCrumbIcon: false,
  showLogo: true,
  appName: 'Mx Admin',
  fullContent: false,
}

export const MultiTabsSettingDefault: MultiTabsSetting = {
  cache: false,
  // Turn on
  show: true,
  // Is it possible to drag and drop sorting tabs
  canDrag: true,
  // Turn on quick actions
  showQuick: true,
  // Whether to show the refresh button
  showRedo: true,
  // Whether to show the collapse button
  showFold: true,
  // Auto collapsed
  autoCollapse: false,
}
