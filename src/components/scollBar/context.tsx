import { createContext, useContext } from "react"

interface ScrollbarContextValueProps {
  scrollbarElement?: React.MutableRefObject<HTMLDivElement>
  wrapElement?: React.MutableRefObject<HTMLDivElement>
}
export const ScrollbarContext: React.Context<ScrollbarContextValueProps> = createContext({})

export const useScrollBarContext = () => {
  return useContext(ScrollbarContext)
}