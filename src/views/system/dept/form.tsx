import { Button, Col, Form, Input, InputNumber, Modal, Radio, Row, Select, TreeSelect } from 'antd'
import { RetweetOutlined, SearchOutlined } from '@ant-design/icons'

import { EditFormModel, QueryFormModel } from './type'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getDeptTreeApi } from '@/api/system/dept'
import { buildTreeFromArray } from '@/utils/tree'

export interface QueryFormProps {
  onQuery: (values: QueryFormModel) => void
  onReset?: () => void
}

export function QueryForm(props: QueryFormProps) {
  const { onQuery } = props
  const [queryForm] = Form.useForm()
  const reset = () => {
    queryForm.resetFields()
    onQuery(queryForm.getFieldsValue() as QueryFormModel)
  }
  return (
    <Form form={queryForm} layout='inline' className='mg-search-form-inline' onFinish={onQuery}>
      <Form.Item<QueryFormModel> label='部门名称' name='deptName'>
        <Input placeholder='请输入部门名称' />
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
      <Form.Item<QueryFormModel> className='mg-search-form-inline-opt'>
        <Button type='primary' size='middle' icon={<SearchOutlined />} htmlType='submit'>
          查询
        </Button>
        <Button icon={<RetweetOutlined />} onClick={reset}>
          重置
        </Button>
      </Form.Item>
    </Form>
  )
}

export interface EditFormProps {
  onCancel: () => void
  onSubmit: (values: EditFormModel, all: EditFormModel) => Promise<boolean>
  //form: FormInstance
  initalData?: EditFormModel
  title: string
  open: boolean
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

  const { data: deptTree } = useQuery({
    queryKey: ['sys-dept', 'tree', 'get'],
    queryFn: () =>
      getDeptTreeApi().then((res) => {
        if (res.code === 0) {
          return buildTreeFromArray(res.data || [], 'deptId')
        } else {
          new Error(res.msg)
        }
      }),
  })

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
          {initalData?.deptId !== 1 && (
            <Col span={24}>
              <Form.Item
                label='上级部门'
                name='parentId'
                rules={[{ required: true, message: '请选择上级部门!' }]}>
                <TreeSelect
                  showSearch
                  style={{ width: '100%' }}
                  dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                  placeholder='请选择上级部门'
                  allowClear
                  treeData={deptTree}
                  fieldNames={{
                    label: 'deptName',
                    value: 'deptId',
                  }}
                />
              </Form.Item>
            </Col>
          )}

          <Col span={12}>
            <Form.Item
              label='部门名称'
              name='deptName'
              rules={[{ required: true, message: '请输入部门名称!' }]}>
              <Input placeholder='请输入部门名称' />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label='负责人' name='leader'>
              <Input placeholder='请输入部门负责人姓名' />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label='显示排序' name='sort'>
              <InputNumber min={1} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label='状态' name='status'>
              <Radio.Group>
                <Radio value={1}>正常</Radio>
                <Radio value={0}>停用</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  )
}
