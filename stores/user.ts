import { acceptHMRUpdate, defineStore } from 'pinia'
import { createDiscreteApi } from 'naive-ui'
import { USER_TOKEN } from '~~/utils/constant'

const { message } = createDiscreteApi(
  ['message'],
)

export const useUserStore = defineStore('user', () => {
  const router = useRouter()
  const info = ref<API.User | null>(null)
  const loading = ref(false)

  async function login(form: API.Login) {
    loading.value = true

    try {
      const response = await request<API.Result>('/api/login', {
        method: 'POST',
        body: JSON.stringify(form),
      })

      const { code, msg, data } = response
      if (code !== 200) {
        message.error(msg)
        loading.value = false
        return
      }

      message.success('登录成功')
      const cookie = useCookie(USER_TOKEN)
      cookie.value = 'true'
      info.value = data
      router.push({ path: '/dashboard' })
    }
    catch (error) {
    }
    finally {
      loading.value = false
    }
  }

  async function logout() {
    await request('/api/logout')

    message.success('退出成功')

    info.value = {} as API.User
    const cookie = useCookie(USER_TOKEN)
    cookie.value = ''
    router.push({ path: '/login' })
  }

  return {
    info,
    loading,
    login,
    logout,
  }
}, {
  persist: {
    key: 'user',
    paths: ['info'],
  },
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot))
