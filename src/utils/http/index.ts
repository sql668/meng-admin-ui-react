import { RequstInterceptors } from './type'
import type { AxiosError } from 'axios'
import axios from 'axios'
import AxiosMax from './Axios'
import { retry } from './axiosRetry'
import { checkErrorStatus } from './checkErrorStatus'
import staticAxiosConfig from './config'
import { Session } from '../storage'
import { Modal } from 'antd'
import { TOKEN } from '@/config/config'
import { antdUtils } from '../antdUtil'
const { confirm } = Modal
// 是否显示重新登录
export const isRelogin = { show: false }
const _RequstInterceptors: RequstInterceptors = {
  requestInterceptors(config) {
    //config.headers!['Authorization'] = `${Session.get('token')}`
    if (Session.get(TOKEN)) {
      config.headers['Authorization'] = 'Bearer ' + Session.get(TOKEN)
      config.headers['Content-Type'] = 'application/json'
    }

    return config
  },
  requestInterceptorsCatch(err) {
    return err
  },
  responseInterceptor(config) {
    //console.log(config)
    const { data } = config
    //console.log('response.headers:', headers)
    // if (headers["new-token"]) {
    //   console.log("new-token: ",headers["new-token"]);

    //   Session.set(TOKEN, headers["new-token"])
    // }
    // if (headers['new-expires-at']) {
    //   Session.set(TOKEN_EXPIRES_TIME, headers['new-expires-at'])
    // }
    if (data.code === 4) {
      if (!isRelogin.show) {
        isRelogin.show = true
        confirm({
          title: '系统提示?',
          content: '登录状态已过期，您可以继续留在该页面，或者重新登录',
          onOk() {
            isRelogin.show = false
            location.href = '/login'
          },
          onCancel() {
            isRelogin.show = false
          },
          okText: '重新登录',
          cancelText: '取消',
        })
      }
    } else if (data.code === 3) {
      antdUtils.message?.warning(data.msg)
    }
    return config
  },
  responseInterceptorsCatch(axiosInstance, err: AxiosError) {

    const message = err.code === 'ECONNABORTED' ? '请求超时' : undefined
    if (axios.isCancel(err)) {
      return Promise.reject(err)
    }
    checkErrorStatus((err as AxiosError).response?.status, message, (message) =>
      console.log(message),
    )
    return retry(axiosInstance, err as AxiosError)
  },
}

const useRequest = new AxiosMax({
  directlyGetData: true,
  baseURL: staticAxiosConfig.baseUrl,
  timeout: 3000,
  withCredentials:false,
  interceptors: _RequstInterceptors,
  abortRepetitiveRequest: true,
  retryConfig: {
    count: 0,
    waitTime: 500,
  },
})

export default useRequest
