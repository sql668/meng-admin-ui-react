import { RouteObject, useLocation, useNavigate } from 'react-router-dom'
import { LOGIN_PATHNAME, TOKEN } from '@/config/config'
import { useEffect } from 'react'
//import { getActivedRoute } from '@/utils/route'
import { Session } from '@/utils/storage'
import { permissions, useUserStore } from '@/store/user'
import { getInfoApi } from '@/api/common'
import { replaceRoutes, router } from '@/router/baseRouter'
import NotFound from '@/views/errors/404'
import { getRoutersApi } from '@/api/system/menu'
import { LoadView } from '@/router'
//import MengLayout from '@/layouts'
import MengLayout from '@/layout'
import { setPermissionRouters } from '@/store/permission'
import { RedirectView } from '@/views/redirect'
import { setDefaultTag } from '@/store/tagsView'
//import { NoLayout } from '@/layouts/noLayout'
import { RouterVo } from '@/types/model/routerVo'
//import { NoLayout } from '@/layout/page'
import { setRouters } from '@/store/router'
const whiteList = ['/login', '/register']

const handleElement = (data: RouterVo[]) => {
  const result: RouteObject[] = []
  for (let i = 0; i < data.length; i++) {
    if (data[i].handle.hasLayout && !data[i].path.includes('/noLayout')) {
      const r: RouteObject = {
        path: `${data[i].path}`,
        element: LoadView(data[i]),
        id: `${data[i].path}`,
        handle: data[i].handle,
      }
      if (data[i].children && data[i].children!.length > 0) {
        r.children = handleElement(data[i].children!)
      }
      result.push(r)
    }
  }
  return result
}

const handleNoLayoutElement = (data: RouterVo[]) => {
  const result: RouteObject[] = []
  for (let i = 0; i < data.length; i++) {
    // !data[i].handle.hasLayout && data[i].path.includes('/noLayout')
    if (!data[i].handle.hasLayout) {
      const r: RouteObject = {
        path: `${data[i].path}`,
        element: LoadView(data[i]),
        id: `${data[i].path}`,
        handle: data[i].handle,
      }
      if (data[i].children && data[i].children!.length > 0) {
        r.children = handleNoLayoutElement(data[i].children!)
      }
      result.push(r)
    }
    if (data[i].children && data[i].children!.length > 0) {
      result.push(...handleNoLayoutElement(data[i].children!))
    }
  }
  return result
}

/**
 * 路由守卫
 * @param props
 * @returns
 */
export default function AuthRouter(props: { children: JSX.Element }) {
  const nav = useNavigate()
  const { pathname } = useLocation()
  useEffect(() => {
    if (!Session.get(TOKEN)) {
      if (whiteList.indexOf(pathname) === -1) {
        // 没有用户信息并且不在白名单中，重定向到登录页面
        nav(`${LOGIN_PATHNAME}?redirect=${encodeURIComponent(pathname)}`)
      }
    } else {
      if (
        (pathname !== LOGIN_PATHNAME || whiteList.indexOf(pathname) === -1) &&
        permissions().length === 0
      ) {
        getInfoApi().then((res) => {
          if (res.code === 0) {
            useUserStore.setState({
              user: res.data?.user,
              roles: res.data?.roles,
              permissions: res.data?.permissions,
            })
            if (res.data?.user.role.defaultRouter) {
              // 设置首页地址
              setDefaultTag(res.data?.user.role.defaultRouter)
            }

            getRoutersApi().then((res) => {
              if (res.code === 0) {
                setPermissionRouters(res.data || [])
                setRouters(res.data || [])

                const routers = handleElement(res.data || [])
                //console.log(res.data)
                const nolayout = handleNoLayoutElement(res.data || [])

                replaceRoutes('*', [
                  // {
                  //   id: '/noLayout',
                  //   path: '/noLayout',
                  //   element: <NoLayout></NoLayout>,
                  //   children: [...nolayout],
                  // },
                  ...nolayout,
                  {
                    id: '/',
                    path: '/',
                    element: <MengLayout></MengLayout>,
                    children: [
                      {
                        id: '/redirect',
                        path: '/redirect/*',
                        element: <RedirectView></RedirectView>,
                        handle: {
                          title: 'redirect',
                          fullPath: '/redirect',
                        },
                      },
                      ...routers,
                    ],
                  },

                  {
                    id: '*',
                    path: '*',
                    element: <NotFound></NotFound>,
                    handle: {
                      path: '404',
                      name: '404',
                      title: '404',
                    },
                  },
                ])
                const path = `${location.pathname}${location.search}`

                console.log(router.routes)
                //const repath = path.replace(import.meta.env.VITE_BASE_URL, '/')
                // replace一下当前路由，为了触发路由匹配
                router.navigate(path.replace(import.meta.env.VITE_BASE_URL, '/'), { replace: true })
              }
            })
          }
        })
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])
  return props.children
}
