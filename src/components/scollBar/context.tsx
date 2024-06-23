import { MutableRefObject, createContext, useContext } from "react"

interface ScrollbarContextValueProps {
  scrollbarElement?: React.MutableRefObject<HTMLElement>
  wrapElement?: React.MutableRefObject<HTMLElement>
}
export const ScrollbarContext: React.Context<ScrollbarContextValueProps> = createContext({})

export const useScrollBarContext = () => {
  return useContext(ScrollbarContext)
}