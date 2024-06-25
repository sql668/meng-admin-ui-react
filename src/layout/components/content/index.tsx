import { useTabs } from '@/hooks/useTabs'
import { Layout } from 'antd'
import { useMemo } from 'react'
import { useOutlet } from 'react-router-dom'
import { CSSTransition, SwitchTransition } from 'react-transition-group'
import { TagsTabContext } from '../tagsView/tags-context'
import { useDesign } from '@/hooks/useDesign'
import classNames from 'classnames'

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
  const { prefixCls } = useDesign('layout-content')
  const getWrapClass = useMemo(() => {
    return classNames([
      prefixCls,
      {
        // [`${prefixCls}--fixed`]: fixed,
        // [`${prefixCls}--${themeMode}`]: themeMode,
        full: true,
      },
    ])
  }, [prefixCls])
  return (
    // <TagsTabContext.Provider value={tagsContextValue}>
    //   <Layout.Content className='mx-layout-content'>
    //     <SwitchTransition mode='out-in'>
    //       <CSSTransition key={location.pathname} timeout={500} classNames='ra-fade' unmountOnExit>
    //         <div className='h-full w-full' key={activeTab?.key}>
    //           {currentOutlet}
    //         </div>
    //       </CSSTransition>
    //     </SwitchTransition>
    //   </Layout.Content>
    // </TagsTabContext.Provider>
    <div className={getWrapClass}>
      <SwitchTransition mode='out-in'>
        <CSSTransition key={location.pathname} timeout={500} classNames='ra-fade' unmountOnExit>
          <div className='h-full w-full overflow-auto' key={activeTab?.key}>
            {currentOutlet}
          </div>
        </CSSTransition>
      </SwitchTransition>
    </div>
  )
}

export default LayoutContent
