import { useCallback, useContext, useEffect, useRef } from "react"
import { MxAppConfigContext } from "./context"
import { MxAppConfigConsumerProps, MxAppConfigProviderProps, ProviderChildrenProps } from "./type"
import useMemo from "@/hooks/useMemo"
import { useBreakpoint } from "@/hooks/useBreakpoint"
import useRootSetting from "@/hooks/setting/useRootSetting"
import { getBeforeminiInfoSetting, getMenuSetting, setBeforeMiniInfo, setMenuSetting, setRootSetting } from "@/store/app"
import { MenuModeEnum, MenuTypeEnum } from "@/core/enums/menuEnum"


const ProviderChildren: React.FC<ProviderChildrenProps> = (props) => {
  const { parentContext, children } = props
  const isSetState = useRef(false)
  const { getIsDisableMobile} = useRootSetting()
  const getPrefixCls = useCallback(
    (suffixCls?: string) => {
      const { prefixCls } = props
      const mergedPrefixCls = prefixCls || parentContext.getPrefixCls('')
      return suffixCls ? `${mergedPrefixCls}-${suffixCls}` : mergedPrefixCls
    },
    [parentContext.getPrefixCls, props.prefixCls],
  )

  // const { menuType, menuMode, menuCollapsed, menuSplit } = useAppConfigStore(
  //   useShallow((state) => ({
  //     menuType: state.menuSetting.type,
  //     menuMode: state.menuSetting.mode,
  //     menuSplit: state.menuSetting.splitMenu,
  //     menuCollapsed: state.menuSetting.collapsed,
  //   })),
  // )
  // const { menuMode:beforeMenuMode, menuCollapsed:beforeMenuCollapsed, menuType:beforeMenuType, menuSplit:beforeMenuSplit } = useAppConfigStore.use.beforeMiniInfo()

  const colSize = useBreakpoint()
  useEffect(() => {
    if ((colSize === 'xs' || colSize === 'sm' || colSize === 'md') && !getIsDisableMobile) {
      setRootSetting({ isMobile: true })
      handleRestoreState(true)
    } else {
      setRootSetting({ isMobile: false })
      handleRestoreState(false)
    }
  }, [getIsDisableMobile, colSize])

  const handleRestoreState = (isMobile:boolean) => {
    if (isMobile && !isSetState.current) {
      isSetState.current = true
      const { type: menuType, mode: menuMode, collapsed: menuCollapsed, splitMenu: menuSplit } = getMenuSetting()
      //console.log({ menuMode, menuCollapsed, menuType, menuSplit })
      
      setMenuSetting({
        splitMenu: false,
        type: MenuTypeEnum.SIDEBAR,
        mode: MenuModeEnum.INLINE,
      })
      setBeforeMiniInfo({ menuMode, menuCollapsed, menuType, menuSplit })
    } else if (!isMobile && isSetState.current) {
      isSetState.current = false
      const {
        menuMode: beforeMenuMode,
        menuCollapsed: beforeMenuCollapsed,
        menuType: beforeMenuType,
        menuSplit: beforeMenuSplit,
      } = getBeforeminiInfoSetting()
      setMenuSetting({
        splitMenu: beforeMenuSplit,
        type: beforeMenuType,
        mode: beforeMenuMode,
        collapsed: beforeMenuCollapsed,
      })
    }
  }

  const config: MxAppConfigConsumerProps = {
    ...parentContext,
    getPrefixCls,
  }
    

  const memoedConfig = useMemo(
    () => config || {},
    [config],
  )
  

  let childNode = (
    <>
      {children}
    </>
  )

  return <MxAppConfigContext.Provider value={memoedConfig as any}>{childNode}</MxAppConfigContext.Provider>

}



const MxAppConfigProvider: React.FC<MxAppConfigProviderProps> & {
  ConfigContext: typeof MxAppConfigContext
} = (props) => {
  const context = useContext<MxAppConfigConsumerProps>(MxAppConfigContext)
  return <ProviderChildren parentContext={context} {...props} />
}

MxAppConfigProvider.ConfigContext = MxAppConfigContext

if (process.env.NODE_ENV !== 'production') {
  MxAppConfigProvider.displayName = 'MxAppConfigProvider'
}

export default MxAppConfigProvider