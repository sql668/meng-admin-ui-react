import { AppLogo } from '@/components/application'
import { ThemeEnum } from '@/core/enums/appEnum'
import { MenuModeEnum, MenuSplitTyeEnum } from '@/core/enums/menuEnum'
import { useMenuSetting } from '@/hooks/setting/useMenuSetting'
import useRootSetting from '@/hooks/setting/useRootSetting'
import { useDesign } from '@/hooks/useDesign'
import classNames from 'classnames'
import { CSSProperties, memo, useMemo } from 'react'
import './style/_style.scss'
import { BaseMenu } from '@/components/menu'
import { useDeepMemo } from '@/hooks/useMemo'
import { MenuDataItem } from '@/types/menu'
import { useMenuContext } from '@/context/menu'
import { clearMenuItem } from '@/utils/menu'
import { ScollBar } from '@/components/scollBar'

interface LayoutMenuProps {
  theme?: ThemeEnum
  isHorizontal?: boolean
  menuMode?: MenuModeEnum | null
  splitType?: MenuSplitTyeEnum
  type: 'top' | 'sider'
}
const LayoutMenu = memo((props: LayoutMenuProps) => {
  const { theme, splitType, menuMode, type } = props

  const { getShowLogo, getIsMobile } = useRootSetting()

  const {
    getIsSidebarType,
    getCollapsed,
    getMenuTheme,
    isMixSplitMenu,
    getIsHorizontal,
    getMenuMode,
    getMenuType,
  } = useMenuSetting()
  const { prefixCls } = useDesign('layout-menu')

  const { location, matchMenuKeys, menuItemClick, menuData: originMenuData } = useMenuContext()

  //const collapsed = getIsMobile ? false : getCollapsed

  const getIsShowLogo = getShowLogo && getIsSidebarType

  const getComputedMenuTheme = useMemo(() => props.theme || getMenuTheme, [])

  const getLogoClass = useMemo(() => {
    return classNames([
      `${prefixCls}-logo`,
      getComputedMenuTheme,
      {
        [`${prefixCls}--mobile`]: true,
      },
    ])
  }, [prefixCls, getComputedMenuTheme, getIsMobile])

  const menuData = useDeepMemo(() => {
    let menuData: MenuDataItem[] = []
    if (isMixSplitMenu && type === 'top') {
      menuData = (originMenuData || []).map((item) => ({
        ...item,
        children: undefined,
        routes: undefined,
      }))
    } else if (isMixSplitMenu && !getIsMobile && type === 'sider') {
      const [key] = matchMenuKeys || []
      if (key) {
        menuData = originMenuData?.find((item) => item.key === key)?.children || []
      }
      return clearMenuItem(menuData)
    } else {
      menuData = originMenuData!
    }

    const menu = clearMenuItem(menuData || [])
    return menu
  }, [isMixSplitMenu, originMenuData, getIsMobile, matchMenuKeys, type])

  //const clearMenuData = clearMenuItem(menuData || [])
  //console.log('menuData: ', menuData)
  const getUseScroll = useMemo(() => {
    return (
      !getIsHorizontal &&
      (getIsSidebarType ||
        splitType === MenuSplitTyeEnum.LEFT ||
        splitType === MenuSplitTyeEnum.NONE)
    )
  }, [getIsHorizontal, getIsSidebarType, splitType])

  const getComputedMenuMode = useMemo(
    () => (getIsMobile ? MenuModeEnum.INLINE : menuMode || getMenuMode),
    [getIsMobile, menuMode, getMenuMode],
  )

  const getWrapperStyle = useMemo((): CSSProperties => {
    return {
      height: `calc(100% - ${getIsShowLogo ? '48px' : '0px'})`,
    }
  }, [getIsShowLogo])

  function renderHeader() {
    if (!getIsShowLogo && !getIsMobile) return null

    return (
      <AppLogo
        showTitle={!getCollapsed}
        className={getLogoClass}
        theme={getComputedMenuTheme}></AppLogo>
    )
  }

  function renderMenu() {
    return (
      <BaseMenu
        collapsed={getCollapsed}
        layout={getMenuType}
        mode={getComputedMenuMode}
        theme={theme}
        className='meng-layout-sider-menu'
        hashId='999'
        location={location!}
        menuData={menuData}
        matchMenuKeys={matchMenuKeys || []}
        menuItemClick={menuItemClick}
        style={{
          width: '100%',
        }}></BaseMenu>
    )
  }

  return (
    <>
      {renderHeader()}
      {getUseScroll ? <ScollBar style={getWrapperStyle}>{renderMenu()}</ScollBar> : renderMenu()}
    </>
  )
})

export default LayoutMenu
