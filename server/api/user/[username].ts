import { Github } from '~~/server/protocol/github'
import { ResOp } from '~~/server/utils'

export default defineEventHandler(async (event) => {
  const { username } = event.context.params

  const user = await Github.getUser(username)

  if (!user)
    return ResOp.error(404, 'User not found')

  await useStorage().setItem(`db:github:user:${username}`, user)

  return ResOp.success(user)
})
