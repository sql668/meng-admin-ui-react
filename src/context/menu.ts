import { MenuItemType } from '@/types/antd'
import { MenuDataItem } from '@/types/menu'
import { createContext, useContext } from 'react'
import { RouteObject } from 'react-router'
type Updater<T> = (updater: T | ((origin: T) => T), ignoreDestroy?: boolean) => void
export type MenuContextType = {
  // 侧边栏 菜单
  sideMenu?: MenuItemType[]
  // 顶栏 菜单
  topMenu?: MenuItemType[]

  collapsed?: boolean
  onCollapse?: Updater<boolean>
  isMobile?: boolean

  location?: {
    pathname: string
  }

  siderMenuWidth?: number

  // 菜单为空时隐藏菜单栏
  suppressSiderWhenMenuEmpty?: boolean

  activedMenu?: RouteObject

  menuItemClick?: (pathname: string) => void

  breadcrumb?: Record<string, MenuDataItem>
  breadcrumbMap?: Map<string, MenuDataItem>
  menuData?: MenuDataItem[]
  matchMenuKeys?: string[]

  // menuItemRender?: WithFalse<
  //   (
  //     item: MenuDataItem & {
  //       isUrl: boolean
  //       onClick: () => void
  //     },
  //     defaultDom: React.ReactNode,
  //     menuProps: BaseMenuProps & Partial<PrivateSiderMenuProps>,
  //   ) => React.ReactNode
  // >
}

/** 和菜单相关 */
export const MenuContext: React.Context<MenuContextType> = createContext({})

export const useMenuContext = () => {
  return useContext(MenuContext)
}
