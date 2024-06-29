import useRootSetting from "./setting/useRootSetting";
import { useDeepMemo } from "./useMemo";
import useSearchParam from "./useSearchParam";

export default function useFullContent() { 
  const query = useSearchParam()
  const { getFullContent: globalFullCopntent}  = useRootSetting()
  const getFullContent = useDeepMemo(() => {
    if (query && Reflect.has(query, '__full__')) {
      return true
    }
    return globalFullCopntent
  }, [query, globalFullCopntent])
  return { getFullContent }
}