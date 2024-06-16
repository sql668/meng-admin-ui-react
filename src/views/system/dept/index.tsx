import { useState } from 'react'
import {  Col, Modal, Row, Space, Table, TableColumnsType, Tag } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { DeptModel, EditFormModel, QueryFormModel } from './type'
import { EditForm, QueryForm } from './form'
import { isFalse } from '@/utils/util'
import {
  deleteDeptByIdApi,
  getDeptById,
  getDeptPageApi,
  insertDeptApi,
  updateDeptApi,
} from '@/api/system/dept'
import { useQuery } from '@tanstack/react-query'
import { buildTreeFromArray } from '@/utils/tree'
import { message } from '@/utils/antdUtil'
import { InitFormData } from './data'
import dayjs from 'dayjs'
import { AuthButton } from '@/components/auth'

export default function Dept() {
  const [modalTitle, setModalTitle] = useState('添加部门')
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState<EditFormModel>(InitFormData)
  const [queryKey, setQueryKey] = useState<QueryFormModel>()
  const { isLoading, data, refetch } = useQuery({
    queryKey: ['sys-dept', 'list', 'get', queryKey],
    queryFn: () =>
      getDeptPageApi(queryKey).then((res) => {
        if (res.code === 0) {
          return buildTreeFromArray(res.data || [], 'deptId')
        } else {
          new Error(res.msg)
        }
      }),
  })

  const queryOk = (values: QueryFormModel) => {
    setQueryKey(values)
  }
  const resetQuery = () => {}
  const addBtnHandle = () => {
    setFormData(InitFormData)
    setOpen(true)
    setModalTitle('添加部门')
  }

  const editFormOk = (values: EditFormModel, allValues: EditFormModel): Promise<boolean> => {
    const api = isFalse(allValues.parentId) ? insertDeptApi : updateDeptApi
    return api(values, allValues.deptId || 0)
      .then((res) => {
        if (res.code === 0) {
          setOpen(false)
          refetch()
          message?.success(res.msg)
          return Promise.resolve(false)
        } else {
          message?.error(res.msg)
          return Promise.reject()
        }
      })
      .catch((err) => {
        message?.error(err.message)
        return Promise.reject(err)
      })
  }
  const editFormCancel = () => {
    setOpen(false)
  }

  const editBtnHandle = (deptId: number) => {
    setModalTitle('修改菜单')
    setOpen(true)
    getDeptById(deptId).then((res) => {
      if (res.code === 0) {
        setFormData(res.data || {})
      }
    })
  }

  const columns: TableColumnsType<DeptModel> = [
    {
      title: '部门名称',
      dataIndex: 'deptName',
    },
    {
      title: '状态',
      dataIndex: 'status',
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
      render: (_, record) => (
        <Space size='small'>
          <AuthButton
            permis={['system:dept:edit']}
            icon={<EditOutlined />}
            type='link'
            size='small'
            onClick={() => editBtnHandle(record.deptId || 0)}>
            修改
          </AuthButton>
          <AuthButton
            permis={['system:dept:add']}
            icon={<PlusOutlined />}
            type='link'
            size='small'
            onClick={() => {
              setModalTitle('新增菜单')
              setOpen(true)
              setFormData({ ...InitFormData, parentId: record.deptId })
            }}>
            新增
          </AuthButton>
          {record.deptId != 1 && (
            <AuthButton
              permis={['system:dept:delete']}
              icon={<DeleteOutlined />}
              type='link'
              size='small'
              onClick={() => {
                Modal.confirm({
                  title: '系统提示',
                  content: `是否确认删除名称为"${record.deptName}"的数据项`,
                  onOk: () => {
                    deleteDeptByIdApi([record.deptId || 0]).then((res) => {
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

  return (
    <div className='app-container overflow-auto'>
      <QueryForm onQuery={queryOk} onReset={resetQuery}></QueryForm>
      <Row>
        <Col span={1.5}>
          <AuthButton
            permis={['system:dept:add']}
            type='primary'
            size='middle'
            icon={<PlusOutlined />}
            onClick={addBtnHandle}>
            新增
          </AuthButton>
        </Col>
        <Col span={1.5}></Col>
      </Row>
      <Table
        className='meng-admin-table'
        columns={columns}
        dataSource={data}
        loading={isLoading}
        pagination={false}
        rowKey='deptId'
        defaultExpandAllRows={true}
        expandable={{ defaultExpandAllRows: true }}
      />

      <EditForm
        title={modalTitle}
        open={open}
        initalData={formData}
        onCancel={editFormCancel}
        onSubmit={editFormOk}></EditForm>
    </div>
  )
}
