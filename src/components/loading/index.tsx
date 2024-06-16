import { useEffect, useState } from 'react'
import NProgress from 'nprogress'
import { Spin } from 'antd'

/**
 * 路由切换loading
 */
const Loading = () => {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const timer = window.setTimeout(() => {
      NProgress.start()
      setVisible(true)
    }, 100)

    return () => {
      window.clearTimeout(timer)
      NProgress.done()
      //setVisible(false)
    }
  })

  if (!visible) {
    return null
  }

  return (
    <Spin
      size='large'
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
      }}
    />
  )
}

export default Loading
