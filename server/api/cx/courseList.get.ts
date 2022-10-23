import { CXMap } from '~~/protocol/cx/cx.store'

export default defineEventHandler(async (event) => {
  const cx = CXMap.get(event.context.user.username)
  const courseList = await cx?.getCourseList()

  return {
    code: 200,
    message: '获取成功',
    data: courseList,
  }
})
