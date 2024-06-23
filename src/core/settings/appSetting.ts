import { HeaderSetting, MenuSetting } from "@/types/app";
import { MenuModeEnum, MenuThemeEnum, MenuTypeEnum } from "../enums/menuEnum";
import { HEADER_PRESET_BG_COLOR_LIST } from "./designSetting";

// 菜单配置相关 默认值
export const MenuSettingDefault: MenuSetting = {
  // Menu width
  menuWidth: 210,
  
  fixed:true,
  // Menu mode
  mode: MenuModeEnum.INLINE,
  // Menu type
  type: MenuTypeEnum.MIX,
  // Menu theme
  theme: MenuThemeEnum.LIGHT,
  topMenuAlign: 'center',
  splitMenu: true,
  show: true,
  hidden: false,
  collapsed: false,
  mixSideFixed: false,
  collapsedShowTitle: false,
  siderHidden:false,
}

export const HeaderSettingDefault: HeaderSetting = {
  show: true,
  fixed: true,
  bgColor: HEADER_PRESET_BG_COLOR_LIST[0],
  theme: MenuThemeEnum.LIGHT
}