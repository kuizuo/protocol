<script setup lang="ts">
import { useMessage } from 'naive-ui'

const userStore = useUserStore()
const message = useMessage()

const logStore = useLogStore()
let loading = $ref(false)

const sign = async () => {
  loading = true
  try {
    const data = await userStore.sign()

    data.forEach((d) => {
      logStore.log(`${d.activity.course?.name ?? ''} ${d.activity.nameOne} ${d.result}`)
    })
  }
  catch (error) { }
  finally {
    loading = false
  }
}

const signBgTask = () => {
  message.warning('后台签到任务暂时开放,请敬请期待')

  // const signBgTaskList = userStore.signBgTask()
  // console.log(signBgTaskList)
}
</script>

<template>
  <div>
    <n-space mt-2>
      <n-button type="info" :loading="loading" @click="sign">
        手动签到
      </n-button>
      <n-button type="info" @click="signBgTask">
        后台签到
      </n-button>
    </n-space>
    <Log />
  </div>
</template>

<style scoped>

</style>
