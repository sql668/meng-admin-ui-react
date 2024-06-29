import AuthRouter from '@/components/authRouter'
import { useBreakpoint } from '@/hooks/useBreakpoint'
import BaseLayout from '@/layout/default'
import { usePermissionStore } from '@/store/permission'
import { MenuDataItem } from '@/types/menu'
import { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { getMatchMenu, getMenuData as getMenuDataTrans, ishttp } from '@/utils/menu'
import { useLocation, useNavigate } from 'react-router-dom'
import { useDeepMemo } from '@/hooks/useMemo'
import { setRootSetting } from '@/store/app'
import { MenuContext } from '@/context/menu'
import useRootSetting from '@/hooks/setting/useRootSetting'
import useRouter from '@/hooks/useRouter'

// 禁止切换到移动端
const disableMobile = false

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

function MengLayout() {
  const { pathname } = useLocation()

  useRouter()


  useEffect(() => {
    setLocation({ pathname: pathname })
  }, [pathname])
  const nav = useNavigate()
   const colSize = useBreakpoint()
  const allRouters = usePermissionStore.use.routes()

  const { getIsDisableMobile } = useRootSetting()
  
  useEffect(() => {
    if ((colSize === 'sm' || colSize === 'xs') && !disableMobile) {
      setRootSetting({ isMobile: true })
    } else {
      setRootSetting({ isMobile: false })
    }
  }, [getIsDisableMobile, colSize])

  const [location, setLocation] = useState<{ pathname: string }>({ pathname: '/' })
  

  const menuInfoData = useMemo<{
    breadcrumb?: Record<string, MenuDataItem>
    breadcrumbMap?: Map<string, MenuDataItem>
    menuData?: MenuDataItem[]
  }>(() => {
    return getMenuDataTrans(allRouters)
  }, [allRouters])
  const { menuData = [] } = menuInfoData || {}

  const matchMenus = useMemo(() => {
    const matchMenus = getMatchMenu(location.pathname, menuData || [], true)
    return matchMenus
  }, [location.pathname, menuData])
  const matchMenuKeys = useDeepMemo(() => {
    const keys = Array.from(new Set(matchMenus.map((item) => item.key || item.path || ''))) || []
    //setMatchMenuKeys(keys)
    return keys
  }, [matchMenus])

  const menuItemClick = useCallback(
    (e: any) => {
      const menu = getMenu(menuInfoData.menuData!, e.key)
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

  const menuContextValue = useDeepMemo(() => {
    return {
      menuItemClick,
      menuData: menuData,
      matchMenuKeys: matchMenuKeys,
    }
  }, [menuItemClick, menuData, matchMenuKeys])
  const {matchRoutes} = useRouter()
  return (
    <AuthRouter>
      <MenuContext.Provider value={menuContextValue}>
        {matchRoutes.at(-1)?.handle.hasLayout && <BaseLayout></BaseLayout>}
      </MenuContext.Provider>
    </AuthRouter>
  )
}

export default memo(MengLayout)
