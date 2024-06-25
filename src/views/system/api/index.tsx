import { useState } from 'react'
import { Form, createForm } from '@formily/core'
import { Modal, Pagination, Space, Table, TableColumnsType } from 'antd'
import { DeleteOutlined, PlusOutlined, EditOutlined } from '@ant-design/icons'
import { BaseForm } from '@/components/form'
import { editFormSchema, searchFormSchema } from './data'
import { ApiEntity, QueryApiModel } from './type'
import dayjs from 'dayjs'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { deleteApiApi, getApiPageApi, insertAPiApi, updateAPiApi } from '@/api/system/api'
import { antdUtils } from '@/utils/antdUtil'
import { AuthButton } from '@/components/auth'

export default function Api() {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('添加Api')
  const [queryKey, setQueryKey] = useState<QueryApiModel>()
  //const queryClient = useQueryClient()
  const form = createForm()
  const [initValues, setInitValues] = useState<ApiEntity>()
  const queryOk = (values: QueryApiModel) => {
    setQueryKey(values)
  }
  const resetQuery = (form: Form) => {
    form.reset()
    setQueryKey(undefined)
  }

  const addBtnHandle = () => {
    setOpen(true)
    setTitle('添加Api')
    setInitValues(undefined)
  }

  const { isLoading, refetch, data, isPlaceholderData } = useQuery({
    queryKey: ['sys-api', 'page', 'get', queryKey],
    queryFn: () =>
      getApiPageApi(queryKey).then((res) => {
        if (res.code === 0) {
          return res.data
        } else {
          new Error(res.msg)
        }
      }),
    placeholderData: keepPreviousData,
  })

  const pageChange = (page: number, pageSize: number) => {
    setQueryKey({ pageNum: page, pageSize: pageSize })
  }

  const onCancel = () => {
    setOpen(false)
  }

  const columns: TableColumnsType<ApiEntity> = [
    {
      title: 'Api组',
      dataIndex: 'apiGroup',
    },
    {
      title: 'api路径',
      dataIndex: 'path',
    },
    {
      title: 'method',
      dataIndex: 'method',
    },
    {
      title: 'remark',
      dataIndex: 'remark',
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
      render: (_, record: ApiEntity) => (
        <Space size='small'>
          {record.editable != '0' && (
            <AuthButton
              permis={['system:api:edit']}
              type='link'
              size='small'
              icon={<EditOutlined />}
              onClick={() => {
                setOpen(true)
                setTitle('编辑api')
                setInitValues(record)
              }}>
              编辑
            </AuthButton>
          )}
          {record.editable != '0' && (
            <AuthButton
              permis={['system:api:delete']}
              icon={<DeleteOutlined />}
              type='link'
              size='small'
              onClick={() => {
                Modal.confirm({
                  title: '系统提示',
                  content: `是否确认删除路径为"${record.path}"的数据项`,
                  onOk: () => {
                    deleteApiApi([record.apiId || 0]).then((res) => {
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
        </Space>
      ),
    },
  ]

  return (
    <div className='app-container'>
      <BaseForm
        schema={searchFormSchema.schema}
        {...searchFormSchema.form}
        onSubmit={queryOk}
        onReset={resetQuery}></BaseForm>
      <AuthButton
        permis={['system:api:add']}
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
        loading={isLoading || isPlaceholderData}
        pagination={false}
        rowKey='apiId'
      />
      <div className='pagination-container'>
        <Pagination
          current={data?.pageNum}
          onChange={pageChange}
          total={data?.total}
          showTotal={(total: number) => `共 ${total} 条`}
          showSizeChanger
        />
      </div>

      <Modal
        open={open}
        title={title}
        width={600}
        destroyOnClose
        maskClosable={false}
        okButtonProps={{ autoFocus: true }}
        onCancel={onCancel}
        onOk={() => {
          form
            .submit<ApiEntity>()
            .then((values: ApiEntity) => {
              const api = title === '添加Api' ? insertAPiApi : updateAPiApi
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
          onSubmit={queryOk}
          onReset={resetQuery}></BaseForm>
      </Modal>
    </div>
  )
}
