
import { Layout } from 'antd'
import { CSSProperties,useEffect,useMemo } from 'react'
import { MenuDataItem } from '@/types/menu'
import { clearMenuItem } from '@/utils/menu'
import { useMenuContext } from '@/context/menu'
import { useDeepMemo } from '@/hooks/useMemo'
import { useMenuSetting } from '@/hooks/setting/useMenuSetting'
import { useDesign } from '@/hooks/useDesign'
import classNames from 'classnames'

import { useDeepCompareEffect } from 'ahooks'
import { setMenuSetting } from '@/store/app'
import LayoutTrigger from '@/layout/default/trigger'
import { MenuModeEnum, MenuSplitTyeEnum, SIDE_BAR_MINI_WIDTH, TriggerEnum } from '@/core/enums/menuEnum'
import { useTrigger } from './useLayoutSide'
import LayoutMenu from '@/layout/default/menu'
import useRootSetting from '@/hooks/setting/useRootSetting'
import "./style/_sider.style.scss"
import { useSiderEvent } from './useLayoutSider'
import { useBreakpoint } from '@/hooks/useBreakpoint'

// const useStyles = createStyles(({ css }) => {
//   return {
//     container: {
//       height: '100%',
//     },
//     slider: css`
//       background: transparent;

//       .ant-layout-sider-children {
//         border-inline-end: 1px solid rgba(5, 5, 5, 0.06);
//         position: relative;
//         padding-inline: 8px;
//         display: flex;
//         flex-direction: column;
//         height: 100%;
//         padding-inline: 8px;
//         padding-block: 0;
//         margin-inline-end: -1px;

//         .meng-layout-sider-menu {
//           height: 100%;
//         }
//       }
//     `,
//   }
// })

const Sider = () => {
  //const { styles, cx } = useStyles()

  const {
    matchMenuKeys,
    menuData: originMenuData,
  } = useMenuContext()

  const {
    isMixSplitMenu,
    getSplitMenu,
    getCollapsed: originCollapsed,
    toggleCollapsed,
    setMixSideHasChildren,
    menuFixed,
    getRealWidth,
    hiddenSideBar,
    getIsMixMode,
    getMenuWidth,
    getMenuTheme,
    getTrigger,
  } = useMenuSetting()
  const { getIsMobile,getIsDisableMobile} = useRootSetting()
  const collapsed = getIsMobile ? false : originCollapsed
  const { getShowTrigger } = useTrigger()
  const {onBreakpointChange} = useSiderEvent()

  const menuData = useDeepMemo(() => {
    let menuData: MenuDataItem[] = []
    if (isMixSplitMenu && !getIsMobile) {
      const [key] = matchMenuKeys || []
      if (key) {
        menuData = originMenuData?.find((item) => item.key === key)?.children || []
      }
      return menuData
    }
    return originMenuData
  }, [isMixSplitMenu, originMenuData, getIsMobile, matchMenuKeys])
  const showClassSideBarRef = useMemo(() => {
    return getSplitMenu ? !hiddenSideBar : true
  }, [getSplitMenu, hiddenSideBar])
  const clearMenuData = clearMenuItem(menuData || [])

  useDeepCompareEffect(() => {
    if (clearMenuData && clearMenuData?.length < 1) {
      setMixSideHasChildren(false)
      setMenuSetting({ hidden: true })
    } else {
      setMixSideHasChildren(true)
      setMenuSetting({ hidden: false })
    }
  }, [clearMenuData])

  // 收起的宽度
  //const collapsedWidth = 64

  const { prefixCls } = useDesign('layout-sideBar')
  const getSideBarClass = useDeepMemo(() => {
    return classNames([
      prefixCls,
      {
        [`${prefixCls}--fixed`]: menuFixed,
        [`${prefixCls}--mix`]: getIsMixMode && !getIsMobile,
      },
    ])
  }, [prefixCls, menuFixed, getIsMixMode, getIsMobile])

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

   const getMode = useMemo(() => {
     return getSplitMenu ? MenuModeEnum.INLINE : null
   }, [getSplitMenu])
  
  const getSplitType = useMemo(() => {
    return getSplitMenu ? MenuSplitTyeEnum.LEFT : MenuSplitTyeEnum.NONE
  }, [getSplitMenu])

  const renderTrigger = useMemo(() => {
    if (!getShowTrigger) return null
    return <LayoutTrigger sider></LayoutTrigger>
  }, [getShowTrigger])

   const colSize = useBreakpoint()
  useEffect(() => {
     
     if (colSize === 'md' && !getIsDisableMobile) {
       onBreakpointChange(true)
     } else {
       onBreakpointChange(false)
     }
   }, [getIsDisableMobile, colSize])
  

  if (clearMenuData && clearMenuData?.length < 1 && getSplitMenu) {
    return null
  }

  return (
    <>
      {menuFixed && !getIsMobile && <div style={getHiddenDomStyle}></div>}
      <Layout.Sider
        className={getSideBarClass}
        //style={{ backgroundColor: 'transparent' }}
        collapsible
        breakpoint={getTrigger === TriggerEnum.FOOTER ? 'md' : 'lg'}
        theme={getMenuTheme}
        trigger={renderTrigger}
        collapsed={collapsed}
        onCollapse={() => {
          if (getIsMobile) return
          toggleCollapsed?.()
        }}
        onBreakpoint={onBreakpointChange}
        collapsedWidth={SIDE_BAR_MINI_WIDTH}
        width={getMenuWidth}>
        {/* <ScollBar>
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
        </ScollBar> */}
        <LayoutMenu
          type='sider'
          theme={getMenuTheme}
          menuMode={getMode}
          splitType={getSplitType}></LayoutMenu>
      </Layout.Sider>
    </>
  )
}
export default Sider
