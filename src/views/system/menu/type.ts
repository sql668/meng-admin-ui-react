import { BaseFormModalProps } from '@/components/common/form-modal'
import { type FormInstance } from 'antd'

export interface MenuModel {
  menuId?: number
  menuName?: string
  title?: string
  icon?: string
  path?: string
  paths?: string
  parentId?: number
  menuType?: string
  viewType?: string
  action?: string
  noCache?: boolean
  breadcrumb?: string
  component?: string
  sort?: number
  visible?: string
  status?: string
  createdAt?: string
}

export type SearchFormField = {
  menuName?: string
  status?: string
}

// export interface CreateMenuFormValue {
//   parentId?: number
//   menuType: string
//   viewType: string
//   menuName?: string
//   sort?: number
//   path?: string
//   visible?: string
//   status?: string
// }

export interface CreateMenuFormProps {
  initialValues: MenuModel
  onFormInstanceReady: (instance: FormInstance<MenuModel>) => void
}

// export interface CreateFormModalProps {
//   title: string
//   open: boolean
//   onOk: (values: CreateMenuFormValue) => Promise<boolean>
//   onCancel: () => void
//   initialValues: CreateMenuFormValue
// }

export type CreateFormModalProps = Omit<BaseFormModalProps<MenuModel>, 'form' | 'children'>
