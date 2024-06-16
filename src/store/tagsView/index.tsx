import { HOME_PATHNAME } from "@/config/config"
import { TagsTabProps } from "@/types/tags"
import { createSelectors } from "@/utils/createSelector"
import { StateCreator, create } from "zustand"
import { devtools, persist, subscribeWithSelector } from "zustand/middleware"
import { immer } from "zustand/middleware/immer"

export type TagsTabStoreState = {
  tags: TagsTabProps[],
  defaultTag:string, //默认首页tagtab
}

const createTagsTabSlice: StateCreator<
  TagsTabStoreState,
  [
    ['zustand/immer', never],
    ['zustand/devtools', unknown],
    ['zustand/subscribeWithSelector', never],
    ['zustand/persist', unknown],
  ]
> = () => ({
  tags: [],
  defaultTag:HOME_PATHNAME,
})


export const useTagsTabStore = createSelectors(
  create<TagsTabStoreState>()(
    immer(
      devtools(
        subscribeWithSelector(
          persist(createTagsTabSlice, {
            name: 'tagstab-storage', // unique name
          }),
        ),
        {
          enabled: import.meta.env.VITE_APP_ENV === 'development', // 只在开发模式启用devtools
          name: 'tagstab store',
        },
      ),
    ),
  ),
)

// 恢复初始数据
export const resetTagsTab = () => {
  useTagsTabStore.setState((state) => {
    state.defaultTag = HOME_PATHNAME
    state.tags = []
  })
}

export const setDefaultTag = (path:string) => {
  useTagsTabStore.setState((state) => {
    state.defaultTag = path
  })
}

export const setTags = (v: TagsTabProps[]) => {
  useTagsTabStore.setState((state) => {
    state.tags = v
  })
}

export const removeTag = (index:number) => {
  useTagsTabStore.setState((state) => {
    state.tags.splice(index, 1)
  })
}

export const updateTag = (index: number, tab: TagsTabProps) => {
  useTagsTabStore.setState((state) => {
    //state.tags.splice(index, 1)
    state.tags[index] = tab
  })
}

export const removeOtherTag = (routePath: string) => {
  useTagsTabStore.setState((state) => {
    //(prev) => prev.filter((o) => o.routePath === routePath)
    state.tags = state.tags.filter(
      (o) => o.routePath === routePath || o.routePath === HOME_PATHNAME,
    )
  })
}

export const getTags = () => {
  // 注意： getState（）是非响应式的
  return useTagsTabStore.getState().tags
}
