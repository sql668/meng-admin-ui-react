
const ObjToStr = Object.prototype.toString

function objToStr(val:any) { 
  return ObjToStr.call(val)
}

/** 是否是原始值 */
export const isPrimitive = (value:any) => {
  // return value !== Object(value) 也可以使用这种方法
  return value === null || (typeof value !== 'object' && typeof value !== 'function');
}

/** 按内容比较是否相等，不按地址比较 */
export const isEqual = (obj1: any, obj2: any) => {
  if(isPrimitive(obj1) || isPrimitive(obj2)){
    return Object.is(obj1,obj2)
  }

  if(Object.keys(obj1).length !== Object.keys(obj2).length){
    return false
  }

  for (let key in obj1) {
    if (!obj2.hasOwnProperty(key)) {
      return false;
    }
    if(!isEqual(obj1[key],obj2[key])){
        return false
    }
  }
  return true;
}

export const depsIsEqual = (obj1: any, obj2: any) => {
  if(isPrimitive(obj1) || isPrimitive(obj2)){
    return Object.is(obj1,obj2)
  }

  if (typeof obj1 === "function" || typeof obj2 === "function") { 
    return Object.is(obj1, obj2)
  }

  if(Object.keys(obj1).length !== Object.keys(obj2).length){
    return false
  }

  for (let key in obj1) {
    if (!obj2.hasOwnProperty(key)) {
      return false;
    }
    if(!isEqual(obj1[key],obj2[key])){
        return false
    }
  }
  return true;
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

export const isStringNumber = (val: string): boolean => {
  if (!isStr(val)) {
    return false
  }
  return !Number.isNaN(Number(val))
}
export function isArray(val:any): val is Array<any> {
  return Array.isArray(val)
}