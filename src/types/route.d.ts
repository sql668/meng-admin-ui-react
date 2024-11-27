import { IndexRouteObject, NonIndexRouteObject } from 'react-router-dom'
/** 路由meta信息 自定义数据 */
export type IRouteMeta = {
  /** 中文title, */
  title?: string
  icon?: React.ReactNode
  redirect?: string
  /** 全路径 用来匹配当前路由 */
  fullPath?: string
  /** 代码路径 用来异步导入 */
  component?: string
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
}
type CustomRouteObjectParams = {
  path: string
  handle?: IRouteMeta
}
type CustomIndexRouteObject = IndexRouteObject & CustomRouteObjectParams
type CustomNonIndexRouteObject = Omit<NonIndexRouteObject, 'children'> &
  CustomRouteObjectParams & {
    children?: (CustomIndexRouteObject | CustomNonIndexRouteObject)[]
  }
export type CustomRouteConfig = CustomIndexRouteObject | CustomNonIndexRouteObject
export {}
