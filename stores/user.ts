import { acceptHMRUpdate, defineStore } from 'pinia'
import { useMessage } from 'naive-ui'
import type { AxiosResponse } from 'axios'

export const useUserStore = defineStore('user', () => {
  const router = useRouter()
  const token = ref('')
  const info = ref<API.User | null>(null)
  const courseList = ref<API.Course[]>([])
  const loading = ref(false)
  const message = useMessage()

  const logStore = useLogStore()

  async function login(form: API.Login) {
    loading.value = true

    try {
      const { data } = await http.post('/cx/login', form)

      message.success('登录成功')
      logStore.log('登录成功')
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

    logStore.log('退出成功')

    info.value = {} as API.User
    token.value = ''
    courseList.value = []
    router.push({ path: '/login' })
  }

  async function getCourseList() {
    const { data } = await http.get<API.Course[]>('/cx/courseList')
    courseList.value = data
  }

  async function getActivityList(course: API.Course) {
    const { data } = await http.post<API.Activity[], AxiosResponse<API.Activity[]>, API.Course>('/cx/activityList', course)
    return data
  }

  async function signByCourse(course: API.Course) {
    const { data } = await http.post<{ activity: API.Activity; result: string }[], AxiosResponse<{ activity: API.Activity; result: string }[]>, API.Course>('/cx/signByCourse', course)

    if (data.length === 0) {
      message.warning(`${course.name} 无签到活动`)
      logStore.log(`${course.name} 无签到活动`)
    }
    else {
      data.forEach(d => logStore.log(`${d.activity.course?.name ?? ''} ${d.activity.nameOne} ${d.result}`))
      message.success(`共有${data.length}个签到活动`)
    }

    return data
  }

  async function sign() {
    const { data } = await http.get<{ activity: API.Activity; result: string }[]>('/cx/sign')
    data.forEach(d => logStore.log(`${d.activity.course?.name ?? ''} ${d.activity.nameOne} ${d.result}`))
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
    getActivityList,
    sign,
    signByCourse,
    signBgTask,
  }
}, {
  persist: {
    key: 'user',
  },
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot))
