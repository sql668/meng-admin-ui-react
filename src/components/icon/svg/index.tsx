import { useMemo } from 'react'
import { createStyles } from 'antd-style'
export interface propsInterface {
  /** src/assets/icons目录下的svg文件名称 */
  icon: string
  /** 图标大小 */
  size?: string | number
  color?: string
  profix?: string
  className?: string
  [key: string]: any
}

const useStyles = createStyles(({ css }, props: { size: number | string; color: string }) => {
  const { size, color } = props
  let s = `${size}`
  s = `${s.replace('px', '')}px`
  return {
    container: css`
      width: ${s};
      height: ${s};
      color: ${color};
    `,
  }
})

export function SvgIcon(props: propsInterface) {
  const { size = 16, color = '', profix = 'icon', icon, className, ...restProps } = props
  const { styles, cx } = useStyles({ size, color })
  const iconName = useMemo<string>(() => {
    return `#${profix}-${icon}`
  }, [profix, icon])

  return (
    <svg aria-hidden='true' className={cx(styles.container, className)} {...restProps}>
      <use href={iconName} />
    </svg>
  )
}
