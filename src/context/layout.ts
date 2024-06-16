import { MenuItemType } from '@/types/antd'
import { MenuDataItem } from '@/types/menu'
import { CustomRouteConfig } from '@/types/route'
//import { BaseMenuProps, MenuDataItem, PrivateSiderMenuProps, WithFalse } from '@/types/type'
import { createContext } from 'react'
type Updater<T> = (updater: T | ((origin: T) => T), ignoreDestroy?: boolean) => void
export type RouteContextType = {
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

  siderWidth?: number

  // 菜单为空时隐藏菜单栏
  suppressSiderWhenMenuEmpty?: boolean

  activedMenu?: CustomRouteConfig | undefined

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
export const RouteContext: React.Context<RouteContextType> = createContext({})
