import { depsIsEqual} from '@/utils/is';
import * as React from 'react';

/** 依赖项是数组，对象会深度比较内容，不会比较内存地址 */
export default function useEffect(
  callback: (prevDeps: any[] | null) => void,
  deps: any[],
) {
  const prevRef = React.useRef<Array<any> | null>(null)
  React.useEffect(() => {
    if (
      prevRef.current === null ||
      deps.length !== prevRef.current.length ||
      deps.some((dep, index) => !depsIsEqual(dep, prevRef.current![index]))
    ) {
      callback(prevRef.current)
    }
    prevRef.current = deps
  })
}
