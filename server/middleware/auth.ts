import jwt from 'jsonwebtoken'
import { CXMap, Cx } from '~~/server/protocol/cx'

const config = useRuntimeConfig()
const exclude = ['/api/cx/login', '/api/cx/logout', '/api']

export default defineEventHandler(async (event) => {
  const { req, context } = event
  try {
    if (!req.url?.startsWith('/api') || req.url?.startsWith('/api/_content'))
      return

    if (exclude.includes(req.url))
      return

    // @ts-expect-error
    const user: API.User = jwt.verify(req.headers.authorization, config.jwtSecret)
    if (!user)
      return createError({ statusCode: 401, message: '认证过期，请重新登陆' })

    context.user = user
    const cx = CXMap.get(user?.username)
    if (cx) {
      context.cx = cx
    }

    else {
      const cx = new Cx(user)
      await cx.login()
      CXMap.set(user?.username, cx)
      context.cx = cx
    }
  }
  catch {
    return createError({ statusCode: 401, message: '认证过期，请重新登陆' })
  }
})
