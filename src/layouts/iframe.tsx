import { Spin } from 'antd'
import { useState } from 'react'
import { createStyles, css } from 'antd-style'
import { useMatches } from 'react-router-dom'
import { RouterHandleVo } from '@/types/model'

const useStyles = createStyles({
  container: css`
    height: 100%;
    width: 100%;
    position: relative;
    overflow: hidden;
    .ant-spin-nested-loading {
      height: 100%;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .ant-spin-container {
      width: 100%;
      height: 100%;
    }
  `,
})

function IframeLayout() {
  const [loading, setLoading] = useState(true)
  const { styles, cx } = useStyles()
  //const { activeTab } = useTabs()
  // 获取所有路由
  const matches = useMatches()
  console.log(matches)

  return (
    <div className={cx(styles.container)}>
      <Spin size='large' className='iframe-loading' spinning={loading}>
        <iframe
          src={(matches.at(-1)?.handle as RouterHandleVo).linkUrl}
          frameBorder='0'
          height='100%'
          width='100%'
          onLoad={() => setLoading(false)}></iframe>
      </Spin>
    </div>
  )
}

IframeLayout.displayName = 'IframeLayout'

IframeLayout.whyDidYouRender = true

export { IframeLayout }
