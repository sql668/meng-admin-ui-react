import {Optional } from '@/utils/type'
export type DeptModel = {
  deptId: number
  parentId: number
  deptPath: string
  deptName: string
  sort: number
  status:number
}


export type QueryFormModel = Optional<DeptModel, 'deptName' | 'status'>

export type EditFormModel = Partial<DeptModel>
