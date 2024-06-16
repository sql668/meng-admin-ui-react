import { defineConfig, presetAttributify, presetUno } from 'unocss'
//import presetIcons from '@unocss/preset-icons'
import presetRemToPx from '@unocss/preset-rem-to-px'

export default defineConfig({
  shortcuts: {
    'wh-full': 'w-full h-full',
  },
  rules: [
    [/^p-(\d+)$/, (match) => ({ padding: `${match[1] * 10}px` })],
    [/^pl-(\d+)$/, (match) => ({ 'padding-left': `${match[1] * 10}px` })],
    [/^pr-(\d+)$/, (match) => ({ 'padding-right': `${match[1] * 10}px` })],
    [/^pt-(\d+)$/, (match) => ({ 'padding-top': `${match[1] * 10}px` })],
    [/^pb-(\d+)$/, (match) => ({ 'padding-bottom': `${match[1] * 10}px` })],
    [
      /^px-(\d+)$/,
      (match) => ({
        'padding-left': `${match[1] * 10}px`,
        'padding-right': `${match[1] * 10}px`,
      }),
    ],
    [
      /^py-(\d+)$/,
      (match) => ({
        'padding-top': `${match[1] * 10}px`,
        'padding-bottom': `${match[1] * 10}px`,
      }),
    ],
  ],
  presets: [
    presetUno(),
    presetAttributify(),
    // presetIcons({
    //   collections: {
    //     material: () =>
    //       import('@iconify/json/json/material-symbols.json').then((i) => i.default as any),
    //     antd: () => import('@iconify/json/json/ant-design.json').then((i) => i.default as any),
    //     ep: () => import('@iconify/json/json/ep.json').then((i) => i.default as any),
    //     fa6s: () => import('@iconify/json/json/fa6-solid.json').then((i) => i.default as any),
    //     fa6r: () => import('@iconify/json/json/fa6-regular.json').then((i) => i.default as any),
    //     fa6b: () => import('@iconify/json/json/fa6-brands.json').then((i) => i.default as any),
    //     svgs: () => import('@iconify/json/json/svg-spinners.json').then((i) => i.default as any),
    //   },
    // }),
    presetRemToPx({
      baseFontSize: 4, // 1rem = 1px  默认为16 1单位 = 0.25rem
    }),
  ],
})
