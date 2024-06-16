import { RouteContext } from '@/context/layout'
import { Layout } from 'antd'
import { useContext, useMemo } from 'react'
import BaseMenu from '../menu/baseMenu'
import { useThemeStore } from '@/store/theme'
import { useShallow } from 'zustand/react/shallow'
import { MenuDataItem } from '@/types/menu'
import { clearMenuItem } from '@/utils/menu'
import { createStyles } from 'antd-style'
//import { CollapsedIcon } from './collapwedIcon'

const useStyles = createStyles(({ css }) => {
  return {
    container: {
      height: '100%',
    },
    slider: css`
      background: transparent;

      .ant-layout-sider-children {
        border-inline-end: 1px solid rgba(5, 5, 5, 0.06);
        position: relative;
        padding-inline: 8px;
        display: flex;
        flex-direction: column;
        height: 100%;
        padding-inline: 8px;
        padding-block: 0;
        margin-inline-end: -1px;

        .meng-layout-sider-menu {
          height: 100%;
        }
      }
    `,
  }
})

const LayoutAside = () => {
  const { styles, cx } = useStyles()

  const routeContext = useContext(RouteContext)

  const { onCollapse, isMobile, siderWidth } = routeContext

  const { splitMenus, layoutMode } = useThemeStore(
    useShallow((state) => ({
      layoutMode: state.layout,
      splitMenus: state.splitMenus,
      //themeMode: state.themeMode,
    })),
  )

  const originCollapsed = routeContext.collapsed

  const collapsed = isMobile ? false : routeContext.collapsed

  // const collapsedDom = useMemo(() => {
  //   const dom = (
  //     <CollapsedIcon
  //       isMobile={isMobile}
  //       collapsed={originCollapsed}
  //       className={`meng-layout-collapsed-button`}
  //       onClick={() => {
  //         onCollapse?.(!originCollapsed)
  //       }}
  //     />
  //   )
  //   return dom
  // }, [isMobile, originCollapsed, onCollapse])

  const menuData = useMemo(() => {
    let menuData: MenuDataItem[] = []
    if (splitMenus && layoutMode === 'mix' && !routeContext.isMobile) {
      const [key] = routeContext.matchMenuKeys || []
      if (key) {
        menuData = routeContext.menuData?.find((item) => item.key === key)?.children || []
      }
      return menuData
    }
    return routeContext.menuData
  }, [
    splitMenus,
    layoutMode,
    routeContext.menuData,
    routeContext.isMobile,
    routeContext.matchMenuKeys,
  ])

  const clearMenuData = clearMenuItem(menuData || [])

  if (clearMenuData && clearMenuData?.length < 1 && splitMenus) {
    return null
  }
  // 收起的宽度
  const collapsedWidth = 64

  return (
    <div className={cx(styles.container)}>
      <Layout.Sider
        className={cx('h-full', styles.slider)}
        style={{ backgroundColor: 'transparent' }}
        collapsible
        trigger={null}
        collapsed={collapsed}
        onCollapse={(collapse) => {
          if (isMobile) return
          onCollapse?.(collapse)
        }}
        collapsedWidth={collapsedWidth}
        width={siderWidth}>
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            overflowX: 'hidden',
          }}>
          <BaseMenu
            collapsed={originCollapsed}
            mode={collapsed && !isMobile ? 'vertical' : 'inline'}
            className='meng-layout-sider-menu'
            hashId='999'
            location={routeContext.location!}
            menuData={clearMenuData}
            matchMenuKeys={routeContext.matchMenuKeys || []}
            menuItemClick={routeContext.menuItemClick}
            style={{
              width: '100%',
            }}></BaseMenu>
        </div>

        {/* {collapsedDom} */}
      </Layout.Sider>
    </div>
  )
}
export default LayoutAside
