function LayoutBreadcrumb() { 
  return <div>面包屑</div>
}

if (process.env.NODE_ENV !== 'production') {
  LayoutBreadcrumb.displayName = 'LayoutHeader'; (LayoutBreadcrumb as any).whyDidYouRender = true
}

export default LayoutBreadcrumb