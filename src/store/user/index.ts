import { createSelectors } from '@/utils/createSelector'
import { StateCreator, create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { devtools, subscribeWithSelector } from 'zustand/middleware'
import { UserInfo } from '@/api/common'
type TUserStoreState = {
  user: UserInfo | null
  roles: string[]
  permissions: string[]
  //setUser: (user: UserModel) => void;
  //clearUser: () => void;
  //summary: () => string;
}

// const initUser: UserModel = {
//   id: '1',
//   userName: 'admin',
//   nickName: '系统管理员',
//   phone: '18191411310',
//   email: 'admin@example.com',
//   birthday: '1990-01-01',
//   gender: '男',
//   address: '北京市朝阳区',
//   status: '0',
//   avatar: 'https://os.alipayobjects.com/rmsportal/UXamdIxYSkXfoVo.jpg',
// }
// export const useUserStore = createSelectors(
//   create<TUserStoreState>()(
//     devtools(
//       persist(
//         immer((set, get) => ({
//           user: initUser,
//           setUser: (user) => set(() => ({ user: user })),
//           clearUser: () => set(() => ({ user: null })),
//           summary: () => {
//             return get().user?.nickName || "未登录";
//           },
//         })),
//         {
//           name: "food-storage", // unique name
//           storage: createJSONStorage(() => sessionStorage),
//         }
//       ),
//       {
//         enabled: import.meta.env.VITE_APP_ENV === "development",// 只在开发模式启用devtools
//       }
//     )
//   )
// );
// export const useUserStore = create<TUserStoreState>()((set) => ({
//   user: initUser,
//   setUser: (user) => set(() => ({ user: user })),
//   clearUser: () => set(() => ({ user: null })),
// }));

const createUserSlice: StateCreator<
  TUserStoreState,
  [
    ['zustand/immer', never],
    ['zustand/devtools', unknown],
    ['zustand/subscribeWithSelector', never],
    //['zustand/persist', unknown],
  ]
> = () => ({
  user: null,
  roles: [],
  permissions: [],
})
export const useUserStore = createSelectors(
  create<TUserStoreState>()(
    immer(
      devtools(subscribeWithSelector(createUserSlice), {
        enabled: import.meta.env.VITE_APP_ENV === 'development', // 只在开发模式启用devtools
        name: 'user store',
      }),
    ),
  ),
)

export const setUser = (user: UserInfo) => {
  useUserStore.setState((state) => {
    state.user = user
  })
}

export const setRoles = (roles: string[]) => {
  useUserStore.setState((state) => {
    state.roles = roles
  })
}
export const setPermissions = (permissions: string[]) => {
  useUserStore.setState((state) => {
    state.permissions = permissions
  })
}
export const clearUser = () => {
  useUserStore.setState(() => null)
}
export const summary = () => {
  return useUserStore.getState().user?.nickName || '未登录'
}

export const roles = () => {
  return useUserStore.getState().roles
}

export const permissions = () => {
  return useUserStore.getState().permissions
}
