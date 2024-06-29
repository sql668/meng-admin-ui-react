import { useSearchParams } from "react-router-dom"
import { useDeepMemo } from "./useMemo"

export default function useSearchParam() {
  const [originSearchParam] = useSearchParams()

  // 将所有查询参数转换为一个对象
  const getAllParams = () => {
    const params:Record<string,any> = {}
    for (const [key, value] of originSearchParam.entries()) {
      params[key] = value
    }
    return params
  }

  const searchParams = useDeepMemo(() => getAllParams(), [originSearchParam])

  return searchParams
}
