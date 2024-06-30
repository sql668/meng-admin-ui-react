import { Icon } from '@/components/icon'
import {
  Col,
  Input,
  Modal,
  Pagination,
  Row,
  Space,
  Table,
  TableColumnsType,
} from 'antd'
//import { createForm, Form, Field, FieldDataSource } from '@formily/core'
import { DeleteOutlined, PlusOutlined, EditOutlined } from '@ant-design/icons'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Form, FieldDataSource, createForm } from '@formily/core'
import { getDeptTreeApi } from '@/api/system/dept'
import { buildTreeFromArray } from '@/utils/tree'
import { useRef, useState } from 'react'
import { BaseForm } from '@/components/form'
import { editFormSchema, searchFormSchema } from './data'
import { QueryUserModel, UserEntity } from './type'
import {
  deleteUserApi,
  getUserPageApi,
  insertUserApi,
  resetPwdApi,
  updateUserApi,
  updateUserStatusApi,
} from '@/api/system/user'
import dayjs from 'dayjs'
import Switch from '@/components/switch'
import { antdUtils } from '@/utils/antdUtil'
import { getRolePageApi } from '@/api/system/role'
import { AuthButton } from '@/components/auth'
import { Tree as FTree } from '@fdesign/component'
export default function User() {

  const [filterText, setFilterText] = useState('')
  const [queryKey, setQueryKey] = useState<QueryUserModel>()
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('添加用户')
  const queryClient = useQueryClient()
  const form = createForm()
  const [initValues, setInitValues] = useState<UserEntity>()
  const inputValueRef = useRef<string>('')

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

  const queryOk = (values: QueryUserModel) => {
    setQueryKey(values)
  }
  const resetQuery = (form: Form) => {
    form.reset()
    setQueryKey(undefined)
  }

  const { isLoading, refetch, data } = useQuery({
    queryKey: ['sys-user', 'page', 'get', queryKey],
    queryFn: () =>
      getUserPageApi(queryKey).then((res) => {
        if (res.code === 0) {
          return res.data
        } else {
          new Error(res.msg)
        }
      }),
  })

  const pageChange = (page: number, pageSize: number) => {
    setQueryKey({ ...queryKey,pageNum: page, pageSize: pageSize })
  }

  const addBtnHandle = () => {
    setOpen(true)
    setTitle('添加用户')
    setInitValues(undefined)
  }

  const onCancel = () => {
    setOpen(false)
  }

  const { data: roleData } = useQuery({
    queryKey: ['sys-role', 'page', 'get', { pageNum: 1, pageSize: 1000 }],
    queryFn: () =>
      getRolePageApi({ pageNum: 1, pageSize: 1000 }).then((res) => {
        if (res.code === 0) {
          return res.data.list
        } else {
          new Error(res.msg)
        }
      }),
  })

  const loadDeptData = async () => {
    //const nickName = field.query('nickName').get('value')

    return new Promise<FieldDataSource>((resolve) => {
      resolve(deptTree || [])
    })
  }

  // 函数可以接收field: Field
  const loadRoleTree = async () => {
    //const userName = field.query('userName').get('value')

    return new Promise<FieldDataSource>((resolve) => {
      resolve(roleData || [])
    })
  }

  const loadRemoteDataGroup = {
    deptId: loadDeptData,
    roleId: loadRoleTree,
  }

  const columns: TableColumnsType<UserEntity> = [
    {
      title: '用户名称',
      dataIndex: 'userName',
    },
    {
      title: '用户昵称',
      dataIndex: 'nickName',
    },
    {
      title: '部门',
      dataIndex: 'dept',
      render: (_, row: UserEntity) => {
        return <span>{row.dept?.deptName}</span>
      },
    },
    {
      title: '手机号码',
      dataIndex: 'phone',
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: (val: string, row: UserEntity) => {
        return (
          <Switch
            checkedChildren='正常'
            unCheckedChildren='停用'
            disabled={row.editable == '0'}
            defaultChecked={val == '1' ? true : false}
            beforeChange={(checked) => {
              return new Promise((resolve) => {
                updateUserStatusApi({ userId: row.userId, status: checked ? '1' : '0' }).then(
                  (res) => {
                    if (res.code === 0) {
                      queryClient.invalidateQueries({ queryKey: ['sys-user', 'page', 'get'] })
                      resolve()
                    } else {
                      antdUtils.message?.error(res.msg)
                    }
                  },
                )
              })
            }}
          />
        )
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      render: (val: Date) => {
        return <span>{dayjs(val).format('YYYY-MM-DD HH:mm:ss')}</span>
      },
    },
    {
      title: '操作',
      key: 'action',
      className: 'action-col',
      render: (_, record: UserEntity) => (
        <Space size='small'>
          {record.editable != '0' && (
            <AuthButton
              permis={['system:user:edit']}
              type='link'
              size='small'
              icon={<EditOutlined />}
              onClick={() => {
                setOpen(true)
                setTitle('编辑用户')
                setInitValues(record)
              }}>
              编辑
            </AuthButton>
          )}
          {record.editable != '0' && (
            <AuthButton
              permis={['system:user:delete']}
              icon={<DeleteOutlined />}
              type='link'
              size='small'
              onClick={() => {
                Modal.confirm({
                  title: '系统提示',
                  content: `是否确认删除名称为"${record.userName}"的数据项`,
                  onOk: () => {
                    deleteUserApi([record.userId || 0]).then((res) => {
                      if (res.code === 0) {
                        antdUtils.message?.success(res.msg)
                        refetch()
                      }
                    })
                  },
                })
              }}>
              删除
            </AuthButton>
          )}
          {record.editable != '0' && (
            <AuthButton
              permis={['system:user:resetPwd']}
              icon={<Icon icon='icon-park-outline:key' size={12} />}
              type='link'
              size='small'
              onClick={() => {
                Modal.confirm({
                  title: '系统提示',
                  content: (
                    <>
                      <p>是否确认重置名称为"{record.userName}"的密码</p>
                      <Input
                        onChange={({ target: { value } }) => {
                          inputValueRef.current = value
                        }}></Input>
                    </>
                  ),
                  onOk: async () => {
                    try {
                      if (!inputValueRef.current.trim()) {
                        antdUtils.message?.warning('请输入密码')
                        //return Promise.reject()
                        return Promise.reject('密码不能为空')
                      }
                      resetPwdApi({ userId: record.userId, password: inputValueRef.current }).then(
                        (res) => {
                          if (res.code === 0) {
                            inputValueRef.current = ''
                            antdUtils.message?.success(res.msg)
                            refetch()
                          }
                        },
                      )
                    } catch (error) {}
                  },
                })
              }}>
              重置密码
            </AuthButton>
          )}
        </Space>
      ),
    },
  ]

  const deptTreeSelectHandle = (val:any) => {
    setQueryKey({
      ...queryKey,
      deptId: `/${val.checkedKeys[0]}/`,
    })
  }

  

  return (
    <div className='app-container'>
      <Row gutter={20}>
        <Col span={4}>
          <div className='head-container'>
            <Input.Search placeholder='请输入部门名称' onSearch={setFilterText} />
          </div>
          <div className='head-container'>
            {/* <Tree
              blockNode={true}
              onExpand={onExpand}
              expandedKeys={expandedKeys}
              autoExpandParent={autoExpandParent}
              filterTreeNode={filterTreeNode as any}
              treeData={deptTree as any}
              fieldNames={{
                title: 'deptName',
                key: 'deptId',
              }}></Tree> */}
            <FTree
              treeData={deptTree as any}
              fieldNames={{
                title: 'deptName',
                key: 'deptId',
              }}
              expandAll={true}
              key='deptId'
              searchValue={filterText}
              treeNodeFilterProp='deptName'
              onSelect={deptTreeSelectHandle}></FTree>
          </div>
        </Col>
        <Col span={20}>
          <BaseForm
            schema={searchFormSchema.schema}
            {...searchFormSchema.form}
            onSubmit={queryOk}
            onReset={resetQuery}></BaseForm>
          <AuthButton
            permis={['system:user:add']}
            type='primary'
            size='middle'
            icon={<PlusOutlined />}
            onClick={addBtnHandle}>
            新增
          </AuthButton>
          <Table
            className='meng-admin-table'
            columns={columns}
            dataSource={data?.list}
            loading={isLoading}
            pagination={false}
            rowKey='userId'
          />
          <div className='pagination-container'>
            <Pagination current={data?.pageNum} onChange={pageChange} total={data?.total} />
          </div>
        </Col>
      </Row>

      <Modal
        open={open}
        title={title}
        width={600}
        destroyOnClose
        okButtonProps={{ autoFocus: true }}
        onCancel={onCancel}
        onOk={() => {
          form
            .submit<UserEntity>()
            .then((values: UserEntity) => {
              const api = title === '添加用户' ? insertUserApi : updateUserApi
              api(values).then((res) => {
                if (res.code === 0) {
                  setOpen(false)
                  refetch()
                  antdUtils.message?.success(res.msg)
                } else {
                  antdUtils.message?.error(res.msg)
                }
              })
            })
            .catch(console.error)
        }}>
        <BaseForm
          mode='edit'
          form={form}
          schema={editFormSchema.schema}
          initValues={initValues}
          {...editFormSchema.form}
          loadDataGroup={loadRemoteDataGroup}
          onSubmit={queryOk}
          onReset={resetQuery}></BaseForm>
      </Modal>

      <Modal title='密码重置'>
        <Input></Input>
      </Modal>
    </div>
  )
}
