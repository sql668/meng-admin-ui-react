import LayoutLogo from '@/layouts/logo'
import { createStyles } from 'antd-style'
import LayoutUser from './user'
import HorizontalMenu from '@/layouts/navMenu/horizontalMenu'
//import BreadCrumb from './breadcumb'

const useStyles = createStyles(() => {
  return {
    container: {
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      //borderBottom: `1px solid ${token.colorSplit}`,
    },
  }
})
const Breadcrumb = () => {
  const { styles, cx } = useStyles()
  return (
    <div className={cx(styles.container)}>
      <LayoutLogo></LayoutLogo>

      {/* <BreadCrumb></BreadCrumb> */}
      <HorizontalMenu></HorizontalMenu>
      <LayoutUser></LayoutUser>
    </div>
  )
}

export default Breadcrumb
