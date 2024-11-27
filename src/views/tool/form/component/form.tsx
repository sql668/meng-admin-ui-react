import { Button, Col, Form, Input, InputNumber, Modal, Radio, Row, Select } from 'antd'
import { EditFormProps, QueryFormModel, QueryFormProps } from '../type'
import { useState } from 'react'
// import { useQuery } from "@tanstack/react-query";
// import { stubFalse } from "lodash-es";

export function QueryForm(props: QueryFormProps) {
  const { onQuery } = props
  const [queryForm] = Form.useForm()

  const reset = () => {
    queryForm.resetFields()
    onQuery(queryForm.getFieldsValue() as QueryFormModel)
  }

  return (
    <Form form={queryForm} layout='inline' className='mg-search-form-inline' onFinish={onQuery}>
      <Form.Item label='表单名称' name='formName'>
        <Input placeholder='请输入表单名称' />
      </Form.Item>
      <Form.Item<QueryFormModel> label='状态' name='status'>
        <Select
          placeholder='请选择状态'
          options={[
            { value: 1, label: <span>正常</span> },
            { value: 0, label: <span>停用</span> },
          ]}
        />
      </Form.Item>
      <Form.Item<QueryFormModel> label='典型案例' name='isModel'>
        <Select
          placeholder='请选择状态'
          options={[
            { value: 1, label: <span>正常</span> },
            { value: 0, label: <span>停用</span> },
          ]}
        />
      </Form.Item>
      <Form.Item className='mg-search-form-inline-opt'>
        <Button type='primary' htmlType='submit'>
          查询
        </Button>
        <Button onClick={reset}>重置</Button>
      </Form.Item>
    </Form>
  )
}

export function EditForm(props: EditFormProps) {
  const { title, open, initalData, onCancel, onSubmit } = props
  const [form] = Form.useForm()
  const [_, setLoading] = useState(false)
  const afterOpenChangeHandle = (open: boolean) => {
    if (open) {
      form.setFieldsValue(initalData)
    } else {
      form.resetFields()
      //afterClose && afterClose()
    }
  }
  return (
    <Modal
      open={open}
      title={title}
      width={600}
      destroyOnClose
      okButtonProps={{ autoFocus: true }}
      onCancel={onCancel}
      onOk={async () => {
        try {
          const values = await form?.validateFields()
          setLoading(true)
          onSubmit &&
            onSubmit(values, form?.getFieldsValue(true))
              .then(setLoading)
              .catch((_) => {
                setLoading(false)
              })
        } catch (error) {
          //console.log(error)
        }
      }}
      afterOpenChange={afterOpenChangeHandle}>
      <Form form={form} labelCol={{ flex: '120px' }}>
        <Row>
          <Col span={24}>
            <Form.Item
              label='表单名称'
              name='formName'
              rules={[{ required: true, message: '请输入表单名称!' }]}>
              <Input placeholder='请输入表单名称' />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label='显示排序' name='sort'>
              <InputNumber min={1} />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label='状态' name='status'>
              <Radio.Group>
                <Radio value={1}>正常</Radio>
                <Radio value={0}>停用</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label='是否作为典型案例' name='isModel'>
              <Radio.Group>
                <Radio value={true}>是</Radio>
                <Radio value={false}>否</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  )
}
