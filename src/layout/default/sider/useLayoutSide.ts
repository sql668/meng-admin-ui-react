import { TriggerEnum } from '@/core/enums/menuEnum'
import { useMenuSetting } from '@/hooks/setting/useMenuSetting'
import useRootSetting from '@/hooks/setting/useRootSetting'
import { useMemo } from 'react'

export function useTrigger() {
  const { getTrigger, getSplitMenu } = useMenuSetting()
  const { getIsMobile } = useRootSetting()

  const getShowTrigger = useMemo(() => {
    return (
      getTrigger !== TriggerEnum.NONE &&
      !getIsMobile &&
      (getTrigger === TriggerEnum.FOOTER || getSplitMenu)
    )
  }, [getTrigger, getIsMobile, getSplitMenu])

  const getTriggerAttr = useMemo(() => {
    if (getShowTrigger) {
      return {}
    }
    return {
      trigger: null,
    }
  }, [])

  return { getTriggerAttr, getShowTrigger }
}
