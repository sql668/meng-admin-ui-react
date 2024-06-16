import axios, { AxiosError, CreateAxiosDefaults } from 'axios'
import qs from 'qs'
import { Session } from './storage'
import { message } from 'antd'
// 请求配置文件
const config: CreateAxiosDefaults = {
  // `baseURL` 将自动加在 `url` 前面，除非 `url` 是一个绝对 URL。
  // 它可以通过设置一个 `baseURL` 便于为 axios 实例的方法传递相对 URL
  baseURL: import.meta.env.VITE_API_URL,

  /** 超时时间15秒 */
  timeout: 1000 * 15,

  // `withCredentials` 表示跨域请求时是否需要使用凭证
  withCredentials: false,

  // `maxRedirects` 定义在 node.js 中 follow 的最大重定向数目
  // 如果设置为0，将不会 follow 任何重定向
  maxRedirects: 3,
  headers: {
    'Content-Type': ' application/json;charset=UTF-8',
    apifoxToken: 'LJEguj2bPb7-kNytB5IJ6',
  },
  paramsSerializer: {
    serialize(params) {
      return qs.stringify(params, { allowDots: true })
    },
  },
}

/**
 * @description: 校验网络请求状态码
 * @param {Number} status
 * @return void
 */
export const checkStatus = (status: number): void => {
  switch (status) {
    case 400:
      message.error('请求失败！请您稍后重试')
      break
    case 401:
      message.error('登录失效！请您重新登录')
      break
    case 403:
      message.error('当前账号无权限访问！')
      break
    case 404:
      message.error('你所访问的资源不存在！')
      break
    case 405:
      message.error('请求方式错误！请您稍后重试')
      break
    case 408:
      message.error('请求超时！请您稍后重试')
      break
    case 500:
      message.error('服务异常！')
      break
    case 502:
      message.error('网关错误！')
      break
    case 503:
      message.error('服务不可用！')
      break
    case 504:
      message.error('网关超时！')
      break
    default:
      message.error('请求失败！')
  }
}

const service = axios.create(config)

// 添加请求拦截器
service.interceptors.request.use(
  (config) => {
    // 在发送请求之前做些什么 token
    if (Session.get('token')) {
      config.headers!['Authorization'] = `${Session.get('token')}`
    }
    return config
  },
  (error) => {
    // 对请求错误做些什么
    return Promise.reject(error)
  },
)

// 添加响应拦截器
service.interceptors.response.use(
  (response) => {
    // 对响应数据做点什么
    const { data } = response

    if (data && data.code !== 0) {
      message.error(data.msg)
      return Promise.reject(data)
    }
    return data
  },
  (error: AxiosError) => {
    // 对响应错误做点什么
    const { response } = error
    // 请求超时单独判断，请求超时没有 response
    if (error.message.indexOf('timeout') !== -1) message.error('请求超时，请稍后再试')
    // 根据响应的错误状态码，做不同的处理
    if (response) checkStatus(response.status)
    // 服务器结果都没有返回(可能服务器错误可能客户端断网) 断网处理:可以跳转到断网页面
    if (!window.navigator.onLine) window.location.hash = '/500'
    return Promise.reject(error)
  },
)
export default service
