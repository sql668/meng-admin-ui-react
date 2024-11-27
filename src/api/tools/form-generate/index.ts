import { PageResultData, ResultData } from '@/types/api'
import useRequest from '@/utils/http'
import { FormInfoModel, QueryFormModel } from '@/views/tool/form/type'

export const getFormGeneratePageApi = (data?: QueryFormModel) => {
  return useRequest.get<PageResultData<FormInfoModel[]>>({
    url: '/tools/form',
    params: data,
  })
}

export const getFormGenerateById = (id: number) => {
  return useRequest.get<ResultData<FormInfoModel>>({
    url: `/tools/form/${id}`,
  })
}

export const insertFormGenerateApi = (data: FormInfoModel) => {
  return useRequest.post<ResultData>({
    url: '/tools/form',
    data,
  })
}

export const updateFormGenerateApi = (data: FormInfoModel, id: number) => {
  return useRequest.put<ResultData>({
    url: `/tools/form/${id}`,
    data,
  })
}
