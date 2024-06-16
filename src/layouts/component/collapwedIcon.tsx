import ArrowSvgIcon from '@/components/arrow'
import { createStyles } from 'antd-style'
import classNames from 'classnames'

const useStyles = createStyles(({ css }) => {
  return {
    container: css`
      position: absolute;
      inset-block-start: 18px;
      width: 24px;
      height: 24px;
      text-align: center;
      inset-inline-end: -13px;
      border-radius: 40px;
      transition: transform 0.3s;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      color: rgba(0, 0, 0, 0.25);
      background-color: #ffffff;
      box-shadow:
        0 2px 8px -2px rgba(0, 0, 0, 0.05),
        0 1px 4px -1px rgba(25, 15, 15, 0.07),
        0 0 1px 0 rgba(0, 0, 0, 0.08);

      &.meng-layout-collapsed-button-collapsed {
        & > svg {
          transform: rotate(-90deg);
        }
      }

      & > svg {
        transition: transform 0.3s;
        transform: rotate(90deg);
      }
    `,
  }
})

export const CollapsedIcon: React.FC<any> = (props) => {
  const { styles, cx } = useStyles()
  const { isMobile, collapsed, ...rest } = props
  if (isMobile && collapsed) return null
  return (
    <div
      {...rest}
      className={cx(
        styles.container,
        classNames(props.className, {
          [`${props.className}-collapsed`]: collapsed,
          [`${props.className}-is-mobile`]: isMobile,
        }),
      )}>
      <ArrowSvgIcon />
    </div>
  )
}
