import { IndexRouteObject, NonIndexRouteObject } from 'react-router-dom'

/** 路由meta信息 自定义数据 */
export type IRouteMeta = {
  /** 中文title, */
  title?: string
  icon?: React.ReactNode // 如果是antd icon 字符串，将会转换为icon组件
  redirect?: string // 重定向地址
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
  //meta: IRouteMeta
  handle?: IRouteMeta // 把其它辅助信息保存到handle 可以使用useMatches直接获取到
}

type CustomIndexRouteObject = IndexRouteObject & CustomRouteObjectParams

type CustomNonIndexRouteObject = Omit<NonIndexRouteObject, 'children'> &
  CustomRouteObjectParams & {
    children?: (CustomIndexRouteObject | CustomNonIndexRouteObject)[]
  }

export type CustomRouteConfig = CustomIndexRouteObject | CustomNonIndexRouteObject
