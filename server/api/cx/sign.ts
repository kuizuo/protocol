import type { Cx } from '~~/protocol/cx'

export default defineEventHandler(async (event) => {
  const cx = event.context.cx as Cx

  const result = await cx.sign()

  return {
    code: 200,
    message: 'success',
    data: result,
  }
})
