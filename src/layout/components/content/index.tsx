import { useTabs } from '@/hooks/useTabs'
import { Layout } from 'antd'
import { useMemo } from 'react'
import { useOutlet } from 'react-router-dom'
import { CSSTransition, SwitchTransition } from 'react-transition-group'
import { TagsTabContext } from '../tagsView/tags-context'

const LayoutContent = () => {
  const currentOutlet = useOutlet()
  const { closeTab, refreshTab, closeOtherTab, activeTab } = useTabs()
  const tagsContextValue = useMemo(
    () => ({
      closeTab,
      closeOtherTab,
      refreshTab,
    }),
    [closeTab, closeOtherTab, refreshTab],
  )
  return (
    <TagsTabContext.Provider value={tagsContextValue}>
      <Layout.Content className='meng-layout-main mx-layout-content'>
        <SwitchTransition mode='out-in'>
          <CSSTransition key={location.pathname} timeout={500} classNames='ra-fade' unmountOnExit>
            <div className='h-full w-full' key={activeTab?.key}>
              {currentOutlet}
            </div>
          </CSSTransition>
        </SwitchTransition>
        {/* <Outlet></Outlet> */}
      </Layout.Content>
    </TagsTabContext.Provider>
  )
}

export default LayoutContent
