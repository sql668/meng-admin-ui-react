import { useDeepMemo } from '@/hooks/useMemo'
import classNames from 'classnames'
import { CSSProperties, memo, useEffect, useMemo, useRef, useState } from 'react'
import { useScrollBarContext } from './context'
import { isClient } from './util'
import { useEventListener, useReactive } from 'ahooks'

interface ThumbProps {
  // 是否是垂直方向的滚动条
  vertical?: boolean
  // 尺寸
  size?: string
  move?: number
  always?: boolean
  ratio: number
}

export const BAR_MAP = {
  vertical: {
    offset: 'offsetHeight',
    scroll: 'scrollTop',
    scrollSize: 'scrollHeight',
    size: 'height',
    key: 'vertical',
    axis: 'Y',
    client: 'clientY',
    direction: 'top',
  },
  horizontal: {
    offset: 'offsetWidth',
    scroll: 'scrollLeft',
    scrollSize: 'scrollWidth',
    size: 'width',
    key: 'horizontal',
    axis: 'X',
    client: 'clientX',
    direction: 'left',
  },
} as const

const renderThumbStyle = ({
  move,
  size,
  bar,
}: Pick<ThumbProps, 'move' | 'size'> & {
  bar: (typeof BAR_MAP)[keyof typeof BAR_MAP]
}): CSSProperties => ({
  [bar.size]: size,
  transform: `translate${bar.axis}(${move}%)`,
})

let cursorDown = false
let cursorLeave = false
let originalOnSelectStart: ((this: GlobalEventHandlers, ev: Event) => any) | null = isClient
  ? document.onselectstart
  : null

const restoreOnselectstart = () => {
  if (document.onselectstart !== originalOnSelectStart)
    document.onselectstart = originalOnSelectStart
}

function ScrollThumb(props: ThumbProps) {
  const { vertical = false, always = false, size, move, ratio } = props
  const scrollbar = useScrollBarContext()
  // const [cursorDown, setCursorDown] = useState(false)
  // const [cursorLeave, setCursorLeave] = useState(false)

  //const [thumbState, setThumbState] = useState<Partial<Record<'X' | 'Y', number>>>({})
  // useReactive 产生可操作的代理对象一直都是同一个引用，useEffect , useMemo ,useCallback , 子组件属性传递 等如果依赖的是这个代理对象是不会引起重新执行
  const thumbState = useReactive<Partial<Record<'X' | 'Y', number>>>({})

  const [visible, setVisible] = useState(false)
  const instance = useRef<HTMLDivElement>(null)
  const thumb = useRef<HTMLDivElement>(null)
  const getClass = useMemo(() => {
    return classNames([
      'scrollbar__bar',
      {
        ['is-horizontal']: !vertical,
        ['is-vertical']: vertical,
        ['scrollbar__bar--show']: always || visible,
        //['scrollbar__bar--hidden']: !(always || visible)
      },
    ])
  }, [vertical, always, visible])
  const bar = useMemo(() => BAR_MAP[vertical ? 'vertical' : 'horizontal'], [vertical])

  const thumbStyle = useDeepMemo(() => {
    return renderThumbStyle({
      size: size,
      move: move,
      bar: bar,
    })
  }, [size, move, bar])

  const [offsetRatio, setOffsetRatio] = useState(1)
  useEffect(() => {
    if (instance.current && thumb.current && scrollbar.wrapElement?.current) {
      const newRatio =
        instance.current![bar.offset] ** 2 /
        scrollbar.wrapElement!.current![bar.scrollSize] /
        ratio /
        thumb.current![bar.offset]
      setOffsetRatio(newRatio)
    }
  }, [ratio, thumbStyle])

  const mouseMoveDocumentHandler = (e: MouseEvent) => {
    if (!instance.current || !thumb.current) return
    if (cursorDown === false) return
    const prevPage = thumbState[bar.axis]
    if (!prevPage) return
    const offset = (instance.current.getBoundingClientRect()[bar.direction] - e[bar.client]) * -1
    const thumbClickPosition = thumb.current[bar.offset] - prevPage
    const thumbPositionPercentage =
      ((offset - thumbClickPosition) * 100 * offsetRatio) / instance.current[bar.offset]

    scrollbar.wrapElement!.current![bar.scroll] =
      (thumbPositionPercentage * scrollbar.wrapElement!.current![bar.scrollSize]) / 100

  }

  const mouseUpDocumentHandler = () => {
    cursorDown = false
    thumbState[bar.axis] = 0
    document.removeEventListener('mousemove', mouseMoveDocumentHandler)
    document.removeEventListener('mouseup', mouseUpDocumentHandler)
    restoreOnselectstart()
    if (cursorLeave) {
      setVisible(false)
    }
  }

  const startDrag = (e: MouseEvent) => {
    e.stopImmediatePropagation()
    cursorDown = true
    document.addEventListener('mousemove', mouseMoveDocumentHandler)
    document.addEventListener('mouseup', mouseUpDocumentHandler)
    originalOnSelectStart = document.onselectstart
    document.onselectstart = () => false
  }

  const clickTrackHandler = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation()
    if (e.ctrlKey || [1, 2].includes(e.button)) return
    window.getSelection()?.removeAllRanges()
    startDrag(e.nativeEvent)

    const el = e.currentTarget as HTMLDivElement
    if (!el) return
    thumbState[bar.axis] = (el[bar.offset] -
      (e[bar.client] - el.getBoundingClientRect()[bar.direction])) as any
  }
  const clickThumbHandler = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation()
    if (e.ctrlKey || [1, 2].includes(e.button)) return

    window.getSelection()?.removeAllRanges()
    startDrag(e.nativeEvent)
    const el = e.currentTarget as HTMLDivElement
    if (!el) return
    thumbState[bar.axis] =
      el[bar.offset] - (e[bar.client] - el.getBoundingClientRect()[bar.direction])
  }

  const mouseMoveScrollbarHandler = () => {
    cursorLeave = false
    setVisible(!!size)
  }

  const mouseLeaveScrollbarHandler = () => {
    cursorLeave = true
    setVisible(cursorDown)
  }

  useEffect(() => {
    return () => {
      restoreOnselectstart()
      document.removeEventListener('mouseup', mouseUpDocumentHandler)
    }
  }, [])
  //useEventListener(toRef(scrollbar, 'scrollbarElement'), 'mousemove', mouseMoveScrollbarHandler)
  //useEventListener(toRef(scrollbar, 'scrollbarElement'), 'mouseleave', mouseLeaveScrollbarHandler)
  useEventListener('mousemove', mouseMoveScrollbarHandler, { target: scrollbar.scrollbarElement })
  useEventListener('mouseleave', mouseLeaveScrollbarHandler, { target: scrollbar.scrollbarElement })

  return (
    <div className={getClass} onMouseDown={clickTrackHandler} ref={instance}>
      <div
        className='scrollbar__thumb'
        style={thumbStyle}
        onMouseDown={clickThumbHandler}
        ref={thumb}></div>
    </div>
  )
}

const Thumb = memo(ScrollThumb)

export default Thumb
