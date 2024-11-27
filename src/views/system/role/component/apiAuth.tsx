import { getAllApiAPi } from '@/api/system/api'
import { useQuery } from '@tanstack/react-query'
import { Key, useEffect, useState } from 'react'
import { ApiEntity } from '../../api/type'
import { cloneDeep } from 'lodash-es'
import { Button, Input, Tree, TreeProps } from 'antd'
import { getAllExpandKeys } from '@/utils/tree'
import { getRoleCheckedByRoleCodeApi, updateRoleApiAuthApi } from '@/api/system/role'
import { RoleEntity } from '../type'
import { antdUtils } from '@/utils/antdUtil'

const buildApiTree = (data: Array<ApiEntity>) => {
  const apis = cloneDeep(data)
  const apiObj: Partial<ApiEntity> = {}
  apis &&
    apis.forEach((item) => {
      item.onlyId = 'p:' + item.path + 'm:' + item.method
      if (Object.prototype.hasOwnProperty.call(apiObj, item.apiGroup)) {
        apiObj[item.apiGroup].push({ ...item, key: item.apiId, title: item.remark })
      } else {
        Object.assign(apiObj, {
          [item.apiGroup]: [{ ...item, key: item.apiId, title: item.remark }],
        })
      }
    })
  const apiTree = []
  for (const key in apiObj) {
    const treeNode = {
      key: key,
      onlyId: key,
      title: key + '组',
      children: apiObj[key],
    }
    apiTree.push(treeNode)
  }
  return apiTree
}

export const ApiAuth = (props: { record?: RoleEntity; close?: () => void }) => {
  const { record, close } = props
  const [filterText, setFilterText] = useState('')
  const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true)
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([])
  const [checkedKeys, setCheckedKeys] = useState<{
    checked: Array<string>
    halfChecked: Array<string>
  }>({
    checked: [],
    halfChecked: [],
  })
  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([])

  const [checkedNodes, setCheckedNodes] = useState<any[]>([])

  const onExpand: TreeProps['onExpand'] = (expandedKeysValue: Key[]) => {
    setExpandedKeys(expandedKeysValue)
    setAutoExpandParent(false)
  }
  const onCheck = (checkedKeys: any, info: any) => {
    setCheckedKeys({
      checked: checkedKeys,
      halfChecked: info.halfCheckedKeys,
    })
    setCheckedNodes(info.checkedNodes)
  }
  const filterTreeNode = (node: any) => {
    if (!filterText) return false
    return node.title.indexOf(filterText) > -1
  }

  const onSelect: TreeProps['onSelect'] = (selectedKeysValue: any) => {
    setSelectedKeys(selectedKeysValue)
  }

  const { data: apiTree } = useQuery({
    queryKey: ['sys-api', 'get', 'all', {}],
    queryFn: () =>
      getAllApiAPi({}).then((res) => {
        if (res.code === 0) {
          return buildApiTree(res.data.list)
        } else {
          new Error(res.msg)
        }
      }),
  })

  useQuery({
    queryKey: ['sys-api', 'get', 'auth', record?.roleCode],
    queryFn: () =>
      getRoleCheckedByRoleCodeApi(record?.roleCode || '').then((res) => {
        if (res.code === 0) {
          const result: Array<string> = []
          res.data.list.forEach((item) => {
            result.push('p:' + item.path + 'm:' + item.method)
          })
          setCheckedKeys({
            checked: result,
            halfChecked: [],
          })
        } else {
          new Error(res.msg)
        }
      }),
  })

  useEffect(() => {
    setExpandedKeys(getAllExpandKeys(apiTree || [], 'key'))
  }, [apiTree])

  return (
    <div>
      <div className='head-container w-full flex justify-between'>
        <div className='w-300'>
          <Input.Search placeholder='请输入部门名称' onSearch={setFilterText} />
        </div>
        <Button
          type='primary'
          onClick={() => {
            const apis: Array<{ path: string; method: string }> = []
            checkedNodes.forEach((item) => {
              if (!item.children || (item.children && item.children.length === 0))
                apis.push({
                  path: item.path,
                  method: item.method,
                })
            })

            updateRoleApiAuthApi({
              roleCode: record?.roleCode!,
              casbinInfos: apis,
            }).then((res) => {
              if (res.code === 0) {
                antdUtils.message?.success('操作成功')
                close && close()
              } else {
                antdUtils.message?.error(res.msg)
              }
            })
          }}>
          确定
        </Button>
      </div>
      <div className='head-container'>
        <Tree
          checkable
          blockNode={false}
          onExpand={onExpand}
          expandedKeys={expandedKeys}
          autoExpandParent={autoExpandParent}
          onCheck={onCheck}
          checkedKeys={checkedKeys.checked}
          onSelect={onSelect}
          selectedKeys={selectedKeys}
          filterTreeNode={filterTreeNode}
          treeData={apiTree as any}
          fieldNames={{
            key: 'onlyId',
          }}></Tree>
      </div>
    </div>
  )
}
