import { ResOp } from '~~/server/utils'

// TODO: 对该接口进行限流操作 防止扫号
// TODO: 分页 + 条件查询
export default defineEventHandler(async (event) => {
  const keys = await useStorage().getKeys('db:ticket')

  const result = await Promise.all(keys.map(async (key: any) => {
    const ticket: API.Ticket = await useStorage().getItem(key)
    return ticket
  }))

  if (!result)
    throw createError({ statusCode: 404, message: '卡密不存在' })

  return ResOp.success(result)
})
