import { useAppConfigStore } from "@/store/app"
import { useShallow } from "zustand/react/shallow"

function useRootSetting() { 
 const {
   getIsShowBreadCrumb,
   getIsShowBreadCrumbIcon,
   getIsMobile,
   getIsDisableMobile,
   getShowLogo,
   getAppName,
   getGlobalTheme,
   getFullContent,
 } = useAppConfigStore(
   useShallow((state) => ({
     getIsDisableMobile: state.rootSetting.disableMobile,
     getIsMobile: state.rootSetting.isMobile,
     getIsShowBreadCrumb: state.rootSetting.showBreadCrumb,
     getIsShowBreadCrumbIcon: state.rootSetting.showBreadCrumbIcon,
     getShowLogo: state.rootSetting.showLogo,
     getAppName: state.rootSetting.appName,
     getGlobalTheme: state.rootSetting.theme,
     getFullContent: state.rootSetting.fullContent,
   })),
 )
  
  
  return {
    getGlobalTheme,
    getAppName,
    getShowLogo,
    getIsMobile,
    getIsDisableMobile,
    getIsShowBreadCrumb,
    getIsShowBreadCrumbIcon,
    getFullContent,
  }
}

export default useRootSetting