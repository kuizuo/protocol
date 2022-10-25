import type { Cx } from '~~/protocol/cx'

export default defineEventHandler(async (event) => {
  const cx = event.context.cx as Cx

  const course = await useBody<API.Course>(event)

  const result = await cx.signByCourse(course)

  return {
    code: 200,
    message: 'success',
    data: result,
  }
})

