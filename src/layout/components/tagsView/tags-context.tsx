/* eslint-disable @typescript-eslint/no-empty-function */

import { createContext } from 'react'

interface TagsTabContextType {
  refreshTab: (path?: string) => void
  closeTab: (path?: string) => void
  closeOtherTab: (path?: string) => void
}

const defaultValue = {
  refreshTab: () => {},
  closeTab: () => {},
  closeOtherTab: () => {},
}

export const TagsTabContext = createContext<TagsTabContextType>(defaultValue)
