//import request from '@/utils/request'
import useRequest from '@/utils/http'
import { CaptchaApiResponse, LoginApiResponse, Result } from '@/types/api'
import { ReqLogin } from '@/types/interface'
// export const LoginApi = (data: ReqLogin) => {
//   return request.post<LoginApiResponse>('/login', data)
// }

export const CaptchaApi = () => {
  return useRequest.get<CaptchaApiResponse>({
    url: '/captcha',
  })
}

export const LoginApi = (data: ReqLogin) => {
  return useRequest.post<LoginApiResponse>({
    url: '/login',
    data,
  })
}

export const LogoutApi = () => {
  return useRequest.post<Result>({
    url: '/logout',
  })
}
