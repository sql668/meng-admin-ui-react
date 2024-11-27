export interface MxAppProviderProps {
  prefixCls: string
}

export interface MxAppConfigProviderProps {
  prefixCls?: string
  children?: React.ReactNode
}

export interface ProviderChildrenProps extends MxAppConfigProviderProps {
  parentContext: MxAppConfigConsumerProps
}

export interface MxAppConfigConsumerProps {
  getPrefixCls: (suffixCls?: string) => string
}
