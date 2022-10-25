<script setup lang="ts">
import { useMessage } from 'naive-ui'

const userStore = useUserStore()
const message = useMessage()
let loadding = $ref(false)

let signRecord = $ref<API.Activity[]>([])
const sign = async () => {
  loadding = true
  try {
    signRecord = await userStore.sign()
    console.log('signRecord', signRecord)
  }
  catch (error) { }
  finally {
    loadding = false
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
      <n-button type="info" @click="sign">
        手动签到
      </n-button>
      <n-button type="info" @click="signBgTask">
        后台签到
      </n-button>
    </n-space>
    <div />
  </div>
</template>

<style scoped>

</style>
