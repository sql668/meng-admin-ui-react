import { useSearchParams } from "react-router-dom"

export function useSearchParam() {
  const [searchParams] = useSearchParams()

  // 将所有查询参数转换为一个对象
  const getAllParams = () => {
    const params:Record<string,any> = {}
    for (const [key, value] of searchParams.entries()) {
      params[key] = value
    }
    return params
  }

  return getAllParams()
}
