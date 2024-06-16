/**
 * 菜单数据 这里的菜单数据并不是最终Menu组件的items 还需要最终的转换。
 * MenuDataItem 保存着附加数据用于判断操作
 */
export type MenuDataItem = {
  /** 菜单的名字 和 路由的title保持一致 */
  name?: string

  /** 用于标定选中的值，默认是 path */
  key?: string

  /** 路由跳转的pathname */
  path: string

  /** 菜单的icon */
  icon?: React.ReactNode

  /** 子菜单 */
  children?: MenuDataItem[]
  routes?: undefined

  /** 是否禁用 */
  disabled?: boolean

  /** 是否隐藏此路由 */
  isHide?: boolean
  /** 是否固定在 tagsView栏 */
  isAffix?: boolean
  /** 内嵌窗口或外链 */
  isLink?: boolean
  /** 链接地址 */
  linkUrl?: string
  isFull?: boolean
  /** 是否缓存 */
  isKeepAlive?: boolean

  /**
   * 当此节点被选中的时候也会选中 parentKeys 的节点
   * 自定义父节点
   */
  parentKeys?: string[]

  layout_parentKeys?: string[]

  [key: string]: any
}

export interface MessageDescriptor {
  id: any
  description?: string
  defaultMessage?: string
}

export interface FormatterProps {
  data: MenuDataItem[]
  parentName?: string
  //[key: string]: any
}

export type MenuMode = 'vertical' | 'vertical-left' | 'vertical-right' | 'horizontal' | 'inline'
