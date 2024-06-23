import { getHeaderConfig, useAppConfigStore } from "@/store/app";
import { useMemo } from "react";
import { useShallow } from "zustand/react/shallow";
import { useMenuSetting } from "./useMenuSetting";

export function useHeaderSetting() { 
  const { isHeaderFixed, isShowHeader } = useAppConfigStore(
    useShallow((state) => ({
      isHeaderFixed: state.headerSeting.fixed,
      isShowHeader: state.headerSeting.show,
    })),
  )

  const { getIsSidebarType,getIsTopMenu,getIsMixSidebar } = useMenuSetting()

  const getShowMixHeaderRef = useMemo(() => { 
    return !getIsSidebarType && isShowHeader
  },[])

  const getShowFullHeaderRef = useMemo(() => {
    return getShowMixHeaderRef && isShowHeader && !getIsTopMenu && !getIsMixSidebar
  }, [getShowMixHeaderRef, isShowHeader, getIsTopMenu, getIsMixSidebar])
  return {
    isHeaderFixed,
    getShowFullHeaderRef,
  }
}