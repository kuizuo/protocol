import jwt from 'jsonwebtoken'

const exclude = ['/api/cx/login', '/api']

export const TOKEN_SECRET = 'protocol'

export default defineEventHandler(async ({ req, context }) => {
  try {
    if (!req.url?.startsWith('/api'))
      return

    if (exclude.includes(req.url))
      return

    // @ts-expect-error
    const user = jwt.verify(req.headers.authorization, TOKEN_SECRET)

    context.user = user
  }
  catch {
    return createError({ statusCode: 401, message: '认证过期，请重新登陆' })
  }
})
