import Logo from '@/assets/react.svg'
import { createStyles } from 'antd-style'
const useStyles = createStyles(({ token, css }) => {
  return {
    container: css`
      width: 200px;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: ${token.colorText};
      font-size: 16px;

      img {
        margin-right: 5px;
      }
    `,
  }
})
const LayoutLogo = () => {
  const { styles, cx } = useStyles()
  return (
    <div className={cx(styles.container)}>
      <img src={Logo} alt='' />
      <span className='font-bold'>Meng React Admin</span>
    </div>
  )
}

export default LayoutLogo
