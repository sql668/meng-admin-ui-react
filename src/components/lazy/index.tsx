//import { Spin } from 'antd'
import { Suspense } from 'react'
import Loading from '../loading'

const LazyLoad = (Component: React.LazyExoticComponent<any>): React.ReactNode => (
  <Suspense fallback={<Loading></Loading>}>
    <Component />
  </Suspense>
)

export default LazyLoad
