import { useHeaderSetting } from "@/hooks/setting/useHeaderSetting";
import { useMenuSetting } from "@/hooks/setting/useMenuSetting";
import useRootSetting from "@/hooks/setting/useRootSetting";
import { useDesign } from "@/hooks/useDesign";
import { useDeepMemo } from "@/hooks/useMemo";
import TagsView from "@/layout/components/tagsView";
import classNames from "classnames";
import { CSSProperties, useMemo } from "react";
import "./style/multiHeader.style.scss"
import useFullContent from "@/hooks/useFullContent";
import useMultipleTabSetting from "@/hooks/setting/useMultipleTabSetting";
import useContentViewHeight from "@/layout/components/content/useContentViewHeight";
import { LayoutHeader } from "./header";

const HEADER_HEIGHT = 48

const TABS_HEIGHT = 32

function MultipleHeader() { 
  const { prefixCls } = useDesign('layout-multiple-header')
  const {
    getHeaderFixed,
    getShowFullHeaderRef,
    getHeaderTheme,
    getShowHeader,
    getShowInsetHeaderRef,
  } = useHeaderSetting()
  const { getCalcContentWidth,getShowMenu,getSplitMenu } = useMenuSetting()
  const { getIsMobile } = useRootSetting()
  const { getFullContent } = useFullContent()
  const { getShowMultipleTab } = useMultipleTabSetting()
  const { setHeaderHeight} = useContentViewHeight()

  const getIsFixed = useMemo(() => {
    return getHeaderFixed || getShowFullHeaderRef
  }, [getHeaderFixed, getShowFullHeaderRef])
  

   const getClass = useDeepMemo(() => {
     return classNames([
       prefixCls,
       `${prefixCls}--${getHeaderTheme}`,
       {
         [`${prefixCls}--fixed`]: getIsFixed,
       },
     ])
   }, [prefixCls])
  
  const getWrapStyle = useDeepMemo(() => {
    const style: CSSProperties = {}
    if (getHeaderFixed) {
      style.width = getIsMobile ? '100%' : getCalcContentWidth
    }
    if (getShowFullHeaderRef) {
      style.top = `${HEADER_HEIGHT}px`
    }
    return style
  }, [getHeaderFixed, getIsMobile, getCalcContentWidth, getShowFullHeaderRef])

  const getIsShowPlaceholderDom = getHeaderFixed || getShowFullHeaderRef
  const getIsUnFold = !getShowMenu && !getShowHeader

  const getPlaceholderDomStyle = useMemo((): CSSProperties => {
    let height = 0
    if (!getIsUnFold) {
      if ((getShowFullHeaderRef || !getSplitMenu) && getShowHeader && !getFullContent) {
        height += HEADER_HEIGHT
      }
      if (getShowMultipleTab && !getFullContent) {
        height += TABS_HEIGHT
      }
      setHeaderHeight(height)
    }
    return {
      height: `${height}px`,
    }
  }, [
    getIsUnFold,
    getShowFullHeaderRef,
    getSplitMenu,
    getShowHeader,
    getFullContent,
    getShowMultipleTab,
    getFullContent,
  ])
  return (
    <>
      {getIsShowPlaceholderDom && (
        <div style={getPlaceholderDomStyle} className={`${prefixCls}__placeholder`}></div>
      )}

      <div className={getClass} style={getWrapStyle}>
        {getShowInsetHeaderRef && <LayoutHeader />}
        <TagsView></TagsView>
      </div>
    </>
  )
}

export { MultipleHeader }