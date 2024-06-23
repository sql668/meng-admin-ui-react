import { ConfigProvider, ConfigProviderProps, App as AntdApp } from 'antd'
import zhCN from 'antd/locale/zh_CN'
//import dayjs from 'dayjs'
//import 'dayjs/locale/zh-cn'
import { useState } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import Router from './router'
import ErrorPage from '@/views/errors/error-page'
import MxAppConfigProvider from '@/components/application/appProvider'
import { ThemeProvider } from 'antd-style'
import { getGlobalTheme, useAppConfigStore } from './store/app'
//import { frontEndRoutes } from './router/frontEnd'
type Locale = ConfigProviderProps['locale']
//dayjs.locale('zhCN')

interface MengThemeToken {
  heightLayoutHeader: number
  headerBgcolor: string
}

export default function App() {
  const [locale] = useState<Locale>(zhCN)
  const themeMode = useAppConfigStore.use.theme()
  return (
    <MxAppConfigProvider>
      <ConfigProvider locale={locale}>
        <ThemeProvider<MengThemeToken> themeMode={themeMode}>
          <AntdApp className='h-full overflow-hidden'>
            <ErrorBoundary fallback={<ErrorPage></ErrorPage>}>
              <Router></Router>
            </ErrorBoundary>
          </AntdApp>
        </ThemeProvider>
      </ConfigProvider>
    </MxAppConfigProvider>
  )
}
{
  /* <BrowserRouter>{useRoutes(frontEndRoutes)}</BrowserRouter> */
}
