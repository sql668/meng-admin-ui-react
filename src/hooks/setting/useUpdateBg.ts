import { ThemeEnum } from '@/core/enums/appEnum'
import { useHeaderSetting } from './useHeaderSetting'
import { colorIsDark } from '@/utils/color'
import { setHeaderSetting, setMenuSetting } from '@/store/app'
import { useMenuSetting } from './useMenuSetting'
import { useMemoizedFn } from 'ahooks'

// const HEADER_BG_COLOR_VAR = '--header-bg-color'
// const HEADER_BG_HOVER_COLOR_VAR = '--header-bg-hover-color'
// const HEADER_MENU_ACTIVE_BG_COLOR_VAR = '--header-active-menu-bg-color'

// const SIDER_DARK_BG_COLOR = '--sider-dark-bg-color'
// const SIDER_DARK_DARKEN_BG_COLOR = '--sider-dark-darken-bg-color'
// const SIDER_LIGHTEN_BG_COLOR = '--sider-dark-lighten-bg-color'

export function useUpdateBg() {
  // const { getGlobalTheme } = useRootSetting()
  const { getHeaderBgColor } = useHeaderSetting()
  const { getMenuBgColor } = useMenuSetting()
  const useUpdateHeaderBgColor = useMemoizedFn((theme: ThemeEnum, color?: string) => {
    const darkMode = theme === ThemeEnum.DARK
    if (!color) {
      if (darkMode) {
        color = '#151515'
      } else {
        color = getHeaderBgColor
      }
    }

    // setCssVar(HEADER_BG_COLOR_VAR, color)

    // hover color
    // const hoverColor = lighten(color!, 6)
    // setCssVar(HEADER_BG_HOVER_COLOR_VAR, hoverColor)
    // setCssVar(HEADER_MENU_ACTIVE_BG_COLOR_VAR, hoverColor)

    // Determine the depth of the color value and automatically switch the theme
    const isDark = colorIsDark(color!)

    // console.log('setHeaderTheme: ', isDark || darkMode ? ThemeEnum.DARK : ThemeEnum.LIGHT)

    setHeaderSetting({
      theme: isDark || darkMode ? ThemeEnum.DARK : ThemeEnum.LIGHT,
    })
  })

  const updateSidebarBgColor = useMemoizedFn((theme: ThemeEnum, color?: string) => {
    const darkMode = theme === ThemeEnum.DARK
    if (!color) {
      if (darkMode) {
        color = '#212121'
      } else {
        color = getMenuBgColor
      }
    }
    // setCssVar(SIDER_DARK_BG_COLOR, color)
    // setCssVar(SIDER_DARK_DARKEN_BG_COLOR, darken(color!, 6))
    // setCssVar(SIDER_LIGHTEN_BG_COLOR, lighten(color!, 5))

    // only #ffffff is light
    // Only when the background color is #fff, the theme of the menu will be changed to light
    const isLight = ['#fff', '#ffffff'].includes(color!.toLowerCase())

    setMenuSetting({
      theme: isLight && !darkMode ? ThemeEnum.LIGHT : ThemeEnum.DARK,
    })
  })

  return {
    updateSidebarBgColor,
    useUpdateHeaderBgColor,
  }
}
