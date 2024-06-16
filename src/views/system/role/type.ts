import { IPage } from "@/types/common";
//import { Optional } from "@/utils/type";

export interface RoleEntity {
  roleId: number
  roleName: string
  roleCode: string
  sort: number
  status: string
  remark: string
  menuIds: Array<number>
  menuIds2: Array<number>
  dataScope: string
  defaultRouter: string
}

export type QueryRoleModel = Partial<Pick<RoleEntity, 'roleName' | 'status'>> & IPage

export type EditRoleModel = Partial<RoleEntity>


export interface CasbinRuleEntity {
  path: string;
  method: string;
}

export interface RoleApiDto {
  roleCode: string
  casbinInfos: Array<CasbinRuleEntity>
}
