import { acceptHMRUpdate, defineStore } from 'pinia'
import { useMessage } from 'naive-ui'
import { USER_TOKEN } from '~~/utils/constant'

export const useUserStore = defineStore('user', () => {
  const router = useRouter()
  const info = ref<API.User | null>(null)
  const loading = ref(false)
  // const message = useMessage()

  async function login(form: API.Login) {
    loading.value = true

    try {
      const response = await request<API.Result>('http://127.0.0.1:8080/api/login', {
        method: 'POST',
        body: JSON.stringify(form),
      })

      const { code, msg, data } = response
      if (code !== 200) {
        // message.error(msg)
        loading.value = false
        return
      }

      // message.success('登录成功')
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
    await request('http://127.0.0.1:8080/api/logout')

    // message.success('退出成功')

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
