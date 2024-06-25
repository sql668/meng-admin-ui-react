import { LogoutApi } from '@/api/login'
import Avatar from '@/assets/img/avatar.webp'
import FullScreen from '@/components/fullScreen'
import { SvgIcon } from '@/components/icon'
import { BaseMenu } from '@/components/menu'
import { default as ThemeSetting } from '@/components/theme'
import { LOGIN_PATHNAME } from '@/config/config'
import { useMenuContext } from '@/context/menu'
import { ThemeEnum } from '@/core/enums/appEnum'
import { useHeaderSetting } from '@/hooks/setting/useHeaderSetting'
import { useMenuSetting } from '@/hooks/setting/useMenuSetting'
import { useDesign } from '@/hooks/useDesign'
import { useDeepMemo } from '@/hooks/useMemo'
import LayoutBreadcrumb from '@/layout/components/breadcrumb'
import AppLogo from '@/layout/components/logo'
import { restRoutes, router } from '@/router/baseRouter'
import { getGlobalTheme, setGlobalTheme, useAppConfigStore } from '@/store/app'
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
  const nav = useNavigate()
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
      return <SvgIcon icon='dark_theme' className='anticon'></SvgIcon>
    } else if (themeMode === 'light') {
      return <SvgIcon icon='light_theme' className='anticon'></SvgIcon>
    } else {
      return <SvgIcon icon='auto_theme' className='anticon'></SvgIcon>
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
            className={`${prefixCls}-action__item`}
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
          <ThemeSetting className={`${prefixCls}-action__item theme-item`}></ThemeSetting>
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
