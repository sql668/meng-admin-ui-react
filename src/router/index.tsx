import { antdUtils } from '@/utils/antdUtil'
import { App } from 'antd'
import { lazy, useEffect } from 'react'
import { RouterProvider } from 'react-router-dom'
import { router } from './baseRouter'
import KeepAlive from 'react-activation'
import LazyLoad from '@/components/lazy'
import { IframeLayout } from '@/layouts/iframe'
import { RouterVo } from '@/types/model/routerVo'

const Router = () => {
  const { notification, message, modal } = App.useApp()

  useEffect(() => {
    antdUtils.setMessageInstance(message)
    antdUtils.setNotificationInstance(notification)
    antdUtils.setModalInstance(modal)
  }, [notification, message, modal])

  return <RouterProvider router={router} />
}

const modules = import.meta.glob('@/views/**/*/index.tsx')

export const LoadView = (props: RouterVo) => {
  if (props.handle.component === 'Layout') {
    return null
  } else if (props.handle.component === 'IFrame') {
    return <IframeLayout></IframeLayout>
  }

  if (props.handle.isKeepAlive) {
    return (
      <KeepAlive cacheKey={props.path} name={props.path}>
        {LazyLoad(lazy(modules[`/src${props.handle.component}.tsx`] as any))}
      </KeepAlive>
    )
  }

  return LazyLoad(lazy(modules[`/src${props.handle.component}.tsx`] as any))
}

export default Router
