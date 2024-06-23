import { useShallow } from 'zustand/react/shallow'
import AuthRouter from '@/components/authRouter'
import BaseLayout from './baseLayout'
import { ThemeProvider } from 'antd-style'
import { RouteContext } from '@/context/layout'
import { useCallback, useEffect, useMemo, useState } from 'react'
//import { asyncRouter } from '@/router/asyncRoute'
import { useThemeStore } from '@/store/theme'
import { getMatchMenu, getMenuData as getMenuDataTrans, ishttp } from '@/utils/menu'
import { MenuDataItem } from '@/types/menu'
import useMergedState from 'rc-util/lib/hooks/useMergedState'
import { useBreakpoint } from '@/hooks/useBreakpoint'
import { useLocation, useNavigate } from 'react-router-dom'
import { usePermissionStore } from '@/store/permission'

// 禁止切换到移动端
const disableMobile = false
interface MengThemeToken {
  heightLayoutHeader: number
  headerBgcolor: string
}

// 通过给 antd-style 扩展 CustomToken 对象类型定义，可以为 token 扩展 自定义 token 对象
declare module 'antd-style' {
  export interface CustomToken extends MengThemeToken {}
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
// const getPaddingInlineStart = (
//   hasLeftPadding: boolean,
//   collapsed: boolean | undefined,
//   siderWidth: number,
// ): number | undefined => {
//   if (hasLeftPadding) {
//     return collapsed ? 64 : siderWidth
//   }
//   return 0
// }

export default function MengLayout() {
  const { pathname } = useLocation()
  const nav = useNavigate()
  const [location, setLocation] = useState<{ pathname: string }>({ pathname: '/' })
  const allRouters = usePermissionStore((state) => state.routes)
  useEffect(() => {
    setLocation({ pathname: pathname })
  }, [pathname])

  const [menuInfoData, setMenuInfoData] = useState<{
    breadcrumb?: Record<string, MenuDataItem>
    breadcrumbMap?: Map<string, MenuDataItem>
    menuData: MenuDataItem[]
  }>({
    // breadcrumb: {},
    // breadcrumbMap: new Map(),
    menuData: [],
  })
  const { layoutMode } = useThemeStore(
    useShallow((state) => ({
      layoutMode: state.layout,
      //splitMenus: state.splitMenus,
    })),
  )

  const siderWidth = useMemo(() => {
    if (layoutMode === 'mix') return 215
    return 256
  }, [layoutMode])

  useEffect(() => {
    const data = getMenuDataTrans(allRouters)
    setMenuInfoData(data)
  }, [allRouters])

  const { menuData = [] } = menuInfoData || {}

  const menuItemClick = useCallback(
    (e: any) => {
      const menu = getMenu(menuData, e.key)
      if (menu?.viewType === '2') {
        if (ishttp(menu.linkUrl || '')) {
          window.open(menu.linkUrl, '_blank')
        } else {
          const url =
            import.meta.env.VITE_BASE_URL !== '/'
              ? import.meta.env.VITE_BASE_URL + menu.linkUrl
              : menu.linkUrl
          window.open(url, '_blank')
        }
      } else {
        if (menu && menu.children && menu.children.length > 0) {
          const kk: string = getChildMenu(menu.children[0]).key!
          //console.log(kk)
          nav(kk)
        } else {
          nav(menu?.key!)
        }
      }
    },
    [menuInfoData],
  )

  const getMenu = (menuData: MenuDataItem[], parentkey: string): MenuDataItem | null => {
    for (const item of menuData) {
      if (item.key === parentkey) {
        return item
      } else if (item.children) {
        const res = getMenu(item.children, parentkey)
        if (res) return res
      }
    }
    return null
  }

  const getChildMenu = (menu: MenuDataItem): MenuDataItem => {
    if (menu.children && menu.children.length > 0) {
      return getChildMenu(menu.children[0])
    } else {
      return menu
    }
  }

  const themeMode = useThemeStore((state) => state.themeMode)

  const matchMenus = useMemo(() => {
    return getMatchMenu(location.pathname, menuData || [], true)
  }, [location.pathname, menuData])
  // 匹配选中的菜单以及父菜单 key

  const matchMenuKeys = useMemo(
    () => Array.from(new Set(matchMenus.map((item) => item.key || item.path || ''))) || [],
    [matchMenus],
  )
  // const currentMenu = matchMenus[matchMenus.length - 1] || {}
  const colSize = useBreakpoint()

  const isMobile = useMemo(() => {
    return (colSize === 'sm' || colSize === 'xs') && !disableMobile
  }, [colSize])

  //const hasLeftPadding = layoutMode !== 'top' && !isMobile

  const [collapsed, onCollapse] = useMergedState<boolean>(
    () => {
      if (process.env.NODE_ENV === 'TEST') return false
      if (isMobile) return true
      if (colSize === 'md') return true
      return false
    },
    {
      value: undefined,
      onChange: undefined, // 触发自定义事件
    },
  )

  /** 计算 slider 的宽度 */
  //const leftSiderWidth = getPaddingInlineStart(!!hasLeftPadding, collapsed, siderWidth)

  const customTokenContext = useMemo(
    () => ({
      headerBgcolor: 'rgba(255,255,255,0.6)',
      heightLayoutHeader: 50,
    }),
    [],
  )

  const routerContext = useMemo(
    () => ({
      isMobile: isMobile,
      location,
      menuItemClick,
      menuData: menuData,
      matchMenuKeys: matchMenuKeys,
      collapsed,
      onCollapse,
      siderWidth,
    }),
    [isMobile, location, menuItemClick, menuData, matchMenuKeys, collapsed, onCollapse, siderWidth],
  )

  return (
    <AuthRouter>
      <ThemeProvider<MengThemeToken> themeMode={themeMode} customToken={customTokenContext}>
        <RouteContext.Provider value={routerContext}>
          <BaseLayout>Layouts</BaseLayout>
        </RouteContext.Provider>
      </ThemeProvider>
    </AuthRouter>
  )
}
