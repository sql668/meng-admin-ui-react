import { Layout } from 'antd'
import { ReactNode, FC } from 'react'

type WrapContentProps = {
  children: ReactNode
}
const WrapContent: FC<WrapContentProps> = (props) => {
  return <Layout.Content>{props.children}</Layout.Content>
}

export default WrapContent
