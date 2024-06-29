import { MenuTypeEnum } from '@/core/enums/menuEnum'
import { HandlerEnum } from './enums'
import { setMenuSetting, useAppConfigStore } from '@/store/app'

export default function useSettingHandle() {
  const menuSetting = useAppConfigStore.use.menuSetting()

  const baseHandler = (event: HandlerEnum, value: any) => {
    switch (event) {
      case HandlerEnum.CHANGE_LAYOUT:
        const { mode, type, split } = value
        const isMixSidebar = type === MenuTypeEnum.MIX
        const mixSideSplitOpt =
          menuSetting.type === MenuTypeEnum.MIX
            ? { splitMenu: menuSetting.splitMenu }
            : { splitMenu: split }
        const otherSplitOpt = { splitMenu: false }
        const splitOpt = isMixSidebar ? mixSideSplitOpt : otherSplitOpt

        setMenuSetting({
          mode,
          type,
          collapsed: false,
          show: true,
          hidden: false,
          ...splitOpt,
        })
        break
      case HandlerEnum.MENU_SPLIT:
        setMenuSetting({ splitMenu: value }) 
        break
    }
  }

  return baseHandler
}


export function handler(event: HandlerEnum, value: any) {
  const menuSetting = useAppConfigStore.use.menuSetting()
  switch (event) {
    case HandlerEnum.CHANGE_LAYOUT:

      const { mode, type, split } = value
      const isMixSidebar = type === MenuTypeEnum.MIX
      const mixSideSplitOpt =
        menuSetting.type === MenuTypeEnum.MIX
          ? { splitMenu: menuSetting.splitMenu }
          : { splitMenu: split }
      const otherSplitOpt = { splitMenu: false }
      const splitOpt = isMixSidebar ? mixSideSplitOpt : otherSplitOpt

      setMenuSetting({
        mode,
        type,
        collapsed: false,
        show: true,
        hidden: false,
        ...splitOpt,
      })
  }
}
