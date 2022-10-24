<script setup lang="ts">
import '@unocss/reset/normalize.css'
import '@unocss/reset/eric-meyer.css'
import 'assets/css/preflight.css'
import { darkTheme, lightTheme } from 'naive-ui'
import type { GlobalTheme } from 'naive-ui'
import pkg from '~/package.json'

const theme = ref<GlobalTheme | null>(darkTheme)
const colorMode = useColorMode()

watchEffect(() => {
  theme.value = colorMode.preference === 'dark' ? darkTheme : lightTheme
})

useHead({
  title: pkg.name,
  link: [
    {
      rel: 'icon', type: 'image/png', href: '/logo.png',
    },
  ],
  meta: [
    {
      name: 'referrer', content: 'no-referrer',
    },
  ],
})
</script>

<template>
  <NuxtLayout>
    <n-config-provider :theme="theme">
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
</style>
