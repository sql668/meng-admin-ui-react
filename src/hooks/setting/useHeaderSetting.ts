import { useAppConfigStore } from '@/store/app'
import { useMemo } from 'react'
import { useShallow } from 'zustand/react/shallow'
import { useMenuSetting } from './useMenuSetting'
import { MenuModeEnum } from '@/core/enums/menuEnum'
import useRootSetting from './useRootSetting'
import useFullContent from '../useFullContent'

export function useHeaderSetting() {
  const { getHeaderFixed, getShowHeader, getHeaderTheme, getHeaderBgColor } = useAppConfigStore(
    useShallow((state) => ({
      getHeaderFixed: state.headerSetting.fixed,
      getShowHeader: state.headerSetting.show,
      getHeaderTheme: state.headerSetting.theme,
      getHeaderBgColor: state.headerSetting.bgColor,
    })),
  )

  const { getFullContent } = useFullContent()

  const {
    getIsSidebarType,
    getIsTopMenu,
    getIsMixSidebar,
    getMenuMode,
    getSplitMenu,
    getShowHeaderTrigger,
  } = useMenuSetting()
  const { getIsShowBreadCrumb, getShowLogo } = useRootSetting()

  const getShowMixHeaderRef = useMemo(() => {
    return !getIsSidebarType && getShowHeader
  }, [])

  const getShowFullHeaderRef = useMemo(() => {
    return getShowMixHeaderRef && getShowHeader && !getIsTopMenu && !getIsMixSidebar
  }, [getShowMixHeaderRef, getShowHeader, getIsTopMenu, getIsMixSidebar])

  const getShowBread = useMemo(() => {
    return getMenuMode !== MenuModeEnum.HORIZONTAL && getIsShowBreadCrumb && !getSplitMenu
  }, [getMenuMode, getIsShowBreadCrumb, getSplitMenu])

  const getShowContent = useMemo(() => {
    return getShowBread || getShowHeaderTrigger
  }, [getShowBread, getShowHeaderTrigger])

  const getShowInsetHeaderRef = useMemo(() => {
    const need = !getFullContent && getShowHeader
    return (need && !getShowMixHeaderRef) || (need && getIsTopMenu) || (need && getIsMixSidebar)
  }, [getFullContent, getShowHeader, getShowMixHeaderRef, getIsTopMenu, getIsMixSidebar])

  const getShowHeaderLogo = getShowLogo && !getIsSidebarType && !getIsMixSidebar

  return {
    getHeaderFixed,
    getShowFullHeaderRef,
    getHeaderTheme,
    getShowContent,
    getHeaderBgColor,
    getShowHeader,
    getShowInsetHeaderRef,
    getShowHeaderLogo,
  }
}
