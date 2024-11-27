import { FormInstance, Modal } from 'antd'
import { Store } from 'antd/es/form/interface'
import { useEffect, useState } from 'react'

export interface BaseFormModalProps<T extends Store> {
  title: string
  open: boolean
  width?: number
  onOk?: (values: T, allValues: T) => Promise<boolean>
  onCancel?: () => void
  onFieldError?: (error: any) => void
  afterOpen?: () => void
  afterClose?: () => void
  initialValues: T
  form: FormInstance<T>
  children: React.ReactNode
}

function BaseFormModal<T extends Store>(props: BaseFormModalProps<T>) {
  const {
    title,
    open,
    width = 680,
    onCancel,
    onOk,
    onFieldError,
    afterOpen,
    afterClose,
    children,
    form,
  } = props
  //const [form] = Form.useForm()
  const [formInstance, setFormInstance] = useState<FormInstance>()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    //setFormInstance(form)
    setFormInstance(form)
  }, [])

  const afterOpenChangeHandle = (open: boolean) => {
    if (open) {
      afterOpen && afterOpen()
    } else {
      afterClose && afterClose()
    }
  }

  return (
    <Modal
      title={title}
      open={open}
      width={width}
      okText='确定'
      cancelText='取消'
      okButtonProps={{ autoFocus: true }}
      onCancel={onCancel}
      destroyOnClose
      afterClose={() => formInstance?.resetFields()}
      confirmLoading={loading}
      onOk={async () => {
        try {
          const values = await formInstance?.validateFields()
          setLoading(true)
          onOk &&
            onOk(values, formInstance?.getFieldsValue(true))
              .then(setLoading)
              .catch((err) => {
                console.error(err)
                setLoading(false)
              })
        } catch (error) {
          onFieldError?.(error)
        }
      }}
      afterOpenChange={afterOpenChangeHandle}>
      {children}
      {/* <Form form={form} initialValues={initialValues}>
        {children}
      </Form> */}
    </Modal>
  )
}

export default BaseFormModal
