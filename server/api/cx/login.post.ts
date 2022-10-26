import jwt from 'jsonwebtoken'
import { CXMap, Cx } from '~~/protocol/cx'
import { USER_TOKEN } from '~~/utils/constant'

const config = useRuntimeConfig()

export default defineEventHandler(async (event) => {
  const body = await useBody<API.Login>(event)

  const cx = new Cx(body)
  const result = await cx.login()

  if (!cx.user.logged)
    return { code: 201, message: result }

  CXMap.set(cx.user.username, cx)
  const token = jwt.sign(cx.user, config.jwtSecret, { expiresIn: '1d' })

  setCookie(event, USER_TOKEN, token, { maxAge: 24 * 60 * 60 })

  return {
    code: 200,
    message: result,
    data: {
      info: cx.user,
      token,
    },
  }
})
