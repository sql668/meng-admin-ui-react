import { MenuDataItem, MenuMode } from '@/types/menu'
import { PureSettings, WithFalse } from '@/types/type'
import { MenuProps } from 'antd'
export type BaseMenuProps = {
  className?: string
  /** 默认的是否展开 */
  defaultCollapsed?: boolean
  collapsed?: boolean
  splitMenus?: boolean
  menuData: MenuDataItem[]
  mode?: MenuMode
  onCollapse?: (collapsed: boolean) => void
  openKeys?: WithFalse<string[]> | undefined
  handleOpenChange?: (openKeys: string[]) => void
  menuRenderType?: 'header' | 'sider'

  /** iconfont字体图标class前缀 例如icon- */
  iconPrefixes?: string
  style?: React.CSSProperties
  menuItemClick?: (e: any) => void

  hashId: string
  location: { pathname?: string }
} & Partial<PureSettings> &
  Omit<MenuProps, 'openKeys' | 'onOpenChange' | 'title'>

export type PrivateSiderMenuProps = {
  matchMenuKeys: string[]
  originCollapsed?: boolean
  menuRenderType?: 'header' | 'sider'
  //stylish?: GenerateStyle<SiderMenuToken>
}

// export type RouterTypes = {
//   computedMatch?: match<any>
//   route?: Route
//   location: { pathname?: string }
// }
