<script setup lang="ts">
import { useMessage } from 'naive-ui'

const ticket = $ref('')
let loading = $ref(false)

const message = useMessage()
async function useTicket() {
  loading = true
  try {
    const data = await request(`/api/ticket/${ticket}`)
    message.success('使用成功')
  }
  finally {
    loading = false
  }
}
</script>

<template>
  <div flex justify-center>
    <n-card max-w-5xl>
      <n-alert type="info">
        <div flex items-center>
          没有卡密?
          <a ml-1 href="/buy">
            <n-button type="info" size="small">
              点我购买
            </n-button>
          </a>
        </div>
      </n-alert>
      <div my-4>
        <n-space justify="center">
          <n-input v-model:value="ticket" placeholder="请输入你的卡密" clearable />
          <n-button type="primary" :loading="loading" :disabled="!ticket" @click="useTicket">
            使用
          </n-button>
        </n-space>
      </div>
    </n-card>
  </div>
</template>

