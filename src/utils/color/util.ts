const mMin = Math.min
const mMax = Math.max
const round = Math.round


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
export function hslToRgb(hsl: number[]) {
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

/**
 * 判断是否 十六进制颜色值.
 * 输入形式可为 #fff000 #f00
 *
 * @param   String  color   十六进制颜色值
 * @return  Boolean
 */
export function isHexColor(color: string) {
  const reg = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;
  return reg.test(color);
}

/**
 * RGB 颜色值转换为 十六进制颜色值.
 * r, g, 和 b 需要在 [0, 255] 范围内
 *
 * @return  String          类似#ff00ff
 * @param r
 * @param g
 * @param b
 */
export function rgbToHex(r: number, g: number, b: number) {
  // tslint:disable-next-line:no-bitwise
  const hex = ((r << 16) | (g << 8) | b).toString(16);
  return '#' + new Array(Math.abs(hex.length - 7)).join('0') + hex;
}

/**
 * 16进制颜色值转换为rgb模式
 * @param hex 
 * @returns 
 */
export function hexToRGB(hex: string) {
  let sHex = hex.toLowerCase()
  if (isHexColor(hex)) {
    if (sHex.length === 4) {
      let sColorNew = '#'
      for (let i = 1; i < 4; i += 1) {
        sColorNew += sHex.slice(i, i + 1).concat(sHex.slice(i, i + 1))
      }
      sHex = sColorNew
    }
    const sColorChange: number[] = []
    for (let i = 1; i < 7; i += 2) {
      sColorChange.push(parseInt('0x' + sHex.slice(i, i + 2)))
    }
    return 'RGB(' + sColorChange.join(',') + ')'
  }
  return sHex
}

/**
 * 判断16进制颜色值是否属于暗色系
 * @param color 
 * @returns 
 */
export function colorIsDark(color: string) {
  if (!isHexColor(color)) return
  const [r, g, b] = hexToRGB(color)
    .replace(/(?:\(|\)|rgb|RGB)*/g, '')
    .split(',')
    .map((item) => Number(item))
  return r * 0.299 + g * 0.578 + b * 0.114 < 192
}

/**
 * 将16进制的颜色值变暗
 * Darkens a HEX color given the passed percentage
 * @param {string} color The color to process
 * @param {number} amount The amount to change the color by 百分比
 * @returns {string} The HEX representation of the processed color
 */
export function darken(color: string, amount: number) {
  color = color.indexOf('#') >= 0 ? color.substring(1, color.length) : color;
  amount = Math.trunc((255 * amount) / 100);
  return `#${subtractLight(color.substring(0, 2), amount)}${subtractLight(
    color.substring(2, 4),
    amount,
  )}${subtractLight(color.substring(4, 6), amount)}`;
}


/**
 * 将16进制的颜色值加亮，比如计算 颜色的hover
 * Lightens a 6 char HEX color according to the passed percentage
 * @param {string} color The color to change
 * @param {number} amount The amount to change the color by 变量的程度
 * @returns {string} The processed color represented as HEX
 */
export function lighten(color: string, amount: number) {
  color = color.indexOf('#') >= 0 ? color.substring(1, color.length) : color;
  amount = Math.trunc((255 * amount) / 100);
  return `#${addLight(color.substring(0, 2), amount)}${addLight(
    color.substring(2, 4),
    amount,
  )}${addLight(color.substring(4, 6), amount)}`;
}

/* Suma el porcentaje indicado a un color (RR, GG o BB) hexadecimal para aclararlo */
/**
 * Sums the passed percentage to the R, G or B of a HEX color
 * @param {string} color The color to change
 * @param {number} amount The amount to change the color by
 * @returns {string} The processed part of the color
 */
function addLight(color: string, amount: number) {
  const cc = parseInt(color, 16) + amount;
  const c = cc > 255 ? 255 : cc;
  return c.toString(16).length > 1 ? c.toString(16) : `0${c.toString(16)}`;
}

/**
 * Calculates luminance of an rgb color
 * @param {number} r red
 * @param {number} g green
 * @param {number} b blue
 */
function luminanace(r: number, g: number, b: number) {
  const a = [r, g, b].map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

/**
 * Calculates contrast between two rgb colors
 * @param {string} rgb1 rgb color 1
 * @param {string} rgb2 rgb color 2
 */
function contrast(rgb1: string[], rgb2: number[]) {
  return (
    (luminanace(~~rgb1[0], ~~rgb1[1], ~~rgb1[2]) + 0.05) /
    (luminanace(rgb2[0], rgb2[1], rgb2[2]) + 0.05)
  );
}

/**
 * Determines what the best text color is (black or white) based con the contrast with the background
 * @param hexColor - Last selected color by the user
 */
export function calculateBestTextColor(hexColor: string) {
  const rgbColor = hexToRGB(hexColor.substring(1));
  const contrastWithBlack = contrast(rgbColor.split(','), [0, 0, 0]);

  return contrastWithBlack >= 12 ? '#000000' : '#FFFFFF';
}
/**
 * Subtracts the indicated percentage to the R, G or B of a HEX color
 * @param {string} color The color to change
 * @param {number} amount The amount to change the color by
 * @returns {string} The processed part of the color
 */
function subtractLight(color: string, amount: number) {
  const cc = parseInt(color, 16) - amount;
  const c = cc < 0 ? 0 : cc;
  return c.toString(16).length > 1 ? c.toString(16) : `0${c.toString(16)}`;
}


