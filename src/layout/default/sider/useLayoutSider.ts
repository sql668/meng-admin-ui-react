import { useMenuSetting } from '@/hooks/setting/useMenuSetting'
import { setMenuSetting } from '@/store/app'

export function useSiderEvent() {
  const { getMiniWidthNumber } = useMenuSetting()

  const getCollapsedWidth = getMiniWidthNumber

  function onBreakpointChange(broken: boolean) {
    setMenuSetting({
      siderHidden: broken,
    })
  }

  return { getCollapsedWidth, onBreakpointChange }
}
