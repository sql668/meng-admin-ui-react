import { Button, Col,  Row, Select, Tree, TreeProps } from "antd";
import { RoleEntity } from "../type";
import { useQuery } from "@tanstack/react-query";
import { getRoleDeptTreeApi, updateRoleDataScopeApi } from "@/api/system/role";
import { Key, useEffect, useState } from "react";
import { getAllExpandKeys } from "@/utils/tree";
import { antdUtils } from "@/utils/antdUtil";

// type FieldType = {
//   dataScope?: string
//   password?: string
//   remember?: string
// }

export function DataScope(props: { role?: RoleEntity; close?: () => void }) {
  const { role } = props
  const [dataScope, setDataScope] = useState<string>('1')
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([])
  const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true)
  const [checkedKeys, setCheckedKeys] = useState<{
    checked: Array<number>
    halfChecked: Array<number>
  }>({
    checked: [],
    halfChecked: [],
  })


  const onExpand: TreeProps['onExpand'] = (expandedKeysValue: Key[]) => {
    setExpandedKeys(expandedKeysValue)
    setAutoExpandParent(false)
  }
  const onCheck = (checkedKeys: any, info: any) => {
    setCheckedKeys({
      checked: checkedKeys,
      halfChecked: info.halfCheckedKeys,
    })
  }

  const { data: deptTree } = useQuery({
    queryKey: ['sys-role', 'get', 'deptTree',role?.roleId],
    queryFn: () =>
      getRoleDeptTreeApi(role?.roleId || 0).then((res) => {
        if (res.code === 0) {
          setCheckedKeys({
            checked: res.data?.checkedKeys || [],
            halfChecked:[]
          })
          return res.data?.depts
        } else {
          new Error(res.msg)
        }
      }),
  })

  useEffect(() => {
    setDataScope(role?.dataScope || '1')
    setExpandedKeys(getAllExpandKeys(deptTree || [], 'key'))
  }, [deptTree])

  return (
    <div>
      <div className='head-container w-full flex justify-between'>
        <div className='w-300'></div>
        <Button type='primary' onClick={() => {
          updateRoleDataScopeApi({
            roleId: role?.roleId!,
            deptIds: checkedKeys.checked,
            dataScope
          }).then((res) => {
            if (res.code === 0) {
              antdUtils.message?.success(res.msg)
            } else {
              antdUtils.message?.error(res.msg)
            }
          })
        }}>
          确定
        </Button>
      </div>
      <div>
        <Row gutter={16} className='grid-items-center'>
          <Col span={8} className='text-right'>
            数据权限范围:
          </Col>
          <Col span={16}>
            <Select
              style={{ width: '80%' }}
              value={ dataScope}
              onChange={(val) => {
                setCheckedKeys({
                  checked: [],
                  halfChecked:[]
                })
                setDataScope(val)
               }}
              options={[
                {
                  value: '1',
                  label: '全部数据权限',
                },
                {
                  value: '2',
                  label: '自定义数据权限',
                },
                {
                  value: '3',
                  label: '本部门数据权限',
                },
                {
                  value: '4',
                  label: '本部门及以下数据权限',
                },
                {
                  value: '5',
                  label: '仅本人数据权限',
                },
              ]}
            />
          </Col>
        </Row>
        {dataScope === '2' && (
          <Row gutter={16} className='grid-items-top mt-8'>
            <Col span={8} className='text-right'>
              数据权限范围:
            </Col>
            <Col span={16}>
              <Tree
                checkable
                onExpand={onExpand}
                expandedKeys={expandedKeys}
                autoExpandParent={autoExpandParent}
                onCheck={onCheck}
                checkedKeys={checkedKeys.checked}
                treeData={deptTree}
              />
            </Col>
          </Row>
        )}
      </div>
    </div>
  )
}
