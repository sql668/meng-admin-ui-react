import { Layout } from 'antd'
import { createStyles } from 'antd-style'
//import { Outlet } from 'react-router-dom'
import LayoutHeader from '../component/header'
import LayoutAside from '../component/aside'
import LayoutMain from '../component/main'
import TagsView from '../navBars/tagsView'
import Footer from '../footer'

const useStyles = createStyles(() => {
  return {
    mixLayoutContainer: {
      height: '100%',
    },
  }
})

const MixLayout = () => {
  const { styles, cx } = useStyles()
  return (
    <div className={cx('meng-layout', 'meng-layout-mix', styles.mixLayoutContainer)}>
      <Layout style={{ height: '100%', width: '100%', flexDirection: 'column' }}>
        <LayoutHeader></LayoutHeader>
        <Layout style={{ height: 'calc(100% - 50px)' }}>
          <LayoutAside></LayoutAside>
          <div className='w-full flex flex-col overflow-hidden main-parent '>
            <TagsView></TagsView>
            <LayoutMain></LayoutMain>
            <Footer></Footer>
          </div>
        </Layout>
      </Layout>
    </div>
  )
}

export default MixLayout
