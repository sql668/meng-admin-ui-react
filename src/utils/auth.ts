/** 权限校验 */

import { useUserStore } from '@/store/user'

/**
 * 角色权限校验，系统管理员角色，拥有说有权限
 * ```
 * 示例
 * checkRole(['admin',['common']]) 如果登录用户的角色是admin或者common中的任意一个角色，则返回true
 * ```
 * @param {Array} roles 校验值(角色数组)
 * @returns {Boolean}
 */
export function checkRole(roles: Array<string>) {
  if (roles.length > 0) {
    const userRoles = useUserStore.use.roles()
    const super_admin = 'admin'

    const hasRole = userRoles.some((role) => {
      return super_admin === role || roles.includes(role)
    })

    return hasRole
  } else {
    console.error(`need roles! Like checkRole="['admin','editor']"`)
    return false
  }
}

/**
 * 字符权限校验
 * ```
 * 示例
 * checkPermi(['sys:user:add',['sys:user:edit']]) 如果登录用户有sys:user:add或sys:user:edit中的任意一个权限，则返回true
 * ```
 * @param {Array} permissions 校验值(权限数组)
 * @returns {Boolean}
 */
export function checkPermi(permissions: Array<string>) {
  if (permissions.length > 0) {
    const userPermissions = useUserStore.use.permissions()
    const all_permission = '*:*:*'

    const hasPermission = userPermissions.some((permission) => {
      return all_permission === permission || permissions.includes(permission)
    })

    return hasPermission
  } else {
    console.error(`need roles! Like checkPermi="['system:user:add','system:user:edit']"`)
    return false
  }
}
