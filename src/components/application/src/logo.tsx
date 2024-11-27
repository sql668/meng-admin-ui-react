import { ThemeEnum } from '@/core/enums/appEnum'
import { useMenuSetting } from '@/hooks/setting/useMenuSetting'
import { useDesign } from '@/hooks/useDesign'
import classNames from 'classnames'
import { CSSProperties, useMemo } from 'react'
import Logo from '@/assets/react.svg'
import useRootSetting from '@/hooks/setting/useRootSetting'
import '../style/_logo.scss'

interface AppLogoProps {
  theme: ThemeEnum
  showTitle?: boolean
  alwaysShowTitle?: boolean
  className?: string
  wrapStyle?: CSSProperties
}
function AppLogo(props: AppLogoProps) {
  const { theme, showTitle = true, alwaysShowTitle, className, wrapStyle } = props
  const { prefixCls } = useDesign('app-logo')
  const { getCollapsedShowTitle } = useMenuSetting()
  const { getAppName } = useRootSetting()
  const getWrapClass = useMemo(() => {
    return classNames([
      'anticon',
      className,
      prefixCls,
      theme,

      { 'collapsed-show-title': getCollapsedShowTitle },
    ])
  }, [className, prefixCls, theme, getCollapsedShowTitle])

  const getTitleClass = useMemo(() => {
    return classNames([
      'ml-8 truncate md:opacity-100',
      `${prefixCls}__title`,
      {
        'xs:opacity-0': !alwaysShowTitle,
      },
    ])
  }, [alwaysShowTitle])
  return (
    <div className={getWrapClass} style={wrapStyle}>
      <img src={Logo} alt='' />
      {showTitle && <div className={getTitleClass}>{getAppName}</div>}
    </div>
  )
}

export default AppLogo
