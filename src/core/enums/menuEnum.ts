// 左侧菜单栏收起时的宽度
export const SIDE_BAR_MINI_WIDTH = 64
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

// 折叠触发器位置
export enum TriggerEnum {
  // 不显示
  NONE = 'NONE',
  // 菜单底部
  FOOTER = 'FOOTER',
  // 头部
  HEADER = 'HEADER',
}

export enum MenuSplitTyeEnum {
  NONE,
  TOP,
  LEFT,
}
