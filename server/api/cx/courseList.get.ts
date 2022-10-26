export default defineEventHandler(async (event) => {
  const cx = event.context.cx

  const courseList = await cx?.getCourseList()

  return {
    code: 200,
    message: '获取成功',
    data: courseList,
  }
})
