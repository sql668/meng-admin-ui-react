import { MenuModeEnum, MenuTypeEnum } from "@/core/enums/menuEnum";


export enum HandlerEnum {
  // 
  CHANGE_LAYOUT,

   MENU_SPLIT,

}

export const menuTypeListEnum = [
  {
    title: "左侧菜单模式",
    mode: MenuModeEnum.INLINE,
    type: MenuTypeEnum.SIDEBAR,
  },
  {
    title: "顶部菜单混合模式",
    mode: MenuModeEnum.INLINE,
    type: MenuTypeEnum.MIX,
  },

  {
    title: "顶部菜单模式",
    mode: MenuModeEnum.HORIZONTAL,
    type: MenuTypeEnum.TOP_MENU,
  },
  // {
  //   title: "左侧菜单混合模式",
  //   mode: MenuModeEnum.INLINE,
  //   type: MenuTypeEnum.MIX_SIDEBAR,
  // },
]
