import { FormatterProps, MenuDataItem } from '@/types/menu'
import { CustomRouteConfig } from '@/types/route'
import {
  RouteListMap,
  getKeyByPath,
  isUrl,
  mergePath,
  notNullArray,
  stripQueryStringAndHashFromPath,
} from './util'
import { pathToRegexp } from 'path-to-regexp'

// 获取菜单数据
export const getMenuData = (routes: CustomRouteConfig[]) => {
  const { menuData, breadcrumb } = transformRoute(routes, true)
  return {
    breadcrumb: fromEntries(breadcrumb),
    breadcrumbMap: breadcrumb,
    menuData,
  }
}

/**
 * 获取当前的选中菜单列表
 * @param pathname
 * @param menuData
 * @returns MenuDataItem[]
 */
export const getMatchMenu = (
  pathname: string,
  menuData: MenuDataItem[],
  /**
   * 要不要展示全部的 key
   */
  fullKeys?: boolean,
  exact?: boolean,
): MenuDataItem[] => {
  const flatMenus = getFlatMenus(menuData)
  const flatMenuKeys = Object.keys(flatMenus)
  let menuPathKeys = getMenuMatches(flatMenuKeys, pathname || '/', exact)
  if (!menuPathKeys || menuPathKeys.length < 1) {
    return []
  }
  if (!fullKeys) {
    menuPathKeys = [menuPathKeys[menuPathKeys.length - 1]]
  }
  
  return menuPathKeys
    .map((menuPathKey) => {
      const menuItem = flatMenus[menuPathKey] || {
        pro_layout_parentKeys: '',
        key: '',
      }

      // 去重
      const map = new Map()
      const parentItems = (menuItem.layout_parentKeys || [])
        .map((key) => {
          if (map.has(key)) {
            return null
          }
          map.set(key, true)
          return flatMenus[key]
        })
        .filter((item) => item) as MenuDataItem[]
      if (menuItem.key) {
        parentItems.push(menuItem)
      }
      return parentItems
    })
    .flat(1)
}

export const getOpenKeysFromMenuData = (menuData?: MenuDataItem[]) => {
  return (menuData || []).reduce((pre, item) => {
    if (item.key) {
      pre.push(item.key)
    }
    if (item.children || item.routes) {
      const newArray: string[] = pre.concat(
        getOpenKeysFromMenuData(item.children || item.routes) || [],
      )
      return newArray
    }
    return pre
  }, [] as string[])
}

export function clearMenuItem(menusData: MenuDataItem[]): MenuDataItem[] {
  return menusData
    .map((item) => {
      const children: MenuDataItem[] = item.children || []
      const finalItem = { ...item }
      if (!finalItem.children && finalItem.routes) {
        finalItem.children = finalItem.routes
      }
      if (!finalItem.name || finalItem.hideInMenu) {
        return null
      }
      if (finalItem && finalItem?.children) {
        if (
          !finalItem.hideChildrenInMenu &&
          children.some((child) => child && child.name && !child.hideInMenu)
        ) {
          return {
            ...item,
            children: clearMenuItem(children),
          }
        }
        // children 为空就直接删掉
        delete finalItem.children
      }
      delete finalItem.routes
      return finalItem
    })
    .filter((item) => item) as MenuDataItem[]
}

export const getMenuMatches = (
  flatMenuKeys: string[] = [],
  path: string,
  exact?: boolean,
): string[] | undefined =>
  flatMenuKeys
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
          // console.log(error, path);
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

/**
 * 将路由数据转换为菜单数据
 * @param routeList 路由配置
 * @param ignoreFilter 是否筛选掉不展示的 menuItem 项
 */
export const transformRoute = (routeList: CustomRouteConfig[], ignoreFilter?: boolean) => {
  const originMenu = routeTransMenuta(routeList)

  const originalMenuData = formatter({
    data: originMenu,
  })

  // const menuData = ignoreFilter
  //   ? clearChildren(originalMenuData)
  //   : defaultFilterMenuData(originalMenuData)

  const menuData = ignoreFilter
    ? defaultFilterMenuData(originalMenuData)
    : clearChildren(originalMenuData)
  const breadcrumb = getBreadcrumbNameMap(originalMenuData)
  return { menuData, breadcrumb }
}

/**
 * 将CustomRouteConfig 转换为 MenuDataItem
 * @param routeList
 * @returns
 */
export const routeTransMenuta = (routeList: CustomRouteConfig[]) => {
  const result: MenuDataItem[] = []
  routeList.forEach((route) => {
    // 将CustomRouteConfig 转换为 MenuDataItem
    const item: MenuDataItem = {
      //...route,
      ...route.handle,
      path: route.path,
      name: route.handle.title,
    }
    if (notNullArray(route.children)) {
      item.children = routeTransMenuta(route.children!)
    }
    result.push(item)
  })
  return result
}

/**
 * 格式化menu数据
 * @param props
 * @param parent
 * @returns
 */
function formatter(props: FormatterProps, parent: Partial<MenuDataItem> = { path: '/' }) {
  const { data } = props
  if (!data || !Array.isArray(data)) {
    return []
  }
  return data
    .map((item = { path: '/' }) => {
      const routerChildren = item.children || []
      const path = mergePath(item.path, parent ? parent.path : '/')
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { layout_parentKeys = [], children, icon, routes, ...restParent } = parent
      const item_pro_layout_parentKeys = new Set([...layout_parentKeys, ...(item.parentKeys || [])])
      if (parent.key) {
        item_pro_layout_parentKeys.add(parent.key)
      }
      const finallyItem: MenuDataItem = {
        ...restParent,
        ...item,
        path,
        key: item.key || getKeyByPath({ ...item, path }),
        layout_parentKeys: Array.from(item_pro_layout_parentKeys).filter(
          (key) => key && key !== '/',
        ),
      }
      if (notNullArray(routerChildren)) {
        const formatterChildren = formatter(
          {
            ...props,
            data: routerChildren,
            parentName: '',
          },
          finallyItem,
        )

        if (notNullArray(formatterChildren)) {
          finallyItem.children = formatterChildren
        }
      }
      return finallyItem
    })
    .flat(1)
}

const clearChildren = (menuData: MenuDataItem[] = []): MenuDataItem[] => {
  return menuData
    .map((item: MenuDataItem) => {
      const routerChildren = item.children
      if (notNullArray(routerChildren)) {
        const newChildren = clearChildren(routerChildren)
        if (newChildren.length) return { ...item }
      }
      const finallyItem = { ...item }
      delete finallyItem.children
      return finallyItem
    })
    .filter((item) => item)
}

/**
 * 删除 hideInMenu 和 item.name 不存在的
 */
const defaultFilterMenuData = (menuData: MenuDataItem[] = []): MenuDataItem[] =>
  menuData
    .filter(
      (item: MenuDataItem) => item && (item.name || notNullArray(item.children)) && !item.isHide,
    )
    .map((item: MenuDataItem) => {
      const newItem = { ...item }
      const routerChildren = newItem.children || []
      if (
        notNullArray(routerChildren) &&
        routerChildren.some((child: MenuDataItem) => child && !!child.name)
      ) {
        const newChildren = defaultFilterMenuData(routerChildren)
        if (newChildren.length)
          return {
            ...newItem,
            children: newChildren,
          }
      }
      return { ...item }
    })
    .filter((item) => item)

function fromEntries(iterable: any) {
  return [...iterable].reduce((obj: Record<string, MenuDataItem>, [key, val]) => {
    obj[key] = val
    return obj
  }, {})
}

/**
 * 获取面包屑映射
 * @param MenuDataItem[] menuData 菜单配置
 */
const getBreadcrumbNameMap = (menuData: MenuDataItem[]): RouteListMap<MenuDataItem> => {
  // Map is used to ensure the order of keys
  const routerMap = new RouteListMap<MenuDataItem>()
  const flattenMenuData = (data: MenuDataItem[], parent?: MenuDataItem) => {
    data.forEach((menuItem) => {
      const routerChildren = menuItem.children || []
      if (notNullArray(routerChildren)) {
        flattenMenuData(routerChildren, menuItem)
      }
      // Reduce memory usage
      const path = mergePath(menuItem.path, parent ? parent.path : '/')
      routerMap.set(stripQueryStringAndHashFromPath(path), menuItem)
    })
  }
  flattenMenuData(menuData)
  return routerMap
}

/**
 * 获取打平的 menuData
 * 以 path 为 key
 * @param menuData
 */
export const getFlatMenus = (menuData: MenuDataItem[] = []): Record<string, MenuDataItem> => {
  let menus: Record<string, MenuDataItem> = {}
  menuData.forEach((mapItem) => {
    const item = { ...mapItem }
    if (!item || !item.key) {
      return
    }
    const routerChildren = item.children || []
    menus[stripQueryStringAndHashFromPath(item.path || item.key || '/')] = {
      ...item,
    }
    menus[item.key || item.path || '/'] = { ...item }

    if (routerChildren) {
      menus = { ...menus, ...getFlatMenus(routerChildren) }
    }
  })
  return menus
}

export function ishttp(url: string) {
  return url.indexOf('http://') !== -1 || url.indexOf('https://') !== -1
}
