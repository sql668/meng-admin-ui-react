import { createContext, useContext } from 'react'
import { MxAppConfigConsumerProps } from './type'

const defaultGetPrefixCls = (suffixCls?: string) => {
  return suffixCls ? `mx-${suffixCls}` : 'mx'
}

export const MxAppConfigContext = createContext<MxAppConfigConsumerProps>({
  getPrefixCls: defaultGetPrefixCls,
})
//console.log(MxAppConfigContext)

export const useAppConfigContext = () => {
  return useContext(MxAppConfigContext)
}

export const { Consumer: MxAppConfigConsumer } = MxAppConfigContext
