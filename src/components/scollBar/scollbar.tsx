import classNames from "classnames"
import { CSSProperties, useCallback, useEffect, useMemo, useRef, useState } from "react"
import { BarRefExpose, ScollBarProps } from "./type"
import React from "react"
import { addUnit } from "@/utils/style"
import { isNumber, isObject, merge } from "lodash-es"
import Bar from "./bar"
import { ScrollbarContext } from "./context"
import { warning } from "@fdesign/util"
import { useSize } from "ahooks"

let stopResizeObserver: (() => void) | undefined = undefined
let stopResizeListener: (() => void) | undefined = undefined

function ScollBar(props: ScollBarProps) {
  const {
    className,
    height,
    maxHeight,
    tag = 'div',
    wrapClass,
    wrapStyle: originWrapStyle,
    viewClass,
    viewStyle,
    native = false,
    always = false,
    minSize = 20,
    children,
    noresize = false,
    scroll: ScrollEmit,
  } = props
  const containerClass = useMemo(() => {
    return classNames(['scollbar', className])
  }, [className])

  const wrapKls = useMemo(() => {
    return classNames([
      'scrollbar__wrap',
      wrapClass,
      { 'scrollbar__wrap--hidden-default': !native },
    ])
  }, [])

  const wrapStyle = useMemo(() => {
    const style: CSSProperties = {}
    if (height) style.height = addUnit(height)
    if (maxHeight) style.maxHeight = addUnit(maxHeight)
    return merge(originWrapStyle || {}, style)
  }, [height, maxHeight, originWrapStyle])

  const resizeKls = useMemo(() => {
    //return [ns.e('view'), props.viewClass]
    return classNames(['scrollbar__view', viewClass])
  }, [viewClass])

  const barRef = useRef<BarRefExpose>(null)
  const scrollbarRef = useRef(null)
  const wrapRef = useRef<HTMLDivElement>(null)

  // const barContextValue = useMemo(() => {
  //   return {
  //     scrollbarElement: scrollbarRef,
  //     wrapElement: wrapRef,
  //   }
  // }, [scrollbarRef, wrapRef])

  const [barContextValue, setContextValue] = useState({})

  useEffect(() => {
    console.log(scrollbarRef, wrapRef)

    setContextValue({
      scrollbarElement: scrollbarRef,
      wrapElement: wrapRef,
    })
  }, [])

  const handleScroll = () => {
    if (wrapRef.current) {
      barRef.current?.handleScroll(wrapRef.current)
      if (ScrollEmit) {
        ScrollEmit({
          scrollTop: wrapRef.current.scrollTop,
          scrollLeft: wrapRef.current.scrollLeft,
        })
      }
    }
  }

  // TODO: refactor method overrides, due to script setup dts
  // @ts-nocheck
  function scrollTo(xCord: number, yCord?: number): void
  function scrollTo(options: ScrollToOptions): void
  function scrollTo(arg1: unknown, arg2?: number) {
    if (isObject(arg1)) {
      wrapRef.current!.scrollTo(arg1)
    } else if (isNumber(arg1) && isNumber(arg2)) {
      wrapRef.current!.scrollTo(arg1, arg2)
    }
  }
  const setScrollTop = (value: number) => {
    if (!isNumber(value)) {
      warning(true,'scrollBar value must be a number')
      return
    }
    wrapRef.current!.scrollTop = value
  }

  const setScrollLeft = (value: number) => {
    if (!isNumber(value)) {
      warning(true, 'scrollBar value must be a number')
      return
    }
    wrapRef.current!.scrollLeft = value
  }

  const update = () => {
    barRef.current?.update()
  }

  useEffect(() => {
    if (noresize) {
      stopResizeObserver?.()
      stopResizeListener?.()
    } else {
      // ({ stop: stopResizeObserver } = useResizeObserver(resizeRef, update))
      // stopResizeListener = useEventListener('resize', update)
      useSize()
    }
   },[noresize])

  const renderSlot = useCallback(() => {
    return React.createElement(tag, { children, className: resizeKls, style: viewStyle })
  }, [children, resizeKls, viewStyle])
  return (
    <div className={containerClass} ref={scrollbarRef}>
      <div className={wrapKls} style={wrapStyle} ref={wrapRef}>
        {renderSlot()}
      </div>
      {!native && (
        <ScrollbarContext.Provider value={barContextValue}>
          <Bar ref={barRef} always={always} minSize={minSize}></Bar>
        </ScrollbarContext.Provider>
      )}
    </div>
  )
}

export { ScollBar }