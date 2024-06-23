import { MenuModeEnum, MenuTypeEnum, SIDE_BAR_MINI_WIDTH, SIDE_BAR_SHOW_TIT_MINI_WIDTH } from "@/core/enums/menuEnum"
import { getMenuConfig, useAppConfigStore } from "@/store/app"
import { split } from "lodash-es"
import { useMemo, useState } from "react"
import { useShallow } from "zustand/react/shallow"
import { useDeepMemo } from "../useMemo"
export function useMenuSetting() {
  const {
    menuType,
    splitMenu,
    menuMode,
    showSideBar,
    collapsed,
    hiddenSideBar,
    mixSideFixed,
    collapsedShowTitle,
    siderHidden,
    menuWidth,
    menuFixed,
  } = useAppConfigStore(
    useShallow((state) => ({
      menuFixed: state.menuSetting.fixed,
      menuType: state.menuSetting.type,
      menuMode: state.menuSetting.mode,
      splitMenu: state.menuSetting.splitMenu,
      showSideBar: state.menuSetting.show,
      collapsed: state.menuSetting.collapsed,
      hiddenSideBar: state.menuSetting.hidden,
      mixSideFixed: state.menuSetting.mixSideFixed,
      collapsedShowTitle: state.menuSetting.collapsedShowTitle,
      siderHidden: state.menuSetting.siderHidden,
      menuWidth: state.menuSetting.menuWidth,
    })),
  )

  const [mixSideHasChildren,setMixSideHasChildren] = useState(false);

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
    return siderHidden
      ? 0
      : collapsedShowTitle
        ? SIDE_BAR_SHOW_TIT_MINI_WIDTH
        : SIDE_BAR_MINI_WIDTH;
  },[siderHidden,collapsedShowTitle])

  const getRealWidth = useDeepMemo(() => {
    if (getIsMixSidebar) {
      return collapsed && !mixSideFixed ? getMiniWidthNumber : menuWidth
    }
    return collapsed ? getMiniWidthNumber : menuWidth
  }, [getIsMixSidebar, collapsed, mixSideFixed, getMiniWidthNumber, menuWidth])

  const getCalcContentWidth = useDeepMemo(() => {
    // debugger
    // console.log("=========");
    
    // console.log('getIsTopMenu:', getIsTopMenu)
    // console.log('showSideBar:', showSideBar)
    // console.log('splitMenu:', splitMenu)
    // console.log('hiddenSideBar:', hiddenSideBar)
    // console.log('getIsMixSidebar:', getIsMixSidebar)
    // console.log('collapsed:', collapsed)
    // console.log('mixSideFixed:', mixSideFixed)
    // console.log('mixSideHasChildren:', mixSideHasChildren)
    // console.log('getRealWidth:', getRealWidth)
    
    const width =
      getIsTopMenu || !showSideBar || (splitMenu && hiddenSideBar)
        ? 0
        : getIsMixSidebar
          ? (collapsed ? SIDE_BAR_MINI_WIDTH : SIDE_BAR_SHOW_TIT_MINI_WIDTH) +
            (mixSideFixed && mixSideHasChildren ? getRealWidth : 0)
          : getRealWidth
    return `calc(100% - ${width}px)`
  }, [
    getIsTopMenu,
    showSideBar,
    splitMenu,
    hiddenSideBar,
    getIsMixSidebar,
    collapsed,
    mixSideFixed,
    mixSideHasChildren,
    getRealWidth,
  ])



  return {
    menuWidth,
    menuFixed,
    getIsSidebarType,
    getIsTopMenu,
    getIsMixSidebar,
    getIsMixMode,
    isMixSplitMenu,
    isSplitMenu: splitMenu,
    getCalcContentWidth,
    setMixSideHasChildren,
    getShowTopMenu,
    getRealWidth,
    hiddenSideBar,
  }
}