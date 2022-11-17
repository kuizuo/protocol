<script setup lang="ts">
import pkg from '~/package.json'
const { title } = useAppConfig()
</script>

<template>
  <nav px-8 py-4 border="b gray-400/10" flex="~ gap-2 " items-center>
    <NuxtLink to="/" flex="~ gap-2" items-center>
      <i i-ri-ticket-2-line />
      <div font-sans leading-1em text-left text-sm capitalize>
        {{ title }}
      </div>
    </NuxtLink>

    <div flex="auto" />

    <div flex="~ gap-4" items-center>
      <NuxtLink to="/admin">
        <div font-medium text-sm hover="opacity-100 text-green-600">
          管理后台
        </div>
      </NuxtLink>
      <NuxtLink to="/changelog">
        <div font-medium text-sm hover="opacity-100 text-green-600">
          更新公告
        </div>
      </NuxtLink>
      <NuxtLink to="/help">
        <div font-medium text-sm hover="opacity-100 text-green-600">
          帮助说明
        </div>
      </NuxtLink>

      <DarkToggle />
      <a i-ri-github-line :href="pkg.repository.url" target="_blank" />
    </div>
  </nav>
</template>
