import Logo from '@/assets/react.svg'
import { useMenuSetting } from '@/hooks/setting/useMenuSetting'
import { createStyles } from 'antd-style'
const useStyles = createStyles(({ token, css }, props: { menuWidth:number }) => {
  return {
    container: css`
      width: ${props.menuWidth}px;
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
const AppLogo = () => {
  const { getMenuWidth } = useMenuSetting()
  const { styles, cx } = useStyles({ menuWidth:getMenuWidth })
  return (
    <div className={cx(styles.container)}>
      <img src={Logo} alt='' />
      <span className='font-bold'>Meng React Admin</span>
    </div>
  )
}

export default AppLogo
