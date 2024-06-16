import { useUserStore } from '@/store/user'
import { Button, ButtonProps } from 'antd'
import { useCallback, useMemo } from 'react'

export interface AuthButtonProps extends ButtonProps {
  roles?: string[]
  permis?: string[]
}

export function AuthButton({ roles = [], permis = [], ...props }: AuthButtonProps) {
  const userPermissions = useUserStore.use.permissions()
  const userRoles = useUserStore.use.roles()

  const checkRole = useCallback(
    (roles: Array<string>) => {
      if (roles.length > 0) {
        const super_admin = 'admin'
        const hasRole = userRoles.some((role) => {
          return super_admin === role || roles.includes(role)
        })
        return hasRole
      } else {
        console.error(`need roles! Like checkRole="['admin','editor']"`)
        return false
      }
    },
    [userRoles],
  )

  const checkPermi = useCallback(
    (permissions: Array<string>) => {
      if (permissions.length > 0) {
        const all_permission = '*:*:*'
        const hasPermission = userPermissions.some((permission) => {
          return all_permission === permission || permissions.includes(permission)
        })
        return hasPermission
      } else {
        console.error(`need roles! Like checkPermi="['system:user:add','system:user:edit']"`)
        return false
      }
    },
    [userPermissions],
  )

  // 判断是否有权限
  const hasAuth = useMemo(() => {
    if (roles.length === 0 && permis.length === 0) {
      return true
    } else if (permis.length > 0) {
      return checkPermi(permis)
    } else {
      return checkRole(roles)
    }
  }, [roles, permis, checkRole, checkPermi])

  if (hasAuth) {
    return <Button {...props}></Button>
  } else {
    return null
  }
}
