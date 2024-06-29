
import { useThemeStore } from '@/store/theme'
import { Dropdown, Tabs } from 'antd'
import { useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { MenuItemType } from 'antd/lib/menu/hooks/useItems'
import { useTabs } from '@/hooks/useTabs'
import { TagsTabProps } from '@/types/tags'
import { Icon } from '@/components/icon'
import { useTagsTabStore } from '@/store/tagsView'
import { useDesign } from '@/hooks/useDesign'
import classNames from 'classnames'
import "./style/tabs.style.scss"


enum OperationType {
  REFRESH = 'refresh',
  CLOSE = 'close',
  CLOSEOTHER = 'close-other',
}


const TagsView = () => {
  
  const { tabs, activeTabRoutePath, closeTab, refreshTab, closeOtherTab } = useTabs()
  console.log('activeTabRoutePath: ', activeTabRoutePath)
  
  const { prefixCls } = useDesign('multiple-tabs')
  const navigate = useNavigate()
  const homePath = useTagsTabStore.use.defaultTag()

  const enableTagsView = useThemeStore((state) => state.enableTagsView)

  const menuItems: MenuItemType[] = useMemo(
    () =>
      [
        {
          label: (
            <>
              <Icon icon='icon-park-outline:refresh' size={12}></Icon>
              <span className='ml-4 font-size-12'>刷新</span>
            </>
          ),
          key: OperationType.REFRESH,
        },
        tabs.length <= 1
          ? null
          : {
              label: (
                <>
                  <Icon icon='icon-park-outline:close-one' size={12}></Icon>
                  <span className='ml-4 font-size-12'>关闭</span>
                </>
              ),
              key: OperationType.CLOSE,
            },
        tabs.length <= 1
          ? null
          : {
              label: (
                <>
                  <Icon icon='icon-park-outline:close' size={12}></Icon>
                  <span className='ml-4 font-size-12'>关闭其它</span>
                </>
              ),
              key: OperationType.CLOSEOTHER,
            },
      ].filter((o) => o !== null) as MenuItemType[],
    [tabs],
  )

  const renderTabTitle = (tab: TagsTabProps) => {
    return (
      <Dropdown
        menu={{ items: menuItems, onClick: (e: any) => menuClick(e, tab) }}
        trigger={['contextMenu']}>
        <div style={{ margin: '-12px 0', padding: '12px 0' }}>{tab.title}</div>
      </Dropdown>
    )
  }

  const tabItems = useMemo(() => {
    return tabs.map((tab) => {
      return {
        key: tab.routePath,
        label: renderTabTitle(tab),
        closable: tabs.length > 1 && tab.routePath != homePath, // 剩最后一个就不能删除了
      }
    })
  }, [tabs])

  const clickTabs = (path: string) => {
    navigate(path)
  }

  const editTabs = (
    targetKey: React.MouseEvent | React.KeyboardEvent | string,
    action: 'add' | 'remove',
  ) => {
    if (action === 'remove') {
      // 关闭tab页签
      closeTab(targetKey as string)
    }
  }

  const menuClick = useCallback(
    ({ key, domEvent }: any, tab: TagsTabProps) => {
      domEvent.stopPropagation()

      if (key === OperationType.REFRESH) {
        refreshTab(tab.routePath)
      } else if (key === OperationType.CLOSE) {
        closeTab(tab.routePath)
      } else if (key === OperationType.CLOSEOTHER) {
        closeOtherTab(tab.routePath)
      }
    },
    [closeOtherTab, closeTab, refreshTab],
  )

  const getWrapClass = useMemo(() => {
    return classNames([
      prefixCls,
      {
        // [`${prefixCls}--fixed`]: fixed,
        // [`${prefixCls}--${themeMode}`]: themeMode,
      },
    ])
  }, [prefixCls])

  return (
    <>
      {enableTagsView && (
        <div className={getWrapClass}>
          <Tabs
            animated
            type='editable-card'
            hideAdd
            size='small'
            activeKey={activeTabRoutePath}
            onChange={clickTabs}
            onEdit={editTabs}
            items={tabItems}></Tabs>
        </div>
      )}
    </>
  )
}

export default TagsView
