import jwt from 'jsonwebtoken'

const config = useRuntimeConfig()
const exclude = ['/api/cx/login', '/api']

export default defineEventHandler(async (event) => {
  const { req, context } = event
  try {
    if (!req.url?.startsWith('/api'))
      return

    if (exclude.includes(req.url))
      return

    // @ts-expect-error
    const user = jwt.verify(req.headers.authorization, config.jwtSecret)

    context.user = user
  }
  catch {
    return createError({ statusCode: 401, message: '认证过期，请重新登陆' })
  }
})
