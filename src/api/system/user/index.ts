import { PageResultData, ResultData } from '@/types/api'
import useRequest from '@/utils/http'
import { EditUserModel, QueryUserModel, UserEntity } from '@/views/system/user/type'


export const getUserPageApi = (data?: QueryUserModel) => {
  return useRequest.get<PageResultData<UserEntity[]>>({
    url: '/sys-user',
    params: data,
  })
}

export const insertUserApi = (data: EditUserModel) => {
  return useRequest.post<ResultData>({
    url: '/sys-user',
    data,
  })
}

export const updateUserApi = (data: EditUserModel) => {
  return useRequest.put<ResultData>({
    url: `/sys-user`,
    data,
  })
}

export const updateUserStatusApi = (data: EditUserModel) => {
  return useRequest.put<ResultData>({
    url: `/sys-user/status/change`,
    data,
  })
}

export const resetPwdApi = (data: {userId:number,password:string}) => {
  return useRequest.put<ResultData>({
    url: `/user/pwd/reset`,
    data,
  })
}

export const deleteUserApi = (ids: number[]) => {
  return useRequest.delete<ResultData>({
    url: '/sys-user/',
    data: { ids },
  })
}
