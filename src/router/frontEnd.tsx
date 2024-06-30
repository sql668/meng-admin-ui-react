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


export const frontEndRoutes = routerData
