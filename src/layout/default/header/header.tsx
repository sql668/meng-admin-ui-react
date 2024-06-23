import { SvgIcon } from '@/components/icon'
import { BaseMenu } from '@/components/menu'
import { default as ThemeSetting } from '@/components/theme'
import { useMenuContext } from '@/context/menu'
import { ThemeEnum } from '@/core/enums/appEnum'
import { useHeaderSetting } from '@/hooks/setting/useHeaderSetting'
import { useMenuSetting } from '@/hooks/setting/useMenuSetting'
import { useDesign } from '@/hooks/useDesign'
import { useDeepMemo } from '@/hooks/useMemo'
import LayoutBreadcrumb from '@/layout/components/breadcrumb'
import AppLogo from '@/layout/components/logo'
import { getGlobalTheme, setGlobalTheme, useAppConfigStore } from '@/store/app'
import { setAlpha } from '@/utils/style'
import { Dropdown, Layout, MenuProps } from 'antd'
import { createStyles } from 'antd-style'
import classNames from 'classnames'
import { memo, useMemo } from 'react'

interface LayoutHeaderProps {
  fixed?: boolean
}

const darkLightItems: MenuProps['items'] = [
  {
    key: 'auto',
    label: <a>跟随系统</a>,
    icon: <SvgIcon icon='auto_theme'></SvgIcon>,
  },
  {
    key: 'light',
    label: <a>亮色模式</a>,
    icon: <SvgIcon icon='light_theme'></SvgIcon>,
  },
  {
    key: 'dark',
    label: <a>暗色模式</a>,
    icon: <SvgIcon icon='dark_theme'></SvgIcon>,
  },
]

const useStyles = createStyles(({ token }) => {
  return {
    container: {
      backgroundColor: setAlpha(token.colorBgElevated, 0.6),
      padding: 0,
      borderBottom: `1px solid ${token.colorSplit}`,
    },
  }
})

const LayoutHeader = memo(function LayoutHeader(props: LayoutHeaderProps) {
  const { fixed = false } = props
  const { styles, cx } = useStyles()
  const themeMode = useAppConfigStore.use.theme()
  const menuContext = useMenuContext()
  const { prefixCls } = useDesign('layout-header')
  const { isMixSplitMenu, getShowTopMenu } = useMenuSetting()
  //const { headerTheme } = useHeaderSetting()
  const getHeaderClass = useMemo(() => {
    return classNames([
      prefixCls,
      {
        [`${prefixCls}--fixed`]: fixed,
        [`${prefixCls}--${themeMode}`]: themeMode,
      },
    ])
  }, [prefixCls, themeMode])

  const currentMode = useMemo(() => {
    if (themeMode === 'dark') {
      return <SvgIcon icon='dark_theme'></SvgIcon>
    } else if (themeMode === 'light') {
      return <SvgIcon icon='light_theme'></SvgIcon>
    } else {
      return <SvgIcon icon='auto_theme'></SvgIcon>
    }
  }, [themeMode])

  const menuData = useDeepMemo(() => {
    //console.log(menuContext, isMixSplitMenu)

    if (isMixSplitMenu) {
      const noChildrenMenuData = (menuContext.menuData || []).map((item) => ({
        ...item,
        children: undefined,
        routes: undefined,
      }))
      return noChildrenMenuData
    }
    return []
  }, [isMixSplitMenu, menuContext.menuData])

  //console.log(menuData)

  return (
    <>
      <Layout.Header className={cx(getHeaderClass, styles.container)}>
        <div className={`${prefixCls}-left`}>
          <AppLogo></AppLogo>
          {/* <LayoutBreadcrumb></LayoutBreadcrumb> */}
        </div>
        {getShowTopMenu && (
          <div className={`${prefixCls}-menu`}>
            <BaseMenu
              mode='horizontal'
              menuRenderType='header'
              className='meng-layout-top-nav-header-base-menu'
              hashId='999'
              collapsed={false}
              location={menuContext.location!}
              style={{
                height: '100%',
              }}
              matchMenuKeys={menuContext.matchMenuKeys || []}
              menuItemClick={menuContext.menuItemClick}
              menuData={menuData}></BaseMenu>
          </div>
        )}

        <div className={`${prefixCls}-action`}>
          <Dropdown
            placement='top'
            menu={{
              items: darkLightItems,
              onClick: (e) => {
                setGlobalTheme(e.key as ThemeEnum)
              },
              selectable: true,
              defaultSelectedKeys: [themeMode],
            }}>
            <span>{currentMode}</span>
          </Dropdown>
          <ThemeSetting></ThemeSetting>
        </div>
      </Layout.Header>
    </>
  )
})

if (process.env.NODE_ENV !== 'production') {
  LayoutHeader.displayName = 'LayoutHeader'
  ;(LayoutHeader as any).whyDidYouRender = true
}
export { LayoutHeader }
