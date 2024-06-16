import { createStyles } from 'antd-style'

const useStyles = createStyles(({ token, css }) => {
  return {
    container: css`
      padding: 8px 0;
      display: flex;
      align-items: center;
      justify-content: center;
      color: ${token.colorTextTertiary};
      background-color: ${token.colorBgContainer};

      a {
        color: inherit;
      }
    `,
  }
})
const Footer = () => {
  const { styles, cx } = useStyles()
  return (
    <div className={cx(styles.container, 'footer')}>
      <a href='https://blog.qianxun.shop' target='_blank' rel='noreferrer'>
        2024 © qianxun By 繁星.
      </a>
    </div>
  )
}
export default Footer
