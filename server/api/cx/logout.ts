import { CXMap } from '~/protocol/cx/cx.store'

export default defineEventHandler(async (event) => {
  const cx = CXMap.get(event.context.user.username)
  await cx?.logout()
  CXMap.delete(event.context.user.username)

  deleteCookie(event, 'token')

  return {
    code: 200,
    message: '退出成功',
  }
})
