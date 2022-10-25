import { acceptHMRUpdate, defineStore } from 'pinia'
import type { MessageType } from 'naive-ui'
import { useMessage } from 'naive-ui'

export const useLogStore = defineStore('log', () => {
  const logList = reactive<string[]>([])
  const showLog = ref(false)
  const message = useMessage()

  const log = (content: string, type: MessageType | null = null) => {
    const formatted = $(useDateFormat(useNow(), 'HH:mm:ss'))

    const info = `${formatted} ${content}`
    console.log(`${formatted} ${info}`)

    if (type)
      message.create(content, { type })

    logList.push(info)
  }

  return {
    logList,
    log,
    showLog,
  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useLogStore, import.meta.hot))
