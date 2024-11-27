import { Button, Space } from 'antd'
import { RetweetOutlined, SearchOutlined } from '@ant-design/icons'
import { Form } from '@formily/core'
import { cloneDeep } from 'lodash-es'

export interface FormActionProps {
  form: Form
  onSubmit?: (values: any) => void
  onReset?: () => void
}

export function FormAction(props: FormActionProps) {
  const { onReset, onSubmit, form } = props
  return (
    <Space>
      <Button
        type='primary'
        size='middle'
        icon={<SearchOutlined />}
        onClick={() => {
          onSubmit && onSubmit(cloneDeep(form.values))
        }}>
        查询
      </Button>
      <Button
        icon={<RetweetOutlined />}
        onClick={() => {
          form.reset()
          onReset && onReset()
        }}>
        重置
      </Button>
    </Space>
  )
}
