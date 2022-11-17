import { nanoid } from 'nanoid'
import { ResOp } from '~~/server/utils'

interface Body {
  count: number
}

// TODO: 接口限流 防止扫号
export default defineEventHandler(async (event) => {
  const body = await readBody<Body>(event)
  if (!body)
    throw createError({ statusCode: 400, message: '参数错误' })

  const { count } = body

  const ticketList: API.Ticket[] = []
  for (let i = 0; i < count; i++) {
    const ticket: API.Ticket = {
      no: nanoid(),
      used: false,
      usedTime: null,
    }
    ticketList.push(ticket)

    await useStorage().setItem(`db:ticket:${ticket.no}`, ticket)
  }

  return ResOp.success(ticketList)
})
