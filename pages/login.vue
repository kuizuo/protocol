<script setup lang="ts">
const app = useAppConfig()
const userStore = useUserStore()

const captchaImg = ref(`/api/captcha?t=${Math.random()}`)

// 演示环境下
const form = ref({
  username: 'admin',
  password: '123456',
  captcha: '',
})

async function submit() {
  await userStore.login(form.value)
}

function updateCaptcha() {
  captchaImg.value = `/api/captcha?t=${Math.random()}`
}

definePageMeta({
  middleware: ['guest'],
})
</script>

<template>
  <ClientOnly>
    <div flex h-screen bg-cover style="background-image: url(/img/background.png);">
      <div flex justify-center items-center mx-auto>
        <n-form ref="formRef" :model="form" :show-label="false">
          <div flex flex-col children:mx-auto>
            <span text-2xl>{{ app.title }}</span>
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
          <n-form-item label="验证码" path="form.captcha">
            <n-input v-model:value="form.captcha" placeholder="验证码">
              <template #prefix>
                <i i-ri:shield-check-line />
              </template>
              <template #suffix>
                <img :src="captchaImg" alt="" width="100" cursor-pointer @click="updateCaptcha">
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
    </div>
  </ClientOnly>
</template>

