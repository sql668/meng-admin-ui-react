import { RouterVo } from '@/types/model'
import { isUrl, stripQueryStringAndHashFromPath } from './util'
import { pathToRegexp } from 'path-to-regexp'
import { warning } from '@fdesign/util'
/**
 * @description 获取需要展开的 subMenu
 * @param {String} path 当前访问地址
 * @returns array
 */
export const getOpenKeys = (path: string) => {
  let newStr: string = ''
  const newArr: any[] = []
  const arr = path.split('/').map((i) => '/' + i)
  for (let i = 1; i < arr.length - 1; i++) {
    newStr += arr[i]
    newArr.push(newStr)
  }
  return newArr
}

export const getMatchRoute = (
  pathname: string,
  routes: RouterVo[],
  fullPath?: boolean,
  exact?: boolean,
) => {
  const flatRoutes = getFlatRoute(routes)
  const flatRoutesPath = Object.keys(flatRoutes)
  
  let routePathKeys = getRouteMatches(flatRoutesPath, pathname || '/', exact)
  if (!routePathKeys || routePathKeys.length < 1) {
    return []
  }
  if (!fullPath) {
    routePathKeys = [routePathKeys[routePathKeys.length - 1]]
  }

  const result = routePathKeys
    .map((routePath) => {
      const routeItem = flatRoutes[routePath] || {
        key: '',
        path:"",
        handle: {
          title: "",
          parentPaths: [],
        },
      }
      // 去重
      const map = new Map()
      const parentItems = (routeItem.handle.parentPaths || [])
        .map((key) => {
          if (map.has(key)) {
            return null
          }
          map.set(key, true)
          return flatRoutes[key]
        })
        .filter((item) => item) as RouterVo[]
      if (routeItem.path) {
        parentItems.push(routeItem)
      }
      return parentItems
    })
    .flat(1)
  return result
}

const getFlatRoute = (routeData: RouterVo[]) => {
  let routes: Record<string, RouterVo> = {}
  routeData.forEach((mapItem) => {
    const item = { ...mapItem }
    if (!item || !item.path) {
      return
    }
    const routerChildren = item.children || []
    routes[stripQueryStringAndHashFromPath(item.path || '/')] = {
      ...item,
    }
    routes[item.path || '/'] = { ...item }

    if (routerChildren) {
      routes = { ...routes, ...getFlatRoute(routerChildren) }
    }
  })
  return routes
}

export const getRouteMatches = (
  flatRoutePaths: string[] = [],
  path: string,
  exact?: boolean,
): string[] | undefined => {
  return flatRoutePaths
    .filter((item) => {
      if (item === '/' && path === '/') {
        return true
      }
      if (item !== '/' && item !== '/*' && item && !isUrl(item)) {
        const pathKey = stripQueryStringAndHashFromPath(item)
        try {
          // exact
          if (exact) {
            if (pathToRegexp(`${pathKey}`).test(path)) {
              return true
            }
          }
          // /a
          if (pathToRegexp(`${pathKey}`, []).test(path)) {
            return true
          }
          // /a/b/b
          if (pathToRegexp(`${pathKey}/(.*)`).test(path)) {
            return true
          }
        } catch (error) {
          warning(true, error as any)
        }
      }
      return false
    })
    .sort((a, b) => {
      // 如果完全匹配放到最后面
      if (a === path) {
        return 10
      }
      if (b === path) {
        return -10
      }
      return a.substr(1).split('/').length - b.substr(1).split('/').length
    }) as string[]
}
