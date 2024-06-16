import { ResultData } from '@/types/api'
import { RouterVo } from '@/types/model/routerVo'
import useRequest from '@/utils/http'
import { MenuModel, SearchFormField } from '@/views/system/menu/type'

import { useQuery } from '@tanstack/react-query'

export interface RouterHandleVo {
  title: string
  icon: string
  component: string
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
  /** 视图类型 1:正常  2:外链  3:内嵌 */
  viewType: string

  /** 是否使用Layout 如果需要将页面内嵌在其它系统，达到美化效果(不显示菜单栏，只显示该页面) 需要将其设置为false */
  hasLayout: boolean
}
export interface RoutersVo {
  path: string
  handle: RouterHandleVo
  children?: RoutersVo[]
}

export const insertMenuApi = (data: MenuModel) => {
  return useRequest.post<ResultData>({
    url: '/menu',
    data,
  })
}

export const updateMenuApi = (data: MenuModel, menuId: number) => {
  return useRequest.put<ResultData>({
    url: `/menu/${menuId}`,
    data,
  })
}

export const getMenuListApi = (data: SearchFormField) => {
  return useRequest.get<ResultData<MenuModel[]>>({
    url: '/menu',
    params: data,
  })
}

export const getMenuById = (menuId: number) => {
  return useRequest.get<ResultData<MenuModel>>({
    url: `/menu/${menuId}`,
  })
}

export const deleteMenuById = (ids: number[]) => {
  return useRequest.delete<ResultData<MenuModel>>({
    url: '/menu/',
    data: { ids },
  })
}

export const useMenuList = (data: SearchFormField) => {
  return useQuery({
    queryKey: ['sys-menu', 'menu', 'get', data],
    queryFn: () => getMenuListApi(data),
  })
}

export const getRoutersApi = () => {
  return useRequest.get<ResultData<RouterVo[]>>({
    url: '/menu/getRouters',
  })
}
