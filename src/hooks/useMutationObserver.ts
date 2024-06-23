import useDeepCompareEffectWithTarget from "@/utils/hooks/useDeepCompareEffectWithTarget"
import { useLatest } from "ahooks"
import { BasicTarget, getTargetElement } from "ahooks/lib/utils/domTarget"
import { useState } from "react"

const useMutationObserver = (
  callback: MutationCallback,
  target: BasicTarget,
  options: MutationObserverInit = {},
): void => {
  const callbackRef = useLatest(callback)

  const [] = useState(null)

  useDeepCompareEffectWithTarget(
    () => {
      const element = getTargetElement(target)
      if (!element) {
        return
      }
      const observer = new MutationObserver(callbackRef.current)
      observer.observe(element, options)
      return () => {
        observer?.disconnect()
      }
    },
    [options],
    target,
  )
}

export default useMutationObserver
