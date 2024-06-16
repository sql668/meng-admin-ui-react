import { ResultData } from '@/types/api'
import useRequest from '@/utils/http'
import { RoleEntity } from '@/views/system/role/type'
import { useQuery } from '@tanstack/react-query'

export interface UserInfo {
  userId: number
  userName: string
  nickName: string
  email: string
  phone: string
  sex: number
  status: number
  role: RoleEntity
}
export interface GetInfoVo {
  user: UserInfo
  roles: string[]
  permissions: string[]
}

export const getInfoApi = () => {
  return useRequest.get<ResultData<GetInfoVo>>({
    url: '/getInfo',
  })
}

export const useInfo = () => {
  return useQuery({
    queryKey: ['sys-user', 'getInfo', 'get'],
    queryFn: () => getInfoApi(),
  })
}
