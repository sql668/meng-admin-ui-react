//import iconData from '../data'
import { Select } from 'antd'
import defaultIcon from '../data'
import { createStyles } from 'antd-style'
import svgIcons from 'virtual:svg-icons-names';
import { Icon } from '../icon'
import { useEffect, useState } from 'react';
import type { SelectProps} from 'antd/es/select';

function getIconifyIcons() {
  return defaultIcon.map((item) => {
    const prefix = item.prefix
    return {
      label: <span>{item.prefix}</span>,
      title: item.prefix,
      options: item.icons.map((icon) => {
        return {
          label: (
            <div className='iconify-select-item'>
              <Icon icon={`${prefix}:${icon}`} size={ 16} className='iconify-select-item-icon'></Icon>
              <span className='iconify-select-item-label'>{`${prefix}:${icon}`}</span>
            </div>
          ),
          value: `${prefix}:${icon}`,
        }
      }),
    }
  })
}

function getSvgIcons() {
  //return svgIcons.map((icon: string) => icon.replace('icon-', ''));
  return svgIcons.map((icon:string) => {
    return {
      label: (
        <div className='iconify-select-item'>
          <Icon icon={`${icon.replace('icon-', '')}|svg`} size={ 16} className='iconify-select-item-icon'></Icon>
              <span className='iconify-select-item-label'>{icon.replace('icon-', '')}</span>
        </div>
      ),
      value: `${icon.replace('icon-', '')}|svg`,
    }
  })
  }

const iconData = getIconifyIcons()
const svgData = getSvgIcons()

const useStyles = createStyles(({ css }) => {
  return {
    container: css`
      min-width: 120px;
    `,
  }
})

export interface IconSelectProps extends SelectProps{
  iconMode?: 'iconify' | 'svg'
  [key: string]: any
}

export function IconSelect(props: IconSelectProps) {
  const { styles, cx } = useStyles()
  const [options,SetOptions] = useState(iconData)
  const { iconMode = 'iconify', ...restProps } = props
  useEffect(() => {
    if(iconMode === 'svg'){
      SetOptions(svgData as any)
    }else{
      SetOptions(iconData)
    }
  },[iconMode])
  return <Select options={options as any} className={cx(styles.container)} {...restProps}></Select>
}
