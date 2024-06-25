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

// const { convertLegacyToken, defaultTheme } = require('@ant-design/compatible/lib')

// const { theme } = require('antd/lib')
// const { defaultAlgorithm, defaultSeed } = theme

// const mapV5Token = defaultAlgorithm(defaultSeed)
// const v5Vars = convertLegacyToken(mapV5Token)
// const mapV4Token = theme.getDesignToken(defaultTheme)
// const v4Vars = convertLegacyToken(mapV4Token)



//import { frontEndRoutes } from './router/frontEnd'
type Locale = ConfigProviderProps['locale']
//dayjs.locale('zhCN')

interface MengThemeToken {
  heightLayoutHeader: number
  headerBgcolor: string
}

const antdThemeConfig = {
  cssVar: true,
  hashed: false,
}

export default function App() {
  const [locale] = useState<Locale>(zhCN)
  const themeMode = useAppConfigStore.use.theme()
  return (
    <MxAppConfigProvider>
      <ConfigProvider locale={locale} theme={antdThemeConfig}>
        <ThemeProvider<MengThemeToken> themeMode={themeMode} theme={antdThemeConfig}>
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
