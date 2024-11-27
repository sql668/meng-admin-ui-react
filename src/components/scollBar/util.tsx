export const isClient = typeof window !== 'undefined'
export const isServer = !isClient
export const GAP = 4 // top 2 + bottom 2 of bar instance
