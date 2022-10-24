import jwt from 'jsonwebtoken'
import { Cx } from '~/protocol/cx/cx.class'
import { CXMap } from '~/protocol/cx/cx.store'

const config = useRuntimeConfig()

export default defineEventHandler(async (event) => {
  const body = await useBody<API.Login>(event)

  const cx = new Cx(body)
  const result = await cx.login()

  if (!cx.user.logged)
    return { code: 201, message: result }

  CXMap.set(cx.user.username, cx)
  const token = jwt.sign(cx.user, config.jwtSecret, { expiresIn: '1d' })

  setCookie(event, config.cookieName, token, { maxAge: 60 * 60 * 24 })

  return {
    code: 200,
    message: result,
    data: {
      info: cx.user,
      token,
    },
  }
})
