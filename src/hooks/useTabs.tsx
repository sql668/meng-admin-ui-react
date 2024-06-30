import { useCallback, useEffect, useState } from 'react'
import useMatchRoute from './useMatchRoute'
import { useNavigate } from 'react-router-dom'
import { useAliveController } from 'react-activation'
import {
  setTags as setTabs,
  removeTag,
  useTagsTabStore,
  removeOtherTag,
  updateTag,
} from '@/store/tagsView'

function getKey() {
  return new Date().getTime().toString()
}

export function useTabs() {
  // 当前打开的tab页签
  const tabs = useTagsTabStore.use.tags()
  const homePath = useTagsTabStore.use.defaultTag()

  // 当前激活的tab
  const [activeTabRoutePath, setActiveTabRoutePath] = useState<string>('')

  // 当前匹配的路由
  const matchRoute = useMatchRoute()

  const navigate = useNavigate()

  const { getCachingNodes, drop, refresh } = useAliveController()

  const closeTab = useCallback(
    (routePath?: string) => {
      if (!routePath) {
        routePath = activeTabRoutePath
      }
      const cachingNodes = getCachingNodes()
      // 不能关闭首页
      if (routePath === homePath) return
      const index = tabs.findIndex((o) => o.routePath === routePath)
      if (tabs[index].routePath === activeTabRoutePath && tabs.length > 1) {
        if (index > 0) {
          navigate(tabs[index - 1].routePath)
        } else {
          navigate(tabs[index + 1].routePath)
        }
      }
      const cache = cachingNodes.find((item) => item.cacheKey === routePath)
      if (cache) {
        // 关闭的页面开启了缓存，需要将该页面从缓存中删除
        drop(cache.name!)
      }
      // tabs.splice(index, 1)
      // setTabs([...tabs])
      removeTag(index)
    },
    [activeTabRoutePath],
  )

  const refreshTab = useCallback(
    (routePath?: string) => {
      if (!routePath) {
        routePath = activeTabRoutePath
      }
      const cachingNodes = getCachingNodes()
      const cache = cachingNodes.find((item) => item.cacheKey === routePath)
      refresh(cache?.name!)
      if (cache) {
        // 关闭的页面开启了缓存，需要将该页面从缓存中删除
        refresh(cache.name!)
      } else {
        const index = tabs.findIndex((tab) => tab.routePath === routePath)
        if (index >= 0) {
          // 这个是react的特性，key变了，组件会卸载重新渲染
          //tabs[index].key = getKey()
          updateTag(index, {
            ...tabs[index],
            key: getKey(),
          })
        }
        //setTabs([...tabs])
      }
      // 增加重定向操作，使页面刷新出现切换的效果，也可以注释掉该操作
      navigate(`/redirect${routePath}${location.search}`)
    },
    [activeTabRoutePath],
  )
  const closeOtherTab = (routePath?: string) => {
    if (!routePath) {
      routePath = activeTabRoutePath
    }
    const cachingNodes = getCachingNodes()
    tabs.forEach((tab) => {
      if (tab.routePath !== routePath && routePath !== homePath) {
        const cache = cachingNodes.find((item) => item.name === tab.routePath)
        if (cache) {
          // 关闭的页面开启了缓存，需要将该页面从缓存中删除
          drop(cache.name!)
        }
      }
    })
    removeOtherTag(routePath)
  }

  const activeTab = tabs.find((item) => item.routePath === activeTabRoutePath)

  useEffect(() => {
    if (!matchRoute) return
    if (matchRoute.handle?.title == '404' || matchRoute.handle?.title == 'redirect') return

    if (matchRoute.handle?.redirect) return
    const existKeepAliveTab = tabs.find((item) => item.routePath === matchRoute.routePath)
    if (!existKeepAliveTab) {
      setTabs([
        ...tabs,
        {
          title: matchRoute.title,
          key: getKey(),
          routePath: matchRoute.routePath,
          pathname: matchRoute.pathname,
          //children: matchRoute.children,  zuztand 不能添加children,否则会报错
          handle: matchRoute.handle,
        },
      ])
    }
    // TODO tabs中存在当前路由，但是路由参数不同，可以刷新该路由
    setActiveTabRoutePath(matchRoute.routePath)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matchRoute])

  return {
    tabs,
    setTabs,
    activeTabRoutePath,
    closeTab,
    refreshTab,
    closeOtherTab,
    activeTab,
  }
}
