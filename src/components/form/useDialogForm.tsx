
import { FormDialog, FormLayout, FormProps } from '@formily/antd-v5'
import { SchemaField } from './base'
import { FormEvent } from './dialogForm'

export interface UseDialogFormProps extends FormProps {
  /** dialog标题 */
  title: string
  schema: any
  formValues?: any
  /** 点击新增按钮，组件内部会拦截该点击事件 */
  onClick?: (values: any) => void
  confirmHandle: FormEvent
  cancelHandle?: FormEvent
}

export function useDialogForm(props: UseDialogFormProps) {
  const { schema, title, formValues, confirmHandle, cancelHandle, ...restProps } = props
  const dialogControl = FormDialog({ title }, () => {
    return (
      <FormLayout labelCol={6} wrapperCol={10} {...restProps}>
        <SchemaField schema={schema} />
      </FormLayout>
    )
  })

  return [dialogControl]
}
