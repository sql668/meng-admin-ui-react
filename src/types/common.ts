export interface IPage {
  pageNum?: number
  pageSize?: number
}

export interface DeptTreeVo {
  key: number
  title: string
  children?: DeptTreeVo[]
}
