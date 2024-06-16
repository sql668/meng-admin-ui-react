import { ConfigProvider, ConfigProviderProps, App as AntdApp } from 'antd'
import zhCN from 'antd/locale/zh_CN'
//import dayjs from 'dayjs'
//import 'dayjs/locale/zh-cn'
import { useState } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import Router from './router'
import ErrorPage from '@/views/errors/error-page'
//import { frontEndRoutes } from './router/frontEnd'
type Locale = ConfigProviderProps['locale']
//dayjs.locale('zhCN')
export default function App() {
  const [locale] = useState<Locale>(zhCN)
  return (
    <ConfigProvider locale={locale}>
      <AntdApp className='h-full overflow-hidden'>
        {/* {useRoutes(frontEndRoutes)} */}
        {/* <RouterProvider router={routerConfig}></RouterProvider> */}
        <ErrorBoundary fallback={<ErrorPage></ErrorPage>}>
          <Router></Router>
        </ErrorBoundary>
      </AntdApp>
    </ConfigProvider>
  )
}
{
  /* <BrowserRouter>{useRoutes(frontEndRoutes)}</BrowserRouter> */
}
