import type { Cx } from './cx.class'

export const CXMap = new Map<string | number, Cx>()

export const getCx = (id: string | number) => CXMap.get(id)
