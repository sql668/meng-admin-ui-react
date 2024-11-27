import { IRouteMeta } from './route'

export interface TagsTabProps {
  title: string
  routePath: string
  key: string
  pathname: string
  children?: any
  handle?: IRouteMeta
}
