import { CSSProperties, RefObject } from 'react'

export interface ScollBarProps {
  // 组件内部样式class前缀
  //prefixCls?:string
  // 是否使用原生的滚动条
  native?: boolean

  // 滚动条高度，如果不设置，和父容器高度自适应
  height?: number
  maxHeight?: number
  // 容器class
  className?: string
  // 容器style
  style?: CSSProperties

  // 包裹容器的自定义类名
  wrapClass?: string
  wrapStyle?: React.CSSProperties
  // 视图的自定义类名
  viewClass?: string
  viewStyle?: React.CSSProperties
  tag?: string

  // 滚动条总是显示 默认false
  always?: boolean
  // 滚动条最小尺寸 默认 20
  minSize?: number
  // 容器size change 事件不在响应
  noresize?: boolean
  children?: React.ReactNode
  scroll?: ({ scrollLeft, scrollTop }: { scrollLeft: number; scrollTop: number }) => void
}

export interface BarRefExpose {
  handleScroll: (wrap: HTMLDivElement) => void
  update: () => void
}

export interface ScrollBarExpose {
  wrapRef: RefObject<HTMLDivElement>
  update: () => void
  scrollTo: {
    (xCord: number, yCord?: number): void
    (options: ScrollToOptions): void
  }
  setScrollTop: (value: number) => void
  setScrollLeft: (value: number) => void
  handleScroll: () => void
}
