import { LayoutMode } from '@/types/theme'
import { createSelectors } from '@/utils/createSelector'
import { ThemeMode } from 'antd-style'
import { StateCreator, create } from 'zustand'
import { devtools, persist, subscribeWithSelector } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

export type ThemeStoreState = {
  layout: LayoutMode
  splitMenus: boolean // 是否切割菜单 只在混合模式下生效
  themeMode: ThemeMode //'light' | 'dark' | 'auto' // 主题模式 light: 浅色模式 dark: 深色模式 auto: 自动模式
  enableTagsView: boolean //是否开启tagsview
}

const createThemeSlice: StateCreator<
  ThemeStoreState,
  [
    ['zustand/immer', never],
    ['zustand/devtools', unknown],
    ['zustand/subscribeWithSelector', never],
    ['zustand/persist', unknown],
  ]
> = () => ({
  themeMode: 'auto',
  layout: 'mix',
  splitMenus: false,
  enableTagsView: true,
})

export const useThemeStore = createSelectors(
  create<ThemeStoreState>()(
    immer(
      devtools(
        subscribeWithSelector(
          persist(createThemeSlice, {
            name: 'theme-storage', // unique name
          }),
        ),
        {
          enabled: import.meta.env.VITE_APP_ENV === 'development', // 只在开发模式启用devtools
          name: 'theme store',
        },
      ),
    ),
  ),
)
// type K = keyof ThemeStoreState
// export const setThemeItem = (key: K, value: string) => {
//   console.log(useThemeStore.getState())
//   if (key) {
//     useThemeStore.setState((state) => {
//       state. = value
//     })
//   }
// }

export const setSplite = (v: boolean) => {
  useThemeStore.setState((state) => {
    state.splitMenus = v
  })
}
