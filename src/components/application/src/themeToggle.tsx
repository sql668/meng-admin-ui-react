import { SvgIcon } from '@/components/icon'
import useRootSetting from '@/hooks/setting/useRootSetting'
import { useUpdateBg } from '@/hooks/setting/useUpdateBg'
import { setRootSetting } from '@/store/app'
import { useMemoizedFn } from 'ahooks'
import { Dropdown, MenuProps } from 'antd'
import { useMemo } from 'react'

interface ThemeToggleProps {
  className?: string
}

const darkLightItems: MenuProps['items'] = [
  // {
  //   key: 'auto',
  //   label: <a>跟随系统</a>,
  //   icon: <SvgIcon icon='auto_theme'></SvgIcon>,
  // },
  {
    key: 'light',
    label: <a>亮色模式</a>,
    icon: <SvgIcon icon='light_theme'></SvgIcon>,
  },
  {
    key: 'dark',
    label: <a>暗色模式</a>,
    icon: <SvgIcon icon='dark_theme'></SvgIcon>,
  },
]

function ThemeToggle(props: ThemeToggleProps) {
  const { className } = props

  const { getGlobalTheme } = useRootSetting()

  const { updateSidebarBgColor, useUpdateHeaderBgColor } = useUpdateBg()

  const currentMode = useMemo(() => {
    if (getGlobalTheme === 'dark') {
      return <SvgIcon icon='dark_theme' className='anticon'></SvgIcon>
    } else {
      return <SvgIcon icon='light_theme' className='anticon'></SvgIcon>
    }
  }, [getGlobalTheme])

  const toggleTheme = useMemoizedFn((e) => {
    setRootSetting({ theme: e.key })
    useUpdateHeaderBgColor(e.key)
    updateSidebarBgColor(e.key)
  })

  return (
    <>
      <Dropdown
        className={className}
        placement='top'
        menu={{
          items: darkLightItems,
          onClick: toggleTheme,
          selectable: true,
          defaultSelectedKeys: [getGlobalTheme],
        }}>
        <span>{currentMode}</span>
      </Dropdown>
    </>
  )
}

export default ThemeToggle
