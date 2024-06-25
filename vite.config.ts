import path, { resolve } from 'path'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import UnoCSS from 'unocss/vite'
import gzipPlugin from 'rollup-plugin-gzip'
import legacy from '@vitejs/plugin-legacy'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons' // 封装svg图标
import { viteCommonjs } from '@originjs/vite-plugin-commonjs'
import PurgeIcons from 'vite-plugin-purge-icons'
//const { theme } = require('antd/lib')
//const { convertLegacyToken, defaultTheme } = require('@ant-design/compatible/lib')
import { theme } from 'antd/lib'
//import convertLegacyToken from 'antd/lib/theme'
import { convertLegacyToken, defaultTheme } from '@ant-design/compatible/lib'

const { defaultAlgorithm, defaultSeed } = theme

const mapV5Token = defaultAlgorithm(defaultSeed)
const v5Vars = convertLegacyToken(mapV5Token)
const mapV4Token = theme.getDesignToken(defaultTheme)
const v4Vars = convertLegacyToken(mapV4Token)
const BASE = '/meng-react-admin-preview/'
console.log('v5 vars:', v5Vars)
//console.log('v5 token:', mapV5Token)

//const BASE = import.meta.env.VITE_API_URL
// https://vitejs.dev/config/
export default defineConfig((config) => {
  console.log(config)
  const root = process.cwd()
  const env = loadEnv(config.mode, root)
  console.log(env)

  return {
    base: env.VITE_BASE_URL,
    optimizeDeps: {
      include: ['@iconify/iconify'],
    },
    build: {
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: config.mode === 'production', //生产环境删除console和debugger
          drop_debugger: config.mode === 'production',
        },
      },
      rollupOptions: {
        output: {
          manualChunks: {
            react: ['react', 'react-dom', 'react-router', 'react-router-dom'], // 将react和react-dom打包到vendor chunk中
            antd: ['antd', '@ant-design/icons'], // 将antd打包到antd chunk中
            formily: ['@formily/antd-v5', '@formily/core', '@formily/react', '@formily/reactive'],
          },
        },
      },
    },
    // css: {
    //   preprocessorOptions: {
    //     less: {
    //       modifyVars: v5Vars(),
    //       javascriptEnabled: true,
    //     },
    //   },
    // },
    resolve: {
      alias: {
        '@': resolve(__dirname, './src'),
      },
    },
    plugins: [
      react(),
      UnoCSS(),
      gzipPlugin(),
      legacy({
        targets: ['> 2%', 'last 2 versions and not dead'],
      }),
      createSvgIconsPlugin({
        iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')],
        symbolId: 'icon-[dir]-[name]',
      }),
      PurgeIcons(),
      viteCommonjs(), //支持require语法
    ],
    define: {
      __PACKAGE_NAME__: JSON.stringify(process.env.npm_package_name),
    },
    server: {
      port: 5174,
      proxy: {
        '/api': {
          //target: 'http://127.0.0.1:8090', // 目标服务器的地址
          target: 'http://122.152.198.22:8091', // 目标服务器的地址
          //changeOrigin: true, // 是否改变源地址
          //rewrite: (path) => path.replace(/^\/api/, ''), // 重写路径
        },
      },
    },
  }
})
