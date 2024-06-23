import { useHeaderSetting } from "@/hooks/setting/useHeaderSetting";
import { useMenuSetting } from "@/hooks/setting/useMenuSetting";
import { useDesign } from "@/hooks/useDesign";
import { useDeepMemo } from "@/hooks/useMemo";
import TagsView from "@/layout/components/tagsView";
import { useAppConfigStore } from "@/store/app";
import classNames from "classnames";
import { CSSProperties } from "react";

const HEADER_HEIGHT = 48

const TABS_HEIGHT = 32

function MultipleHeader() { 
  const { prefixCls } = useDesign('layout-multiple-header')
  const { isHeaderFixed, getShowFullHeaderRef } = useHeaderSetting()
  const { getCalcContentWidth } = useMenuSetting()
  const isMobile = useAppConfigStore.use.isMobile()
   const getClass = useDeepMemo(() => {
     return classNames([
       prefixCls,
       {
         [`${prefixCls}--fixed`]: true,
       },
     ])
   }, [prefixCls])
  
  const getWrapStyle = useDeepMemo(() => {
    const style: CSSProperties = {}
    if (isHeaderFixed) {
      style.width = isMobile ? '100%' : getCalcContentWidth
    }
    if (getShowFullHeaderRef) {
      style.top = `${HEADER_HEIGHT}px`
    }
    return style
  }, [isHeaderFixed, isMobile, getCalcContentWidth, getShowFullHeaderRef])
  return (
    <>
      <div style={{ height: 80 }}></div>
      <div className={getClass} style={getWrapStyle}>
        <TagsView></TagsView>
      </div>
    </>
  )
}

export { MultipleHeader }