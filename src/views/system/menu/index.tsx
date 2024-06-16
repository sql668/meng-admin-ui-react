import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  RetweetOutlined,
  SearchOutlined,
} from '@ant-design/icons'
import {
  Button,
  Col,
  Form,
  Input,
  Row,
  Select,
  type FormProps,
  TreeSelect,
  Radio,
  InputNumber,
  message,
  Table,
  TableColumnsType,
  Space,
  Modal,
  Tag,
} from 'antd'
import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { CreateFormModalProps, MenuModel, SearchFormField } from './type'
import { useMemo, useState } from 'react'
import BaseFormModal from '@/components/common/form-modal'
import {
  deleteMenuById,
  getMenuById,
  getMenuListApi,
  insertMenuApi,
  updateMenuApi,
} from '@/api/system/menu'
import { buildTreeFromArray } from '@/utils/tree'
import { cleanEmptyObj } from '@/utils/util'
import { Icon, IconSelect } from '@/components/icon'
import { AuthButton } from '@/components/auth'

const InitFormData: MenuModel = {
  parentId: 0,
  menuType: 'M',
  menuName: '',
  viewType: '1',
  sort: 0,
  visible: '1',
  status: '1',
  path: '',
}

const CreateMenuModal: React.FC<CreateFormModalProps> = (props) => {
  const [form] = Form.useForm()

  const { data } = useQuery({
    queryKey: ['sys-menu', 'menu', 'get', {}],
    queryFn: () =>
      getMenuListApi({}).then((res) => {
        if (res.code === 0) {
          return buildTreeFromArray(res.data || [], 'menuId')
        } else {
          new Error(res.msg)
        }
      }),
  })

  const menuTree = useMemo(() => {
    const treeSelectData: Record<string, any>[] = [
      {
        menuName: '主目录',
        menuId: 0,
      },
    ]
    treeSelectData[0].children = data
    return treeSelectData
  }, [data])

  const modalOpen = () => {
    form.setFieldsValue(props.initialValues)
    setTemp(props.initialValues)
  }

  const [temp, setTemp] = useState<MenuModel>(props.initialValues)

  const fieldChange = (_: any, allFields: any) => {
    setTemp(allFields)
  }

  return (
    <BaseFormModal {...props} form={form} afterOpen={modalOpen}>
      <Form form={form} labelCol={{ flex: '120px' }} onValuesChange={fieldChange}>
        <Row>
          <Col span={24}>
            <Form.Item label='上级菜单' name='parentId'>
              <TreeSelect
                showSearch
                style={{ width: '100%' }}
                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                placeholder='请选择父级菜单'
                allowClear
                treeData={menuTree}
                fieldNames={{
                  label: 'menuName',
                  value: 'menuId',
                }}
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label='菜单类型' name='menuType'>
              <Radio.Group>
                <Radio value='M'>目录</Radio>
                <Radio value='C'>菜单</Radio>
                <Radio value='F'>按钮</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label='菜单名称'
              name='menuName'
              rules={[{ required: true, message: '请输入菜单名称!' }]}>
              <Input placeholder='请输入菜单名称' />
            </Form.Item>
          </Col>
          {temp.menuType != 'F' && (
            <Col span={12}>
              <Form.Item label='图标' name='icon'>
                <IconSelect showSearch></IconSelect>
              </Form.Item>
            </Col>
          )}
          <Col span={12}>
            <Form.Item label='显示排序' name='sort'>
              <InputNumber min={1} />
            </Form.Item>
          </Col>

          {temp.menuType != 'F' && (
            <Col span={12}>
              <Form.Item label='显示类型' name='viewType'>
                <Radio.Group>
                  <Radio value='1'>普通</Radio>
                  <Radio value='2'>外链</Radio>
                  <Radio value='3'>内嵌</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
          )}

          <Form.Item noStyle shouldUpdate>
            {({ getFieldValue }) =>
              getFieldValue('menuType') != 'F' ? (
                <Col span={12}>
                  <Form.Item
                    name='path'
                    label='路由地址'
                    rules={[{ required: true, message: '请输入路由地址!' }]}>
                    <Input placeholder='请输入路由地址' />
                  </Form.Item>
                </Col>
              ) : null
            }
          </Form.Item>

          {temp.menuType === 'C' && (
            <Col span={12}>
              <Form.Item label='组件路径' name='component'>
                <Input placeholder='请输入组件路径' />
              </Form.Item>
            </Col>
          )}
          {temp.menuType === 'F' && (
            <Col span={12}>
              <Form.Item label='权限标识' name='permission'>
                <Input placeholder='请输入权限标识' />
              </Form.Item>
            </Col>
          )}
          {temp.menuType === 'C' && temp.viewType != '1' && (
            <Col span={12}>
              <Form.Item label='链接地址' name='linkUrl'>
                <Input placeholder='请输入链接地址' />
              </Form.Item>
            </Col>
          )}
          {temp.menuType === 'C' && (
            <Col span={12}>
              <Form.Item label='是否Layout' name='hasLayout'>
                <Radio.Group>
                  <Radio value='1'>是</Radio>
                  <Radio value='0'>否</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
          )}
          {temp.menuType != 'F' && (
            <Col span={12}>
              <Form.Item label='显示状态' name='visible'>
                <Radio.Group>
                  <Radio value='1'>显示</Radio>
                  <Radio value='0'>隐藏</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
          )}
          {temp.menuType != 'F' && (
            <Col span={12}>
              <Form.Item label='是否缓存' name='noCache'>
                <Radio.Group>
                  <Radio value={false}>缓存</Radio>
                  <Radio value={true}>不缓存</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
          )}

          <Col span={12}>
            <Form.Item label='菜单状态' name='status'>
              <Radio.Group>
                <Radio value='1'>正常</Radio>
                <Radio value='0'>停用</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </BaseFormModal>
  )
}

export default function Menu() {
  const [form] = Form.useForm()
  const [title, setTitle] = useState('添加菜单')
  const [open, setOpen] = useState(false)
  const [initialValues, setInitialValues] = useState<MenuModel>(InitFormData)
  const [queryKey, setQueryKey] = useState<SearchFormField>({})
  const { isLoading, data, refetch } = useQuery({
    queryKey: ['sys-menu', 'menu', 'get', queryKey],
    queryFn: () =>
      getMenuListApi(queryKey).then((res) => {
        if (res.code === 0) {
          return buildTreeFromArray(res.data || [], 'menuId')
        } else {
          new Error(res.msg)
        }
      }),
  })

  const queryOk: FormProps<SearchFormField>['onFinish'] = (values) => {
    setQueryKey(cleanEmptyObj(values))
  }
  const onReset = () => {
    form.resetFields()
    queryOk({})
  }

  const handleOk = (values: MenuModel, allValues: MenuModel): Promise<boolean> => {
    const api = allValues.menuId !== undefined ? updateMenuApi : insertMenuApi

    return api(values, allValues.menuId || 0)
      .then((res) => {
        if (res.code === 0) {
          setOpen(false)
          refetch()
          message.success(res.msg)
          return Promise.resolve(false)
        } else {
          message.error(res.msg)
          return Promise.reject()
        }
      })
      .catch((err) => {
        message.error(err.message)
        return Promise.reject(err)
      })
  }

  const handleCancel = () => {
    setOpen(false)
  }

  const addModalOpen = () => {
    setOpen(true)
    setInitialValues(InitFormData)
  }

  const editBtnHandle = (menuId: number) => {
    setTitle('修改菜单')
    setOpen(true)
    getMenuById(menuId).then((res) => {
      if (res.code === 0) {
        setInitialValues(res.data || {})
      }
    })
  }

  const columns: TableColumnsType<MenuModel> = [
    {
      title: '菜单名称',
      dataIndex: 'menuName',
    },
    {
      title: '图标',
      dataIndex: 'icon',
      width: 80,
      render: (val: string) => {
        return <Icon icon={val}></Icon>
      },
    },
    {
      title: '路由地址',
      dataIndex: 'path',
    },
    {
      title: '权限字符标识',
      dataIndex: 'permission',
    },
    {
      title: '组件路径',
      dataIndex: 'component',
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      render: (val: string) => {
        if (val == '1') {
          return <Tag color='success'>正常</Tag>
        } else {
          return <Tag color='error'>停用</Tag>
        }
      },
    },
    {
      title: '排序',
      dataIndex: 'sort',
      width: '100px',
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      width: 180,
      render: (val: Date) => {
        return <span>{dayjs(val).format('YYYY-MM-DD HH:mm:ss')}</span>
      },
    },
    {
      title: '操作',
      key: 'action',
      width: '200px',
      className: 'action-col',
      render: (_, record) => (
        <Space size='small'>
          {record.path != 'noLayout' && (
            <AuthButton
              permis={['system:menu:edit']}
              icon={<EditOutlined />}
              type='link'
              size='small'
              onClick={() => editBtnHandle(record.menuId || 0)}>
              修改
            </AuthButton>
          )}

          <AuthButton
            permis={['system:menu:add']}
            icon={<PlusOutlined />}
            type='link'
            size='small'
            onClick={() => {
              setTitle('新增菜单')
              setOpen(true)
              setInitialValues({ ...InitFormData, parentId: record.menuId })
            }}>
            新增
          </AuthButton>
          {record.path != 'noLayout' && (
            <AuthButton
              permis={['system:menu:delete']}
              icon={<DeleteOutlined />}
              type='link'
              size='small'
              onClick={() => {
                Modal.confirm({
                  title: '系统提示',
                  content: `是否确认删除名称为"${record.menuName}"的数据项`,
                  onOk: () => {
                    // 删除操作
                    deleteMenuById([record.menuId || 0]).then((res) => {
                      if (res.code === 0) {
                        message.success(res.msg)
                        //getData()
                        refetch()
                      }
                    })
                  },
                })
              }}>
              删除
            </AuthButton>
          )}
        </Space>
      ),
    },
  ]

  return (
    <div className='app-container overflow-auto'>
      <Form form={form} layout='inline' className='mg-search-form-inline' onFinish={queryOk}>
        <Form.Item<SearchFormField> label='菜单名称' name='menuName'>
          <Input placeholder='请输入菜单名称' />
        </Form.Item>
        <Form.Item label='状态' name='status'>
          <Select
            placeholder='请选择状态'
            options={[
              { value: '1', label: <span>正常</span> },
              { value: '0', label: <span>停用</span> },
            ]}
          />
        </Form.Item>
        <Form.Item<SearchFormField> className='mg-search-form-inline-opt'>
          <Button type='primary' size='middle' icon={<SearchOutlined />} htmlType='submit'>
            查询
          </Button>
          <Button icon={<RetweetOutlined />} onClick={onReset}>
            重置
          </Button>
        </Form.Item>
      </Form>
      <Row>
        <Col span={1.5}>
          <AuthButton
            permis={['system:menu:add']}
            type='primary'
            size='middle'
            icon={<PlusOutlined />}
            onClick={addModalOpen}>
            新增
          </AuthButton>
        </Col>
        <Col span={1.5}></Col>
      </Row>

      <Table
        columns={columns}
        dataSource={data}
        loading={isLoading}
        pagination={false}
        rowKey='menuId'
      />

      <CreateMenuModal
        title={title}
        open={open}
        width={760}
        onOk={handleOk}
        onCancel={handleCancel}
        initialValues={initialValues}
      />
    </div>
  )
}
