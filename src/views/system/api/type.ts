import { IPage } from '@/types/common'

export interface ApiEntity {
  apiId: number
  path: string
  remark: string
  apiGroup: string
  method: string
  editable: string //是否可编辑 系统内置数据禁止编辑 1可以编辑  0禁止编辑
  createdAt: Date
  [key: string]: any
}

export type QueryApiModel = Partial<Pick<ApiEntity, 'apiGroup' | 'method' | 'path'>> & IPage

export type EditAPiModel = Partial<ApiEntity>
