
//import MengLayout from '@/layouts'
import MengLayout from '@/layout'
//import { CustomRouteConfig } from '@/types/route'
import NotAuth from '@/views/403'
import NotFound from '@/views/errors/404'
import NotNotWork from '@/views/500'
//import Home from '@/views/home'
import Login from '@/views/login'
import Register from '@/views/register'
import { Navigate, RouteObject, createBrowserRouter } from 'react-router-dom'
import RouterErrorElement from '@/views/router-error-element'
import { RouterVo } from '@/types/model'
import CreatedForm from "@/views/tool/form/views/edit"
export const StaticRoute: RouteObject[] = [
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
    path: '/form-created',
    element: <CreatedForm></CreatedForm>,
    handle: {
      title: '表单测试',
      fullPath: '/form-created',
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

export const routerData: RouteObject[] = [
  {
    path: '/',
    element: <Navigate to='/redirect' replace />,
  },
  ...StaticRoute,
  {
    path: '*',
    //element: <NotFound></NotFound>,
    element: <MengLayout></MengLayout>,
    errorElement: <RouterErrorElement></RouterErrorElement>,
  },
]

// @ts-ignore
export const router = createBrowserRouter(routerData, {
  basename: import.meta.env.VITE_BASE_URL,
}) as any

function findNodeByPath(routes: RouteObject[], path: string) {
  for (let i = 0; i < routes.length; i += 1) {
    const element = routes[i]

    if (element.path === path) return element

    findNodeByPath(element.children || [], path)
  }
}

export const addRoutes = (parentPath: string, routes: RouteObject[]) => {
  if (!parentPath) {
    router.routes.push(...(routes as any))
    return
  }

  const curNode = findNodeByPath(router.routes, parentPath)

  if (curNode?.children) {
    curNode?.children.push(...routes)
  } else if (curNode) {
    curNode.children = routes
  }
}

export const replaceRoutes = (parentPath: string, routes: RouteObject[]) => {
  if (!parentPath) {
    router.routes.push(...(routes as any))
    return
  }

  const curNode = findNodeByPath(router.routes, parentPath)

  if (curNode) {
    router.routes.splice(router.routes.indexOf(curNode as any), 1, ...(routes as any))
    //curNode.children = routes
  }
}

export const restRoutes = (routes: RouteObject[]) => {
  router.routes.splice(0, router.routes.length, ...(routes as any))
}

export const staticRouteData: RouterVo[] = StaticRoute.map((item) => {
  return {
    path: item.path!,
    handle: item.handle
  }
})
