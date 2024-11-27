import { IPage } from '@/types/common'
//import { Optional } from "@/utils/type"

export type FormInfoModel = {
  formId?: number
  formName: string
  jsonSchema?: string
  isModel: boolean // 是否作为典型案例
  status: number // 1 正常  0 停用
  sort: number
}

// export type QueryFormModel = Optional<FormInfoModel, 'formName' | 'status' | 'isModel'> & IPage
export type QueryFormModel = Partial<Pick<FormInfoModel, 'formName' | 'status' | 'isModel'>> &
  IPage & { formId?: string }

export interface QueryFormProps {
  onQuery: (values: QueryFormModel) => void
  onReset?: () => void
}

export interface EditFormProps {
  onCancel: () => void
  onSubmit: (values: FormInfoModel, all: FormInfoModel) => Promise<boolean>
  //form: FormInstance
  initalData?: FormInfoModel
  title: string
  open: boolean
}
