
/**
 * 将T类型的某些字段变为可选
 *
 * type queryUser = Optional<User,'username' | 'sex'>
 */
export type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>

/**
 * 筛选出T类型所有的可选类型
 */
export type GetOptional<T> = {
  [K in keyof T as T[K] extends Required<T>[K] ? never : K]: T[K]
}

/** 深度遍历，将属性为可选 */
export type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>
}

export type AnyObject = {
  [key: string]: any
  [key: number]: any
  [key: symbol]:any
}
