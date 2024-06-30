import { LogoutApi } from '@/api/login'
import Avatar from '@/assets/img/avatar.webp'
import FullScreen from '@/components/fullScreen'
import { LOGIN_PATHNAME } from '@/config/config'
import { ThemeEnum } from '@/core/enums/appEnum'
import { useHeaderSetting } from '@/hooks/setting/useHeaderSetting'
import { useMenuSetting } from '@/hooks/setting/useMenuSetting'
import { useDesign } from '@/hooks/useDesign'
import { restRoutes, router } from '@/router/baseRouter'
import { setPermissionRouters } from '@/store/permission'
import { resetTagsTab } from '@/store/tagsView'
import { setPermissions, useUserStore } from '@/store/user'
import { Session } from '@/utils/storage'
import { setAlpha } from '@/utils/style'
import { LoginOutlined, UserOutlined } from '@ant-design/icons'
import { Dropdown, Layout, MenuProps, Modal, message } from 'antd'
import { createStyles } from 'antd-style'
import classNames from 'classnames'
import { memo, useMemo, useState } from 'react'
import { useAliveController } from 'react-activation'
import { useNavigate } from 'react-router-dom'
import LayoutTrigger from '../trigger'
import useRootSetting from '@/hooks/setting/useRootSetting'
import { SettingDrawer } from '../setting'
import { AppLogo, ThemeToggle } from '@/components/application'
import "./style/_style.scss"
import LayoutMenu from '../menu'
import { MenuModeEnum, MenuSplitTyeEnum } from '@/core/enums/menuEnum'

interface LayoutHeaderProps {
  fixed?: boolean
}


const items: MenuProps['items'] = [
  {
    key: 'userInfo',
    label: <a>个人中心</a>,
    icon: <UserOutlined />,
  },
  {
    key: 'logout',
    label: <a>退出登录</a>,
    icon: <LoginOutlined />,
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
  const nav = useNavigate()
  const { styles, cx } = useStyles()
  const { prefixCls } = useDesign('layout-header')
  const { getShowTopMenu,getShowHeaderTrigger,getSplitMenu,getIsMixSidebar,getIsMixMode,getMenuWidth } = useMenuSetting()
  const { getShowContent,getHeaderTheme,getShowHeaderLogo} = useHeaderSetting()
  
  const {getIsMobile } = useRootSetting()
  const getHeaderClass = useMemo(() => {
    return classNames([
      prefixCls,
      {
        [`${prefixCls}--fixed`]: fixed,
        [`${prefixCls}--mobile`]: getIsMobile,
        [`${prefixCls}--${getHeaderTheme}`]: getHeaderTheme,
      },
    ])
  }, [prefixCls, getIsMobile,getHeaderTheme])

  const [isModalOpen, setIsModalOpen] = useState(false)
  const { clear } = useAliveController()
  const userInfo = useUserStore.use.user()

  const onClick: MenuProps['onClick'] = ({ key }) => {
    if (key === 'logout') {
      setIsModalOpen(true)
    }
  }

   const handleOk = async () => {
     const res = await LogoutApi()
     if (res.code === 0) {
       Session.remove('token')

       setIsModalOpen(false)
       setTimeout(() => {
         clear() // 清空路由缓存节点
         nav(LOGIN_PATHNAME)
         setPermissions([])
         setPermissionRouters([])
         restRoutes(router.routes)
         resetTagsTab()
       }, 0)
     } else {
       message.error(res.msg)
     }
   }

   const handleCancel = () => {
     setIsModalOpen(false)
   }
  
   const getLogoWidth = useMemo(() => {
     if (!getIsMixMode || getIsMobile) {
       return undefined
     }
     const width = getMenuWidth < 180 ? 180 : getMenuWidth
     return { width: `${width}px` }
   }, [getIsMixMode, getIsMobile, getMenuWidth])
  
  const getSplitType = getSplitMenu ? MenuSplitTyeEnum.TOP : MenuSplitTyeEnum.NONE

   const getMenuMode = getSplitMenu ? MenuModeEnum.HORIZONTAL : null
  

  return (
    <>
      <Layout.Header className={cx(getHeaderClass, styles.container)}>
        <div className={`${prefixCls}-left`}>
          {(getShowHeaderLogo || getIsMobile) && (
              <AppLogo
                wrapStyle={getLogoWidth}
                theme={getHeaderTheme}
                className={`${prefixCls}-logo`}></AppLogo>
            )}

          {((getShowContent && getShowHeaderTrigger && !getSplitMenu && !getIsMixSidebar) ||
            getIsMobile) && <LayoutTrigger></LayoutTrigger>}
        </div>
        {(getShowTopMenu && !getIsMobile) && (
          <div className={`${prefixCls}-menu`}>
            <LayoutMenu
              isHorizontal
              type='top'
              theme={ThemeEnum.LIGHT}
              splitType={getSplitType}
              menuMode={getMenuMode}></LayoutMenu>
          </div>
        )}

        <div className={`${prefixCls}-action`}>
          <ThemeToggle className={`${prefixCls}-action__item`}></ThemeToggle>
          <SettingDrawer className={`${prefixCls}-action__item theme-item`}></SettingDrawer>
          <FullScreen className={`${prefixCls}-action__item`}></FullScreen>
          <Dropdown menu={{ items, onClick }} className={`${prefixCls}-action__item`}>
            <span className='h-full flex flex-items-center'>
              <img
                src={Avatar}
                style={{
                  height: '25px',
                  width: '25px',
                  borderRadius: '100%',
                  marginRight: '5px',
                }}></img>
              {userInfo?.userName}
              <i className='i-ep:arrow-down ml-5' style={{ height: '14px', width: '14px' }}></i>
            </span>
          </Dropdown>
        </div>
      </Layout.Header>

      <Modal
        title='提示'
        okText='确定'
        cancelText='取消'
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}>
        <p>此操作即将退出登录，是否继续</p>
      </Modal>
    </>
  )
})

if (process.env.NODE_ENV !== 'production') {
  LayoutHeader.displayName = 'LayoutHeader'
  ;(LayoutHeader as any).whyDidYouRender = true
}
export { LayoutHeader }
