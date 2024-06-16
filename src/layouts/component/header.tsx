import { Layout } from 'antd'
import { useTheme } from 'antd-style'
import NavBar from '../navBars'
import { setAlpha } from '@/utils/style'
const LayoutHeader = () => {
  const token = useTheme()
  return (
    <Layout.Header
      style={{
        height: token.heightLayoutHeader || 50,
        lineHeight: token.heightLayoutHeader || 50,
        backgroundColor: setAlpha(token.colorBgElevated, 0.6),
        padding: 0,
        borderBottom: `1px solid ${token.colorSplit}`,
      }}>
      <NavBar></NavBar>
    </Layout.Header>
  )
}
export default LayoutHeader
