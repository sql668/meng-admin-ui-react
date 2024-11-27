import { useAppConfigContext } from '@/components/application/context'

export function useDesign(scope: string) {
  const values = useAppConfigContext()
  return {
    prefixCls: `${values.getPrefixCls()}-${scope}`,
    prefixVar: values.getPrefixCls(),
  }
}
