import { acceptHMRUpdate, defineStore } from 'pinia'
import { useMessage } from 'naive-ui'
const namespace = 'cx'

export const useUserStore = defineStore('user', () => {
  const router = useRouter()
  const token = ref('')
  const info = ref<API.User | null>(null)
  const courseList = ref<API.Course[]>([])
  const loading = ref(false)
  const message = useMessage()

  async function login(form: API.Login) {
    loading.value = true

    try {
      const { data } = await http.post('/cx/login', form)

      message.success('登录成功')
      info.value = data.info
      token.value = data.token
      loading.value = false
      router.push({ path: '/' })
    }
    catch (error) {
    }
    finally {
      loading.value = false
    }
  }

  async function logout() {
    if (token.value) {
      try {
        const { data } = await http.post('/cx/logout')
        message.success(data.message)
      }
      catch (error: any) {
        console.log(`logout error:${error.toString()}`)
      }
    }

    info.value = {} as API.User
    token.value = ''
    router.push({ path: '/login' })
  }

  async function getCourseList() {
    const { data } = (await http.get('/cx/courseList'))
    courseList.value = data
  }

  return {
    info,
    token,
    courseList,
    login,
    logout,
    getCourseList,
    loading,
  }
}, {
  persist: {
    enabled: true,
    strategies: [
      {
        key: `${namespace}-user`,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        storage: process.client ? localStorage : null,
      },
    ],
  },
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot))

