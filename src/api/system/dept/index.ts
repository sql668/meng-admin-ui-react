import { ResultData } from '@/types/api'
import useRequest from '@/utils/http'
import { DeptModel, EditFormModel, QueryFormModel } from '@/views/system/dept/type'

export const getDeptPageApi = (data?: QueryFormModel) => {
  return useRequest.get<ResultData<DeptModel[]>>({
    url: '/dept',
    params: data,
  })
}

export const getDeptTreeApi = (data?: QueryFormModel) => {
  return useRequest.get<ResultData<DeptModel[]>>({
    url: '/dept/tree',
    params: data,
  })
}

export const getDeptById = (menuId: number) => {
  return useRequest.get<ResultData<QueryFormModel>>({
    url: `/dept/${menuId}`,
  })
}

export const insertDeptApi = (data: EditFormModel) => {
  return useRequest.post<ResultData>({
    url: '/dept',
    data,
  })
}

export const updateDeptApi = (data: EditFormModel, id: number) => {
  return useRequest.put<ResultData>({
    url: `/dept/${id}`,
    data,
  })
}

export const deleteDeptByIdApi = (ids: number[]) => {
  return useRequest.delete<ResultData>({
    url: '/dept/',
    data: { ids },
  })
}
