import { useDesign } from "@/hooks/useDesign"
import {  Layout } from "antd"
import { memo } from "react"
import  { MultipleHeader, LayoutHeader } from './header'
import LayoutContent from "../components/content"
import LayoutFooter from "../components/footer"
import { useDeepMemo } from "@/hooks/useMemo"
import classNames from "classnames"
import LayoutSider from "./sider"
import "./_style.scss"
import { useHeaderSetting } from "@/hooks/setting/useHeaderSetting"
import { useMenuSetting } from "@/hooks/setting/useMenuSetting"
import useRootSetting from "@/hooks/setting/useRootSetting"

function BaseLayout() { 
  const { prefixCls } = useDesign('default-layout')
  const { getShowFullHeaderRef } = useHeaderSetting()
  const { getShowSidebar } = useMenuSetting()
  const { getIsMobile} = useRootSetting()

  const getLayoutClass = useDeepMemo(() => {
    return classNames([
      `${prefixCls}-out`,
      {
        // [`${prefixCls}--fixed`]: fixed,
        // [`${prefixCls}--${themeMode}`]: themeMode,
      },
    ])
  }, [prefixCls])
  return (
    <>
      <Layout className={prefixCls}>
        {getShowFullHeaderRef && <LayoutHeader fixed></LayoutHeader>}
        <Layout className={getLayoutClass}>
          {(getShowSidebar || getIsMobile) && <LayoutSider></LayoutSider>}
          <Layout className={`${prefixCls}-main`}>
            <MultipleHeader></MultipleHeader>
            <LayoutContent></LayoutContent>
            <LayoutFooter></LayoutFooter>
          </Layout>
        </Layout>
      </Layout>
    </>
  )
}
if (process.env.NODE_ENV !== 'production') {
  BaseLayout.displayName = 'BaseLayout';
  (BaseLayout as any).whyDidYouRender = true
}
//export default BaseLayout
export default memo(BaseLayout)