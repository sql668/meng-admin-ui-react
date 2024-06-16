
const ObjToStr = Object.prototype.toString

function objToStr(val:any) { 
  return ObjToStr.call(val)
}

/**
 * 是否未定义
 * @param val 
 * @returns 
 */
export function isUndef(val:any) { 
  return val === void 0
}

/**
 * 是否是字符串
 * @param val 
 * @returns 
 */
export function isStr(val:any): val is string { 
  return objToStr(val) === '[object String]'
}

/**
 * 是否是奇数
 * @param num 
 * @returns 
 */
export function isOdd(num:any) { 
  if (!isInt(num)) return false
  return num % 2 !== 0
}

/**
 * 是否是整数
 * @param val 
 * @returns 
 */
export function isInt(val:any) { 
  return isNum(val) && val % 1 === 0
}

/**
 * 是否是数值类型
 * @param val 
 * @returns 
 */
export function isNum(val:any): val is number { 
  return objToStr(val) === '[object Number]'
}