import './wdyr'
//import 'virtual:uno.css'
//import React from 'react'
import ReactDOM from 'react-dom/client' //ReactDOM.createRoot
//import ReactDOM from 'react-dom'
import { AliveScope } from 'react-activation'
import NProgress from 'nprogress'
/** 重置样式 这里引入自定义的重置样式也可 */
//import '@unocss/reset/tailwind.css'
/**
 *  项目内的样式，
 *  注意：最好放在重置样式后，uno.css前
 */
import './index.scss'
import 'nprogress/nprogress.css'
import 'uno.css'
import 'virtual:unocss-devtools'
import 'virtual:svg-icons-register'

// 离线加载图标集合，会导致打包体积
// import iconify from '@iconify/iconify'
// import antdIcons from '@iconify/json/json/ant-design.json'
// import iconparkOutline from '@iconify/json/json/icon-park-outline.json'
// iconify.addCollection(antdIcons)
// iconify.addCollection(iconparkOutline)

// 单个图标离线加载
// import Iconify from '@iconify/iconify/offline'
// import accountBook from '@iconify/icons-ant-design/account-book' //@iconify/icons-ant-design需要安装 pnpm add @iconify/icons-ant-design -D
// Iconify.addIcon('xxx:account-book', accountBook) //可以自定义 icon的key <Icon icon='xxx:account-book'></Icon>

import App from './App.tsx'

NProgress.configure({
  minimum: 0.3,
  easing: 'ease',
  speed: 800,
  showSpinner: false,
  parent: '#root',
})

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
// import { BrowserRouter } from 'react-router-dom'

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')!).render(
  //<React.StrictMode>
  <QueryClientProvider client={queryClient}>
    <ReactQueryDevtools initialIsOpen={false} />
    {/* <BrowserRouter> */}
    <AliveScope>
      <App />
    </AliveScope>
    {/* </BrowserRouter> */}
  </QueryClientProvider>,
  //</React.StrictMode>,
)

// ReactDOM.render(
//   <AliveScope>
//     <App />
//   </AliveScope>,
//   document.getElementById('root')
// )
