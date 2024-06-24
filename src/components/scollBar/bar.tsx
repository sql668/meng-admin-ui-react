import { forwardRef, memo, useImperativeHandle, useState } from "react";
import Thumb from "./thumb";
import { GAP } from "./util";
import { useScrollBarContext } from "./context";
import { BarRefExpose } from "./type";

interface BarProps {
  // 滚动条总是显示 默认false
  always?: boolean
  // 滚动条最小尺寸 默认 20
  minSize: number
}


const ScrollBar = forwardRef<BarRefExpose, BarProps>((props: BarProps, ref) => {
  const { always = false, minSize = 20 } = props
  const scrollbar = useScrollBarContext()
  const [ratioX, setRatioX] = useState(1)
  const [ratioY, setRatioY] = useState(1)
  const [moveY, setMoveY] = useState(0)
  const [moveX, setMoveX] = useState(0)
  const [sizeWidth, setSizeWidth] = useState('')
  const [sizeHeight, setSizeHeight] = useState('')

  const handleScroll = (wrap: HTMLDivElement) => {
    if (wrap) {
      const offsetHeight = wrap.offsetHeight - GAP
      const offsetWidth = wrap.offsetWidth - GAP

      setMoveY(((wrap.scrollTop * 100) / offsetHeight) * ratioY)
      setMoveX(((wrap.scrollLeft * 100) / offsetWidth) * ratioX)
    }
  }

  const update = () => {
    const wrap = scrollbar?.wrapElement?.current
    if (!wrap) return
    const offsetHeight = wrap.offsetHeight - GAP
    const offsetWidth = wrap.offsetWidth - GAP

    const originalHeight = offsetHeight ** 2 / wrap.scrollHeight
    const originalWidth = offsetWidth ** 2 / wrap.scrollWidth
    const height = Math.max(originalHeight, minSize)
    const width = Math.max(originalWidth, minSize)

    setRatioY(originalHeight / (offsetHeight - originalHeight) / (height / (offsetHeight - height)))
    setRatioX(originalWidth / (offsetWidth - originalWidth) / (width / (offsetWidth - width)))

    setSizeHeight(height + GAP < offsetHeight ? `${height}px` : '')
    setSizeWidth(width + GAP < offsetWidth ? `${width}px` : '')
  }

  useImperativeHandle(ref, () => ({
    handleScroll,
    update,
  }))
  return (
    <>
      <Thumb always={always} ratio={ratioX} move={moveX} size={ sizeWidth}></Thumb>
      <Thumb vertical ratio={ratioY} always={always} move={moveY} size={sizeHeight}></Thumb>
    </>
  )
})

const Bar = memo(ScrollBar)

export default Bar