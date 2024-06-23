import { TinyColor } from '@ctrl/tinycolor'
import { isNum, isStr, isStringNumber } from './is'
import { warning } from '@fdesign/util'
/**
 * 把一个颜色设置一下透明度
 * @example (#fff, 0.5) => rgba(255, 255, 255, 0.5)
 * @param baseColor {string}
 * @param alpha {0-1}
 * @returns rgba {string}
 */
export const setAlpha = (baseColor: string, alpha: number) =>
  new TinyColor(baseColor).setAlpha(alpha).toRgbString()


export function addUnit(value?: string | number, defaultUnit = 'px') {
  if (!value) return ''
  if (isNum(value) || isStringNumber(value)) {
    return `${value}${defaultUnit}`
  } else if (isStr(value)) {
    return value
  }
  warning(true,'binding value must be a string or number')
}