import { PageResultData, ResultData } from '@/types/api'
import useRequest from '@/utils/http'
import { ApiEntity, EditAPiModel, QueryApiModel } from '@/views/system/api/type'


export const getApiPageApi = (data?: QueryApiModel) => {
  return useRequest.get<PageResultData<ApiEntity[]>>({
    url: '/sys-api',
    params: data,
  })
}

export const getAllApiAPi = (data?: QueryApiModel) => {
  return useRequest.get<PageResultData<ApiEntity[]>>({
    url: '/sys-api/all',
    params: data,
  })
}

export const insertAPiApi = (data: EditAPiModel) => {
  return useRequest.post<ResultData>({
    url: '/sys-api',
    data,
  })
}

export const updateAPiApi = (data: EditAPiModel) => {
  return useRequest.put<ResultData>({
    url: `/sys-api/${data.apiId}`,
    data,
  })
}

export const deleteApiApi = (ids: number[]) => {
  return useRequest.delete<ResultData>({
    url: '/sys-api/',
    data: { ids },
  })
}
