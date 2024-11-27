import { useMemoizedFn } from 'ahooks'
import { useRef } from 'react'

export default function useContentViewHeight() {
  const headerHeightRef = useRef(0)
  const footerHeightRef = useRef(0)
  const setHeaderHeight = useMemoizedFn((val: number) => {
    headerHeightRef.current = val
  })
  const setFooterHeight = useMemoizedFn((val: number) => {
    footerHeightRef.current = val
  })

  return {
    headerHeightRef,
    footerHeightRef,
    setHeaderHeight,
    setFooterHeight,
  }
}
