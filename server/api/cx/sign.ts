export default defineEventHandler(async (event) => {
  const cx = event.context.cx

  const result = await cx.sign()

  return {
    code: 200,
    message: 'success',
    data: result,
  }
})
