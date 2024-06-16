import { createSelectors } from '@/utils/createSelector'
import { StateCreator, create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { devtools, subscribeWithSelector } from 'zustand/middleware'
import { RouterVo } from '@/types/model'
type TPermissionStoreState = {
  routes: RouterVo[]
}
const createPermissionSlice: StateCreator<
  TPermissionStoreState,
  [
    ['zustand/immer', never],
    ['zustand/devtools', unknown],
    ['zustand/subscribeWithSelector', never],
    //['zustand/persist', unknown],
  ]
> = () => ({
  routes: [],
})
export const usePermissionStore = createSelectors(
  create<TPermissionStoreState>()(
    immer(
      devtools(subscribeWithSelector(createPermissionSlice), {
        enabled: import.meta.env.VITE_APP_ENV === 'development', // 只在开发模式启用devtools
        name: 'permission store',
      }),
    ),
  ),
)

export const setPermissionRouters = (routers: RouterVo[]) => {
  usePermissionStore.setState((state) => {
    state.routes = routers
  })
}

export const getPermissionRouters = () => {
  return usePermissionStore.getState().routes
}
