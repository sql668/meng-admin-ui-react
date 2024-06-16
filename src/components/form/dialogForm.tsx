
import React, { ReactElement } from 'react'
import { Form } from '@formily/core'
import { FormDialog, FormLayout, FormProps } from '@formily/antd-v5'
import { SchemaField } from './base'
import { nanoid} from "nanoid"

/** 确定和取消按钮事件 */
export interface FormEvent<R = any> {
  (payload: Form, next: (payload?: Form) => R): R
}

export interface DialogFormProps extends FormProps {
  id?:string
  /** dialog标题 */
  title: string
  schema: any
  formValues?: any
  children: React.ReactNode
  /** 点击新增按钮，组件内部会拦截该点击事件 */
  onClick?: (values: any) => void
  confirmHandle: FormEvent
  cancelHandle?: FormEvent
}


export function DialogForm(props: DialogFormProps) {
  const { id = nanoid(),schema, title, formValues, confirmHandle, cancelHandle,children, ...restProps } = props
  const clickHandle = (confirmHandle: FormEvent) => {
    const dialog = FormDialog({ title }, () => {
      return (
        <FormLayout labelCol={6} wrapperCol={10} {...restProps}>
          <SchemaField schema={schema} />
        </FormLayout>
      )
    })
    dialog
      .forOpen((_, next) => {
        next({
          values: formValues,
        })
      })
      .forConfirm(confirmHandle)
      .forCancel((payload, next) => {
        if (cancelHandle) {
          cancelHandle(payload, next)
        } else {
          // 关闭弹窗
          next(payload)
        }
      })
      .open()
      .then(console.log)
  }
  return (
    <FormDialog.Portal id={ id}>
      {React.cloneElement(children as ReactElement, {
        ...(children as ReactElement).props,
        onClick: () => {
          ;(children as ReactElement).props.onClick?.()
          clickHandle(confirmHandle)
        },
      })}
    </FormDialog.Portal>
  )
}
