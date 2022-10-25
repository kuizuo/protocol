<script setup lang="ts">
import '@unocss/reset/normalize.css'
import '@unocss/reset/eric-meyer.css'
import 'assets/css/preflight.css'
import { darkTheme, dateZhCN, lightTheme, zhCN } from 'naive-ui'

import type { GlobalTheme } from 'naive-ui'

const config = useAppConfig()
const theme = ref<GlobalTheme | null>(darkTheme)
const colorMode = useColorMode()

watchEffect(() => {
  theme.value = colorMode.preference === 'dark' ? darkTheme : lightTheme
})

useHead({
  title: config.title,
  link: [
    {
      rel: 'icon', type: 'image/png', href: '/logo.png',
    },
  ],
  meta: [
    {
      name: 'description', contetn: config.description,
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

.page-enter-active,
.page-leave-active {
  transition: all 0.4s;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
  filter: blur(1rem);
}
</style>
