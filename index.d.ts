import { Cx } from 'protocol/cx/cx.class'

declare module 'h3' {
  interface H3EventContext {
    cx: Cx
  }
}

export { }
