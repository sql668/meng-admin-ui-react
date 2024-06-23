import { useCallback, useContext } from "react"
import { MxAppConfigContext } from "./context"
import { MxAppConfigConsumerProps, MxAppConfigProviderProps, ProviderChildrenProps } from "./type"
import useMemo from "@/hooks/useMemo"


const ProviderChildren: React.FC<ProviderChildrenProps> = (props) => {
  const { parentContext,children } = props
  const getPrefixCls = useCallback(
    (suffixCls?: string) => {
      const { prefixCls } = props
      const mergedPrefixCls = prefixCls || parentContext.getPrefixCls('')
      return suffixCls ? `${mergedPrefixCls}-${suffixCls}` : mergedPrefixCls
    },
    [parentContext.getPrefixCls, props.prefixCls],
  )

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

  return <MxAppConfigContext.Provider value={memoedConfig!}>{childNode}</MxAppConfigContext.Provider>

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