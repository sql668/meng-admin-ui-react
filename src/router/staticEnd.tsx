import Login from '@/views/login'
import Register from '@/views/register'
//import { IRoute } from './type'
import NotAuth from '@/views/403'
import NotFound from '@/views/errors/404'
import NotNotWork from '@/views/500'
import { CustomRouteConfig } from '@/types/route'

export const StaticRoute: CustomRouteConfig[] = [
  {
    index: false,
    path: '/login',
    element: <Login></Login>,
    handle: {
      title: '登录',
      fullPath: '/login',
    },
  },
  {
    path: '/register',
    element: <Register></Register>,
    handle: {
      title: '注册',
      fullPath: '/register',
    },
  },
  {
    path: '/403',
    element: <NotAuth></NotAuth>,
    handle: {
      title: '403',
      fullPath: '/403',
    },
  },
  {
    path: '/404',
    element: <NotFound></NotFound>,
    handle: {
      title: '404',
      fullPath: '/404',
    },
  },
  {
    path: '/500',
    element: <NotNotWork></NotNotWork>,
    handle: {
      title: '500',
      fullPath: '/500',
    },
  },
]
