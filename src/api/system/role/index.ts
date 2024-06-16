import { PageResultData, ResultData } from '@/types/api'
import { DeptTreeVo } from '@/types/common'
import useRequest from '@/utils/http'
import { CasbinRuleEntity, EditRoleModel, QueryRoleModel, RoleApiDto, RoleEntity } from '@/views/system/role/type'

export const getRolePageApi = (data?: QueryRoleModel) => {
  return useRequest.get<PageResultData<RoleEntity[]>>({
    url: '/role',
    params: data,
  })
}


export const getRoleByIdApi = (id: number) => {
  return useRequest.get<ResultData<RoleEntity>>({
    url: `/role/${id}`,
  })
}

export const insertRoleApi = (data: EditRoleModel) => {
  return useRequest.post<ResultData>({
    url: '/role',
    data,
  })
}

export const updateRoleApi = (data: EditRoleModel, id: number) => {
  return useRequest.put<ResultData>({
    url: `/role/${id}`,
    data,
  })
}

export const updateRoleStatusApi = (data: EditRoleModel) => {
  return useRequest.put<ResultData>({
    url: `/role/status/change`,
    data,
  })
}

export const updateRoleMenuApi = (data: { roleId: number; menuIds: Array<number> }) => {
  return useRequest.put<ResultData>({
    url: `/role/auth/menu`,
    data,
  })
}

/** 更新角色的api权限列表 */
export const updateRoleApiAuthApi = (data: RoleApiDto) => {
  return useRequest.put<ResultData>({
    url: `/role/auth/apis`,
    data,
  })
}

export const getRoleDetailApi = (roleId:number) => {
  return useRequest.get<ResultData<RoleEntity>>({
    url: `/role/${roleId}`,
  })
}

export const deleteRoleApi = (ids: number[]) => {
  return useRequest.delete<ResultData>({
    url: '/role/',
    data: { ids },
  })
}

export const getRoleCheckedByRoleCodeApi = (roleCode: string) => {
  return useRequest.get<PageResultData<CasbinRuleEntity[]>>({
    url: `/role/getPolicyPathByRoleCode/${roleCode}`,
  })
}

export const getRoleDeptTreeApi = (roleId: number) => {
  return useRequest.get<ResultData<{ depts: DeptTreeVo[]; checkedKeys: number[]}>>({
    url: `/role/roleDeptTree/${roleId}`,
  })
}

/** 更新角色的数据权限 */
export const updateRoleDataScopeApi = (data: { roleId: number; deptIds:number[],dataScope:string}) => {
  return useRequest.put<ResultData>({
    url: `/role/roledatascope`,
    data,
  })
}

/** 更新角色的数据权限 */
export const updateRoleDefaultRouterApi = (data: { roleId: number; defaultRouter: string }) => {
  return useRequest.put<ResultData>({
    url: `/role/roleDefaultRouter`,
    data,
  })
}
