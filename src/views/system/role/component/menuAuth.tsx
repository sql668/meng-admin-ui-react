import { Key, useEffect, useState } from "react";
import { RoleEntity } from "../type";
import { Button, Input, Tree, TreeProps } from "antd";
import { DeptModel } from "../../dept/type";
import { useQuery } from "@tanstack/react-query";
import { getMenuListApi } from "@/api/system/menu";
import { buildTreeFromArray, getAllExpandKeys } from "@/utils/tree";
import { updateRoleDefaultRouterApi, updateRoleMenuApi } from "@/api/system/role";
import { antdUtils } from "@/utils/antdUtil";

export const MenuAuth = (props: { record?: RoleEntity; close?: () => void }) => {
  const { record } = props
  const [role, setRole] = useState<Partial<RoleEntity>>()
  const [filterText, setFilterText] = useState('')
  const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true)
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([])
  //const [checkedKeys, setCheckedKeys] = useState<React.Key[]>(['0-0-0'])
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
  const filterTreeNode = (node: DeptModel) => {
    if (!filterText) return false
    return node.deptName.indexOf(filterText) > -1
  }
  const { data: menuTree } = useQuery({
    queryKey: ['sys-menu', 'menu', 'get', {}],
    queryFn: () =>
      getMenuListApi({}).then((res) => {
        if (res.code === 0) {
          return buildFullPath(buildTreeFromArray(res.data || [], 'menuId'),null)
        } else {
          new Error(res.msg)
        }
      }),
  })
  const buildFullPath = (data:Array<any>,parent:any) => {
    for (let item of data) {
      if (!parent) {
        if (!item.path.startsWith('/')) {
          item.fullPath = '/' + item.path
        } else {
          item.fullpath = item.path
        }
      } else {
        item.fullPath = parent.fullPath + '/' + item.path
      }
      if (item.children && item.children.length > 0) {
        buildFullPath(item.children, item)
      }
    }
    return data
  }
  const treeTitleRender = (node:any) => {
    return (
      <div>
        <span>{node.menuName}</span>
        {node.menuType === 'C' && (
          <Button
            type='link'
            onClick={() => {
              updateRoleDefaultRouterApi({
                roleId: record?.roleId || 0,
                defaultRouter: node.fullPath,
              }).then((res) => {
                if (res.code === 0) {
                  //role!.defaultRouter = node.fullPath
                  setRole({ ...role, defaultRouter: node.fullPath, roleId: record?.roleId || 0 })
                  antdUtils.message?.success(res.msg)
                } else {
                  antdUtils.message?.error(res.msg)
                }
              })
            }}
            style={{ color: role?.defaultRouter === node.fullPath ? '#E6A23C' : '#85ce61' }}>
            {role?.defaultRouter === node.fullPath ? '首页' : '设为首页'}
          </Button>
        )}
      </div>
    )
  }
  useEffect(() => {
    setExpandedKeys(getAllExpandKeys(menuTree || [], 'menuId'))
  }, [menuTree])

  useEffect(() => {
    setRole(record)
    const checkedKeys = record?.menuIds || []
    const halfCheckeys = record?.menuIds2.filter((item) => !record?.menuIds.includes(item))
    setCheckedKeys({ checked: [...checkedKeys], halfChecked: halfCheckeys || [] })
  }, [record])
  return (
    <div>
      <div className='head-container w-full flex justify-between'>
        <div className='w-300'>
          <Input.Search placeholder='请输入部门名称' onSearch={setFilterText} />
        </div>
        <Button
          type='primary'
          onClick={() => {
            updateRoleMenuApi({
              roleId: props.record?.roleId || 0,
              menuIds: [...checkedKeys.halfChecked, ...checkedKeys.checked],
            }).then((res) => {
              if (res.code === 0) {
                antdUtils.message?.success('操作成功')
                props?.close && props.close()
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
          checkedKeys={checkedKeys.checked as any}
          filterTreeNode={filterTreeNode as any}
          treeData={menuTree as any}
          fieldNames={{
            //title: 'menuName',
            key: 'menuId',
          }}
          titleRender={ treeTitleRender}></Tree>
      </div>
    </div>
  )
}
