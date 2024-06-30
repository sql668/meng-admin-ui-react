import { staticRouteData } from '@/router/baseRouter'
import { useRouterStore } from '@/store/router'
import { getMatchRoute } from '@/utils/route'
import { useMemo } from 'react'
import { useLocation } from 'react-router'

function useRouter() {
  const { pathname } = useLocation()
  const apiRouters = useRouterStore.use.allRouters()
  const allRouters = useMemo(
    () =>
      staticRouteData.concat(apiRouters, [
        {
          path: '/redirect',
          handle: {
            title: 'redirect',
            hasLayout: true,
          },
        },
        {
          path: '/redirect/*',
          handle: {
            title: 'redirect',
            hasLayout:true
          },
        },
      ]),
    [apiRouters],
  )
  const matchRoutes = useMemo(
    () => getMatchRoute(pathname, allRouters, true),
    [pathname, allRouters],
  )
  return {
    matchRoutes,
  }
}

export default useRouter
