import { useDesign } from "@/hooks/useDesign"
import useEffect from "@/hooks/useEffect"
import { depsIsEqual, isEqual } from "@/utils/is"
import { useDeepCompareEffect } from "ahooks"
import { Button, Layout } from "antd"
import React, { useRef } from "react"
import { memo, useCallback, useState } from "react"
import { useOutlet } from "react-router-dom"
import  { MultipleHeader, LayoutHeader } from './header'
import LayoutSideBar from "../components/sider"
import TagsView from "../components/tagsView"
import LayoutContent from "../components/content"
import LayoutFooter from "../components/footer"
import { useDeepMemo } from "@/hooks/useMemo"
import classNames from "classnames"

function BaseLayout() { 
  const { prefixCls } = useDesign('default-layout')

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
        <LayoutHeader fixed></LayoutHeader>
        <Layout className={getLayoutClass}>
          <LayoutSideBar ></LayoutSideBar>
          {/* <div className='w-full flex flex-col overflow-hidden main-parent '>
            <MultipleHeader></MultipleHeader>
            <LayoutContent></LayoutContent>
            <LayoutFooter></LayoutFooter>
          </div> */}
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