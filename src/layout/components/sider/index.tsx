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
import { setMenuSetting } from '@/store/app'
import { ScollBar } from '@/components/scollBar'
import LayoutTrigger from '@/layout/default/trigger'
import { SIDE_BAR_MINI_WIDTH } from '@/core/enums/menuEnum'
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
    //onCollapse,
    isMobile,
    //siderMenuWidth,
    //collapsed: originCollapsed,
    matchMenuKeys,
    menuItemClick,
    menuData: originMenuData,
  } = useMenuContext()

  const {
    isMixSplitMenu,
    isSplitMenu,
    isCollapsed: originCollapsed,
    toggleCollapsed,
    setMixSideHasChildren,
    menuFixed,
    getRealWidth,
    hiddenSideBar,
    getIsMixMode,
    menuWidth,
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
  }, [isSplitMenu, hiddenSideBar])
  //console.log('side menu:', menuData)

  const clearMenuData = clearMenuItem(menuData || [])
  console.log('clearMenuData: ',clearMenuData)
  
  useDeepCompareEffect(() => {
    if (clearMenuData && clearMenuData?.length < 1 ) {
      setMixSideHasChildren(false)
      setMenuSetting({ hidden: true })
    } else {
      setMixSideHasChildren(true)
      setMenuSetting({ hidden: false })
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

  const renderTrigger = useMemo(() => {
    return <LayoutTrigger sider></LayoutTrigger>
   },[])

  


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
        trigger={renderTrigger}
        collapsed={collapsed}
        onCollapse={() => {
          if (isMobile) return
          toggleCollapsed?.()
        }}
        collapsedWidth={SIDE_BAR_MINI_WIDTH}
        width={menuWidth}>
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
      </Layout.Sider>
    </>
  )
}
export default LayoutSideBar
