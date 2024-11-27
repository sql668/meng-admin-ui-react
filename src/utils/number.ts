import { isUndef } from './is'

/**
 * 将数字限定于指定区间
 * clamp(-10, -5, 5); // -> -5
clamp(10, -5, 5); // -> 5
clamp(2, -5, 5); // -> 2
clamp(10, 5); // -> 5
clamp(2, 5); // -> 2
 * @param n 要处理的数字
 * @param lower  下限
 * @param upper 上限
 * @returns 
 */
export function clamp(n: number, lower: any, upper: number) {
  if (isUndef(upper)) {
    upper = lower
    lower = undefined
  }
  if (!isUndef(lower) && n < lower) return lower
  if (n > upper) return upper
  return n
}
