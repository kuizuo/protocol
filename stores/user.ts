import { acceptHMRUpdate, defineStore } from 'pinia'
import { useMessage } from 'naive-ui'

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
      await http.get('/cx/logout')
      message.success('退出成功')
    }

    info.value = {} as API.User
    token.value = ''
    courseList.value = []
    router.push({ path: '/login' })
  }

  async function getCourseList() {
    const { data } = await http.get<API.Course[]>('/cx/courseList')
    courseList.value = data
  }

  async function sign() {
    const { data } = await http.get<API.Activity[]>('/cx/sign')
    return data
  }

  async function signBgTask() {
    const { data } = await http.get('/cx/signBgTask')

    return data
  }

  return {
    info,
    token,
    loading,
    courseList,
    login,
    logout,
    getCourseList,
    sign,
    signBgTask,
  }
}, {
  persist: {
    key: 'user',
  },
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot))
