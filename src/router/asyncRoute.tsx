import Home from '@/views/home'
import KeepAlive from 'react-activation'
import { lazy } from 'react'
import LazyLoad from '@/components/lazy'
import { CustomRouteConfig } from '@/types/route'

const originRoute: CustomRouteConfig[] = [
  {
    path: '/home',
    element: <Home></Home>,
    handle: {
      title: '首页',
      component: '/views/home/index',
    },
  },

  {
    path: '/system',
    handle: { title: '系统管理', icon: 'mx-icon-shezhi1', redirect: '/system/user' },
    children: [
      {
        path: '/system/user',
        handle: {
          title: '用户管理',
          icon: 'mx-icon-moban',
          component: '/views/system/user/index',
        },
      },
      {
        path: '/system/menu',
        handle: {
          title: '菜单管理',
          icon: 'mx-icon-caidan',
          component: '/views/system/menu/index',
        },
      },
      {
        path: '/system/role',
        handle: {
          title: '角色管理',
          icon: 'mx-icon-caidan',
          component: '/views/system/role/index',
        },
      },
      {
        path: '/system/dept',
        handle: {
          title: '部门管理',
          icon: 'mx-icon-caidan',
          component: '/views/system/dept/index',
        },
      },
    ],
  },
  {
    path: '/menu',
    handle: { title: '菜单嵌套', redirect: '/menu/menu1/menu11' },
    children: [
      {
        path: '/menu/menu1',
        handle: { title: 'menu1', icon: 'mx-icon-caidan' },
        children: [
          {
            path: '/menu/menu1/menu11',
            //icon: 'CrownFilled',
            handle: {
              title: 'menu11',
              component: '/views/menu/menu1/menu11/index',
              icon: 'CrownFilled',
            },
          },
          {
            path: '/menu/menu1/menu12',
            handle: { title: 'menu12' },
            children: [
              {
                path: '/menu/menu1/menu12/menu121',
                handle: { title: 'menu121', component: '/views/menu/menu1/menu12/menu121/index' },
              },
              {
                path: '/menu/menu1/menu12/menu122',
                handle: { title: 'menu122', component: '/views/menu/menu1/menu12/menu122/index' },
              },
            ],
          },
          {
            path: '/menu/menu1/menu13',
            handle: { title: 'menu13', component: '/views/menu/menu1/menu13/index' },
          },
        ],
      },
    ],
  },
]

const generateRoute = (root: CustomRouteConfig[]) => {
  for (let i = 0; i < root.length; i++) {
    if (root[i].path !== '*') {
      // let fullPath = ''
      // if (parent) {
      //   fullPath =
      //     parent.meta?.fullPath === '/'
      //       ? `/${root[i].path}`
      //       : `${parent.meta.fullPath}/${root[i].path}`
      // } else {
      //   fullPath = root[i].path.startsWith('/') ? root[i].path : '/' + root[i].path
      // }
      // root[i].meta.fullPath = fullPath
      if (!root[i].element && root[i].handle.component) {
        root[i].element = <LoadView path={root[i].handle.component!}></LoadView>
      }
      if (root[i].children?.length) {
        generateRoute(root[i].children!)
      }
    }
  }
  return root
}
const modules = import.meta.glob('@/views/**/*/index.tsx')

const LoadView = (props: { path: string }) => {
  return (
    <KeepAlive cacheKey={props.path}>
      {LazyLoad(lazy(modules[`/src${props.path}.tsx`] as any))}
    </KeepAlive>
  )
}

export const asyncRouter = generateRoute(originRoute)
