import { CXMap } from '~~/protocol/cx'

const config = useRuntimeConfig()

export default defineEventHandler(async (event) => {
  const cx = event.context.cx

  await cx?.logout()
  CXMap.delete(event.context.user?.username)

  deleteCookie(event, config.cookieName)

  return {
    code: 200,
    message: '退出成功',
  }
})
