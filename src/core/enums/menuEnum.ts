// 左侧菜单栏收起时的宽度
export const SIDE_BAR_MINI_WIDTH = 48
export const SIDE_BAR_SHOW_TIT_MINI_WIDTH = 80
/** 导航栏模式 */
export enum MenuTypeEnum {
  // 左侧菜单模式
  SIDEBAR = 'sidebar',
  // 左侧菜单混合模式
  MIX_SIDEBAR = 'mix-sidebar',
  // 顶部菜单混合模式
  MIX = 'mix',
  // 顶部菜单模式
  TOP_MENU = 'top-menu',
}

// menu mode
export enum MenuModeEnum {
  VERTICAL = 'vertical',
  HORIZONTAL = 'horizontal',
  INLINE = 'inline',
}

export enum MenuThemeEnum {
  LIGHT = 'light',
  DARK = 'dark',
}
