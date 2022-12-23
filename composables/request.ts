import { createDiscreteApi } from 'naive-ui'

const { message } = createDiscreteApi(
  ['message'],
)

export function getHeaders(defaultHeaders = {}) {
  return {
    ...defaultHeaders,
    // Authorization: useUserStore()?.token
  }
}

const _fetch = $fetch.create({
  async onRequest({ options }) {
    options.headers = getHeaders(options.headers)
  },
  async onResponse({ response }) {
    if (response._data.code !== 200)
      throw new Error(response._data.msg || '未知错误')
  },
  async onResponseError({ response, options }) {
    options?.params?.noMessage || message.error(response._data.msg || '服务器错误')
    if (response.status === 401)
      useUserStore().reset()
  },
})

const request = _fetch
// export const request = (...args: Parameters<typeof _fetch>): ReturnType<typeof _fetch> => _fetch(...args)

export default request

