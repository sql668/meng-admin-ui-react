/**
 * 用户实体
 */
export interface UserResp {
  userId: number
  userName: string
  nickName: string
  sex: string
  avatar: string
  phone: string
  email: string
  status: number
  [property: string]: any
}
