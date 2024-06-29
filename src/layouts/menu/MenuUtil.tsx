import { MenuDataItem } from '@/types/menu'
import { BaseMenuProps } from './type'
import classNames from 'classnames'
import type { ItemType } from 'antd/lib/menu/hooks/useItems'
import { isUrl } from '@/utils/util'
import { useEffect, useState } from 'react'
import { Tooltip } from 'antd'
//import { IconFont } from '@/components/iconFont'
import { Icon } from '@/components/icon'
import { MenuTypeEnum } from '@/core/enums/menuEnum'

const getMenuTitleSymbol = (title: React.ReactNode) => {
  if (title && typeof title === 'string') {
    const symbol = title.substring(0, 1).toUpperCase()
    return symbol
  }
  return null
}

// const getIcon = (
//   icon: string | React.ReactNode,
//   iconPrefixes: string = 'mx-icon-',
//   className: string,
// ): React.ReactNode => {
//   if (typeof icon === 'string' && icon !== '') {
//     if (isUrl(icon) || isImg(icon)) {
//       return <img width={16} key={icon} src={icon} alt='icon' className={className} />
//     }
//     if (icon.startsWith(iconPrefixes)) {
//       return <IconFont type={icon} />
//     }
//   }
//   return icon
// }

export default class MenuUtil {
  props: BaseMenuProps & { baseClassName: string; hashId: string; location: { pathname?: string } }
  constructor(
    props: BaseMenuProps & {
      baseClassName: string
      hashId: string
      location: { pathname?: string }
    },
  ) {
    this.props = props
  }

  getNavMenuItems = (menusData: MenuDataItem[] = [], level: number, noGroupLevel: number) => {
    const data = menusData
      .map((item) => this.getSubMenuOrItem(item, level, noGroupLevel))
      .filter((item) => item)
      .flat(1)

    return data
  }

  getSubMenuOrItem = (item: MenuDataItem, level: number, noGroupLevel: number): any => {
    const { collapsed, layout, menu, baseClassName } = this.props
    const isGroup = menu?.type === 'group' && layout !== MenuTypeEnum.TOP_MENU
    const menuType = isGroup && level === 0 ? ('group' as const) : undefined
    if (Array.isArray(item.children) && item.children.length > 0) {
      /** Menu 第一级可以有icon，或者 isGroup 时第二级别也要有 */

      const shouldHasIcon = level === 0 || (isGroup && level === 1)

      // TODO 获取菜单图标
      // const iconDom = getIcon(
      //   item.icon,
      //   iconPrefixes,
      //   `${baseClassName}-icon ${this.props?.hashId}`,
      // )
      const iconDom = <Icon icon={ item.icon as string}></Icon>

      /**
       * 如果没有icon在收起的时候用首字母代替
       */
      const defaultIcon = collapsed && shouldHasIcon ? getMenuTitleSymbol(item.name) : null

      const defaultTitle = (
        <div
          className={classNames(`${baseClassName}-item-title`, this.props?.hashId, {
            [`${baseClassName}-item-title-collapsed`]: collapsed,
            [`${baseClassName}-item-title-collapsed-level-${noGroupLevel}`]: collapsed,
            [`${baseClassName}-group-item-title`]: menuType === 'group',
            [`${baseClassName}-item-collapsed-show-title`]: menu?.collapsedShowTitle && collapsed,
          })}>
          {/* 收起的时候group模式就不要展示icon了，放不下 */}
          {menuType === 'group' && collapsed ? null : shouldHasIcon && iconDom ? (
            <span className={`${baseClassName}-item-icon ${this.props?.hashId}`.trim()}>
              {iconDom}
            </span>
          ) : (
            defaultIcon
          )}
          <span
            className={classNames(`${baseClassName}-item-text`, this.props?.hashId, {
              [`${baseClassName}-item-text-has-icon`]:
                menuType !== 'group' && shouldHasIcon && (iconDom || defaultIcon),
            })}>
            {item.name}
          </span>
        </div>
      )

      const title = defaultTitle

      // 如果收起来，没有子菜单了，就不需要展示 group，所以 level 不增加
      if (isGroup && level === 0 && this.props.collapsed && !menu.collapsedShowGroupTitle) {
        return this.getNavMenuItems(item.children, level + 1, level)
      }

      const childrenList = this.getNavMenuItems(
        item.children,
        level + 1,
        isGroup && level === 0 && this.props.collapsed ? level : level + 1,
      )

      return [
        {
          type: menuType,
          key: item.key! || item.path!,
          label: title,
          onClick: isGroup ? undefined : item.onTitleClick,
          children: childrenList,
          className: classNames({
            [`${baseClassName}-group`]: menuType === 'group',
            [`${baseClassName}-submenu`]: menuType !== 'group',
            [`${baseClassName}-submenu-has-icon`]: menuType !== 'group' && shouldHasIcon && iconDom,
          }),
        } as ItemType,
        isGroup && level === 0
          ? ({
              type: 'divider',
              //prefixCls,
              className: `${baseClassName}-divider`,
              key: (item.key! || item.path!) + '-group-divider',
              style: {
                padding: 0,
                borderBlockEnd: 0,
                margin: this.props.collapsed ? '4px' : '6px 16px',
                marginBlockStart: this.props.collapsed ? 4 : 8,
                //borderColor: designToken?.layout?.sider?.colorMenuItemDivider,
              },
            } as ItemType)
          : undefined,
      ].filter(Boolean) as ItemType[]
    }

    return {
      className: `${baseClassName}-menu-item`,
      disabled: item.disabled,
      key: item.key! || item.path!,
      onClick: item.onTitleClick,
      label: this.getMenuItemPath(item, level, noGroupLevel),
    }
  }

  conversionPath = (path: string) => {
    if (path && path.indexOf('http') === 0) {
      return path
    }
    return `/${path || ''}`.replace(/\/+/g, '/')
  }

  /**
   * 判断是否是http链接.返回 Link 或 a
   *
   * @memberof SiderMenu
   */
  getMenuItemPath = (item: MenuDataItem, level: number, noGroupLevel: number) => {

    const itemPath = this.conversionPath(item.path || '/')
    //const { iconPrefixes } = this.props

    // if local is true formatMessage all name。
    const menuItemTitle = item.name
    const { baseClassName, menu, collapsed } = this.props
    //const isGroup = menu?.type === 'group'
    /** Menu 第一级可以有icon，或者 isGroup 时第二级别也要有 */
    // const hasIcon = level === 0 || (isGroup && level === 1)
    const hasIcon = true

    // TODO 获取icon
    // const icon = !hasIcon
    //   ? null
    //   : getIcon(item.icon, iconPrefixes, `${baseClassName}-icon ${this.props?.hashId}`)

    const icon = !hasIcon
      ? null
      : <Icon icon={ item.icon as string}></Icon>

    // 如果没有 icon 在收起的时候用首字母代替
    const defaultIcon = collapsed && hasIcon ? getMenuTitleSymbol(menuItemTitle) : null

    let defaultItem = (
      <div
        key={itemPath}
        className={classNames(`${baseClassName}-item-title`, this.props?.hashId, {
          [`${baseClassName}-item-title-collapsed`]: collapsed,
          [`${baseClassName}-item-title-collapsed-level-${noGroupLevel}`]: collapsed,
          [`${baseClassName}-item-collapsed-show-title`]: menu?.collapsedShowTitle && collapsed,
        })}>
        <span
          className={`${baseClassName}-item-icon ${this.props?.hashId}`.trim()}
          style={{
            display: defaultIcon === null && !icon ? 'none' : '',
          }}>
          {icon || <span className='anticon'>{defaultIcon}</span>}
        </span>
        <span
          className={classNames(`${baseClassName}-item-text`, this.props?.hashId, {
            [`${baseClassName}-item-text-has-icon`]: hasIcon && (icon || defaultIcon),
          })}>
          {menuItemTitle}
        </span>
      </div>
    )
    const isHttpUrl = isUrl(itemPath)

    // Is it a http link
    if (isHttpUrl) {
      defaultItem = (
        <span
          key={itemPath}
          onClick={() => {
            window?.open?.(itemPath, '_blank')
          }}
          className={classNames(`${baseClassName}-item-title`, this.props?.hashId, {
            [`${baseClassName}-item-title-collapsed`]: collapsed,
            [`${baseClassName}-item-title-collapsed-level-${noGroupLevel}`]: collapsed,
            [`${baseClassName}-item-link`]: true,
            [`${baseClassName}-item-collapsed-show-title`]: menu?.collapsedShowTitle && collapsed,
          })}>
          <span
            className={`${baseClassName}-item-icon ${this.props?.hashId}`.trim()}
            style={{
              display: defaultIcon === null && !icon ? 'none' : '',
            }}>
            {icon || <span className='anticon'>{defaultIcon}</span>}
          </span>
          <span
            className={classNames(`${baseClassName}-item-text`, this.props?.hashId, {
              [`${baseClassName}-item-text-has-icon`]: hasIcon && (icon || defaultIcon),
            })}>
            {menuItemTitle}
          </span>
        </span>
      )
    }

    return level === 0 ? (
      <MenuItemTooltip collapsed={collapsed} title={menuItemTitle} disable={item.disabledTooltip}>
        {defaultItem}
      </MenuItemTooltip>
    ) : (
      defaultItem
    )
  }
}

const MenuItemTooltip = (props: {
  collapsed?: boolean
  children: React.ReactNode
  title?: React.ReactNode
  disable?: boolean
}) => {
  const [collapsed, setCollapsed] = useState(props.collapsed)
  const [open, setOpen] = useState(false)
  useEffect(() => {
    setOpen(false)
    setTimeout(() => {
      setCollapsed(props.collapsed)
    }, 400)
  }, [props.collapsed])

  if (props.disable) {
    return props.children as JSX.Element
  }

  return (
    <Tooltip
      title={props.title}
      open={collapsed && props.collapsed ? open : false}
      placement='right'
      onOpenChange={setOpen}>
      {props.children}
    </Tooltip>
  )
}
