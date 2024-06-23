import { RouteContext } from '@/context/layout'
import { Layout } from 'antd'
import { CSSProperties, useContext, useEffect, useMemo, useRef } from 'react'
import { useThemeStore } from '@/store/theme'
import { useShallow } from 'zustand/react/shallow'
import { MenuDataItem } from '@/types/menu'
import { clearMenuItem } from '@/utils/menu'
import { createStyles } from 'antd-style'
import { BaseMenu } from '@/components/menu'
import { useMenuContext } from '@/context/menu'
import { useDeepMemo } from '@/hooks/useMemo'
import { useMenuSetting } from '@/hooks/setting/useMenuSetting'
import { useDesign } from '@/hooks/useDesign'
import classNames from 'classnames'

import { useDeepCompareEffect, useSize } from 'ahooks'
import { setMenuConfig } from '@/store/app'
import { ScollBar } from '@/components/scollBar'
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

const LayoutSideBar = () => {
  //const { styles, cx } = useStyles()

  const {
    location,
    onCollapse,
    isMobile,
    siderMenuWidth,
    collapsed: originCollapsed,
    matchMenuKeys,
    menuItemClick,
    menuData: originMenuData,
  } = useMenuContext()

  const {
    isMixSplitMenu,
    isSplitMenu,
    setMixSideHasChildren,
    menuFixed,
    getRealWidth,
    hiddenSideBar,
    getIsMixMode,
  } = useMenuSetting()
  const collapsed = isMobile ? false : originCollapsed

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

  const menuData = useDeepMemo(() => {
    let menuData: MenuDataItem[] = []
    if (isMixSplitMenu && !isMobile) {
      const [key] = matchMenuKeys || []
      if (key) {
        menuData = originMenuData?.find((item) => item.key === key)?.children || []
      }
      return menuData
    }
    return originMenuData
  }, [isMixSplitMenu, originMenuData, isMobile, matchMenuKeys])
  const showClassSideBarRef = useMemo(() => {
    return isSplitMenu ? !hiddenSideBar : true
  }, [])
  //console.log('side menu:', menuData)

  const clearMenuData = clearMenuItem(menuData || [])
  console.log('clearMenuData: ',clearMenuData)
  
  useDeepCompareEffect(() => {
    if (clearMenuData && clearMenuData?.length < 1 ) {
      setMixSideHasChildren(false)
      setMenuConfig({ hidden:true })
    } else {
      setMixSideHasChildren(true)
      setMenuConfig({ hidden: false })
    }
  }, [clearMenuData])

  // 收起的宽度
  const collapsedWidth = 64

  const { prefixCls } = useDesign('layout-sideBar')
  const getSideBarClass = useDeepMemo(() => {
    return classNames([
      prefixCls,
      {
        [`${prefixCls}--fixed`]: menuFixed,
        [`${prefixCls}--mix`]: getIsMixMode && !isMobile,
      },
    ])
  }, [prefixCls, menuFixed, getIsMixMode, isMobile])

  const getHiddenDomStyle = useMemo(() => {
    const width = `${getRealWidth}px`
    const style: CSSProperties = {
      width,
      overflow: 'hidden',
      flex: `0 0 ${width}`,
      maxWidth: width,
      minWidth: width,
      transition: 'all 0.2s',
    }
    if (!showClassSideBarRef) {
      style.display = 'none'
    }
    return style
  }, [getRealWidth, showClassSideBarRef])

  


  if (clearMenuData && clearMenuData?.length < 1 && isSplitMenu) {
    return null
  }

  return (
    <>
      {menuFixed && !isMobile && <div style={getHiddenDomStyle}></div>}
      <Layout.Sider
        className={getSideBarClass}
        //style={{ backgroundColor: 'transparent' }}
        collapsible
        trigger={null}
        collapsed={collapsed}
        onCollapse={(collapse) => {
          if (isMobile) return
          onCollapse?.(collapse)
        }}
        collapsedWidth={collapsedWidth}
        width={siderMenuWidth}>
        {/* <div
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
            location={location!}
            menuData={clearMenuData}
            matchMenuKeys={matchMenuKeys || []}
            menuItemClick={menuItemClick}
            style={{
              width: '100%',
            }}></BaseMenu>
        </div> */}
        <ScollBar>
          <BaseMenu
            collapsed={originCollapsed}
            mode={collapsed && !isMobile ? 'vertical' : 'inline'}
            className='meng-layout-sider-menu'
            hashId='999'
            location={location!}
            menuData={clearMenuData}
            matchMenuKeys={matchMenuKeys || []}
            menuItemClick={menuItemClick}
            style={{
              width: '100%',
            }}></BaseMenu>
        </ScollBar>
        dddd
      </Layout.Sider>
    </>
  )
}
export default LayoutSideBar
