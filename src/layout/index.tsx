import AuthRouter from '@/components/authRouter'
import { useBreakpoint } from '@/hooks/useBreakpoint'
import BaseLayout from '@/layout/default'
import { usePermissionStore } from '@/store/permission'
import { MenuDataItem } from '@/types/menu'
import { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { getMatchMenu, getMenuData as getMenuDataTrans, ishttp } from '@/utils/menu'
import { useLocation, useNavigate } from 'react-router-dom'
import { useDeepMemo } from '@/hooks/useMemo'
import { useMergedState } from '@fdesign/util'
import { useAppConfigStore } from '@/store/app'
import { useShallow } from 'zustand/react/shallow'
import { MenuTypeEnum } from '@/core/enums/menuEnum'
import { MenuContext } from '@/context/menu'

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
  useEffect(() => {
    setLocation({ pathname: pathname })
  }, [pathname])
  const nav = useNavigate()
  // const ur = useMatches()
  // console.log(ur);
  
   const colSize = useBreakpoint()
  const allRouters = usePermissionStore.use.routes()
  const { menuType } = useAppConfigStore(
    useShallow((state) => ({
      menuType: state.menuSetting.type,
      //splitMenus: state.splitMenus,
    })),
  )

  const [menuInfoData, setMenuInfoData] = useState<{
    breadcrumb?: Record<string, MenuDataItem>
    breadcrumbMap?: Map<string, MenuDataItem>
    menuData: MenuDataItem[]
  }>({
    // breadcrumb: {},
    // breadcrumbMap: new Map(),
    menuData: [],
  })
  const { menuData = [] } = menuInfoData || {}

  const isMobile = useDeepMemo(() => {
    return (colSize === 'sm' || colSize === 'xs') && !disableMobile
  }, [colSize])

  const [location, setLocation] = useState<{ pathname: string }>({ pathname: '/' })
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

  // const siderMenuWidth = useMemo(() => {
  //   if (menuType === MenuTypeEnum.MIX) return 215
  //   return 256
  // }, [menuType])
  
 
  const matchMenus = useMemo(() => {
    return getMatchMenu(location.pathname, menuData || [], true)
  }, [location.pathname, menuData])
  // 匹配选中的菜单以及父菜单 key

  const matchMenuKeys = useDeepMemo(
    () => Array.from(new Set(matchMenus.map((item) => item.key || item.path || ''))) || [],
    [matchMenus],
  )
  

  useEffect(() => {
    console.log(allRouters)
    
    const data = getMenuDataTrans(allRouters)
    console.log(data);
    
    setMenuInfoData(data)
  }, [allRouters])

  const menuItemClick = useCallback(
    (e: any) => {
      const menu = getMenu(menuInfoData.menuData, e.key)
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
      isMobile,
      menuItemClick,
      menuData: menuData,
      matchMenuKeys: matchMenuKeys,
      collapsed,
      onCollapse,
      //siderMenuWidth,
    }
  }, [isMobile, menuItemClick, menuData, matchMenuKeys, collapsed, onCollapse])

  return (
    <AuthRouter>
      <MenuContext.Provider value={ menuContextValue}>
        <BaseLayout></BaseLayout>
      </MenuContext.Provider>
    </AuthRouter>
  )
}

export default memo(MengLayout)
