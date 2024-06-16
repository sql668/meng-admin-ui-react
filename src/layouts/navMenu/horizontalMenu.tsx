import { RouteContext } from '@/context/layout'
//import { Menu, MenuProps } from 'antd'
import { createStyles } from 'antd-style'
import { useContext, useMemo } from 'react'
import BaseMenu from '../menu/baseMenu'
import { useThemeStore } from '@/store/theme'
import { useShallow } from 'zustand/react/shallow'

const useStyles = createStyles(() => {
  return {
    container: {
      height: '100%',
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      paddingInline: '6px',
      paddingBlock: '6px',
      //   in-width: 0;
      // display: flex;
      // align-items: center;
      // padding-inline: 6px;
      // padding-block: 6px;
      // line-height: 44px;
    },
  }
})

const HorizontalMenu = () => {
  const { styles, cx } = useStyles()
  const routeContext = useContext(RouteContext)

  // const clickMenu: MenuProps['onClick'] = ({ key }: { key: string }) => {
  //   if (routeContext?.menuItemClick) {
  //     routeContext?.menuItemClick(key)
  //   }
  // }

  const { splitMenus, layoutMode } = useThemeStore(
    useShallow((state) => ({
      layoutMode: state.layout,
      splitMenus: state.splitMenus,
      //themeMode: state.themeMode,
    })),
  )

  const menuData = useMemo(() => {
    if (layoutMode === 'mix' && splitMenus) {
      const noChildrenMenuData = (routeContext.menuData || []).map((item) => ({
        ...item,
        children: undefined,
        routes: undefined,
      }))
      return noChildrenMenuData
    }
    return []
  }, [layoutMode, splitMenus, routeContext.menuData])

  return (
    <div className={cx(styles.container, 'meng-layout-header-menu')}>
      {/* <Menu
        className='h-full'
        theme='light'
        mode='horizontal'
        triggerSubMenuAction='click'
        items={routeContext.topMenu}
        onClick={clickMenu}></Menu> */}
      <BaseMenu
        mode='horizontal'
        menuRenderType='header'
        className='meng-layout-top-nav-header-base-menu'
        hashId='999'
        collapsed={false}
        location={routeContext.location!}
        style={{
          height: '100%',
        }}
        matchMenuKeys={routeContext.matchMenuKeys || []}
        menuItemClick={routeContext.menuItemClick}
        menuData={menuData}></BaseMenu>
    </div>
  )
}
export default HorizontalMenu
