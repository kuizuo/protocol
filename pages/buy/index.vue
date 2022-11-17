<script setup lang="ts">
import { useMessage } from 'naive-ui'

const router = useRouter()
const message = useMessage()

const ticket = ref('xxx_123')

const { copy, copied } = useClipboard()

const copyTicket = () => {
  copy(ticket.value)
  if (copied.value)
    message.success('复制成功')
}
</script>

<template>
  <main p="x4 y10" text="center">
    <n-result title="暂未提供购买链接">
      <template #footer>
        <n-button @click="router.back">
          回到首页
        </n-button>
      </template>
    </n-result>
    <!-- <span text-lg mr-2>卡密: </span>
    <n-tag cursor-pointer @click="copyTicket">
      {{ ticket }}
    </n-tag> -->
  </main>
</template>
