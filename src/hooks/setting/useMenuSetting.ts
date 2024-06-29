import {
  MenuModeEnum,
  MenuTypeEnum,
  SIDE_BAR_MINI_WIDTH,
  SIDE_BAR_SHOW_TIT_MINI_WIDTH,
  TriggerEnum,
} from '@/core/enums/menuEnum'
import {  setMenuSetting, useAppConfigStore } from '@/store/app'
import { useMemo, useState } from 'react'
import { useShallow } from 'zustand/react/shallow'
import { useDeepMemo } from '../useMemo'
import { useMemoizedFn } from 'ahooks'
import useFullContent from '../useFullContent'
export function useMenuSetting() {
  const {
    menuType,
    splitMenu,
    menuMode,
    showSideBar,
    getCollapsed,
    hiddenSideBar,
    mixSideFixed,
    collapsedShowTitle,
    siderHidden,
    getMenuWidth,
    menuFixed,
    getTrigger,
    getShowMenu,
    getHiddenMenu,
    getCollapsedShowTitle,
    getMenuTheme,
    getMenuBgColor,
  } = useAppConfigStore(
    useShallow((state) => ({
      menuFixed: state.menuSetting.fixed,
      menuType: state.menuSetting.type,
      menuMode: state.menuSetting.mode,
      splitMenu: state.menuSetting.splitMenu,
      showSideBar: state.menuSetting.show,
      getShowMenu: state.menuSetting.show,
      getCollapsed: state.menuSetting.collapsed,
      hiddenSideBar: state.menuSetting.hidden,
      getHiddenMenu: state.menuSetting.hidden,
      mixSideFixed: state.menuSetting.mixSideFixed,
      collapsedShowTitle: state.menuSetting.collapsedShowTitle,
      siderHidden: state.menuSetting.siderHidden,
      getMenuWidth: state.menuSetting.menuWidth,
      getTrigger: state.menuSetting.trigger,
      getCollapsedShowTitle: state.menuSetting.collapsedShowTitle,
      getMenuTheme: state.menuSetting.theme,
      getMenuBgColor: state.menuSetting.bgColor,
    })),
    )
  
  const { getFullContent} = useFullContent()

  const [mixSideHasChildren, setMixSideHasChildren] = useState(false)


  const getIsHorizontal = useMemo(() => {
    return menuMode === MenuModeEnum.HORIZONTAL
  }, [menuMode])
  
  const getShowSidebar = useMemo(() => {
    return splitMenu || (getShowMenu && menuMode !== MenuModeEnum.HORIZONTAL && !getFullContent)
  }, [splitMenu, getShowMenu, menuMode, getFullContent])

  // 是否是左侧菜单模式
  const getIsSidebarType = useMemo(() => menuType === MenuTypeEnum.SIDEBAR, [menuType])
  /**是否是顶部菜单模式*/
  const getIsTopMenu = useMemo(() => menuType === MenuTypeEnum.TOP_MENU, [menuType])

  // 是否是左侧菜单混合模式
  const getIsMixSidebar = useMemo(() => menuType === MenuTypeEnum.MIX_SIDEBAR, [menuType])
  // 顶部菜单混合模式
  const getIsMixMode = useMemo(
    () => menuMode === MenuModeEnum.INLINE && menuType === MenuTypeEnum.MIX,
    [menuMode, menuType],
  )

  // 顶部菜单混合模式 并且 开启分隔菜单，header显示顶栏菜单
  const isMixSplitMenu = useMemo(
    () => menuType === MenuTypeEnum.MIX && splitMenu,
    [menuType, splitMenu],
  )

  // 是否显示header区域的菜单栏
  const getShowTopMenu = useMemo(
    () => getIsTopMenu || isMixSplitMenu,
    [getIsTopMenu, isMixSplitMenu],
  )

  const getMiniWidthNumber = useDeepMemo(() => {
    return siderHidden ? 0 : collapsedShowTitle ? SIDE_BAR_SHOW_TIT_MINI_WIDTH : SIDE_BAR_MINI_WIDTH
  }, [siderHidden, collapsedShowTitle])

  const getRealWidth = useDeepMemo(() => {
    if (getIsMixSidebar) {
      return getCollapsed && !mixSideFixed ? getMiniWidthNumber : getMenuWidth
    }
    return getCollapsed ? getMiniWidthNumber : getMenuWidth
  }, [getIsMixSidebar, getCollapsed, mixSideFixed, getMiniWidthNumber, getMenuWidth])

  const getCalcContentWidth = useDeepMemo(() => {
    const width =
      getIsTopMenu || !showSideBar || (splitMenu && hiddenSideBar)
        ? 0
        : getIsMixSidebar
          ? (getCollapsed ? SIDE_BAR_MINI_WIDTH : SIDE_BAR_SHOW_TIT_MINI_WIDTH) +
            (mixSideFixed && mixSideHasChildren ? getRealWidth : 0)
          : getRealWidth
    return `calc(100% - ${width}px)`
  }, [
    getIsTopMenu,
    showSideBar,
    splitMenu,
    hiddenSideBar,
    getIsMixSidebar,
    getCollapsed,
    mixSideFixed,
    mixSideHasChildren,
    getRealWidth,
  ])

  const toggleCollapsed = useMemoizedFn(() => { 
    setMenuSetting({
      collapsed: !getCollapsed,
    })
  })

  const getShowHeaderTrigger = useMemo(() => {
    if (
      menuType === MenuTypeEnum.TOP_MENU ||
      !showSideBar ||
      hiddenSideBar
    ) {
      return false
    }

    return getTrigger === TriggerEnum.HEADER
  },[menuType,showSideBar,hiddenSideBar,getTrigger])

  return {
    getCollapsed,
    toggleCollapsed,
    getMenuWidth,
    menuFixed,
    getShowMenu,
    getHiddenMenu,
    getMenuType: menuType,
    getMenuMode: menuMode,
    getIsSidebarType,
    getIsTopMenu,
    getIsMixSidebar,
    getIsMixMode,
    getIsHorizontal,
    isMixSplitMenu,
    getSplitMenu: splitMenu,
    getCalcContentWidth,
    setMixSideHasChildren,
    getShowTopMenu,
    getRealWidth,
    hiddenSideBar,
    getShowHeaderTrigger,
    getTrigger,
    getCollapsedShowTitle,
    getMenuTheme,
    getMenuBgColor,
    getShowSidebar,
  }
}
