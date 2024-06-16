import { useEffect, useRef } from 'react'
//import Iconify from '@purge-icons/generated'
import Iconify from '@iconify/iconify'
import { isString } from 'lodash-es'
import { SvgIcon } from '../svg'
import { createStyles } from 'antd-style'
export interface IconType {
  icon: string
  color?: string
  size?: number | string
  mode?: 'iconify' | 'svg'
  className?: string
  [key: string]: any
}
const SVG_END_WITH_FLAG = '|svg';
const useStyles = createStyles(({ css }, props: { size: number | string; color: string }) => {
  const { size, color } = props
  let fs = size
  if (isString(size)) {
    fs = parseInt(size, 10)
  }
  return {
    container: css`
      font-size: ${fs}px;
      color: ${color};
      display: inline-flex;
      align-items: center;
      line-height: 0;
      text-align: center;
    `,
  }
})

export function Icon(props: IconType) {
  const { icon, color = '', size = 16, mode = 'iconify', className, ...restProps } = props
  const iconRef = useRef(null)
  const { styles, cx } = useStyles({ size, color })

  useEffect(() => {

    if (mode != 'svg' && !icon?.endsWith(SVG_END_WITH_FLAG)) {
      const el = iconRef.current! as HTMLElement
      const svg = Iconify.renderSVG(icon, {})
      if (svg) {
        el.textContent = ''
        el.appendChild(svg)
      } else {
        const span = document.createElement('span')
        span.className = 'iconify'
        span.dataset.icon = icon
        el.textContent = ''
        el.appendChild(span)
      }
    }
  }, [icon, mode])
  return mode === 'svg' || icon?.endsWith(SVG_END_WITH_FLAG) ? (
    <SvgIcon icon={icon?.endsWith(SVG_END_WITH_FLAG) ? icon.replace(SVG_END_WITH_FLAG, ''): icon} color={color} size={size} {...restProps}></SvgIcon>
  ) : (
    <span ref={iconRef} className={cx(styles.container, className,'anticon')}></span>
  )
}
