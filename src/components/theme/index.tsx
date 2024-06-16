import { useThemeStore } from '@/store/theme'
import { FireOutlined, SettingOutlined, SkinOutlined } from '@ant-design/icons'
import { Divider, Drawer, Switch } from 'antd'
import { createStyles } from 'antd-style'
import { useState } from 'react'
import { useShallow } from 'zustand/react/shallow'

const useStyles = createStyles(({ token, css }) => {
  return {
    iconContainer: css`
      height: 100%;
      padding: 0 10px;
      font-size: 16px;
      display: flex;
      align-items: center;
      color: ${token.colorTextTertiary};
      cursor: pointer;

      &:hover {
        background-color: ${token.colorBgTextHover};
        .icon {
          animation: logoAnimation 0.3s ease-in-out;
        }
      }
    `,

    itemRow: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '5px',
    },

    itemLabel: {
      flex: 1,
      color: token.colorText,
    },
  }
})

const ThemeConfig = () => {
  const { styles, cx } = useStyles()
  const [visible, setVisible] = useState<boolean>(false)
  const { splitMenus } = useThemeStore(
    useShallow((state) => ({
      layoutMode: state.layout,
      splitMenus: state.splitMenus,
    })),
  )

  return (
    <>
      <div
        className={cx(styles.iconContainer)}
        onClick={() => {
          setVisible(true)
        }}>
        <SkinOutlined className='icon' title='主题配置' />
      </div>
      <Drawer
        width={300}
        closable={false}
        placement='right'
        open={visible}
        onClose={() => {
          setVisible(false)
        }}>
        {/* 全局主题 */}
        <Divider className='divider'>
          <FireOutlined />
          全局主题
        </Divider>

        {/* 界面设置 */}
        <Divider className='divider'>
          <SettingOutlined />
          界面设置
        </Divider>
        <div className={cx(styles.itemRow)}>
          <span className={cx(styles.itemLabel)}>分割菜单</span>
          <Switch
            checked={splitMenus}
            onChange={(e) => {
              useThemeStore.setState((state) => {
                state.splitMenus = e
              })
            }}
          />
        </div>
      </Drawer>
    </>
  )
}

export default ThemeConfig
