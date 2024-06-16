import { BaseForm, DialogForm } from '@/components/form'
import { editFormSchema, searchFormSchema } from './data'
import {
  Drawer,
  Modal,
  Pagination,
  Space,
  Table,
  TableColumnsType,
  Tabs,
  TabsProps,
} from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { useState } from 'react'
import { Form } from '@formily/core'
import { FormLayout } from '@formily/antd-v5'
import {
  deleteRoleApi,
  getRoleDetailApi,
  getRolePageApi,
  insertRoleApi,
  updateRoleApi,
  updateRoleStatusApi,
} from '@/api/system/role'
import { antdUtils, message } from '@/utils/antdUtil'
import { QueryRoleModel, RoleEntity } from './type'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { isFalse } from '@/utils/util'
import Switch from '@/components/switch'
import { Icon } from '@/components/icon'
import { MenuAuth } from './component/menuAuth'
import { ApiAuth } from './component/apiAuth'
import { DataScope } from './component/dataScope'
import { AuthButton } from '@/components/auth'

export default function Role() {
  const [selectedRow, setSelectedRow] = useState<RoleEntity>()
  const [queryKey, setQueryKey] = useState<QueryRoleModel>()
  const [open, setOpen] = useState(false)
  const queryClient = useQueryClient()
  const queryOk = (values: QueryRoleModel) => {
    setQueryKey(values)
  }
  const resetQuery = (form: Form) => {
    form.reset()
    setQueryKey(undefined)
  }
  const addBtnHandle = () => {}

  const addOk = (payload: Form, next: any) => {
    const api = isFalse(payload.values?.roleId) ? insertRoleApi : updateRoleApi
    api(payload.values, payload.values?.roleId)
      .then((res) => {
        if (res.code === 0) {
          next()
          refetch()
          antdUtils.message?.success(res.msg)
        } else {
          antdUtils.message?.error(res.msg)
          payload.setSubmitting(false)
        }
      })
      .catch((err) => {
        antdUtils.message?.error(err.message)
        payload.submitting = false
      })
  }

  const { isLoading, refetch, data } = useQuery({
    queryKey: ['sys-role', 'page', 'get', queryKey],
    queryFn: () =>
      getRolePageApi(queryKey).then((res) => {
        if (res.code === 0) {
          return res.data
        } else {
          new Error(res.msg)
        }
      }),
  })

  const pageChange = (page: number, pageSize: number) => {
    setQueryKey({ pageNum: page, pageSize: pageSize })
    //console.log(page, pageSize);
  }

  const columns: TableColumnsType<RoleEntity> = [
    {
      title: '角色名称',
      dataIndex: 'roleName',
    },
    {
      title: '角色编码',
      dataIndex: 'roleCode',
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: (val: string, row: RoleEntity) => {
        return (
          <Switch
            checkedChildren='正常'
            unCheckedChildren='停用'
            defaultChecked={val == '1' ? true : false}
            beforeChange={(checked) => {
              return new Promise((resolve) => {
                updateRoleStatusApi({ roleId: row.roleId, status: checked ? '1' : '0' }).then(
                  (res) => {
                    if (res.code === 0) {
                      queryClient.invalidateQueries({ queryKey: ['sys-role', 'page', 'get'] })
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
      title: '排序',
      dataIndex: 'sort',
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
      render: (_, record: RoleEntity) => (
        <Space size='small'>
          {record.roleId != 1 && (
            <AuthButton
              permis={['system:role:auth']}
              icon={<Icon icon='icon-park-outline:permissions' size={12} />}
              type='link'
              size='small'
              onClick={() => {
                getRoleDetailApi(record.roleId).then((res) => {
                  if (res.code === 0) {
                    setSelectedRow(res.data)
                    setOpen(true)
                  }
                })
              }}>
              分配权限
            </AuthButton>
          )}
          {record.roleId != 1 && (
            <DialogForm
              schema={editFormSchema.schema}
              {...editFormSchema.form}
              title='编辑角色'
              formValues={record}
              confirmHandle={addOk}>
              <AuthButton
                permis={['system:role:edit']}
                type='link'
                size='small'
                icon={<EditOutlined />}
                onClick={addBtnHandle}>
                编辑
              </AuthButton>
            </DialogForm>
          )}
          {record.roleId != 1 && (
            <AuthButton
              permis={['system:role:delete']}
              icon={<DeleteOutlined />}
              type='link'
              size='small'
              onClick={() => {
                Modal.confirm({
                  title: '系统提示',
                  content: `是否确认删除名称为"${record.roleName}"的数据项`,
                  onOk: () => {
                    deleteRoleApi([record.roleId || 0]).then((res) => {
                      if (res.code === 0) {
                        message?.success(res.msg)
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

  const items: TabsProps['items'] = [
    {
      key: 'menu',
      label: '菜单权限',
      children: <MenuAuth record={selectedRow}></MenuAuth>,
    },
    {
      key: 'api',
      label: '接口权限',
      children: <ApiAuth record={selectedRow}></ApiAuth>,
    },
    {
      key: 'dataScope',
      label: '数据权限',
      children: <DataScope role={selectedRow}></DataScope>,
    },
  ]

  const perTabChange = (key: string) => {
    console.log(key)
  }

  return (
    <div className='app-container overflow-auto'>
      <BaseForm
        schema={searchFormSchema.schema}
        {...searchFormSchema.form}
        onSubmit={queryOk}
        onReset={resetQuery}></BaseForm>
      <DialogForm
        schema={editFormSchema.schema}
        {...editFormSchema.form}
        title='添加角色'
        confirmHandle={addOk}>
        <AuthButton
          permis={['system:role:add']}
          type='primary'
          size='middle'
          icon={<PlusOutlined />}
          onClick={addBtnHandle}>
          新增
        </AuthButton>
      </DialogForm>
      <Table
        className='meng-admin-table'
        columns={columns}
        dataSource={data?.list}
        loading={isLoading}
        pagination={false}
        rowKey='roleId'
      />
      <div className='pagination-container'>
        <Pagination current={data?.pageNum} onChange={pageChange} total={data?.total} />
      </div>

      <FormLayout {...editFormSchema.form}></FormLayout>
      <Drawer
        title='权限分配'
        onClose={() => {
          setOpen(false)
          refetch()
        }}
        open={open}
        width={600}
        destroyOnClose={true}>
        <Tabs defaultActiveKey='menu' items={items} onChange={perTabChange} />
      </Drawer>
    </div>
  )
}
