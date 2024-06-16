import { Menu } from 'antd'
import { BaseMenuProps, PrivateSiderMenuProps } from './type'
import { useEffect, useMemo, useRef } from 'react'
import MenuUtil from './MenuUtil'
import useMergedState from 'rc-util/lib/hooks/useMergedState'
import { getOpenKeysFromMenuData } from '@/utils/menu'
import classNames from 'classnames'

/**
 * 生成openKeys 的对象，因为设置了openKeys 就会变成受控，所以需要一个空对象
 *
 * @param BaseMenuProps
 */
const getOpenKeysProps = (
  openKeys: (string | number)[] | false,
  { layout, collapsed }: BaseMenuProps,
): {
  openKeys?: undefined | string[]
} => {
  let openKeysProps = {} as Record<string, any>

  if (openKeys && !collapsed && ['side', 'mix'].includes(layout || 'mix')) {
    openKeysProps = {
      openKeys,
    }
  }
  return openKeysProps
}

const BaseMenu: React.FC<BaseMenuProps & PrivateSiderMenuProps> = (props) => {
  const {
    mode,
    className,
    menuData,
    style,
    menuItemClick,
    menu,
    matchMenuKeys,
    //iconfontUrl,
    selectedKeys: propsSelectedKeys,
    onSelect,
    //menuRenderType,
    openKeys: propsOpenKeys,
    handleOpenChange,
  } = props

  const baseClassName = `meng-layout-base-menu-${mode}`

  const menuUtils = useMemo(() => {
    return new MenuUtil({
      ...props,
      //token: designToken,
      //menuRenderType,
      baseClassName,
      hashId: '988',
    })
  }, [props, baseClassName])

  // 用于减少 defaultOpenKeys 计算的组件
  const defaultOpenKeysRef = useRef<string[]>([])

  const [defaultOpenAll, setDefaultOpenAll] = useMergedState(menu?.defaultOpenAll)

  const [openKeys, setOpenKeys] = useMergedState<(string | number)[] | false>(
    () => {
      if (menu?.defaultOpenAll) {
        return getOpenKeysFromMenuData(menuData) || []
      }
      if (propsOpenKeys === false) {
        return false
      }
      return []
    },
    {
      value: propsOpenKeys === false ? undefined : propsOpenKeys,
      onChange: handleOpenChange as any,
    },
  )

  const [selectedKeys, setSelectedKeys] = useMergedState<string[] | undefined>([], {
    value: propsSelectedKeys,
    onChange: onSelect
      ? (keys) => {
          if (onSelect && keys) {
            onSelect(keys as any)
          }
        }
      : undefined,
  })

  useEffect(() => {
    if (menu?.defaultOpenAll || propsOpenKeys === false) {
      return
    }
    if (matchMenuKeys) {
      setOpenKeys(matchMenuKeys)
      setSelectedKeys(matchMenuKeys)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matchMenuKeys.join('-')])

  useEffect(
    () => {
      // if pathname can't match, use the nearest parent's key
      if (matchMenuKeys.join('-') !== (selectedKeys || []).join('-')) {
        setSelectedKeys(matchMenuKeys)
      }
      if (
        !defaultOpenAll &&
        propsOpenKeys !== false &&
        matchMenuKeys.join('-') !== (openKeys || []).join('-')
      ) {
        let newKeys: (string | number)[] | false = matchMenuKeys
        // 如果不自动关闭，我需要把 openKeys 放进去
        if (menu?.autoClose === false) {
          newKeys = Array.from(new Set([...matchMenuKeys, ...(openKeys || [])]))
        }
        setOpenKeys(newKeys)
      } else if (menu?.ignoreFlatMenu && defaultOpenAll) {
        // 忽略用户手动折叠过的菜单状态，折叠按钮切换之后也可实现默认展开所有菜单
        setOpenKeys(getOpenKeysFromMenuData(menuData))
      } else {
        setDefaultOpenAll(false)
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [matchMenuKeys.join('-')],
  )

  const openKeysProps = useMemo(
    () => getOpenKeysProps(openKeys, props),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [openKeys && openKeys.join(','), props.layout, props.collapsed],
  )

  // 这次 openKeys === false 的时候的情况，这种情况下帮用户选中一次
  // 第二此不会使用，所以用了 defaultOpenKeys
  // 这里返回 null，是为了让 defaultOpenKeys 生效
  if (props.openKeys === false && !props.handleOpenChange) {
    defaultOpenKeysRef.current = matchMenuKeys
  }

  const finallyData = menuData

  if (finallyData && finallyData?.length < 1) {
    return null
  }

  return (
    <Menu
      {...openKeysProps}
      _internalDisableMenuItemTitleTooltip
      inlineIndent={16}
      defaultOpenKeys={defaultOpenKeysRef.current}
      selectedKeys={selectedKeys}
      items={menuUtils.getNavMenuItems(finallyData, 0, 0)}
      mode={mode}
      style={{
        backgroundColor: 'transparent',
        border: 'none',
        ...style,
      }}
      onOpenChange={(_openKeys) => {
        if (!props.collapsed) {
          setOpenKeys(_openKeys)
        }
      }}
      className={classNames(className, baseClassName, {
        [`${baseClassName}-horizontal`]: mode === 'horizontal',
        [`${baseClassName}-collapsed`]: props.collapsed,
      })}
      onClick={menuItemClick}></Menu>
  )
}

export default BaseMenu
