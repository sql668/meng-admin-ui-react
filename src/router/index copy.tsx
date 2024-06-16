// import { createBrowserRouter } from 'react-router-dom'
// import { CustomRouteConfig } from './type'
// import { Suspense, lazy } from 'react'
// import { KeepAlive } from 'react-activation'
// import { Spin } from 'antd'
// import NotFound from '@/views/404'
// import Login from '@/views/login'
// import Register from '@/views/register'
// import Layouts from '@/layouts'
// import Home from '@/views/home'

// const lazyLoad = (Component: React.LazyExoticComponent<any>): React.ReactNode => (
//   <Suspense fallback={<Spin />}>
//     <Component />
//   </Suspense>
// )

// const routerData: CustomRouteConfig[] = [
//   {
//     path: '/',
//     element: <Layouts></Layouts>,
//     children: [
//       {
//         index: true,
//         path: 'home',
//         element: <Home></Home>,
//       },
//       {
//         path: 'system',
//         children: [
//           {
//             index: true,
//             path: 'user',
//             element: (
//               <KeepAlive cacheKey='/system/user'>
//                 {lazyLoad(lazy(() => import('../views/system/user/index')))}
//               </KeepAlive>
//             ),
//           },
//           {
//             path: 'menu',
//             title: '菜单管理',
//             element: (
//               <KeepAlive cacheKey='/system/menu'>
//                 {lazyLoad(lazy(() => import('../views/system/menu/index')))}
//               </KeepAlive>
//             ),
//             meta: {
//               title: '菜单管理',
//             },
//           },
//         ],
//       },
//     ],
//   },
//   {
//     index: false,
//     path: 'login',
//     element: <Login></Login>,
//     meta: {
//       title: '登录',
//     },
//   },
//   {
//     path: 'register',
//     element: <Register></Register>,
//   },
//   {
//     path: '*',
//     element: <NotFound></NotFound>,
//   },
// ]

// const getFullPath = (root: CustomRouteConfig[], parent?: CustomRouteConfig) => {
//   for (let i = 0; i < root.length; i++) {
//     if (root[i].path !== '*') {
//       let fullpath = ''
//       if (parent) {
//         fullpath =
//           parent.fullPath === '/' ? `/${root[i].path}` : `${parent.fullPath}/${root[i].path}`
//       } else {
//         fullpath = root[i].path.startsWith('/') ? root[i].path : '/' + root[i].path
//       }
//       root[i].fullPath = fullpath
//       if (root[i].children?.length) {
//         getFullPath(root[i].children || [], root[i])
//       }
//     }
//   }
//   return root
// }

// // 常用的路由，常量
// export const HOME_PATHNAME = '/'
// export const LOGIN_PATHNAME = '/login'
// export const REGISTER_PATHNAME = '/register'

// export const rootRouteData = getFullPath(routerData)

// const router = createBrowserRouter(rootRouteData)

// export default router
