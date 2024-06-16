import { createStyles } from 'antd-style'
import Breadcrumb from './topBar'

const useStyles = createStyles(() => {
  return {
    container: {
      height: '100%',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
    },
  }
})
const NavBar = () => {
  const { styles, cx } = useStyles()
  return (
    <div className={cx(styles.container)}>
      <Breadcrumb></Breadcrumb>
    </div>
  )
}

export default NavBar
