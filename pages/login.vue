<script setup lang="ts">
const userStore = useUserStore()

const form = ref({
  username: '',
  password: '',
})

async function submit() {
  await userStore.login(form.value)
}
</script>

<template>
  <div flex justify-center mx-auto>
    <n-form ref="formRef" :model="form" :show-label="false">
      <div flex flex-col children:mx-auto>
        <i i-carbon-api-1 text-green5 icon-btn w-10 h-10 />
      </div>
      <div text="center sm gray-400" mt-3 mb-6>
        — Login —
      </div>
      <n-form-item label="账号" path="form.username">
        <n-input v-model:value="form.username" placeholder="账号">
          <template #prefix>
            <i i-ri:user-3-line />
          </template>
        </n-input>
      </n-form-item>
      <n-form-item label="密码" path="form.password">
        <n-input
          v-model:value="form.password"
          type="password"
          show-password-on="mousedown"
          placeholder="密码"
          :maxlength="16"
          :disabled="userStore.loading"
          @keyup.enter="submit()"
        >
          <template #prefix>
            <i i-ri:lock-2-line />
          </template>
        </n-input>
      </n-form-item>
      <n-form-item>
        <n-button type="primary" w-full :loading="userStore.loading" @click="submit">
          登录
        </n-button>
      </n-form-item>
    </n-form>
  </div>
</template>

