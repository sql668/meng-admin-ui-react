import type { AxiosError, AxiosInstance } from 'axios'

export function retry(instance: AxiosInstance, err: AxiosError) {
  const config: any = err.config
  // 获取配置项内容(请求间隔时间，请求次数)
  const { waitTime, count } = config.retryConfig ?? {}
  // 当前重复请求的次数
  config.currentCount = config.currentCount ?? 0
  console.log(`第${config.currentCount}次重连`)

  // 如果当前的重复请求次数已经大于规定次数，则返回Promise
  if (config.currentCount >= count) {
    return Promise.reject(err)
  }
  config.currentCount++

  // 等待间隔时间结束后再执行请求
  return wait(waitTime).then(() => instance(config))
}

function wait(waitTime: number) {
  return new Promise((resolve) => setTimeout(resolve, waitTime))
}
