//import { RouteObject } from './type'
import MengLayout from '@/layouts'
import { StaticRoute } from './staticEnd'
import NotFound from '@/views/errors/404'
import { asyncRouter } from './asyncRoute'
import { CustomRouteConfig } from '@/types/route'
const routerData: CustomRouteConfig[] = [
  {
    path: '/',
    element: <MengLayout></MengLayout>,
    //meta: {},
    children: [...asyncRouter],
  },
  ...StaticRoute,
  {
    path: '*',
    element: <NotFound></NotFound>,
    //meta: {},
  },
]

//console.log(modules)

// const routes = Object.entries(modules).map(([path, page]) => {
//   console.log(path)

//   const componentName = path?.split('/')?.pop()?.replace(/.tsx$/, '')
//   console.log(componentName)

//   const routePath = componentName === 'Home' ? '/' : `/${componentName?.toLowerCase()}`
//   const Component = lazy(page as any)
//   return {
//     path: routePath,
//     component: Component,
//   }
// })
// console.log(routes)

//console.log(modules)

//export const frontEndRoutes = generateRoute(routerData)
export const frontEndRoutes = routerData
