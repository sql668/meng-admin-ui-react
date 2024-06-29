import { createSelectors } from '@/utils/createSelector'
import { StateCreator, create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { devtools, subscribeWithSelector } from 'zustand/middleware'
import { RouterVo } from '@/types/model'
import { MenuDataItem } from '@/types/menu'
import { DeepPartial } from '@/utils/type'
import { deepMerge } from '@/utils/util'
type RouterStoreState = {
  // getRoutersApi接口返回的路由信息
  allRouters: RouterVo[]
  menuData: MenuDataItem[]
  matchMenus: MenuDataItem[]
  matchMenuKeys: Array<string>
}
const createPermissionSlice: StateCreator<
  RouterStoreState,
  [
    ['zustand/immer', never],
    ['zustand/devtools', unknown],
    ['zustand/subscribeWithSelector', never],
  ]
> = () => ({
  allRouters: [],
  menuData: [],
  matchMenus: [],
  matchMenuKeys: [],
})
export const useRouterStore = createSelectors(
  create<RouterStoreState>()(
    immer(
      devtools(subscribeWithSelector(createPermissionSlice), {
        enabled: import.meta.env.VITE_APP_ENV === 'development', // 只在开发模式启用devtools
        name: 'routers store',
      }),
    ),
  ),
)

export const setRouters = (routers: RouterVo[]) => {
  useRouterStore.setState((state) => {
    state.allRouters = routers
  })
}

export const setMenuData = (menu: MenuDataItem[]) => {
  useRouterStore.setState((state) => {
    state.menuData = menu
  })
}

export const setMatchMenuData = (menu: MenuDataItem[]) => {
  useRouterStore.setState((state) => {
    state.matchMenus = menu
  })
}

export const setMatchMenuKeys = (keys: string[]) => {
  useRouterStore.setState((state) => {
    state.matchMenuKeys = keys
  })
}

export const setRouterStoreState = (newState: DeepPartial<RouterStoreState>) => {
  useRouterStore.setState((state) => {
    state = deepMerge(state, newState)
  })
}
