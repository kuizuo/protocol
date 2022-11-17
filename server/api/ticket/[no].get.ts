import { ResOp } from '~~/server/utils'

// TODO: 对该接口进行限流操作 防止扫号

export default defineEventHandler(async (event) => {
  const { no } = event.context.params
  const key = `db:ticket:${no}`
  const ticket: API.Ticket = await useStorage().getItem(key)

  if (!ticket)
    throw createError({ statusCode: 404, message: '卡密不存在' })

  if (ticket.used)
    throw createError({ statusCode: 400, message: '卡密已被使用' })

  ticket.used = true
  ticket.usedTime = Date.now()

  await useStorage().setItem(key, ticket)

  return ResOp.success(ticket)
})
