import { hex } from "./hex"
import { isStr } from "./is"
import { clamp } from "./number"

const mMin = Math.min
const mMax = Math.max
const round = Math.round

const regHexAbbr = /^#([a-fA-F0-9]{3})$/
const regHex = /^#([a-fA-F0-9]{6})$/
const regRgba = /^rgba?\(\s*([+-]?\d+)\s*,\s*([+-]?\d+)\s*,\s*([+-]?\d+)\s*(?:,\s*([+-]?[\d.]+)\s*)?\)$/
const regRgbaPer = /^rgba?\(\s*([+-]?[\d.]+)%\s*,\s*([+-]?[\d.]+)%\s*,\s*([+-]?[\d.]+)%\s*(?:,\s*([+-]?[\d.]+)\s*)?\)$/
const regHsla = /^hsla?\(\s*([+-]?\d*[.]?\d+)(?:deg)?\s*,\s*([+-]?[\d.]+)%\s*,\s*([+-]?[\d.]+)%\s*(?:,\s*([+-]?[\d.]+)\s*)?\)$/


/**
 * rgb换hsl
 * rgbToHsl([52, 203, 165, 0.8]); // -> [165, 59, 50, 0.8]
 * @param rgb 
 * @returns 
 */
export function rgbToHsl(rgb: number[]) {
  const r = rgb[0] / 255
  const g = rgb[1] / 255
  const b = rgb[2] / 255
  const min = mMin(r, g, b)
  const max = mMax(r, g, b)
  const delta = max - min
  let h
  let s
  if (max === min) {
    h = 0
  } else if (r === max) {
    h = (g - b) / delta
  } else if (g === max) {
    h = 2 + (b - r) / delta
  } else {
    h = 4 + (r - g) / delta
  }
  h = mMin(h * 60, 360)
  if (h < 0) h += 360
  const l = (min + max) / 2
  if (max === min) {
    s = 0
  } else if (l <= 0.5) {
    s = delta / (max + min)
  } else {
    s = delta / (2 - max - min)
  }
  const ret = [round(h), round(s * 100), round(l * 100)]
  if (rgb[3]) ret[3] = rgb[3]
  return ret
}

/**
 * hsl转rgb
 * hslToRgb([165, 59, 50, 0.8]); // -> [52, 203, 165, 0.8]
 * @param hsl 
 * @returns 
 */
export function hslToRgb(hsl:number[]) { 
  const h = hsl[0] / 360
  const s = hsl[1] / 100
  const l = hsl[2] / 100
  const ret = []
  let t2
  let t3
  let val
  if (hsl[3]) ret[3] = hsl[3]
  if (s === 0) {
    val = round(l * 255)
    ret[0] = ret[1] = ret[2] = val
    return ret
  }
  if (l < 0.5) {
    t2 = l * (1 + s)
  } else {
    t2 = l + s - l * s
  }
  const t1 = 2 * l - t2
  for (let i = 0; i < 3; i++) {
    t3 = h + (1 / 3) * -(i - 1)
    if (t3 < 0) t3++
    if (t3 > 1) t3--
    if (6 * t3 < 1) {
      val = t1 + (t2 - t1) * 6 * t3
    } else if (2 * t3 < 1) {
      val = t2
    } else if (3 * t3 < 2) {
      val = t1 + (t2 - t1) * (2 / 3 - t3) * 6
    } else {
      val = t1
    }
    ret[i] = round(val * 255)
  }
  return ret
}




interface IColor {
  val: number[]
  model: string
}

export class Color {
  model: string
  val: any[]
  constructor(color: string | IColor) {
    if (isStr(color)) {
      color = Color.parse(color)
    }
    this.model = color.model
    this.val = color.val
  }

  toRgb() { 
    let val = this.val
    if (this.model === 'hsl') val = hslToRgb(val)
    let prefix = 'rgba'
    if (val[3] === 1) {
      prefix = 'rgb'
      val = val.slice(0, 3)
    }
    return prefix + '(' + val.join(', ') + ')'
  }

  toHex() { 
    let val = this.val
    if (this.model === 'hsl') val = hslToRgb(val)
    var ret = hex.encode(val.slice(0, 3))
    if (ret[0] === ret[1] && ret[2] === ret[3] && ret[4] === ret[5]) {
      ret = ret[0] + ret[2] + ret[5]
    }
    return '#' + ret
  }

  toHsl() { 
    let val = this.val
    if (this.model === 'rgb') val = rgbToHsl(val)
    let prefix = 'hsla'
    if (val[3] === 1) {
      prefix = 'hsl'
      val = val.slice(0, 3)
    }
    val[1] = val[1] + '%'
    val[2] = val[2] + '%'
    return prefix + '(' + val.join(', ') + ')'
  }

  /**
   * 将颜色字符串转换为含有值及颜色模型的对象
   * Color.parse('rgb(170, 287, 204, 0.5)'); // -> {val: [170, 187, 204, 0.5], model: 'rgb'}
    const color = new Color('#abc');
    color.toRgb(); // -> 'rgb(170, 187, 204)'
    color.toHsl(); // -> 'hsl(210, 25%, 73%)'
   * @param colorStr
   * @returns
   */
  static parse(colorStr: string) {
    var i, match
    var val = [0, 0, 0, 1],
      model = 'rgb'

    /* eslint-disable no-cond-assign */
    if ((match = colorStr.match(regHexAbbr))) {
      match = match[1]
      for (i = 0; i < 3; i++) {
        val[i] = parseInt(match[i] + match[i], 16)
      }
    } else if ((match = colorStr.match(regHex))) {
      match = match[1]
      for (i = 0; i < 3; i++) {
        var i2 = i * 2
        val[i] = parseInt(match.slice(i2, i2 + 2), 16)
      }
    } else if ((match = colorStr.match(regRgba))) {
      for (i = 0; i < 3; i++) {
        val[i] = parseInt(match[i + 1], 0)
      }
      if (match[4]) val[3] = parseFloat(match[4])
    } else if ((match = colorStr.match(regRgbaPer))) {
      for (i = 0; i < 3; i++) {
        val[i] = Math.round(parseFloat(match[i + 1]) * 2.55)
      }
      if (match[4]) val[3] = parseFloat(match[4])
    } else if ((match = colorStr.match(regHsla))) {
      model = 'hsl'
      val = [
        ((parseFloat(match[1]) % 360) + 360) % 360,
        clamp(parseFloat(match[2]), 0, 100),
        clamp(parseFloat(match[3]), 0, 100),
        clamp(parseFloat(match[4]), 0, 1),
      ]
    }
    return {
      val: val,
      model: model,
    }
  }
}
