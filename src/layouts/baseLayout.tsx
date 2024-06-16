//import { Layout } from 'antd'
// import WrapContent from './wrapContent'
// import { Outlet } from 'react-router-dom'
import { useThemeStore } from '@/store/theme'
import LazyLoad from '@/components/lazy'
import { lazy } from 'react'
import React from 'react'

export type BaseLayoutType = {
  // class前缀
  prefixCls?: string
  children: React.ReactNode
}

const BaseLayout: React.FC<BaseLayoutType> = () => {
  //const { message, notification, modal } = App.useApp()
  const LayoutMode = useThemeStore((state) => state.layout)
  // useEffect(() => {
  //   antdUtils.setModalInstance(modal)
  //   antdUtils.setMessageInstance(message)
  //   antdUtils.setNotificationInstance(notification)
  // },[])
  switch (LayoutMode) {
    case 'mix':
      return LazyLoad(lazy(() => import('./main/mixLayout')))
    case 'side':
      return LazyLoad(lazy(() => import('./main/sideLayout')))
    case 'top':
      return LazyLoad(lazy(() => import('./main/topLayout')))
    default:
      return LazyLoad(lazy(() => import('./main/mixLayout')))
  }
}

BaseLayout.defaultProps = {
  prefixCls: 'mu',
}
//export default BaseLayout
export default React.memo(BaseLayout)
