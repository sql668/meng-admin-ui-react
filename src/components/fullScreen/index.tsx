import screenfull from 'screenfull'
import { message } from 'antd'
import { useEffect, useState } from 'react'
import { FullscreenExitOutlined, FullscreenOutlined } from '@ant-design/icons'
import { createStyles } from 'antd-style'

const useStyles = createStyles(({ token, css }) => {
  return {
    container: {
      height: '100%',
      paddingRight: '15px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      flex: 1,
    },
    dropdown: {
      color: token.colorTextTertiary,
    },
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
  }
})

const FullScreen = () => {
  const { styles, cx } = useStyles()
  const [fullScreen, setFullScreen] = useState<boolean>(screenfull.isFullscreen)

  useEffect(() => {
    screenfull.on('change', () => {
      if (screenfull.isFullscreen) setFullScreen(true)
      else setFullScreen(false)
      return () => screenfull.off('change', () => {})
    })
  }, [])

  const handleFullScreen = () => {
    if (!screenfull.isEnabled) message.warning('当前您的浏览器不支持全屏 ❌')
    screenfull.toggle()
  }
  return (
    <div className={cx(styles.iconContainer)} onClick={handleFullScreen}>
      {fullScreen ? (
        <FullscreenExitOutlined className='icon' title='退出全屏' />
      ) : (
        <FullscreenOutlined className='icon' title='开全屏' />
      )}
    </div>
  )
}
export default FullScreen
