import { SkinOutlined } from '@ant-design/icons'
import { Divider, Drawer } from 'antd'
import { useMemo, useState } from 'react'
import { SwitchItem, TypePicker } from './components'
import { HandlerEnum, menuTypeListEnum } from './enums'
import { useMenuSetting } from '@/hooks/setting/useMenuSetting'
import useSettingHandle from './handler'
import { MenuTypeEnum } from '@/core/enums/menuEnum'

interface SettingDrawerProps {
  className?: string
}

function SettingDrawer(props: SettingDrawerProps) {
  const [visible, setVisible] = useState<boolean>(false)

  const { getMenuType, getIsHorizontal, getSplitMenu, getShowMenu } = useMenuSetting()

  const baseHandler = useSettingHandle()

  const getShowMenuRef = useMemo(() => {
    return getShowMenu && !getIsHorizontal
  }, [getShowMenu, getIsHorizontal])

  function renderSiderbar() {
    return (
      <TypePicker
        menuTypeList={menuTypeListEnum}
        def={getMenuType}
        handler={(item: (typeof menuTypeListEnum)[0]) => {
          baseHandler(HandlerEnum.CHANGE_LAYOUT, {
            mode: item.mode,
            type: item.type,
            split: getIsHorizontal ? false : undefined,
          })
        }}></TypePicker>
    )
  }

  function renderFeatures() {
    return (
      <>
        <SwitchItem
          title='分隔菜单'
          event={HandlerEnum.MENU_SPLIT}
          def={getSplitMenu}
          disabled={!getShowMenuRef || getMenuType !== MenuTypeEnum.MIX}
          onChange={(val) => {
            baseHandler(HandlerEnum.MENU_SPLIT, val)
          }}
        />
      </>
    )
  }
  return (
    <>
      <div
        className={props.className}
        onClick={() => {
          setVisible(true)
        }}>
        <SkinOutlined className='icon' title='主题配置' />
      </div>
      <Drawer
        width={330}
        closable={false}
        placement='right'
        open={visible}
        onClose={() => {
          setVisible(false)
        }}>
        <Divider className='divider'>导航栏模式</Divider>
        {renderSiderbar()}
        <Divider className='divider'>界面功能</Divider>
        {renderFeatures()}
      </Drawer>
    </>
  )
}

export default SettingDrawer
