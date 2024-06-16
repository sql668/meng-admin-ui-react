//import { Optional } from '@/utils/type'
import { DeptModel } from '../dept/type'
import { IPage } from '@/types/common'

export interface UserEntity {
  userId: number
  userName: string
  nickName: string
  sex: string
  avatar: string
  phone: string
  email: string
  status: string
  roleId: number
  deptId: number
  remark: string
  createdAt: Date
  updatedAt: Date
  deletedAt: Date
  editable:string
  dept: DeptModel
}

//export type QueryUserModel = Optional<UserEntity, 'userName' | 'status' | 'nickName'> & IPage
export type QueryUserModel = Partial<Pick<UserEntity, 'userName' | 'status' | 'nickName'>> & IPage & {deptId?:string}
export type EditUserModel = Partial<UserEntity>
