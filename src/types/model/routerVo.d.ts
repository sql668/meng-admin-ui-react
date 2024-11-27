export interface RouterHandleVo {
    title: string;
    icon?: string;
    component?: string;
    linkUrl?: string;
    isKeepAlive?: boolean;
    isHide?: boolean;
    viewType?: string;
    hasLayout?: boolean;
    parentPaths?: Array<string>;
}
export interface RouterVo {
    path: string;
    handle: RouterHandleVo;
    children?: RouterVo[];
}
