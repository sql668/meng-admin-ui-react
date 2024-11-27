import { ThemeEnum } from '@/core/enums/appEnum'
import {
  HeaderSettingDefault,
  MenuSettingDefault,
  MultiTabsSettingDefault,
  RootSettingDEfault,
} from '@/core/settings/appSetting'
import {
  BeforeMiniState,
  HeaderSetting,
  MenuSetting,
  MultiTabsSetting,
  RootSetting,
} from '@/types/app'
import { createSelectors } from '@/utils/createSelector'
import { DeepPartial } from '@/utils/type'
import { deepMerge } from '@/utils/util'
import { StateCreator, create } from 'zustand'
import { devtools, persist, subscribeWithSelector } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

interface AppStoreState {
  //isMobile: boolean
  // theme: ThemeEnum
  // 菜单相关
  menuSetting: MenuSetting
  headerSetting: HeaderSetting
  multiTabsSetting: MultiTabsSetting
  rootSetting: RootSetting
  beforeMiniInfo: BeforeMiniState
}

const createAppSlice: StateCreator<
  AppStoreState,
  [
    ['zustand/immer', never],
    ['zustand/devtools', unknown],
    ['zustand/subscribeWithSelector', never],
    ['zustand/persist', unknown],
  ]
> = () => ({
  isMobile: false,
  theme: ThemeEnum.DARK,
  menuSetting: MenuSettingDefault,
  headerSetting: HeaderSettingDefault,
  multiTabsSetting: MultiTabsSettingDefault,
  rootSetting: RootSettingDEfault,
  beforeMiniInfo: {},
})

export const useAppConfigStore = createSelectors(
  create<AppStoreState>()(
    immer(
      devtools(
        subscribeWithSelector(
          persist(createAppSlice, {
            name: 'app-storage', // unique name
          }),
        ),
        {
          enabled: import.meta.env.VITE_APP_ENV === 'development', // 只在开发模式启用devtools
          name: 'app store',
        },
      ),
    ),
  ),
)

export const setHeaderSetting = (config: DeepPartial<HeaderSetting>) => {
  useAppConfigStore.setState((state) => {
    state.headerSetting = deepMerge(state.headerSetting || {}, config) as any
  })
}

export const setMenuSetting = (config: DeepPartial<MenuSetting>) => {
  useAppConfigStore.setState((state) => {
    state.menuSetting = deepMerge(state.menuSetting || {}, config) as any
  })
}
export const setMultipleTabsSetting = (config: DeepPartial<MultiTabsSetting>) => {
  useAppConfigStore.setState((state) => {
    state.multiTabsSetting = deepMerge(state.multiTabsSetting || {}, config) as any
  })
}

export const setRootSetting = (config: DeepPartial<RootSetting>) => {
  useAppConfigStore.setState((state) => {
    state.rootSetting = deepMerge(state.rootSetting, config)
  })
}

export const setBeforeMiniInfo = (config: BeforeMiniState) => {
  useAppConfigStore.setState((state) => {
    state.beforeMiniInfo = config
  })
}

//export const setGlobalTheme = (mode: ThemeEnum) => { useAppConfigStore.setState((state) => state.theme = mode) }
// export const setGlobalTheme = (mode: ThemeEnum) => {
//   useAppConfigStore.setState((state) => {
//     state.theme = mode
//   })
// }

// export const setMobile = (isMobile:boolean) => {
// useAppConfigStore.setState((state) => {
//   state.isMobile = isMobile
// })
// }

//export const getHeaderConfig = () => useAppConfigStore.getState().headerSeting

export const getMenuSetting = () => useAppConfigStore.getState().menuSetting
export const getBeforeminiInfoSetting = () => useAppConfigStore.getState().beforeMiniInfo

// 注意： 这种写法 当state更新时，外部组件无法监听到
//export const getGlobalTheme = () => useAppConfigStore.getState().theme
