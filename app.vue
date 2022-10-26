<script setup lang="ts">
import '@unocss/reset/normalize.css'
import '@unocss/reset/eric-meyer.css'
import 'assets/css/preflight.css'
import { darkTheme, dateZhCN, lightTheme, zhCN } from 'naive-ui'

import type { GlobalTheme } from 'naive-ui'

const appConfig = useAppConfig()

const theme = ref<GlobalTheme | null>(darkTheme)
const colorMode = useColorMode()

watchEffect(() => {
  theme.value = colorMode.preference === 'dark' ? darkTheme : lightTheme
})

useHead({
  title: appConfig.title ?? '',
  link: [
    {
      rel: 'icon', type: 'image/png', href: '/logo.png',
    },
  ],
  meta: [
    {
      name: 'description', contetn: appConfig.description ?? '',
    },
    {
      name: 'referrer', content: 'no-referrer',
    },
  ],
})
</script>

<template>
  <NuxtLayout>
    <n-config-provider :theme="theme" :locale="zhCN" :date-locale="dateZhCN">
      <n-message-provider>
        <NuxtPage />
      </n-message-provider>
    </n-config-provider>
  </NuxtLayout>
</template>

<style>
html,
body,
#__nuxt {
  height: 100vh;
  margin: 0;
  padding: 0;
}

html.dark {
  background: #121213;
  color: white;
}

.page-enter-active {
  transition: all 0.1s ease-out;
}
.page-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}
.page-enter-from,
.page-leave-to {
  transform: translateY(20px);
  opacity: 0;
}

.layout-enter-active {
  transition: all 0.1s ease-out;
}
.layout-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}
.layout-enter-from,
.layout-leave-to {
  transform: translateY(-20px);
  opacity: 0;
}
</style>
