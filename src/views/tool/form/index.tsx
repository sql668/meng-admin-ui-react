import { useState } from "react";
import { QueryForm } from "./component/form";
import { FormInfoModel, QueryFormModel } from "./type";
import { Col, Pagination, Row, Space, Table, TableColumnsType, Tag } from "antd";
import { AuthButton } from "@/components/auth";
import { EditOutlined, PlusOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router";
import dayjs from "dayjs";
import { useQuery } from "@tanstack/react-query";
import { getFormGeneratePageApi } from "@/api/tools/form-generate";

export default function FormCreated() { 

  const nav = useNavigate()
  const [queryKey, setQueryKey] = useState<QueryFormModel>()
  
  const queryOk = (values: QueryFormModel) => {
    setQueryKey(values)
  }

  const resetQuery = () => {}

  const addBtnHandle = () => {
    nav("/tool/form/add")
  }

  const editBtnHandle = (id: number) => {
    nav(`/tool/form/edit/${id}`)
  }

  const { isLoading, data } = useQuery({
    queryKey: ['tools/form', 'list', 'get', queryKey],
    queryFn: () =>
      getFormGeneratePageApi(queryKey).then((res) => {
        if (res.code === 0) {
          //return buildTreeFromArray(res.data || [], 'deptId')
          return res.data
        } else {
          new Error(res.msg)
        }
      }),
  })
  const pageChange = (page: number, pageSize: number) => {
    setQueryKey({ ...queryKey,pageNum: page, pageSize: pageSize })
  }

  const columns: TableColumnsType<FormInfoModel> = [
    {
      title: '表单名称',
      dataIndex: 'formName',
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
            onClick={() => editBtnHandle(record.formId || 0)}>
            修改
          </AuthButton>
        </Space>
      ),
    },
  ]

  return (
    <div className='app-container'>
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
        dataSource={data?.list}
        loading={isLoading}
        pagination={false}
        rowKey='formId'
      />
      <div className='pagination-container'>
            <Pagination current={data?.pageNum} onChange={pageChange} total={data?.total} />
          </div>
    </div>
  )
}