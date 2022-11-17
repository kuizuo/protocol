import { ResOp } from '~~/server/utils'

// TODO: 对该接口进行限流操作 防止扫号

export default defineEventHandler(async (event) => {
  const { no } = event.context.params
  const key = `db:ticket:${no}`
  const ticket: API.Ticket = await useStorage().getItem(key)

  if (!ticket)
    throw createError({ statusCode: 404, message: '卡密不存在' })

  await useStorage().removeItem(key)

  return ResOp.success(ticket)
})
